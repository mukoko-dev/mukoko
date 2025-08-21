// ========================================
// MONGODB UTILITIES FOR HIGH-FREQUENCY OPERATIONS
// ========================================

import { MongoClient, Db, Collection } from 'mongodb';
import type { 
  CloudflareEnv, 
  PostInteraction, 
  Comment, 
  ChatMessage, 
  UserPresence 
} from '../types/database';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToMongoDB(env: CloudflareEnv): Promise<Db> {
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(env.MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
  });
  
  await client.connect();
  const db = client.db(env.MONGODB_DB_NAME);
  
  cachedClient = client;
  cachedDb = db;
  
  return db;
}

// ========================================
// INTERACTION FUNCTIONS
// ========================================

export async function addInteraction(
  db: Db, 
  interaction: Omit<PostInteraction, '_id' | 'timestamp'>
): Promise<PostInteraction | null> {
  try {
    const collection = db.collection<PostInteraction>('interactions');
    
    // Check if interaction already exists (for likes, saves)
    if (interaction.type === 'like' || interaction.type === 'save') {
      const existing = await collection.findOne({
        post_id: interaction.post_id,
        user_id: interaction.user_id,
        type: interaction.type
      });
      
      if (existing) {
        // Remove existing interaction (toggle behavior)
        await collection.deleteOne({ _id: existing._id });
        return null;
      }
    }
    
    const newInteraction: PostInteraction = {
      ...interaction,
      timestamp: new Date()
    };
    
    const result = await collection.insertOne(newInteraction);
    return { ...newInteraction, _id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error adding interaction:', error);
    return null;
  }
}

export async function getInteractionCounts(
  db: Db, 
  postId: string
): Promise<Record<string, number>> {
  try {
    const collection = db.collection<PostInteraction>('interactions');
    
    const pipeline = [
      { $match: { post_id: postId } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ];
    
    const results = await collection.aggregate(pipeline).toArray();
    
    const counts: Record<string, number> = {};
    results.forEach(item => {
      counts[item._id] = item.count;
    });
    
    return counts;
  } catch (error) {
    console.error('Error getting interaction counts:', error);
    return {};
  }
}

export async function getUserInteractions(
  db: Db,
  userId: string,
  postIds: string[]
): Promise<PostInteraction[]> {
  try {
    const collection = db.collection<PostInteraction>('interactions');
    
    return await collection.find({
      user_id: userId,
      post_id: { $in: postIds }
    }).toArray();
  } catch (error) {
    console.error('Error getting user interactions:', error);
    return [];
  }
}

export async function getPopularContent(
  db: Db,
  timeframe: 'hour' | 'day' | 'week' = 'day',
  limit = 10
): Promise<{ post_id: string; interaction_count: number; like_count: number; share_count: number }[]> {
  try {
    const collection = db.collection<PostInteraction>('interactions');
    
    const timeframeDuration = {
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
      week: 1000 * 60 * 60 * 24 * 7
    };
    
    const cutoffDate = new Date(Date.now() - timeframeDuration[timeframe]);
    
    const pipeline = [
      { $match: { timestamp: { $gte: cutoffDate } } },
      {
        $group: {
          _id: '$post_id',
          interaction_count: { $sum: 1 },
          like_count: {
            $sum: { $cond: [{ $eq: ['$type', 'like'] }, 1, 0] }
          },
          share_count: {
            $sum: { $cond: [{ $eq: ['$type', 'share'] }, 1, 0] }
          }
        }
      },
      { $sort: { interaction_count: -1 } },
      { $limit: limit }
    ];
    
    const results = await collection.aggregate(pipeline).toArray();
    
    return results.map(item => ({
      post_id: item._id,
      interaction_count: item.interaction_count,
      like_count: item.like_count,
      share_count: item.share_count
    }));
  } catch (error) {
    console.error('Error getting popular content:', error);
    return [];
  }
}

// ========================================
// COMMENT FUNCTIONS
// ========================================

export async function addComment(
  db: Db, 
  comment: Omit<Comment, '_id' | 'created_at' | 'updated_at' | 'likes' | 'replies'>
): Promise<Comment | null> {
  try {
    const collection = db.collection<Comment>('comments');
    
    const newComment: Comment = {
      ...comment,
      created_at: new Date(),
      updated_at: new Date(),
      likes: 0,
      replies: 0,
      is_edited: false
    };
    
    const result = await collection.insertOne(newComment);
    return { ...newComment, _id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

export async function getComments(
  db: Db, 
  postId: string,
  options: {
    limit?: number;
    offset?: number;
    sort?: 'newest' | 'oldest' | 'popular';
    parentId?: string;
  } = {}
): Promise<Comment[]> {
  try {
    const collection = db.collection<Comment>('comments');
    
    const query: any = { post_id: postId };
    if (options.parentId) {
      query.parent_id = options.parentId;
    } else {
      // Only get top-level comments if no parent specified
      query.parent_id = { $exists: false };
    }
    
    let sortOptions: any = { created_at: -1 }; // newest first by default
    if (options.sort === 'oldest') {
      sortOptions = { created_at: 1 };
    } else if (options.sort === 'popular') {
      sortOptions = { likes: -1, created_at: -1 };
    }
    
    let cursor = collection.find(query).sort(sortOptions);
    
    if (options.offset) {
      cursor = cursor.skip(options.offset);
    }
    
    if (options.limit) {
      cursor = cursor.limit(options.limit);
    }
    
    return await cursor.toArray();
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
}

export async function updateComment(
  db: Db,
  commentId: string,
  userId: string,
  content: string
): Promise<Comment | null> {
  try {
    const collection = db.collection<Comment>('comments');
    
    const result = await collection.findOneAndUpdate(
      { _id: commentId, user_id: userId },
      { 
        $set: { 
          content, 
          updated_at: new Date(),
          is_edited: true 
        } 
      },
      { returnDocument: 'after' }
    );
    
    return result.value;
  } catch (error) {
    console.error('Error updating comment:', error);
    return null;
  }
}

export async function likeComment(
  db: Db,
  commentId: string,
  userId: string
): Promise<boolean> {
  try {
    const collection = db.collection<Comment>('comments');
    
    await collection.updateOne(
      { _id: commentId },
      { $inc: { likes: 1 } }
    );
    
    // Also track who liked it (you might want a separate collection for this)
    const likesCollection = db.collection('comment_likes');
    await likesCollection.insertOne({
      comment_id: commentId,
      user_id: userId,
      created_at: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error liking comment:', error);
    return false;
  }
}

// ========================================
// CHAT MESSAGE FUNCTIONS
// ========================================

export async function addChatMessage(
  db: Db,
  message: Omit<ChatMessage, '_id' | 'timestamp'>
): Promise<ChatMessage | null> {
  try {
    const collection = db.collection<ChatMessage>('chat_messages');
    
    const newMessage: ChatMessage = {
      ...message,
      timestamp: new Date(),
      reactions: {}
    };
    
    const result = await collection.insertOne(newMessage);
    return { ...newMessage, _id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error adding chat message:', error);
    return null;
  }
}

export async function getChatMessages(
  db: Db,
  roomId: string,
  options: {
    limit?: number;
    before?: Date;
    after?: Date;
  } = {}
): Promise<ChatMessage[]> {
  try {
    const collection = db.collection<ChatMessage>('chat_messages');
    
    const query: any = { room_id: roomId };
    
    if (options.before && options.after) {
      query.timestamp = { $gte: options.after, $lte: options.before };
    } else if (options.before) {
      query.timestamp = { $lte: options.before };
    } else if (options.after) {
      query.timestamp = { $gte: options.after };
    }
    
    return await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(options.limit || 100)
      .toArray();
  } catch (error) {
    console.error('Error getting chat messages:', error);
    return [];
  }
}

export async function addMessageReaction(
  db: Db,
  messageId: string,
  userId: string,
  reactionType: string
): Promise<boolean> {
  try {
    const collection = db.collection<ChatMessage>('chat_messages');
    
    await collection.updateOne(
      { _id: messageId },
      { 
        $addToSet: { 
          [`reactions.${reactionType}`]: userId 
        } 
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error adding message reaction:', error);
    return false;
  }
}

// ========================================
// USER PRESENCE FUNCTIONS
// ========================================

export async function updateUserPresence(
  db: Db,
  presence: Omit<UserPresence, '_id'>
): Promise<UserPresence | null> {
  try {
    const collection = db.collection<UserPresence>('user_presence');
    
    const result = await collection.findOneAndUpdate(
      { user_id: presence.user_id },
      { 
        $set: { 
          ...presence,
          last_seen: new Date()
        } 
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );
    
    return result.value;
  } catch (error) {
    console.error('Error updating user presence:', error);
    return null;
  }
}

export async function getActiveUsers(
  db: Db,
  sinceMinutes = 5
): Promise<UserPresence[]> {
  try {
    const collection = db.collection<UserPresence>('user_presence');
    
    const cutoffTime = new Date(Date.now() - sinceMinutes * 60 * 1000);
    
    return await collection
      .find({
        last_seen: { $gte: cutoffTime },
        status: { $ne: 'offline' }
      })
      .toArray();
  } catch (error) {
    console.error('Error getting active users:', error);
    return [];
  }
}

// ========================================
// ANALYTICS FUNCTIONS
// ========================================

export async function getEngagementMetrics(
  db: Db,
  timeframe: 'hour' | 'day' | 'week' = 'day'
): Promise<{
  total_interactions: number;
  total_comments: number;
  total_messages: number;
  active_users: number;
}> {
  try {
    const timeframeDuration = {
      hour: 1000 * 60 * 60,
      day: 1000 * 60 * 60 * 24,
      week: 1000 * 60 * 60 * 24 * 7
    };
    
    const cutoffDate = new Date(Date.now() - timeframeDuration[timeframe]);
    
    const [interactions, comments, messages, activeUsers] = await Promise.all([
      db.collection('interactions').countDocuments({ timestamp: { $gte: cutoffDate } }),
      db.collection('comments').countDocuments({ created_at: { $gte: cutoffDate } }),
      db.collection('chat_messages').countDocuments({ timestamp: { $gte: cutoffDate } }),
      db.collection('user_presence').countDocuments({ 
        last_seen: { $gte: cutoffDate },
        status: { $ne: 'offline' }
      })
    ]);
    
    return {
      total_interactions: interactions,
      total_comments: comments,
      total_messages: messages,
      active_users: activeUsers
    };
  } catch (error) {
    console.error('Error getting engagement metrics:', error);
    return {
      total_interactions: 0,
      total_comments: 0,
      total_messages: 0,
      active_users: 0
    };
  }
}

// ========================================
// CLEANUP FUNCTIONS
// ========================================

export async function cleanupOldData(db: Db): Promise<void> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // Clean up old interactions (keep for 30 days)
    await db.collection('interactions').deleteMany({
      timestamp: { $lt: thirtyDaysAgo }
    });
    
    // Clean up old chat messages (keep for 7 days)
    await db.collection('chat_messages').deleteMany({
      timestamp: { $lt: sevenDaysAgo }
    });
    
    // Clean up offline user presence (keep for 1 day)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await db.collection('user_presence').deleteMany({
      last_seen: { $lt: oneDayAgo },
      status: 'offline'
    });
    
    console.log('MongoDB cleanup completed');
  } catch (error) {
    console.error('Error during MongoDB cleanup:', error);
  }
}

// ========================================
// CONNECTION MANAGEMENT
// ========================================

export async function closeMongoDB(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}
