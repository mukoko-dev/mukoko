export class ConfigService {
  constructor(configStorage) {
    this.storage = configStorage
    this.cache = new Map()
    this.cacheExpiry = new Map()
    this.TTL = 24 * 60 * 60 * 1000 // 24 hours
  }

  async get(key, defaultValue = null) {
    // Check memory cache first
    if (this.cache.has(key) && this.cacheExpiry.get(key) > Date.now()) {
      return this.cache.get(key)
    }

    try {
      const value = await this.storage.get(key)
      const parsed = value ? JSON.parse(value) : defaultValue

      // Cache the result
      this.cache.set(key, parsed)
      this.cacheExpiry.set(key, Date.now() + this.TTL)
      
      return parsed
    } catch (error) {
      console.error(`Error getting config ${key}:`, error)
      return defaultValue
    }
  }

  async set(key, value) {
    try {
      await this.storage.put(key, JSON.stringify(value))
      
      // Update cache
      this.cache.set(key, value)
      this.cacheExpiry.set(key, Date.now() + this.TTL)
      
      return true
    } catch (error) {
      console.error(`Error setting config ${key}:`, error)
      return false
    }
  }

  async getRSSources() {
    return await this.get('config:rss_sources', [])
  }

  async getCategories() {
    return await this.get('config:categories', [])
  }

  async getSiteConfig() {
    return await this.get('config:site', {
      name: 'Harare Metro',
      version: '2.0',
      features: { user_accounts: true, analytics: true }
    })
  }

  async updateRSSSource(sourceId, updates) {
    const sources = await this.getRSSources()
    const sourceIndex = sources.findIndex(s => s.id === sourceId)
    
    if (sourceIndex >= 0) {
      sources[sourceIndex] = { ...sources[sourceIndex], ...updates }
      await this.set('config:rss_sources', sources)
      return true
    }
    
    return false
  }

  async addRSSSource(source) {
    const sources = await this.getRSSources()
    sources.push({
      id: source.id || Date.now().toString(),
      name: source.name,
      url: source.url,
      category: source.category || 'general',
      enabled: source.enabled !== false,
      priority: source.priority || 1,
      refresh_interval: source.refresh_interval || 3600,
      ...source
    })
    
    await this.set('config:rss_sources', sources)
    return true
  }

  // Cache management
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key)
      this.cacheExpiry.delete(key)
    } else {
      this.cache.clear()
      this.cacheExpiry.clear()
    }
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: this.cache.size > 0 ? 'N/A' : 0 // Would need to track hits/misses
    }
  }
} 