// ========================================
// USER SESSION DURABLE OBJECT FOR MUKOKO
// Real-time user presence and session management
// ========================================

import type { UserPresence, UserSessionState, CloudflareEnv } from '../types/database';

export class UserSession {
  private state: DurableObjectState;
  private env: CloudflareEnv;
  private websocket: WebSocket | null = null;
  private userId: string = '';
  private username: string = '';
  private lastActivity: Date = new Date();
  private presenceInfo: UserPresence = {
    user_id: '',
    username: '',
    status: 'offline',
    last_seen: new Date(),
    current_page: '',
    device_info: {
      type: '',
      browser: '',
      os: ''
    }
  };

  constructor(state: DurableObjectState, env: CloudflareEnv) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    this.userId = pathParts[pathParts.length - 1] || '';

    // Handle WebSocket upgrade for real-time presence
    if (request.headers.get('Upgrade') === 'websocket') {
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      await this.handleWebSocket(server, request);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // Handle HTTP requests for session management
    if (request.method === 'GET') {
      return this.handleGetSession();
    }

    if (request.method === 'POST') {
      return this.handleUpdateSession(request);
    }

    return new Response('Method not allowed', { status: 405 });
  }

  private async handleWebSocket(webSocket: WebSocket, request: Request): Promise<void> {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    this.username = url.searchParams.get('username') || '';

    if (!token || !this.username) {
      webSocket.close(1008, 'Missing required parameters: token, username');
      return;
    }

    // TODO: Validate token against Supabase
    // For now, we'll trust the provided user info

    webSocket.accept();
    this.websocket = webSocket;

    // Initialize presence
    this.presenceInfo = {
      user_id: this.userId,
      username: this.username,
      status: 'online',
      last_seen: new Date(),
      current_page: url.searchParams.get('page') || '',
      device_info: {
        user_agent: request.headers.get('User-Agent') || '',
        screen_resolution: url.searchParams.get('screen') || '',
        timezone: url.searchParams.get('timezone') || ''
      }
    };

    await this.updatePresenceInMongoDB();
    this.lastActivity = new Date();

    // Set up heartbeat
    this.setupHeartbeat();

    // Handle messages
    webSocket.addEventListener('message', async (event) => {
      try {
        const message = JSON.parse(event.data as string);
        await this.handleMessage(message);
      } catch (error) {
        console.error('Error handling user session message:', error);
      }
    });

    // Handle close
    webSocket.addEventListener('close', async () => {
      this.presenceInfo.status = 'offline';
      this.presenceInfo.last_seen = new Date();
      await this.updatePresenceInMongoDB();
      this.websocket = null;
    });

    // Handle error
    webSocket.addEventListener('error', async (error) => {
      console.error('User session WebSocket error:', error);
      this.presenceInfo.status = 'offline';
      this.presenceInfo.last_seen = new Date();
      await this.updatePresenceInMongoDB();
      this.websocket = null;
    });

    // Send initial session data
    this.sendSessionUpdate();
  }

  private async handleMessage(message: any): Promise<void> {
    this.lastActivity = new Date();

    switch (message.type) {
      case 'presence_update':
        await this.handlePresenceUpdate(message.payload);
        break;

      case 'page_change':
        await this.handlePageChange(message.payload);
        break;

      case 'activity_ping':
        await this.handleActivityPing();
        break;

      case 'reading_progress':
        await this.handleReadingProgress(message.payload);
        break;

      case 'notification_read':
        await this.handleNotificationRead(message.payload);
        break;

      default:
        console.log('Unknown user session message type:', message.type);
    }
  }

  private async handlePresenceUpdate(payload: any): Promise<void> {
    this.presenceInfo = {
      ...this.presenceInfo,
      status: payload.status || this.presenceInfo.status,
      current_page: payload.current_page || this.presenceInfo.current_page,
      device_info: { ...this.presenceInfo.device_info, ...payload.device_info }
    };

    await this.updatePresenceInMongoDB();
    this.sendSessionUpdate();
  }

  private async handlePageChange(payload: any): Promise<void> {
    this.presenceInfo.current_page = payload.page || '';
    this.presenceInfo.last_seen = new Date();

    // Track page visit in analytics
    try {
      const visitData = {
        user_id: this.userId,
        page: payload.page,
        referrer: payload.referrer || '',
        timestamp: new Date(),
        session_id: this.userId + '-' + Date.now(),
        device_info: this.presenceInfo.device_info
      };

      // Store in KV for quick access and D1 for persistence
      await this.env.ANALYTICS_KV?.put(
        `page_visit:${this.userId}:${Date.now()}`,
        JSON.stringify(visitData),
        { expirationTtl: 86400 } // 24 hours
      );

    } catch (error) {
      console.error('Error tracking page visit:', error);
    }

    await this.updatePresenceInMongoDB();
  }

  private async handleActivityPing(): Promise<void> {
    this.lastActivity = new Date();
    this.presenceInfo.last_seen = new Date();
    this.presenceInfo.status = 'online';

    await this.updatePresenceInMongoDB();
  }

  private async handleReadingProgress(payload: any): Promise<void> {
    const progressData = {
      user_id: this.userId,
      article_id: payload.article_id,
      progress_percentage: payload.progress,
      scroll_position: payload.scroll_position,
      time_spent: payload.time_spent,
      timestamp: new Date()
    };

    // Store reading progress
    try {
      await this.env.ANALYTICS_KV?.put(
        `reading_progress:${this.userId}:${payload.article_id}`,
        JSON.stringify(progressData),
        { expirationTtl: 86400 }
      );
    } catch (error) {
      console.error('Error storing reading progress:', error);
    }
  }

  private async handleNotificationRead(payload: any): Promise<void> {
    try {
      // Update notification as read in Supabase
      const response = await fetch(`/api/internal/notifications/${payload.notification_id}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Token': this.env.ADMIN_KEY || ''
        },
        body: JSON.stringify({
          user_id: this.userId,
          read_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Send acknowledgment
        this.sendMessage({
          type: 'notification_read_ack',
          payload: { notification_id: payload.notification_id },
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  private async handleGetSession(): Promise<Response> {
    const sessionData = {
      user_id: this.userId,
      username: this.username,
      presence: this.presenceInfo,
      last_activity: this.lastActivity.toISOString(),
      is_connected: this.websocket !== null && this.websocket.readyState === 1,
      session_duration: Date.now() - this.lastActivity.getTime()
    };

    return new Response(JSON.stringify(sessionData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleUpdateSession(request: Request): Promise<Response> {
    try {
      const updateData = await request.json() as { presence?: Partial<UserPresence> };
      
      if (updateData.presence) {
        this.presenceInfo = { ...this.presenceInfo, ...updateData.presence };
        await this.updatePresenceInMongoDB();
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private async updatePresenceInMongoDB(): Promise<void> {
    try {
      const response = await fetch('/api/internal/presence/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Token': this.env.ADMIN_KEY || ''
        },
        body: JSON.stringify(this.presenceInfo)
      });

      if (!response.ok) {
        console.error('Failed to update presence in MongoDB');
      }
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  private setupHeartbeat(): void {
    // Send heartbeat every 30 seconds
    const heartbeatInterval = setInterval(() => {
      if (this.websocket && this.websocket.readyState === 1) {
        this.sendMessage({
          type: 'heartbeat',
          payload: { timestamp: Date.now() },
          timestamp: new Date()
        });

        // Check for inactivity (5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (this.lastActivity.getTime() < fiveMinutesAgo) {
          this.presenceInfo.status = 'away';
          this.updatePresenceInMongoDB();
        }
      } else {
        clearInterval(heartbeatInterval);
      }
    }, 30000);
  }

  private sendSessionUpdate(): void {
    this.sendMessage({
      type: 'session_update',
      payload: {
        user_id: this.userId,
        username: this.username,
        presence: this.presenceInfo,
        last_activity: this.lastActivity.toISOString()
      },
      timestamp: new Date()
    });
  }

  private sendMessage(message: any): void {
    if (this.websocket && this.websocket.readyState === 1) {
      try {
        this.websocket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message to user session:', error);
      }
    }
  }

  // Static method to get user presence from multiple sessions
  static async getUserPresence(userId: string, env: CloudflareEnv): Promise<UserPresence | null> {
    try {
      const response = await fetch(`/api/internal/presence/${userId}`, {
        headers: {
          'X-Internal-Token': env.ADMIN_KEY || ''
        }
      });

      if (response.ok) {
        const data = await response.json() as { presence?: UserPresence };
        return data.presence || null;
      }
    } catch (error) {
      console.error('Error fetching user presence:', error);
    }

    return null;
  }

  // Static method to broadcast to user across all their sessions
  static async broadcastToUser(userId: string, message: any, env: CloudflareEnv): Promise<void> {
    try {
      // Get user session Durable Object
      const id = env.USER_SESSIONS?.idFromName(userId);
      if (!id) return;

      const stub = env.USER_SESSIONS?.get(id);
      if (!stub) return;

      await stub.fetch(`https://user-session/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'broadcast', message })
      });
    } catch (error) {
      console.error('Error broadcasting to user:', error);
    }
  }
}
