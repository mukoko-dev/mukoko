// ========================================
// MONGODB UTILITIES FOR MUKOKO
// High-frequency operations database integration
// ========================================

import { MongoClient, Db, Collection } from 'mongodb';
import type {
  ChatMessage,
  UserPresence,
  PostInteraction,
  UserComment,
  CloudflareEnv
} from '../types/database';

class MongoDBService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connectionPromise: Promise<void> | null = null;

  constructor(private env: CloudflareEnv) {}

  private async connect(): Promise<void> {
    if (!this.connectionPromise) {
      this.connectionPromise = this._connect();
    }
    await this.connectionPromise;
  }

  private async _connect(): Promise<void> {
    try {
      if (!this.client) {
        this.client = new MongoClient(this.env.MONGODB_URI, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });
        await this.client.connect();
        this.db = this.client.db(this.env.MONGODB_DB_NAME || 'mukoko');
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  private getCollection<T>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<T>(name);
  }

  // ========================================
  // CHAT MESSAGE OPERATIONS
  // ========================================

  async storeChatMessage(message: Omit<ChatMessage, '_id'>): Promise<string> {
    await this.connect();
    const collection = this.getCollection<ChatMessage>('chat_messages');
    
    const result = await collection.insertOne({
      ...message,
      created_at: new Date(),
      updated_at: new Date()
    });

    return result.insertedId.toString();
  }

  async getChatHistory(roomId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    await this.connect();
    const collection = this.getCollection<ChatMessage>('chat_messages');
    
    return await collection
      .find({ room_id: roomId })
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  async updateChatMessage(messageId: string, updates: Partial<ChatMessage>): Promise<boolean> {
    await this.connect();
    const collection = this.getCollection<ChatMessage>('chat_messages');
    
    const result = await collection.updateOne(
      { _id: messageId as any },
      { $set: { ...updates, updated_at: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  async deleteChatMessage(messageId: string): Promise<boolean> {
    await this.connect();
    const collection = this.getCollection<ChatMessage>('chat_messages');
    
    const result = await collection.deleteOne({ _id: messageId as any });
    return result.deletedCount > 0;
  }

  // ========================================
  // USER PRESENCE OPERATIONS
  // ========================================

  async updateUserPresence(presence: UserPresence): Promise<void> {
    await this.connect();
    const collection = this.getCollection<UserPresence>('user_presence');
    
    await collection.replaceOne(
      { user_id: presence.user_id },
      {
        ...presence,
        last_seen: new Date(),
        updated_at: new Date()
      },
      { upsert: true }
    );
  }

  async getUserPresence(userId: string): Promise<UserPresence | null> {
    await this.connect();
    const collection = this.getCollection<UserPresence>('user_presence');
    
    return await collection.findOne({ user_id: userId });
  }

  async getMultipleUserPresence(userIds: string[]): Promise<UserPresence[]> {
    await this.connect();
    const collection = this.getCollection<UserPresence>('user_presence');
    
    return await collection
      .find({ user_id: { $in: userIds } })
      .toArray();
  }

  async getOnlineUsers(limit: number = 100): Promise<UserPresence[]> {
    await this.connect();
    const collection = this.getCollection<UserPresence>('user_presence');
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return await collection
      .find({
        status: { $in: ['online', 'away'] },
        last_seen: { $gte: fiveMinutesAgo }
      })
      .limit(limit)
      .toArray();
  }

  async cleanupOfflineUsers(): Promise<number> {
    await this.connect();
    const collection = this.getCollection<UserPresence>('user_presence');
    
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const result = await collection.updateMany(
      {
        last_seen: { $lt: tenMinutesAgo },
        status: { $ne: 'offline' }
      },
      {
        $set: { status: 'offline', updated_at: new Date() }
      }
    );

    return result.modifiedCount;
  }

  // ========================================
  // POST INTERACTION OPERATIONS
  // ========================================

  async recordInteraction(interaction: Omit<PostInteraction, '_id'>): Promise<string> {
    await this.connect();
    const collection = this.getCollection<PostInteraction>('post_interactions');
    
    const existing = await collection.findOne({
      user_id: interaction.user_id,
      post_id: interaction.post_id,
      interaction_type: interaction.interaction_type
    });

    if (existing) {
      // Update existing interaction
      await collection.updateOne(
        { _id: existing._id },
        { $set: { created_at: new Date(), ...interaction } }
      );
      return existing._id!.toString();
    } else {
      // Create new interaction
      const result = await collection.insertOne({
        ...interaction,
        created_at: new Date()
      });
      return result.insertedId.toString();
    }
  }

  async removeInteraction(userId: string, postId: string, interactionType: string): Promise<boolean> {
    await this.connect();
    const collection = this.getCollection<PostInteraction>('post_interactions');
    
    const result = await collection.deleteOne({
      user_id: userId,
      post_id: postId,
      interaction_type: interactionType
    });

    return result.deletedCount > 0;
  }

  async getUserInteractions(userId: string, limit: number = 100): Promise<PostInteraction[]> {
    await this.connect();
    const collection = this.getCollection<PostInteraction>('post_interactions');
    
    return await collection
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }

  async getPostInteractionStats(postId: string): Promise<Record<string, number>> {
    await this.connect();
    const collection = this.getCollection<PostInteraction>('post_interactions');
    
    const stats = await collection.aggregate([
      { $match: { post_id: postId } },
      { $group: { _id: '$interaction_type', count: { $sum: 1 } } }
    ]).toArray();

    const result: Record<string, number> = {};
    stats.forEach(stat => {
      result[stat._id] = stat.count;
    });

    return result;
  }

  // ========================================
  // COMMENT OPERATIONS
  // ========================================

  async storeComment(comment: Omit<UserComment, '_id' | 'created_at' | 'updated_at'>): Promise<string> {
    await this.connect();
    const collection = this.getCollection<UserComment>('user_comments');
    
    const result = await collection.insertOne({
      ...comment,
      created_at: new Date(),
      updated_at: new Date(),
      is_deleted: false,
      like_count: 0,
      reply_count: 0
    });

    return result.insertedId.toString();
  }

  async getComments(articleId: string, limit: number = 50, offset: number = 0): Promise<UserComment[]> {
    await this.connect();
    const collection = this.getCollection<UserComment>('user_comments');
    
    return await collection
      .find({ 
        article_id: articleId, 
        is_deleted: false,
        parent_comment_id: null 
      })
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  async getCommentReplies(parentCommentId: string): Promise<UserComment[]> {
    await this.connect();
    const collection = this.getCollection<UserComment>('user_comments');
    
    return await collection
      .find({ 
        parent_comment_id: parentCommentId, 
        is_deleted: false 
      })
      .sort({ created_at: 1 })
      .toArray();
  }

  async updateComment(commentId: string, updates: Partial<UserComment>): Promise<boolean> {
    await this.connect();
    const collection = this.getCollection<UserComment>('user_comments');
    
    const result = await collection.updateOne(
      { _id: commentId as any },
      { $set: { ...updates, updated_at: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  async deleteComment(commentId: string): Promise<boolean> {
    await this.connect();
    const collection = this.getCollection<UserComment>('user_comments');
    
    const result = await collection.updateOne(
      { _id: commentId as any },
      { $set: { is_deleted: true, updated_at: new Date() } }
    );

    return result.modifiedCount > 0;
  }

  // ========================================
  // ANALYTICS AND AGGREGATION
  // ========================================

  async getTopInteractedPosts(timeframe: number = 24, limit: number = 10): Promise<Array<{post_id: string, interaction_count: number}>> {
    await this.connect();
    const collection = this.getCollection<PostInteraction>('post_interactions');
    
    const since = new Date(Date.now() - timeframe * 60 * 60 * 1000);
    
    return await collection.aggregate([
      { $match: { created_at: { $gte: since } } },
      { $group: { _id: '$post_id', interaction_count: { $sum: 1 } } },
      { $sort: { interaction_count: -1 } },
      { $limit: limit },
      { $project: { post_id: '$_id', interaction_count: 1, _id: 0 } }
    ]).toArray();
  }

  async getUserActivityStats(userId: string, days: number = 7): Promise<{
    total_interactions: number;
    comments_count: number;
    messages_count: number;
    active_days: number;
  }> {
    await this.connect();
    
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const [interactions, comments, messages] = await Promise.all([
      this.getCollection<PostInteraction>('post_interactions')
        .countDocuments({ user_id: userId, created_at: { $gte: since } }),
      this.getCollection<UserComment>('user_comments')
        .countDocuments({ user_id: userId, created_at: { $gte: since } }),
      this.getCollection<ChatMessage>('chat_messages')
        .countDocuments({ user_id: userId, created_at: { $gte: since } })
    ]);

    // Calculate active days
    const activeDays = await this.getCollection<PostInteraction>('post_interactions')
      .aggregate([
        { $match: { user_id: userId, created_at: { $gte: since } } },
        { 
          $group: { 
            _id: { 
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' } 
            } 
          } 
        },
        { $count: 'active_days' }
      ]).toArray();

    return {
      total_interactions: interactions,
      comments_count: comments,
      messages_count: messages,
      active_days: activeDays[0]?.active_days || 0
    };
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  async healthCheck(): Promise<boolean> {
    try {
      await this.connect();
      await this.db?.admin().ping();
      return true;
    } catch (error) {
      console.error('MongoDB health check failed:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.connectionPromise = null;
    }
  }
}

// Singleton instance
let mongoInstance: MongoDBService | null = null;

export function getMongoDBService(env: CloudflareEnv): MongoDBService {
  if (!mongoInstance) {
    mongoInstance = new MongoDBService(env);
  }
  return mongoInstance;
}

export { MongoDBService };
