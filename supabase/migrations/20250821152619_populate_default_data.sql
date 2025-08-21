-- ========================================
-- POPULATE DEFAULT DATA FOR MUKOKO
-- ========================================

-- Insert default content categories
INSERT INTO content_categories (name, slug, description, icon_name, color_hex, sort_order) VALUES
('Technology', 'technology', 'Latest in tech, gadgets, software, and innovation', 'monitor-speaker', '#3B82F6', 1),
('Business', 'business', 'Business news, finance, and market updates', 'briefcase', '#10B981', 2),
('Science', 'science', 'Scientific discoveries and research', 'flask-conical', '#8B5CF6', 3),
('Health', 'health', 'Health, medicine, and wellness news', 'heart-pulse', '#EF4444', 4),
('Sports', 'sports', 'Sports news, scores, and updates', 'trophy', '#F59E0B', 5),
('Entertainment', 'entertainment', 'Movies, TV, music, and celebrity news', 'film', '#EC4899', 6),
('Politics', 'politics', 'Political news and government updates', 'landmark', '#6B7280', 7),
('World', 'world', 'International news and global events', 'globe', '#14B8A6', 8),
('Opinion', 'opinion', 'Opinion pieces and editorial content', 'message-circle', '#F97316', 9),
('Lifestyle', 'lifestyle', 'Fashion, food, travel, and culture', 'coffee', '#84CC16', 10);

-- Insert some popular news sources
INSERT INTO news_sources (name, url, rss_url, description, category, language, country, is_verified) VALUES
('TechCrunch', 'https://techcrunch.com', 'https://techcrunch.com/feed/', 'Technology and startup news', 'Technology', 'en', 'US', true),
('BBC News', 'https://bbc.com/news', 'https://feeds.bbci.co.uk/news/rss.xml', 'British Broadcasting Corporation news', 'World', 'en', 'UK', true),
('Reuters', 'https://reuters.com', 'https://feeds.reuters.com/reuters/topNews', 'International news agency', 'World', 'en', 'US', true),
('The Verge', 'https://theverge.com', 'https://theverge.com/rss/index.xml', 'Technology, science, art, and culture', 'Technology', 'en', 'US', true),
('Hacker News', 'https://news.ycombinator.com', 'https://hnrss.org/frontpage', 'Tech community discussions', 'Technology', 'en', 'US', true),
('ArsTechnica', 'https://arstechnica.com', 'https://feeds.arstechnica.com/arstechnica/index', 'Technology news and analysis', 'Technology', 'en', 'US', true),
('Wired', 'https://wired.com', 'https://wired.com/feed/rss', 'Technology, culture, and politics', 'Technology', 'en', 'US', true),
('Bloomberg', 'https://bloomberg.com', 'https://feeds.bloomberg.com/markets/news.rss', 'Business and financial news', 'Business', 'en', 'US', true),
('ESPN', 'https://espn.com', 'https://espn.com/espn/rss/news', 'Sports news and updates', 'Sports', 'en', 'US', true),
('National Geographic', 'https://nationalgeographic.com', 'https://nationalgeographic.com/feed/', 'Science, exploration, and photography', 'Science', 'en', 'US', true);

-- Insert some sample articles for testing
INSERT INTO articles (source_id, category_id, title, slug, excerpt, author, original_url, published_at, language, word_count, reading_time, tags, is_featured) VALUES
(
  (SELECT id FROM news_sources WHERE name = 'TechCrunch' LIMIT 1),
  (SELECT id FROM content_categories WHERE slug = 'technology' LIMIT 1),
  'The Future of AI in Software Development',
  'future-ai-software-development',
  'Exploring how artificial intelligence is transforming the way we write, test, and deploy software applications.',
  'Jane Smith',
  'https://techcrunch.com/future-ai-development',
  NOW() - INTERVAL '2 hours',
  'en',
  1200,
  5,
  ARRAY['AI', 'Software', 'Development', 'Machine Learning'],
  true
),
(
  (SELECT id FROM news_sources WHERE name = 'BBC News' LIMIT 1),
  (SELECT id FROM content_categories WHERE slug = 'world' LIMIT 1),
  'Global Climate Summit Reaches Historic Agreement',
  'climate-summit-historic-agreement',
  'World leaders unite on ambitious climate targets in landmark international accord.',
  'Michael Johnson',
  'https://bbc.com/news/climate-summit-2024',
  NOW() - INTERVAL '4 hours',
  'en',
  850,
  4,
  ARRAY['Climate', 'Environment', 'Politics', 'Global'],
  true
),
(
  (SELECT id FROM news_sources WHERE name = 'The Verge' LIMIT 1),
  (SELECT id FROM content_categories WHERE slug = 'technology' LIMIT 1),
  'New Smartphone Features That Actually Matter',
  'smartphone-features-that-matter',
  'Beyond the hype: which new smartphone innovations will genuinely improve your daily life.',
  'Sarah Chen',
  'https://theverge.com/smartphone-features-2024',
  NOW() - INTERVAL '6 hours',
  'en',
  950,
  4,
  ARRAY['Smartphones', 'Technology', 'Mobile', 'Innovation'],
  false
);

-- Insert some trending topics
INSERT INTO trending_topics (topic, category, mention_count, trend_score, date) VALUES
('Artificial Intelligence', 'Technology', 145, 89.5, CURRENT_DATE),
('Climate Change', 'Science', 132, 85.2, CURRENT_DATE),
('Electric Vehicles', 'Technology', 98, 72.1, CURRENT_DATE),
('Space Exploration', 'Science', 87, 68.9, CURRENT_DATE),
('Cryptocurrency', 'Business', 76, 64.3, CURRENT_DATE),
('Remote Work', 'Business', 69, 58.7, CURRENT_DATE),
('Renewable Energy', 'Science', 54, 52.1, CURRENT_DATE),
('5G Technology', 'Technology', 43, 45.8, CURRENT_DATE);

-- Create some achievement templates
INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, is_public) 
SELECT 
  up.id,
  'welcome',
  'Welcome to Mukoko',
  'Joined the Mukoko community',
  true
FROM user_profiles up
WHERE up.role = 'super_admin'; -- Grant welcome achievement to existing super admin

-- Update article counts for categories (this will be maintained by triggers in production)
UPDATE content_categories 
SET article_count = (
  SELECT COUNT(*) 
  FROM articles 
  WHERE articles.category_id = content_categories.id 
  AND articles.status = 'published'
);

-- Update total articles count for news sources
UPDATE news_sources 
SET total_articles = (
  SELECT COUNT(*) 
  FROM articles 
  WHERE articles.source_id = news_sources.id
);