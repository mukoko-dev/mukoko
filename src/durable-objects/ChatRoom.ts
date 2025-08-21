// ========================================
// CHAT ROOM DURABLE OBJECT FOR MUKOKO
// Real-time chat functionality with MongoDB persistence
// ========================================

import type { ChatRoomState, WebSocketMessage, UserPresence, CloudflareEnv } from '../types/database';

export class ChatRoom {
  private state: DurableObjectState;
  private env: CloudflareEnv;
  private sessions: Map<WebSocket, { userId: string; username: string; joinedAt: Date }>;
  private roomId: string;
  private participants: Set<string>;
  private lastActivity: Date;

  constructor(state: DurableObjectState, env: CloudflareEnv) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
    this.participants = new Set();
    this.lastActivity = new Date();
    this.roomId = '';
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    this.roomId = url.pathname.split('/').pop() || 'default';

    // Handle WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      await this.handleSession(server, request);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // Handle HTTP requests for room info
    if (request.method === 'GET') {
      return this.handleGetRoomInfo();
    }

    return new Response('Expected WebSocket or GET request', { status: 400 });
  }

  private async handleGetRoomInfo(): Promise<Response> {
    const roomInfo = {
      room_id: this.roomId,
      participant_count: this.participants.size,
      participants: Array.from(this.participants),
      last_activity: this.lastActivity.toISOString(),
      is_active: this.sessions.size > 0
    };

    return new Response(JSON.stringify(roomInfo), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleSession(webSocket: WebSocket, request: Request): Promise<void> {
    webSocket.accept();

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const username = url.searchParams.get('username');
    const token = url.searchParams.get('token');

    if (!userId || !username || !token) {
      webSocket.close(1008, 'Missing required parameters: userId, username, token');
      return;
    }

    // TODO: Validate token against Supabase
    // For now, we'll trust the provided user info

    const sessionInfo = { userId, username, joinedAt: new Date() };
    this.sessions.set(webSocket, sessionInfo);
    this.participants.add(userId);
    this.lastActivity = new Date();

    // Send room history to new user
    await this.sendRoomHistory(webSocket);

    // Broadcast user joined message
    this.broadcast({
      type: 'join',
      payload: {
        user_id: userId,
        username,
        joined_at: sessionInfo.joinedAt.toISOString(),
        participant_count: this.participants.size
      },
      timestamp: new Date(),
      user_id: userId
    }, webSocket);

    // Handle incoming messages
    webSocket.addEventListener('message', async (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data as string);
        await this.handleMessage(webSocket, message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        webSocket.send(JSON.stringify({
          type: 'error',
          payload: { message: 'Invalid message format' },
          timestamp: new Date()
        }));
      }
    });

    // Handle connection close
    webSocket.addEventListener('close', () => {
      this.sessions.delete(webSocket);
      this.participants.delete(userId);
      this.lastActivity = new Date();

      this.broadcast({
        type: 'leave',
        payload: {
          user_id: userId,
          username,
          participant_count: this.participants.size
        },
        timestamp: new Date(),
        user_id: userId
      });
    });

    // Handle connection error
    webSocket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      this.sessions.delete(webSocket);
      this.participants.delete(userId);
    });
  }

  private async handleMessage(sender: WebSocket, message: WebSocketMessage): Promise<void> {
    const session = this.sessions.get(sender);
    if (!session) return;

    this.lastActivity = new Date();

    switch (message.type) {
      case 'message':
        await this.handleChatMessage(session, message);
        break;
      
      case 'typing':
        this.handleTypingIndicator(session, message, sender);
        break;
      
      case 'reaction':
        await this.handleMessageReaction(session, message);
        break;
      
      case 'presence':
        await this.handlePresenceUpdate(session, message);
        break;
      
      default:
        sender.send(JSON.stringify({
          type: 'error',
          payload: { message: `Unknown message type: ${message.type}` },
          timestamp: new Date()
        }));
    }
  }

  private async handleChatMessage(session: { userId: string; username: string }, message: WebSocketMessage): Promise<void> {
    const chatMessage = {
      room_id: this.roomId,
      user_id: session.userId,
      username: session.username,
      content: message.payload.content,
      type: message.payload.type || 'text',
      timestamp: new Date(),
      reply_to: message.payload.reply_to
    };

    // Store message in MongoDB
    try {
      const response = await fetch(`/api/internal/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Token': this.env.ADMIN_KEY
        },
        body: JSON.stringify(chatMessage)
      });

      if (!response.ok) {
        console.error('Failed to store chat message in MongoDB');
      }
    } catch (error) {
      console.error('Error storing chat message:', error);
    }

    // Broadcast to all participants
    this.broadcast({
      type: 'message',
      payload: chatMessage,
      timestamp: new Date(),
      user_id: session.userId,
      message_id: `${this.roomId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }

  private handleTypingIndicator(
    session: { userId: string; username: string }, 
    message: WebSocketMessage, 
    sender: WebSocket
  ): void {
    this.broadcast({
      type: 'typing',
      payload: {
        user_id: session.userId,
        username: session.username,
        is_typing: message.payload.is_typing
      },
      timestamp: new Date(),
      user_id: session.userId
    }, sender); // Exclude sender
  }

  private async handleMessageReaction(session: { userId: string; username: string }, message: WebSocketMessage): Promise<void> {
    const reaction = {
      room_id: this.roomId,
      message_id: message.payload.message_id,
      user_id: session.userId,
      reaction_type: message.payload.reaction_type,
      action: message.payload.action // 'add' or 'remove'
    };

    // Store reaction in MongoDB
    try {
      const response = await fetch(`/api/internal/chat/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Token': this.env.ADMIN_KEY
        },
        body: JSON.stringify(reaction)
      });

      if (response.ok) {
        // Broadcast reaction update
        this.broadcast({
          type: 'reaction',
          payload: reaction,
          timestamp: new Date(),
          user_id: session.userId
        });
      }
    } catch (error) {
      console.error('Error storing message reaction:', error);
    }
  }

  private async handlePresenceUpdate(session: { userId: string; username: string }, message: WebSocketMessage): Promise<void> {
    const presence = {
      user_id: session.userId,
      username: session.username,
      status: message.payload.status,
      current_page: message.payload.current_page,
      device_info: message.payload.device_info
    };

    // Update presence in MongoDB
    try {
      const response = await fetch(`/api/internal/presence/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Token': this.env.ADMIN_KEY
        },
        body: JSON.stringify(presence)
      });

      if (response.ok) {
        // Broadcast presence update (optional, for real-time user lists)
        this.broadcast({
          type: 'presence',
          payload: presence,
          timestamp: new Date(),
          user_id: session.userId
        });
      }
    } catch (error) {
      console.error('Error updating user presence:', error);
    }
  }

  private async sendRoomHistory(webSocket: WebSocket): Promise<void> {
    try {
      const response = await fetch(`/api/internal/chat/history/${this.roomId}?limit=50`, {
        headers: {
          'X-Internal-Token': this.env.ADMIN_KEY
        }
      });

      if (response.ok) {
        const history = await response.json() as { data?: any[] };
        webSocket.send(JSON.stringify({
          type: 'history',
          payload: { messages: history.data || [] },
          timestamp: new Date()
        }));
      }
    } catch (error) {
      console.error('Error fetching room history:', error);
    }
  }

  private broadcast(message: WebSocketMessage, exclude?: WebSocket): void {
    const messageStr = JSON.stringify(message);
    
    this.sessions.forEach((session, webSocket) => {
      if (webSocket !== exclude && webSocket.readyState === WebSocket.OPEN) {
        try {
          webSocket.send(messageStr);
        } catch (error) {
          console.error('Error broadcasting message to client:', error);
          // Remove problematic connection
          this.sessions.delete(webSocket);
          this.participants.delete(session.userId);
        }
      }
    });
  }

  // Periodic cleanup of inactive connections
  private async cleanup(): Promise<void> {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    this.sessions.forEach((session, webSocket) => {
      if (webSocket.readyState !== WebSocket.OPEN || 
          session.joinedAt.getTime() < fiveMinutesAgo) {
        this.sessions.delete(webSocket);
        this.participants.delete(session.userId);
        
        try {
          webSocket.close();
        } catch (error) {
          console.error('Error closing inactive WebSocket:', error);
        }
      }
    });

    // Schedule next cleanup
    if (this.sessions.size > 0) {
      setTimeout(() => this.cleanup(), 60000); // Every minute
    }
  }
}

// Initialize cleanup when room becomes active
export function initializeChatRoom() {
  // This would be called when the Durable Object is first created
  console.log('Chat room initialized');
}
