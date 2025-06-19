export class D1UserService {
  constructor(db) {
    this.db = db
  }

  async upsertUser(userId, userData = {}) {
    try {
      const result = await this.db.prepare(`
        INSERT INTO users (id, email, preferences, last_active)
        VALUES (?1, ?2, ?3, ?4)
        ON CONFLICT(id) DO UPDATE SET 
          email = COALESCE(?2, email),
          preferences = ?3,
          last_active = ?4,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        userId,
        userData.email || null,
        JSON.stringify(userData.preferences || {}),
        new Date().toISOString()
      ).run()

      return { success: true, changes: result.changes }
    } catch (error) {
      console.error('Error upserting user:', error)
      throw error
    }
  }

  async getUser(userId) {
    try {
      const user = await this.db.prepare(`
        SELECT u.*,
          COUNT(CASE WHEN ua.interaction_type = 'like' THEN 1 END) as total_likes,
          COUNT(CASE WHEN ua.interaction_type = 'bookmark' THEN 1 END) as total_bookmarks,
          COUNT(CASE WHEN ua.interaction_type = 'view' THEN 1 END) as total_views,
          COUNT(CASE WHEN ua.interaction_type = 'share' THEN 1 END) as total_shares,
          MAX(ua.created_at) as last_interaction
        FROM users u
        LEFT JOIN user_articles ua ON u.id = ua.user_id
        WHERE u.id = ?1
        GROUP BY u.id
      `).bind(userId).first()
      
      if (user) {
        user.preferences = JSON.parse(user.preferences || '{}')
        
        // Get reading stats
        const readingStats = await this.db.prepare(`
          SELECT 
            AVG(reading_time_seconds) as avg_reading_time,
            SUM(reading_time_seconds) as total_reading_time,
            COUNT(DISTINCT DATE(created_at)) as active_days
          FROM user_articles 
          WHERE user_id = ?1 AND interaction_type = 'view'
        `).bind(userId).first()
        
        user.reading_stats = readingStats
      }

      return user
    } catch (error) {
      console.error('Error getting user:', error)
      return null
    }
  }

  async recordInteraction(userId, article, interactionType, metadata = {}) {
    try {
      await this.db.prepare(`
        INSERT INTO user_articles (
          user_id, article_id, article_title, article_source, 
          article_category, interaction_type, reading_time_seconds, 
          scroll_depth_percent, metadata
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        ON CONFLICT(user_id, article_id, interaction_type) DO UPDATE SET
          reading_time_seconds = reading_time_seconds + ?7,
          scroll_depth_percent = MAX(scroll_depth_percent, ?8),
          metadata = ?9,
          created_at = CURRENT_TIMESTAMP
      `).bind(
        userId, 
        article.id || article.link, 
        article.title, 
        article.source,
        article.category, 
        interactionType, 
        metadata.reading_time_seconds || 0,
        metadata.scroll_depth_percent || 0,
        JSON.stringify(metadata)
      ).run()

      // Update user stats
      if (interactionType === 'view') {
        await this.db.prepare(`
          UPDATE users 
          SET total_articles_read = total_articles_read + 1,
              last_active = CURRENT_TIMESTAMP
          WHERE id = ?1
        `).bind(userId).run()
      }

      return { success: true }
    } catch (error) {
      console.error('Error recording interaction:', error)
      throw error
    }
  }

  async getUserInteractions(userId, interactionType = null, limit = 100, offset = 0) {
    try {
      let query = `
        SELECT ua.*, 
               CASE WHEN ua.metadata != '{}' THEN ua.metadata ELSE NULL END as metadata_json
        FROM user_articles ua 
        WHERE ua.user_id = ?1
      `
      const params = [userId]

      if (interactionType) {
        query += ` AND ua.interaction_type = ?2`
        params.push(interactionType)
      }

      query += ` ORDER BY ua.created_at DESC LIMIT ?${params.length + 1} OFFSET ?${params.length + 2}`
      params.push(limit, offset)

      const results = await this.db.prepare(query).bind(...params).all()
      
      return results.results.map(row => ({
        ...row,
        metadata: row.metadata_json ? JSON.parse(row.metadata_json) : {}
      }))
    } catch (error) {
      console.error('Error getting user interactions:', error)
      return []
    }
  }

  async recordSearchQuery(userId, searchData) {
    try {
      await this.db.prepare(`
        INSERT INTO search_queries (
          user_id, query, results_count, clicked_result_position,
          clicked_article_id, search_time_ms, filters_applied
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
      `).bind(
        userId,
        searchData.query,
        searchData.results_count || 0,
        searchData.clicked_result_position || null,
        searchData.clicked_article_id || null,
        searchData.search_time_ms || 0,
        JSON.stringify(searchData.filters_applied || {})
      ).run()

      return { success: true }
    } catch (error) {
      console.error('Error recording search query:', error)
      throw error
    }
  }

  async getUserSearchHistory(userId, limit = 50) {
    try {
      const results = await this.db.prepare(`
        SELECT * FROM search_queries 
        WHERE user_id = ?1 
        ORDER BY created_at DESC 
        LIMIT ?2
      `).bind(userId, limit).all()

      return results.results.map(row => ({
        ...row,
        filters_applied: JSON.parse(row.filters_applied || '{}')
      }))
    } catch (error) {
      console.error('Error getting search history:', error)
      return []
    }
  }

  async updateTrendingArticles(articles) {
    try {
      for (const article of articles) {
        await this.db.prepare(`
          INSERT INTO trending_articles (
            article_id, title, source, category, view_count_24h,
            like_count_24h, bookmark_count_24h, share_count_24h,
            trend_score, updated_at
          ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
          ON CONFLICT(article_id) DO UPDATE SET
            view_count_24h = ?5,
            like_count_24h = ?6,
            bookmark_count_24h = ?7,
            share_count_24h = ?8,
            trend_score = ?9,
            updated_at = ?10
        `).bind(
          article.id,
          article.title,
          article.source,
          article.category,
          article.view_count_24h || 0,
          article.like_count_24h || 0,
          article.bookmark_count_24h || 0,
          article.share_count_24h || 0,
          article.trend_score || 0,
          new Date().toISOString()
        ).run()
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating trending articles:', error)
      throw error
    }
  }

  async getTrendingArticles(limit = 20) {
    try {
      const results = await this.db.prepare(`
        SELECT * FROM trending_articles 
        ORDER BY trend_score DESC 
        LIMIT ?1
      `).bind(limit).all()

      return results.results
    } catch (error) {
      console.error('Error getting trending articles:', error)
      return []
    }
  }
}