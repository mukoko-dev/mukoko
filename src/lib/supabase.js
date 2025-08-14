import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found. Using fallback authentication.')
}

export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key'
)

// Auth helpers
export const auth = {
  // Sign up with email
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Sign in with email
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in with OAuth
  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  }
}

// Database helpers
export const db = {
  // User profiles
  profiles: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    upsert: async (profile) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select()
        .single()
      return { data, error }
    },

    update: async (userId, updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      return { data, error }
    }
  },

  // User preferences
  preferences: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    },

    upsert: async (preferences) => {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(preferences)
        .select()
        .single()
      return { data, error }
    }
  },

  // Bookmarks
  bookmarks: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    add: async (bookmark) => {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert(bookmark)
        .select()
        .single()
      return { data, error }
    },

    remove: async (userId, articleId) => {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('article_id', articleId)
      return { error }
    }
  },

  // Likes
  likes: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('likes')
        .select('article_id')
        .eq('user_id', userId)
      return { 
        data: data ? data.map(item => item.article_id) : [], 
        error 
      }
    },

    add: async (like) => {
      const { data, error } = await supabase
        .from('likes')
        .insert(like)
        .select()
        .single()
      return { data, error }
    },

    remove: async (userId, articleId) => {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('article_id', articleId)
      return { error }
    }
  },

  // Reading history
  readingHistory: {
    get: async (userId, limit = 100) => {
      const { data, error } = await supabase
        .from('reading_history')
        .select('*')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(limit)
      return { data, error }
    },

    add: async (historyEntry) => {
      const { data, error } = await supabase
        .from('reading_history')
        .insert(historyEntry)
        .select()
        .single()
      return { data, error }
    }
  },

  // Analytics
  analytics: {
    track: async (event) => {
      const { data, error } = await supabase
        .from('analytics_events')
        .insert(event)
      return { data, error }
    },

    get: async (userId, eventType = null, limit = 100) => {
      let query = supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (eventType) {
        query = query.eq('event_type', eventType)
      }

      const { data, error } = await query
      return { data, error }
    }
  }
}

// Real-time subscriptions
export const realtime = {
  // Subscribe to user data changes
  subscribeToUserData: (userId, callback) => {
    return supabase
      .channel(`user-${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `id=eq.${userId}`
        }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to bookmarks changes
  subscribeToBookmarks: (userId, callback) => {
    return supabase
      .channel(`bookmarks-${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe()
  }
}

export default supabase