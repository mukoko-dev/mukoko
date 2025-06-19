// worker/index.js - Updated to match production configuration
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import { XMLParser } from 'fast-xml-parser'

// Cache configuration
const CACHE_CONFIG = {
  ARTICLES_TTL: 14 * 24 * 60 * 60,
  SCHEDULED_REFRESH_INTERVAL: 60 * 60,
  MAX_ARTICLES: 10000,
  ITEMS_PER_SOURCE: 50,
  CACHE_HEADERS: {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
    'CDN-Cache-Control': 'max-age=600'
  }
}

// Cache keys
const CACHE_KEYS = {
  ALL_ARTICLES: 'cache:all_articles',
  LAST_REFRESH: 'cache:last_refresh',
  ARTICLE_COUNT: 'cache:article_count',
  REFRESH_LOCK: 'cache:refresh_lock'
}

// Configuration Service - Updated to use NEWS_STORAGE
class ConfigService {
  constructor(kvStorage) {
    this.kv = kvStorage
  }

  async get(key, defaultValue = null) {
    try {
      const value = await this.kv.get(key, { type: 'json' })
      return value !== null ? value : defaultValue
    } catch (error) {
      console.error(`Error getting config ${key}:`, error)
      return defaultValue
    }
  }

  async getRSSources() {
    return await this.get('config:rss_sources', [])
  }

  async getCategories() {
    return await this.get('config:categories', [])
  }

  async getCategoryKeywords() {
    return await this.get('config:category_keywords', {})
  }

  async getPriorityKeywords() {
    return await this.get('config:priority_keywords', [])
  }

  async getTrustedImageDomains() {
    return await this.get('config:trusted_image_domains', [])
  }

  async getSiteConfig() {
    return await this.get('config:site', {})
  }
}

// Text processing functions
function decodeHtmlEntities(text) {
  if (!text || typeof text !== 'string') return text
  
  const entityMap = {
    '&#8217;': "'", '&#8216;': "'", '&#8220;': '"', '&#8221;': '"',
    '&#39;': "'", '&quot;': '"', '&apos;': "'", '&#8211;': '–',
    '&#8212;': '—', '&#160;': ' ', '&nbsp;': ' ', '&#8230;': '…',
    '&amp;': '&', '&lt;': '<', '&gt;': '>'
  }
  
  let decoded = text
  Object.entries(entityMap).forEach(([entity, replacement]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), replacement)
  })
  
  return decoded
}

function cleanText(text) {
  if (!text || typeof text !== 'string') return text
  
  let cleaned = decodeHtmlEntities(text)
  cleaned = cleaned.replace(/<[^>]*>/g, '')
  cleaned = cleaned.replace(/\s+/g, ' ').trim()
  
  return cleaned
}

function cleanHtml(html) {
  if (!html) return ''
  
  let cleaned = decodeHtmlEntities(html)
  cleaned = cleaned.replace(/<[^>]*>/g, '')
  cleaned = cleaned.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300)
    
  return cleaned
}

// Article processing functions
function isImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  
  const imageExtensions = /\.(jpe?g|png|gif|webp|svg|bmp|avif|ico|tiff?)(\?.*)?$/i
  const imageParams = /[?&](format|f)=(jpe?g|png|gif|webp|svg|bmp|avif)/i
  
  return imageExtensions.test(url) || imageParams.test(url)
}

function extractImageFromContent(item, link, trustedDomains) {
  const imageMatches = []
  
  try {
    // RSS Media tags
    if (item['media:content'] && item['media:content']['@_url']) {
      const mediaUrl = item['media:content']['@_url']
      if (isImageUrl(mediaUrl)) {
        imageMatches.push(mediaUrl)
      }
    }
    
    // RSS Enclosure tags
    if (item.enclosure && item.enclosure['@_type']?.startsWith('image/') && item.enclosure['@_url']) {
      imageMatches.push(item.enclosure['@_url'])
    }
    
    // Content extraction
    const contentFields = [item.description, item['content:encoded'], item.content, item.summary].filter(Boolean)
    
    contentFields.forEach((content) => {
      try {
        if (typeof content === 'object') {
          content = content.text || content['#text'] || content._ || ''
        }
        
        if (typeof content === 'string' && content.length > 0) {
          const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
          let match
          while ((match = imgRegex.exec(content)) !== null) {
            imageMatches.push(match[1])
          }
        }
      } catch (e) {
        console.log('Error processing content field:', e.message)
      }
    })
  } catch (e) {
    console.log('Error extracting images:', e.message)
  }
  
  const validImages = imageMatches
    .map(img => {
      try {
        if (!img || typeof img !== 'string') return null
        
        img = img.trim()
        
        if (img.startsWith('//')) {
          return `https:${img}`
        } else if (img.startsWith('/')) {
          const baseUrl = new URL(link)
          return `${baseUrl.protocol}//${baseUrl.hostname}${img}`
        } else if (!img.startsWith('http')) {
          const baseUrl = new URL(link)
          return `${baseUrl.protocol}//${baseUrl.hostname}/${img.replace(/^\.\//, '')}`
        }
        return img
      } catch (e) {
        return null
      }
    })
    .filter(Boolean)
    .filter(img => {
      try {
        if (!isImageUrl(img)) return false
        
        const imgUrl = new URL(img)
        const isTrusted = trustedDomains.some(domain => 
          imgUrl.hostname.includes(domain) || imgUrl.hostname.endsWith(domain)
        )
        
        return isTrusted
      } catch (e) {
        return false
      }
    })
    .filter((img, index, arr) => arr.indexOf(img) === index)
  
  return validImages.length > 0 ? validImages[0] : null
}

function detectCategory(content, categoryKeywords) {
  let maxMatches = 0
  let detectedCategory = null

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword => 
      content.includes(keyword.toLowerCase())
    ).length

    if (matches > maxMatches) {
      maxMatches = matches
      detectedCategory = category
    }
  }

  return detectedCategory
}

function calculateRelevanceScore(content, title, priorityKeywords) {
  let score = 0
  
  priorityKeywords.forEach(keyword => {
    if (content.includes(keyword.toLowerCase())) {
      score += title.toLowerCase().includes(keyword.toLowerCase()) ? 3 : 1
    }
  })

  return Math.min(score, 10)
}

async function processArticleItem(item, source, configService) {
  try {
    const rawTitle = item.title?.text || item.title || ''
    const title = cleanText(rawTitle)
    if (!title || title.length < 10) return null

    const rawDescription = item.description?.text || 
                          item.description || 
                          item.summary?.text || 
                          item.summary || 
                          item['content:encoded'] || ''
    const description = cleanHtml(rawDescription)

    const link = item.link?.text || item.link || item.id || item.guid?.text || item.guid || '#'
    if (link === '#') return null

    const content = `${title} ${description}`.toLowerCase()
    
    // Get configuration data
    const [categoryKeywords, priorityKeywords, trustedDomains] = await Promise.all([
      configService.getCategoryKeywords(),
      configService.getPriorityKeywords(),
      configService.getTrustedImageDomains()
    ])
    
    const detectedCategory = detectCategory(content, categoryKeywords) || source.category
    const isPriority = priorityKeywords.some(keyword => 
      content.includes(keyword.toLowerCase())
    )
    const relevanceScore = calculateRelevanceScore(content, title, priorityKeywords)
    
    const extractedImage = extractImageFromContent(item, link, trustedDomains)

    let pubDate
    try {
      const dateStr = item.pubDate || item.published || item.updated || item.date
      pubDate = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString()
    } catch {
      pubDate = new Date().toISOString()
    }

    return {
      id: item.guid?.text || item.guid || item.id || `${source.id}-${Date.now()}-${Math.random()}`,
      title,
      description,
      link,
      pubDate,
      source: source.name,
      sourceId: source.id,
      category: detectedCategory,
      priority: isPriority,
      relevanceScore,
      imageUrl: extractedImage,
      optimizedImageUrl: extractedImage ? `/api/image-proxy?url=${encodeURIComponent(extractedImage)}` : null,
      wordCount: (title + ' ' + description).split(' ').length,
      processed: new Date().toISOString(),
      sourcePriority: source.priority || 3
    }
  } catch (error) {
    console.error('Error processing article item:', error)
    return null
  }
}

// Feed fetching functions
async function fetchAllFeedsBackground(env) {
  console.log('Background feed fetching started')
  
  const configService = new ConfigService(env.NEWS_STORAGE)
  const allFeeds = []
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    ignoreNameSpace: false,
    removeNSPrefix: false,
    parseTagValue: true,
    parseAttributeValue: true,
    trimValues: true,
    processEntities: true,
    htmlEntities: true
  })

  const enabledSources = await configService.getRSSources()
  const filteredSources = enabledSources.filter(source => source.enabled)
  
  console.log(`Processing ${filteredSources.length} RSS sources in background`)

  const feedPromises = filteredSources.map(async (source) => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Harare Metro News Aggregator/2.0 (Zimbabwe)',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal,
        cf: {
          cacheTtl: 60,
          cacheEverything: false
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const xmlText = await response.text()
      if (!xmlText || xmlText.length < 100) {
        throw new Error('Empty or invalid RSS response')
      }

      const feedData = parser.parse(xmlText)
      
      let items = feedData?.rss?.channel?.item || 
                  feedData?.feed?.entry || 
                  feedData?.channel?.item || 
                  feedData?.rss?.item ||
                  []

      if (!Array.isArray(items)) {
        items = items ? [items] : []
      }

      if (items.length === 0) {
        return []
      }

      const processedItems = []
      for (const item of items.slice(0, CACHE_CONFIG.ITEMS_PER_SOURCE)) {
        const processed = await processArticleItem(item, source, configService)
        if (processed) {
          processedItems.push(processed)
        }
      }

      return processedItems

    } catch (error) {
      console.error(`Background fetch error for ${source.name}:`, error.message)
      return []
    }
  })

  const feedResults = await Promise.allSettled(feedPromises)
  
  feedResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value)) {
      allFeeds.push(...result.value)
    } else if (result.status === 'rejected') {
      console.error(`Background feed ${filteredSources[index].name} failed:`, result.reason)
    }
  })

  console.log(`Background fetch collected: ${allFeeds.length} articles`)

  const uniqueFeeds = removeDuplicateArticles(allFeeds)
  const cachedArticles = await setCachedArticles(env, uniqueFeeds)
  
  return cachedArticles
}

function removeDuplicateArticles(articles) {
  const seen = new Set()
  const unique = []

  for (const article of articles) {
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle)
      unique.push(article)
    }
  }

  return unique
}

async function getCachedArticles(env) {
  try {
    const cached = await env.NEWS_STORAGE.get(CACHE_KEYS.ALL_ARTICLES, { type: 'json' })
    
    if (cached && Array.isArray(cached)) {
      console.log(`Retrieved ${cached.length} articles from cache`)
      return cached
    } else {
      console.log('No valid cached articles found')
      return []
    }
  } catch (error) {
    console.error('Error retrieving cached articles:', error)
    return []
  }
}

async function setCachedArticles(env, articles) {
  try {
    const sortedArticles = articles
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, CACHE_CONFIG.MAX_ARTICLES)

    await env.NEWS_STORAGE.put(
      CACHE_KEYS.ALL_ARTICLES, 
      JSON.stringify(sortedArticles),
      { expirationTtl: CACHE_CONFIG.ARTICLES_TTL }
    )

    await env.NEWS_STORAGE.put(
      CACHE_KEYS.LAST_REFRESH, 
      new Date().toISOString(),
      { expirationTtl: CACHE_CONFIG.ARTICLES_TTL }
    )

    await env.NEWS_STORAGE.put(
      CACHE_KEYS.ARTICLE_COUNT, 
      sortedArticles.length.toString(),
      { expirationTtl: CACHE_CONFIG.ARTICLES_TTL }
    )

    console.log(`Cached ${sortedArticles.length} articles`)
    return sortedArticles
  } catch (error) {
    console.error('Error caching articles:', error)
    return articles
  }
}

// Image proxy handler
async function handleImageProxy(request, env) {
  try {
    const url = new URL(request.url)
    const imageUrl = url.searchParams.get('url')
    
    if (!imageUrl) {
      return new Response('Missing url parameter', { status: 400 })
    }

    // Get trusted domains
    const configService = new ConfigService(env.NEWS_STORAGE)
    const trustedDomains = await configService.getTrustedImageDomains()
    
    // Validate domain
    try {
      const imgUrl = new URL(imageUrl)
      const isTrusted = trustedDomains.some(domain => 
        imgUrl.hostname.includes(domain) || imgUrl.hostname.endsWith(domain)
      )
      
      if (!isTrusted) {
        return new Response('Untrusted domain', { status: 403 })
      }
    } catch (e) {
      return new Response('Invalid URL', { status: 400 })
    }

    // Fetch and proxy the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Harare Metro Image Proxy/2.0'
      },
      cf: {
        cacheTtl: 86400, // 24 hours
        cacheEverything: true
      }
    })

    if (!response.ok) {
      return new Response('Image fetch failed', { status: response.status })
    }

    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Cache-Control', 'public, max-age=86400')
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    
    return newResponse
  } catch (error) {
    console.error('Image proxy error:', error)
    return new Response('Proxy error', { status: 500 })
  }
}

// API handlers
async function handleApiRequest(request, env, ctx) {
  const url = new URL(request.url)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
    'Access-Control-Max-Age': '86400'
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log(`API Request: ${request.method} ${url.pathname}`)

    const path = url.pathname.replace('/api/', '')
    
    // Initialize config service
    const configService = new ConfigService(env.NEWS_STORAGE)
    
    switch (path) {
      case 'health':
        return await handleHealthCheck(env, corsHeaders)
      case 'feeds':
        return await handleFeedsRequest(request, env, corsHeaders, ctx)
      case 'config/sources':
        return await handleSourcesConfig(configService, corsHeaders)
      case 'config/categories':
        return await handleCategoriesConfig(configService, corsHeaders)
      default:
        if (path.startsWith('image-proxy')) {
          return await handleImageProxy(request, env)
        }
        return new Response(JSON.stringify({
          error: 'API endpoint not found',
          available: [
            '/api/health', '/api/feeds', '/api/config/sources', '/api/config/categories'
          ]
        }), { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('API request error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleHealthCheck(env, corsHeaders) {
  const lastRefresh = await env.NEWS_STORAGE.get(CACHE_KEYS.LAST_REFRESH)
  const articleCount = await env.NEWS_STORAGE.get(CACHE_KEYS.ARTICLE_COUNT)
  
  return new Response(JSON.stringify({
    status: 'ok',
    timestamp: new Date().toISOString(),
    lastRefresh: lastRefresh || 'Never',
    cachedArticles: parseInt(articleCount) || 0,
    maxArticles: CACHE_CONFIG.MAX_ARTICLES,
    refreshInterval: `${CACHE_CONFIG.SCHEDULED_REFRESH_INTERVAL / 60} minutes`,
    services: {
      news_storage: 'connected'
    }
  }), {
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json',
      ...CACHE_CONFIG.CACHE_HEADERS
    }
  })
}

async function handleFeedsRequest(request, env, corsHeaders, ctx) {
  try {
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit')) || 100, 1000)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    
    // Background refresh if needed
    ctx.waitUntil(runScheduledRefresh(env))
    
    let allFeeds = await getCachedArticles(env)
    
    if (!allFeeds || allFeeds.length === 0) {
      allFeeds = await fetchAllFeedsBackground(env)
    }

    if (!Array.isArray(allFeeds)) {
      allFeeds = []
    }

    let filteredFeeds = allFeeds

    if (category && category !== 'all') {
      filteredFeeds = filteredFeeds.filter(feed => 
        feed && feed.category === category
      )
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredFeeds = filteredFeeds.filter(feed =>
        feed && (
          (feed.title && feed.title.toLowerCase().includes(searchLower)) ||
          (feed.description && feed.description.toLowerCase().includes(searchLower)) ||
          (feed.source && feed.source.toLowerCase().includes(searchLower))
        )
      )
    }

    const sortedFeeds = filteredFeeds
      .filter(feed => feed && feed.title)
      .sort((a, b) => {
        if (a.priority !== b.priority) return b.priority - a.priority
        if (a.relevanceScore !== b.relevanceScore) return b.relevanceScore - a.relevanceScore
        if (a.sourcePriority !== b.sourcePriority) return b.sourcePriority - a.sourcePriority
        return new Date(b.pubDate) - new Date(a.pubDate)
      })
      .slice(0, limit)

    const configService = new ConfigService(env.NEWS_STORAGE)
    const [categoriesConfig, sourcesConfig] = await Promise.all([
      configService.getCategories(),
      configService.getRSSources()
    ])

    return new Response(JSON.stringify({
      success: true,
      articles: sortedFeeds,
      meta: {
        total: filteredFeeds.length,
        returned: sortedFeeds.length,
        cached: true,
        lastRefresh: await env.NEWS_STORAGE.get(CACHE_KEYS.LAST_REFRESH) || new Date().toISOString(),
        categories: categoriesConfig.map(c => ({ id: c.id, name: c.name, emoji: c.emoji })),
        sources: sourcesConfig.filter(s => s.enabled).map(s => ({ id: s.id, name: s.name }))
      }
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        ...CACHE_CONFIG.CACHE_HEADERS
      }
    })
  } catch (error) {
    console.error('Feeds request error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to fetch feeds',
      message: error.message,
      articles: [],
      meta: { total: 0, returned: 0, cached: false }
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleSourcesConfig(configService, corsHeaders) {
  try {
    const sources = await configService.getRSSources()
    return new Response(JSON.stringify({
      success: true,
      sources: sources
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Sources config error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to load sources configuration',
      sources: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleCategoriesConfig(configService, corsHeaders) {
  try {
    const categories = await configService.getCategories()
    return new Response(JSON.stringify({
      success: true,
      categories: categories
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Categories config error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to load categories configuration',
      categories: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function runScheduledRefresh(env) {
  try {
    const lockKey = CACHE_KEYS.REFRESH_LOCK
    const lock = await env.NEWS_STORAGE.get(lockKey)
    
    if (lock) {
      console.log('Refresh already in progress')
      return { success: false, reason: 'Already running' }
    }

    await env.NEWS_STORAGE.put(lockKey, 'locked', { expirationTtl: 1800 })

    console.log('Starting scheduled background refresh')
    const startTime = Date.now()
    
    const freshArticles = await fetchAllFeedsBackground(env)
    
    await env.NEWS_STORAGE.delete(lockKey)

    const duration = Date.now() - startTime
    console.log(`Scheduled refresh completed in ${duration}ms, fetched ${freshArticles.length} articles`)
    
    return { 
      success: true, 
      articlesCount: freshArticles.length,
      duration: duration,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Scheduled refresh failed:', error)
    await env.NEWS_STORAGE.delete(CACHE_KEYS.REFRESH_LOCK)
    return { success: false, reason: error.message }
  }
}

// Main Worker export
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    try {
      console.log(`Worker request: ${request.method} ${url.pathname}`)

      // Handle image proxy
      if (url.pathname.startsWith('/api/image-proxy')) {
        return await handleImageProxy(request, env)
      }

      // Handle API routes
      if (url.pathname.startsWith('/api/')) {
        return await handleApiRequest(request, env, ctx)
      }

      // Handle static assets
      if (url.pathname.startsWith('/assets/') || url.pathname.includes('.')) {
        try {
          const response = await getAssetFromKV({
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          }, {
            ASSET_NAMESPACE: env.ASSETS || env.__STATIC_CONTENT,
            ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
          })
          
          const newResponse = new Response(response.body, response)
          newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
          return newResponse
        } catch (e) {
          console.log('Asset not found:', url.pathname)
        }
      }

      // Serve React app
      try {
        const response = await getAssetFromKV({
          request: new Request(new URL('/index.html', request.url)),
          waitUntil: ctx.waitUntil.bind(ctx),
        }, {
          ASSET_NAMESPACE: env.ASSETS || env.__STATIC_CONTENT,
          ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
        })
        
        const newResponse = new Response(response.body, response)
        newResponse.headers.set('Cache-Control', 'public, max-age=3600')
        return newResponse
      } catch (e) {
        console.log('Serving fallback HTML')
        return new Response(getBasicHTML(), {
          headers: { 
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=300'
          }
        })
      }

    } catch (error) {
      console.error('Worker error:', error)
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  },

  async scheduled(controller, env, ctx) {
    console.log('Scheduled event triggered:', new Date().toISOString())
    
    try {
      const result = await runScheduledRefresh(env)
      console.log('Scheduled refresh result:', result)
    } catch (error) {
      console.error('Scheduled refresh error:', error)
    }
  }
}

function getBasicHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harare Metro - Zimbabwe News</title>
    <style>
      body {
        margin: 0;
        padding: 40px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container { text-align: center; max-width: 500px; }
      .flag { font-size: 4em; margin-bottom: 20px; }
      h1 { font-size: 2.5em; margin: 0 0 10px 0; }
      p { font-size: 1.2em; opacity: 0.9; margin: 0 0 30px 0; }
      .loading { animation: pulse 2s infinite; }
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="flag">🇿🇼</div>
        <h1>Harare Metro</h1>
        <p class="loading">Loading Zimbabwe's latest news...</p>
    </div>
</body>
</html>`
}