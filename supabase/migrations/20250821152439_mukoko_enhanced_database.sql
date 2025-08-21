-- ========================================
-- MUKOKO ENHANCED DATABASE STRUCTURE
-- Multi-tier architecture for social news app
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- USER MANAGEMENT TABLES
-- ========================================

-- Enhanced user profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'business-creator', 'author', 'admin', 'super_admin', 'moderator', 'analyst', 'content_manager')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
  email_verified BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User preferences and settings
CREATE TABLE user_settings (
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  auto_play_videos BOOLEAN DEFAULT TRUE,
  compact_mode BOOLEAN DEFAULT FALSE,
  default_feed TEXT DEFAULT 'trending',
  reading_speed INTEGER DEFAULT 200, -- words per minute
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- User subscription/follow relationships
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(follower_id, following_id)
);

-- User achievements and badges
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_public BOOLEAN DEFAULT TRUE
);

-- ========================================
-- CONTENT MANAGEMENT TABLES
-- ========================================

-- News sources and RSS feeds
CREATE TABLE news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  rss_url TEXT,
  description TEXT,
  category TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  country TEXT,
  favicon_url TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  crawl_frequency INTEGER DEFAULT 3600, -- in seconds
  last_crawled_at TIMESTAMP WITH TIME ZONE,
  total_articles INTEGER DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  quality_score DECIMAL(3,2) DEFAULT 0.50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Content categories with hierarchical structure
CREATE TABLE content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES content_categories(id),
  icon_name TEXT,
  color_hex TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Article/content table (main content storage)
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES news_sources(id),
  category_id UUID REFERENCES content_categories(id),
  title TEXT NOT NULL,
  slug VARCHAR(255),
  excerpt TEXT,
  content TEXT,
  author VARCHAR(255),
  original_url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  language TEXT DEFAULT 'en',
  word_count INTEGER,
  reading_time INTEGER, -- in minutes
  tags TEXT[], -- array of tags
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'hidden')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  quality_score DECIMAL(3,2) DEFAULT 0.50,
  sentiment_score DECIMAL(3,2), -- -1 to 1
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  indexed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ========================================
-- USER INTERACTION TABLES
-- ========================================

-- User bookmarks/saved articles
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  folder_name TEXT DEFAULT 'default',
  notes TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, article_id)
);

-- User likes/reactions
CREATE TABLE user_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  reaction_type TEXT DEFAULT 'like' CHECK (reaction_type IN ('like', 'dislike', 'love', 'angry', 'sad', 'wow')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, article_id, reaction_type)
);

-- Reading history and analytics
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  read_percentage DECIMAL(5,2) DEFAULT 0, -- 0-100%
  time_spent INTEGER DEFAULT 0, -- seconds
  device_type TEXT,
  platform TEXT,
  referrer TEXT,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- User comments and discussions
CREATE TABLE user_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES user_comments(id), -- for nested comments
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'flagged', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ========================================
-- ANALYTICS AND TRACKING TABLES
-- ========================================

-- User activity tracking
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  entity_type TEXT, -- 'article', 'comment', 'user', etc.
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Content performance metrics
CREATE TABLE article_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  avg_read_time DECIMAL(5,2) DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  engagement_score DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(article_id, date)
);

-- ========================================
-- NOTIFICATIONS AND MESSAGING
-- ========================================

-- User notifications
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  entity_type TEXT,
  entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  read_at TIMESTAMP WITH TIME ZONE
);

-- ========================================
-- SEARCH AND DISCOVERY
-- ========================================

-- User search history
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  clicked_article_id UUID REFERENCES articles(id),
  search_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Popular/trending topics
CREATE TABLE trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  category TEXT,
  mention_count INTEGER DEFAULT 1,
  trend_score DECIMAL(8,4) DEFAULT 0,
  peak_at TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(topic, date)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_auth_id ON user_profiles(auth_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- Articles indexes
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_is_featured ON articles(is_featured);
CREATE INDEX idx_articles_is_breaking ON articles(is_breaking);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_language ON articles(language);
CREATE INDEX idx_articles_quality_score ON articles(quality_score DESC);

-- User interactions indexes
CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_created_at ON user_bookmarks(created_at DESC);
CREATE INDEX idx_user_reactions_user_id ON user_reactions(user_id);
CREATE INDEX idx_user_reactions_article_id ON user_reactions(article_id);
CREATE INDEX idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX idx_reading_history_read_at ON reading_history(read_at DESC);
CREATE INDEX idx_user_comments_user_id ON user_comments(user_id);
CREATE INDEX idx_user_comments_article_id ON user_comments(article_id);
CREATE INDEX idx_user_comments_parent_id ON user_comments(parent_id);

-- Analytics indexes
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX idx_article_analytics_article_id ON article_analytics(article_id);
CREATE INDEX idx_article_analytics_date ON article_analytics(date DESC);

-- Search indexes
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX idx_trending_topics_date ON trending_topics(date DESC);
CREATE INDEX idx_trending_topics_trend_score ON trending_topics(trend_score DESC);

-- Full-text search indexes
CREATE INDEX idx_articles_fts ON articles USING GIN(to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, '')));

-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Public read access for content
ALTER TABLE news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;

-- User profile policies
CREATE POLICY "Users can view all public profiles" ON user_profiles
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- User settings policies
CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid()));

-- Bookmark policies
CREATE POLICY "Users can manage their own bookmarks" ON user_bookmarks
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid()));

-- Reaction policies
CREATE POLICY "Users can manage their own reactions" ON user_reactions
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid()));

-- Comment policies
CREATE POLICY "Users can view all published comments" ON user_comments
  FOR SELECT USING (status = 'published');

CREATE POLICY "Users can manage their own comments" ON user_comments
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid()));

-- Reading history policies
CREATE POLICY "Users can manage their own reading history" ON reading_history
  FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE auth_id = auth.uid()));

-- Public content policies
CREATE POLICY "Articles are publicly viewable" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "News sources are publicly viewable" ON news_sources
  FOR SELECT USING (is_active = true);

CREATE POLICY "Categories are publicly viewable" ON content_categories
  FOR SELECT USING (is_active = true);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_sources_updated_at BEFORE UPDATE ON news_sources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_comments_updated_at BEFORE UPDATE ON user_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (auth_id, email, username, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name'),
    CASE 
      WHEN NEW.email = 'bryan@nyuchi.com' THEN 'super_admin'
      ELSE 'creator'
    END
  );
  
  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES ((SELECT id FROM user_profiles WHERE auth_id = NEW.id));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_registration();

-- Function to update article view counts
CREATE OR REPLACE FUNCTION increment_article_views(article_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles 
  SET view_count = view_count + 1 
  WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get user reading stats
CREATE OR REPLACE FUNCTION get_user_reading_stats(user_uuid UUID)
RETURNS TABLE (
  total_articles_read BIGINT,
  total_reading_time INTEGER,
  avg_reading_time DECIMAL,
  favorite_category TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_articles_read,
    SUM(rh.time_spent)::INTEGER as total_reading_time,
    AVG(rh.time_spent) as avg_reading_time,
    (
      SELECT cc.name 
      FROM reading_history rh2
      JOIN articles a ON rh2.article_id = a.id
      JOIN content_categories cc ON a.category_id = cc.id
      WHERE rh2.user_id = user_uuid
      GROUP BY cc.name
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as favorite_category
  FROM reading_history rh
  WHERE rh.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;