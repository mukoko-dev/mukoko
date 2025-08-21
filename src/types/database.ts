// ========================================
// MUKOKO DATABASE TYPES
// Enhanced multi-tier architecture types
// ========================================

// ========================================
// USER MANAGEMENT TYPES
// ========================================

export interface UserProfile {
  id: string;
  auth_id: string;
  email: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  role: 'creator' | 'business-creator' | 'author' | 'admin' | 'super_admin' | 'moderator' | 'analyst' | 'content_manager';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  email_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface UserSettings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  email_notifications: boolean;
  push_notifications: boolean;
  privacy_level: 'public' | 'friends' | 'private';
  auto_play_videos: boolean;
  compact_mode: boolean;
  default_feed: string;
  reading_speed: number;
  font_size: 'small' | 'medium' | 'large';
  created_at: string;
  updated_at: string;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description?: string;
  icon_url?: string;
  earned_at: string;
  is_public: boolean;
}

// ========================================
// CONTENT MANAGEMENT TYPES
// ========================================

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rss_url?: string;
  description?: string;
  category: string;
  language: string;
  country?: string;
  favicon_url?: string;
  logo_url?: string;
  is_active: boolean;
  is_verified: boolean;
  crawl_frequency: number;
  last_crawled_at?: string;
  total_articles: number;
  subscriber_count: number;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  icon_name?: string;
  color_hex?: string;
  sort_order: number;
  is_active: boolean;
  article_count: number;
  created_at: string;
}

export interface Article {
  id: string;
  source_id?: string;
  category_id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  original_url?: string;
  image_url?: string;
  published_at?: string;
  language: string;
  word_count?: number;
  reading_time?: number;
  tags?: string[];
  status: 'draft' | 'published' | 'archived' | 'hidden';
  is_featured: boolean;
  is_breaking: boolean;
  view_count: number;
  share_count: number;
  quality_score: number;
  sentiment_score?: number;
  created_at: string;
  updated_at: string;
  indexed_at: string;
}

// ========================================
// USER INTERACTION TYPES
// ========================================

export interface UserBookmark {
  id: string;
  user_id: string;
  article_id: string;
  folder_name: string;
  notes?: string;
  is_public: boolean;
  created_at: string;
}

export interface UserReaction {
  id: string;
  user_id: string;
  article_id: string;
  reaction_type: 'like' | 'dislike' | 'love' | 'angry' | 'sad' | 'wow';
  created_at: string;
}

export interface ReadingHistory {
  id: string;
  user_id: string;
  article_id: string;
  read_percentage: number;
  time_spent: number;
  device_type?: string;
  platform?: string;
  referrer?: string;
  read_at: string;
  completed_at?: string;
}

export interface UserComment {
  id: string;
  user_id: string;
  article_id: string;
  parent_id?: string;
  content: string;
  is_edited: boolean;
  is_pinned: boolean;
  like_count: number;
  reply_count: number;
  status: 'published' | 'hidden' | 'flagged' | 'deleted';
  created_at: string;
  updated_at: string;
}

// ========================================
// ANALYTICS AND TRACKING TYPES
// ========================================

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ArticleAnalytics {
  id: string;
  article_id: string;
  date: string;
  views: number;
  unique_views: number;
  shares: number;
  comments: number;
  likes: number;
  bookmarks: number;
  avg_read_time: number;
  bounce_rate: number;
  engagement_score: number;
  created_at: string;
}

// ========================================
// NOTIFICATIONS AND MESSAGING TYPES
// ========================================

export interface UserNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  entity_type?: string;
  entity_id?: string;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  read_at?: string;
}

// ========================================
// SEARCH AND DISCOVERY TYPES
// ========================================

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  results_count: number;
  clicked_article_id?: string;
  search_type: string;
  created_at: string;
}

export interface TrendingTopic {
  id: string;
  topic: string;
  category?: string;
  mention_count: number;
  trend_score: number;
  peak_at?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

// ========================================
// MONGODB HIGH-FREQUENCY TYPES
// ========================================

export interface PostInteraction {
  _id?: string;
  post_id: string;
  user_id: string;
  type: 'like' | 'save' | 'share' | 'view';
  timestamp: Date;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export interface Comment {
  _id?: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_id?: string;
  likes: number;
  replies: number;
  created_at: Date;
  updated_at: Date;
  is_edited: boolean;
  mentions?: string[];
  hashtags?: string[];
}

export interface ChatMessage {
  _id?: string;
  room_id: string;
  user_id: string;
  username: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'reaction';
  timestamp: Date;
  edited_at?: Date;
  reply_to?: string;
  reactions?: Record<string, string[]>; // reaction_type -> user_ids
}

export interface UserPresence {
  _id?: string;
  user_id: string;
  username: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: Date;
  current_page?: string;
  device_info?: {
    type?: string;
    browser?: string;
    os?: string;
    user_agent?: string;
    screen_resolution?: string;
    timezone?: string;
  };
}

// ========================================
// KV CACHE TYPES
// ========================================

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  version?: string;
}

export interface UserSession {
  user_id: string;
  session_token: string;
  expires_at: number;
  ip_address: string;
  user_agent: string;
  device_fingerprint?: string;
  last_activity: number;
  is_mobile: boolean;
}

// ========================================
// DURABLE OBJECTS TYPES
// ========================================

export interface ChatRoomState {
  room_id: string;
  participants: Map<string, UserPresence>;
  message_history: ChatMessage[];
  last_activity: Date;
  room_settings: {
    max_participants: number;
    is_public: boolean;
    allow_files: boolean;
    auto_delete_after: number; // hours
  };
}

export interface WebSocketMessage {
  type: 'join' | 'leave' | 'message' | 'typing' | 'presence' | 'reaction';
  payload: any;
  timestamp: Date;
  user_id: string;
  message_id?: string;
}

export interface UserSessionState {
  user_id: string;
  session_data: Record<string, any>;
  connections: Set<WebSocket>;
  last_activity: Date;
  preferences: UserSettings;
  real_time_subscriptions: Set<string>; // channel names
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    has_more?: boolean;
  };
}

export interface FeedResponse {
  articles: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
    trending_topics: TrendingTopic[];
    recommended_sources: NewsSource[];
  };
}

export interface UserStatsResponse {
  reading_stats: {
    total_articles_read: number;
    total_reading_time: number;
    avg_reading_time: number;
    favorite_category: string;
  };
  engagement_stats: {
    total_likes: number;
    total_bookmarks: number;
    total_comments: number;
    total_shares: number;
  };
  achievements: UserAchievement[];
  follower_count: number;
  following_count: number;
}

// ========================================
// ENVIRONMENT AND CONFIG TYPES
// ========================================

export interface CloudflareEnv {
  // Supabase
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // MongoDB
  MONGODB_URI: string;
  MONGODB_DB_NAME: string;

  // Cloudflare bindings
  CACHE_STORAGE: KVNamespace;
  USER_STORAGE: KVNamespace;
  NEWS_STORAGE: KVNamespace;
  CONFIG_STORAGE: KVNamespace;
  ANALYTICS_KV: KVNamespace;
  USER_DB: D1Database;
  CHAT_ROOMS: DurableObjectNamespace;
  USER_SESSIONS: DurableObjectNamespace;

  // Analytics Engine
  CATEGORY_CLICKS: AnalyticsEngineDataset;
  NEWS_INTERACTIONS: AnalyticsEngineDataset;
  SEARCH_QUERIES: AnalyticsEngineDataset;

  // Configuration
  NODE_ENV: string;
  ADMIN_KEY: string;
  WORKER_URL?: string;
  ENABLE_REAL_TIME_CHAT: string;
  ENABLE_PUSH_NOTIFICATIONS: string;
  ENABLE_ANALYTICS_TRACKING: string;
  ENABLE_CONTENT_RECOMMENDATIONS: string;
}

// ========================================
// UTILITY TYPES
// ========================================

export type DatabaseError = {
  code: string;
  message: string;
  details?: any;
};

export type SortDirection = 'asc' | 'desc';

export type PaginationOptions = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type FilterOptions = {
  category?: string;
  source?: string;
  language?: string;
  date_from?: string;
  date_to?: string;
  is_featured?: boolean;
  is_breaking?: boolean;
  status?: string;
};

export type SortOptions = {
  field: string;
  direction: SortDirection;
};

export type QueryOptions = PaginationOptions & {
  filters?: FilterOptions;
  sort?: SortOptions;
  include_analytics?: boolean;
  include_user_data?: boolean;
};
