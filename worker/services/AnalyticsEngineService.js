export class AnalyticsEngineService {
  constructor(env) {
    this.newsAnalytics = env.NEWS_ANALYTICS
    this.searchAnalytics = env.SEARCH_ANALYTICS  
    this.categoryAnalytics = env.CATEGORY_ANALYTICS
    this.userAnalytics = env.USER_ANALYTICS
    this.performanceAnalytics = env.PERFORMANCE_ANALYTICS
  }

  async trackArticleInteraction(data) {
    const {
      userId, articleId, articleTitle, articleSource, articleCategory,
      interactionType, readingTime = 0, scrollDepth = 0, referrer = '',
      deviceType = '', country = '', timestamp = Date.now()
    } = data

    try {
      await this.newsAnalytics.writeDataPoint({
        blobs: [
          interactionType, articleSource, articleCategory, deviceType,
          country, this.getTimeSegment(timestamp), this.getDayOfWeek(timestamp),
          this.getEngagementLevel(readingTime, scrollDepth), referrer
        ],
        doubles: [1, readingTime, scrollDepth, timestamp, this.getHourOfDay(timestamp)],
        indexes: [articleId, userId.substring(0, 8)]
      })

      // Also track in user analytics
      await this.userAnalytics.writeDataPoint({
        blobs: ['user_interaction', interactionType, deviceType, country],
        doubles: [1, timestamp],
        indexes: [userId]
      })
    } catch (error) {
      console.error('Error tracking article interaction:', error)
    }
  }

  async trackSearchQuery(data) {
    const {
      userId, query, resultsCount = 0, clickedPosition = -1,
      searchTimeMs = 0, filtersApplied = {}, deviceType = '', 
      country = '', timestamp = Date.now()
    } = data

    try {
      await this.searchAnalytics.writeDataPoint({
        blobs: [
          'search_query', query.toLowerCase().trim(), deviceType, country,
          this.getTimeSegment(timestamp), this.hasResults(resultsCount) ? 'with_results' : 'no_results',
          Object.keys(filtersApplied).length > 0 ? 'filtered' : 'unfiltered'
        ],
        doubles: [1, query.length, resultsCount, clickedPosition, searchTimeMs, timestamp],
        indexes: [this.generateSearchId(userId, timestamp)]
      })
    } catch (error) {
      console.error('Error tracking search:', error)
    }
  }

  async trackCategoryClick(data) {
    const { userId, category, deviceType = '', country = '', timestamp = Date.now() } = data

    try {
      await this.categoryAnalytics.writeDataPoint({
        blobs: ['category_click', category, deviceType, country, this.getTimeSegment(timestamp)],
        doubles: [1, timestamp],
        indexes: [category]
      })
    } catch (error) {
      console.error('Error tracking category click:', error)
    }
  }

  async trackPerformance(data) {
    const { 
      pageLoadTime, apiResponseTime, renderTime, 
      contentSize, cacheHit = false, deviceType = '', 
      country = '', timestamp = Date.now() 
    } = data

    try {
      await this.performanceAnalytics.writeDataPoint({
        blobs: ['performance', deviceType, country, cacheHit ? 'cache_hit' : 'cache_miss'],
        doubles: [pageLoadTime, apiResponseTime, renderTime, contentSize, timestamp],
        indexes: ['performance_metric']
      })
    } catch (error) {
      console.error('Error tracking performance:', error)
    }
  }

  // Helper methods
  getTimeSegment(timestamp) {
    const hour = new Date(timestamp).getHours()
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
  }

  getDayOfWeek(timestamp) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date(timestamp).getDay()]
  }

  getHourOfDay(timestamp) {
    return new Date(timestamp).getHours()
  }

  getEngagementLevel(readingTime, scrollDepth) {
    if (readingTime > 120 && scrollDepth > 75) return 'high'
    if (readingTime > 30 && scrollDepth > 25) return 'medium'
    return 'low'
  }

  hasResults(count) {
    return count > 0
  }

  generateSearchId(userId, timestamp) {
    return `search_${userId.substring(0, 8)}_${timestamp}`
  }
}