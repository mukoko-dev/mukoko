// ========================================
// ENHANCED WORKER API ENDPOINTS FOR MUKOKO
// Multi-tier architecture API integration
// ========================================

import { createSupabaseClient } from '../src/utils/supabase-enhanced';
import type { CloudflareEnv } from '../src/types/database';

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

function validateAdminToken(request: Request, env: CloudflareEnv): boolean {
  const token = request.headers.get('X-Internal-Token');
  return token === env.ADMIN_KEY;
}

async function validateUserToken(request: Request, env: CloudflareEnv): Promise<string | null> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    const supabase = createSupabaseClient(env);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    return error ? null : user?.id || null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

// ========================================
// SIMPLIFIED API HANDLERS
// Using KV and Supabase without MongoDB for now
// ========================================

export async function handleChatMessage(request: Request, env: CloudflareEnv): Promise<Response> {
  if (!validateAdminToken(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const messageData = await request.json() as {
      room_id: string;
      user_id: string;
      username: string;
      content: string;
      type?: string;
      reply_to?: string;
    };
    
    // Store in Supabase for persistence
    const supabase = createSupabaseClient(env, true);
    const { data, error } = await supabase.from('chat_messages').insert({
      room_id: messageData.room_id,
      user_id: messageData.user_id,
      content: messageData.content,
      message_type: messageData.type || 'text',
      reply_to: messageData.reply_to
    }).select().single();

    if (error) throw error;

    // Cache recent message in KV
    const cacheKey = `chat:${messageData.room_id}:latest`;
    await env.USER_STORAGE.put(cacheKey, JSON.stringify({
      ...data,
      username: messageData.username,
      timestamp: new Date().toISOString()
    }), { expirationTtl: 300 });

    return new Response(JSON.stringify({ 
      success: true, 
      message_id: data.id 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Chat message storage error:', error);
    return new Response(JSON.stringify({ error: 'Storage failed' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleChatHistory(request: Request, env: CloudflareEnv): Promise<Response> {
  if (!validateAdminToken(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const roomId = url.pathname.split('/').pop();
    const limit = parseInt(url.searchParams.get('limit') || '50');
    
    if (!roomId) {
      return new Response(JSON.stringify({ error: 'Room ID required' }), { status: 400 });
    }

    const supabase = createSupabaseClient(env, true);
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user_profiles!inner(username, avatar_url)
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return new Response(JSON.stringify({ 
      data: messages || [],
      count: messages?.length || 0 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Chat history retrieval error:', error);
    return new Response(JSON.stringify({ error: 'Retrieval failed' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handlePresenceUpdate(request: Request, env: CloudflareEnv): Promise<Response> {
  if (!validateAdminToken(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const presenceData = await request.json() as {
      user_id: string;
      username: string;
      status: string;
      current_page?: string;
      device_info?: any;
    };
    
    // Cache in KV for quick access
    await env.USER_STORAGE.put(
      `presence:${presenceData.user_id}`,
      JSON.stringify({
        ...presenceData,
        last_updated: new Date().toISOString()
      }),
      { expirationTtl: 300 } // 5 minutes
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Presence update error:', error);
    return new Response(JSON.stringify({ error: 'Update failed' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleGetPresence(request: Request, env: CloudflareEnv): Promise<Response> {
  if (!validateAdminToken(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), { status: 400 });
    }

    // Try KV cache first
    const cached = await env.USER_STORAGE.get(`presence:${userId}`);
    if (cached) {
      const presenceData = JSON.parse(cached);
      return new Response(JSON.stringify({ 
        presence: presenceData,
        source: 'cache' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback to default offline status
    return new Response(JSON.stringify({ 
      presence: {
        user_id: userId,
        status: 'offline',
        last_seen: new Date().toISOString()
      },
      source: 'default' 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Presence retrieval error:', error);
    return new Response(JSON.stringify({ error: 'Retrieval failed' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleNotificationRead(request: Request, env: CloudflareEnv): Promise<Response> {
  if (!validateAdminToken(request, env)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const notificationId = url.pathname.split('/')[3]; // /api/internal/notifications/{id}/read
    const { user_id, read_at } = await request.json() as { user_id: string; read_at: string };

    const supabase = createSupabaseClient(env, true);
    const { error } = await supabase
      .from('user_notifications')
      .update({ 
        read_at,
        is_read: true 
      })
      .eq('id', notificationId)
      .eq('user_id', user_id);

    if (error) {
      return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Notification read error:', error);
    return new Response(JSON.stringify({ error: 'Processing failed' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export function routeInternalAPI(request: Request, env: CloudflareEnv): Promise<Response> | Response {
  const url = new URL(request.url);
  const path = url.pathname;

  // Chat endpoints
  if (path === '/api/internal/chat/message') {
    return handleChatMessage(request, env);
  }
  if (path.startsWith('/api/internal/chat/history/')) {
    return handleChatHistory(request, env);
  }

  // Presence endpoints
  if (path === '/api/internal/presence/update') {
    return handlePresenceUpdate(request, env);
  }
  if (path.startsWith('/api/internal/presence/')) {
    return handleGetPresence(request, env);
  }

  // Notification endpoints
  if (path.includes('/notifications/') && path.endsWith('/read')) {
    return handleNotificationRead(request, env);
  }

  return new Response(JSON.stringify({ error: 'Not found' }), { 
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}
