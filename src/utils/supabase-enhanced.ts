// ========================================
// ENHANCED SUPABASE UTILITIES FOR MUKOKO
// ========================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { 
  CloudflareEnv, 
  UserProfile, 
  UserSettings, 
  Article, 
  UserBookmark,
  UserReaction,
  ReadingHistory,
  UserComment,
  NewsSource,
  ContentCategory,
  TrendingTopic,
  ApiResponse
} from '../types/database';

export function createSupabaseClient(env: CloudflareEnv, useServiceRole = false): SupabaseClient {
  const key = useServiceRole ? env.SUPABASE_SERVICE_ROLE_KEY : env.VITE_SUPABASE_ANON_KEY;
  
  return createClient(env.VITE_SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    }
  });
}

// ========================================
// USER MANAGEMENT FUNCTIONS
// ========================================

export async function getUserProfile(supabase: SupabaseClient, userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('auth_id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

export async function createUserProfile(
  supabase: SupabaseClient, 
  profileData: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profileData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  return data;
}

export async function updateUserProfile(
  supabase: SupabaseClient, 
  userId: string, 
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('auth_id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
  return data;
}

export async function getUserSettings(supabase: SupabaseClient, userId: string): Promise<UserSettings | null> {
  // First get the user profile to get the internal user_id
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', profile.id)
    .single();
    
  if (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }
  return data;
}

export async function updateUserSettings(
  supabase: SupabaseClient,
  userId: string,
  settings: Partial<UserSettings>
): Promise<UserSettings | null> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .upsert({ 
      user_id: profile.id,
      ...settings,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error updating user settings:', error);
    return null;
  }
  return data;
}

// ========================================
// CONTENT FUNCTIONS
// ========================================

export async function getArticles(
  supabase: SupabaseClient,
  options: {
    category?: string;
    limit?: number;
    offset?: number;
    is_featured?: boolean;
    is_breaking?: boolean;
  } = {}
): Promise<{ articles: Article[]; total: number }> {
  let query = supabase
    .from('articles')
    .select(`
      *,
      news_sources (name, favicon_url, is_verified),
      content_categories (name, slug, color_hex)
    `, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (options.category) {
    query = query.eq('content_categories.slug', options.category);
  }

  if (options.is_featured !== undefined) {
    query = query.eq('is_featured', options.is_featured);
  }

  if (options.is_breaking !== undefined) {
    query = query.eq('is_breaking', options.is_breaking);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    return { articles: [], total: 0 };
  }

  return { articles: data || [], total: count || 0 };
}

export async function getArticleById(supabase: SupabaseClient, articleId: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      news_sources (name, url, favicon_url, is_verified),
      content_categories (name, slug, color_hex, icon_name)
    `)
    .eq('id', articleId)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data;
}

export async function incrementArticleViews(supabase: SupabaseClient, articleId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_article_views', {
    article_uuid: articleId
  });

  if (error) {
    console.error('Error incrementing article views:', error);
  }
}

export async function getContentCategories(supabase: SupabaseClient): Promise<ContentCategory[]> {
  const { data, error } = await supabase
    .from('content_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function getNewsSource(supabase: SupabaseClient, sourceId: string): Promise<NewsSource | null> {
  const { data, error } = await supabase
    .from('news_sources')
    .select('*')
    .eq('id', sourceId)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching news source:', error);
    return null;
  }

  return data;
}

// ========================================
// USER INTERACTION FUNCTIONS
// ========================================

export async function getUserBookmarks(
  supabase: SupabaseClient,
  userId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<{ bookmarks: UserBookmark[]; total: number }> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return { bookmarks: [], total: 0 };

  let query = supabase
    .from('user_bookmarks')
    .select(`
      *,
      articles (
        id, title, slug, excerpt, image_url, published_at,
        news_sources (name, favicon_url),
        content_categories (name, slug, color_hex)
      )
    `, { count: 'exact' })
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching bookmarks:', error);
    return { bookmarks: [], total: 0 };
  }

  return { bookmarks: data || [], total: count || 0 };
}

export async function addBookmark(
  supabase: SupabaseClient,
  userId: string,
  articleId: string,
  folderName = 'default'
): Promise<UserBookmark | null> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return null;

  const { data, error } = await supabase
    .from('user_bookmarks')
    .upsert({
      user_id: profile.id,
      article_id: articleId,
      folder_name: folderName
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding bookmark:', error);
    return null;
  }

  return data;
}

export async function removeBookmark(
  supabase: SupabaseClient,
  userId: string,
  articleId: string
): Promise<boolean> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return false;

  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .eq('user_id', profile.id)
    .eq('article_id', articleId);

  if (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }

  return true;
}

export async function addReaction(
  supabase: SupabaseClient,
  userId: string,
  articleId: string,
  reactionType: UserReaction['reaction_type']
): Promise<UserReaction | null> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return null;

  const { data, error } = await supabase
    .from('user_reactions')
    .upsert({
      user_id: profile.id,
      article_id: articleId,
      reaction_type: reactionType
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding reaction:', error);
    return null;
  }

  return data;
}

export async function removeReaction(
  supabase: SupabaseClient,
  userId: string,
  articleId: string,
  reactionType: UserReaction['reaction_type']
): Promise<boolean> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return false;

  const { error } = await supabase
    .from('user_reactions')
    .delete()
    .eq('user_id', profile.id)
    .eq('article_id', articleId)
    .eq('reaction_type', reactionType);

  if (error) {
    console.error('Error removing reaction:', error);
    return false;
  }

  return true;
}

export async function recordReadingActivity(
  supabase: SupabaseClient,
  userId: string,
  articleId: string,
  activityData: {
    read_percentage?: number;
    time_spent?: number;
    device_type?: string;
    platform?: string;
    referrer?: string;
  }
): Promise<ReadingHistory | null> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return null;

  const { data, error } = await supabase
    .from('reading_history')
    .upsert({
      user_id: profile.id,
      article_id: articleId,
      ...activityData
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording reading activity:', error);
    return null;
  }

  return data;
}

// ========================================
// ANALYTICS FUNCTIONS
// ========================================

export async function getUserReadingStats(
  supabase: SupabaseClient,
  userId: string
): Promise<any> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return null;

  const { data, error } = await supabase.rpc('get_user_reading_stats', {
    user_uuid: profile.id
  });

  if (error) {
    console.error('Error fetching reading stats:', error);
    return null;
  }

  return data;
}

export async function getTrendingTopics(
  supabase: SupabaseClient,
  limit = 10
): Promise<TrendingTopic[]> {
  const { data, error } = await supabase
    .from('trending_topics')
    .select('*')
    .eq('date', new Date().toISOString().split('T')[0])
    .order('trend_score', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }

  return data || [];
}

// ========================================
// SEARCH FUNCTIONS
// ========================================

export async function searchArticles(
  supabase: SupabaseClient,
  query: string,
  options: {
    category?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ articles: Article[]; total: number }> {
  let searchQuery = supabase
    .from('articles')
    .select(`
      *,
      news_sources (name, favicon_url, is_verified),
      content_categories (name, slug, color_hex)
    `, { count: 'exact' })
    .eq('status', 'published')
    .textSearch('title,content,excerpt', query, {
      type: 'websearch',
      config: 'english'
    })
    .order('published_at', { ascending: false });

  if (options.category) {
    searchQuery = searchQuery.eq('content_categories.slug', options.category);
  }

  if (options.limit) {
    searchQuery = searchQuery.limit(options.limit);
  }

  if (options.offset) {
    searchQuery = searchQuery.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error, count } = await searchQuery;

  if (error) {
    console.error('Error searching articles:', error);
    return { articles: [], total: 0 };
  }

  return { articles: data || [], total: count || 0 };
}

export async function recordSearchQuery(
  supabase: SupabaseClient,
  userId: string,
  query: string,
  resultsCount: number,
  clickedArticleId?: string
): Promise<void> {
  const profile = await getUserProfile(supabase, userId);
  if (!profile) return;

  const { error } = await supabase
    .from('search_history')
    .insert({
      user_id: profile.id,
      query,
      results_count: resultsCount,
      clicked_article_id: clickedArticleId,
      search_type: 'general'
    });

  if (error) {
    console.error('Error recording search query:', error);
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

export function handleSupabaseError(error: any): ApiResponse {
  console.error('Supabase error:', error);
  
  return {
    success: false,
    error: error.message || 'Database operation failed',
    data: null
  };
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

export async function checkUserExists(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('auth_id', userId)
    .single();

  return !error && !!data;
}

export async function isUserAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const profile = await getUserProfile(supabase, userId);
  return profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'moderator';
}
