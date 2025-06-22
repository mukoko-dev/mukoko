import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import ConfigService from './services/ConfigService.js'
import { D1UserService } from './services/D1UserService.js'
import { AnalyticsEngineService } from './services/AnalyticsEngineService.js'
import RSSFeedService from './services/RSSFeedService.js'
import { CacheService } from './services/CacheService.js'
import { handleApiRequest } from './api.js'
import { CloudflareImagesService } from './services/CloudflareImagesService.js'

// Cache configuration
const CACHE_CONFIG = {
  ARTICLES_TTL: 14 * 24 * 60 * 60, // 2 weeks in seconds
  SCHEDULED_REFRESH_INTERVAL: 60 * 60 * 1000, // 1 hour in milliseconds
  MAX_ARTICLES: 20000,           // Increased from 10000
  ITEMS_PER_SOURCE: 100,         // Increased from 50
  MIN_LIMIT: 100,                // New minimum limit
  MAX_LIMIT: 1000,               // New maximum limit
  CACHE_HEADERS: {
    'Cache-Control': 'public, max-age=300, s-maxage=600',
    'CDN-Cache-Control': 'max-age=600',
    'Cloudflare-CDN-Cache-Control': 'max-age=600'
  }
}

// Initialize services with CORRECT bindings
function initializeServices(env) {
  try {
    // FIXED: Use correct binding names
    const configService = new ConfigService(env.CONFIG_STORAGE)
    
    // FIXED: CacheService expects (newsStorageKV, contentCacheKV) with correct binding names
    const cacheService = new CacheService(
      env.NEWS_STORAGE,      // newsStorageKV (for articles)
      env.CONTENT_CACHE      // contentCacheKV (for search/general cache) - FIXED name
    )
    
    // FIXED: Use USER_STORAGE instead of USER_DB
    const userService = env.USER_STORAGE ? new D1UserService(env.USER_STORAGE) : null
    
    // FIXED: Analytics service with correct 3 datasets
    const analyticsService = new AnalyticsEngineService({
      categoryClicks: env.CATEGORY_CLICKS || null,
      newsInteractions: env.NEWS_INTERACTIONS || null,
      searchQueries: env.SEARCH_QUERIES || null
    })
    
    const imagesService = new CloudflareImagesService(env)
    const rssService = new RSSFeedService(configService)

    console.log('✅ Services initialized successfully with correct bindings')
    console.log(`[BINDINGS] NEWS_STORAGE: ${!!env.NEWS_STORAGE}`)
    console.log(`[BINDINGS] CONTENT_CACHE: ${!!env.CONTENT_CACHE}`)
    console.log(`[BINDINGS] USER_STORAGE: ${!!env.USER_STORAGE}`)
    console.log(`[BINDINGS] CONFIG_STORAGE: ${!!env.CONFIG_STORAGE}`)

    return {
      configService,
      cacheService,
      userService,
      analyticsService,
      imagesService,
      rssService
    }
  } catch (error) {
    console.error('❌ Failed to initialize services:', error.message)
    throw error
  }
}

// Background scheduled refresh function - FULLY AUTONOMOUS
async function runScheduledRefresh(env) {
  const startTime = Date.now()
  
  try {
    console.info('[CRON] Starting autonomous scheduled refresh')
    
    const { cacheService, rssService } = initializeServices(env)
    
    // Check if refresh is needed (autonomous decision)
    const needsRefresh = await cacheService.shouldRunScheduledRefresh(CACHE_CONFIG.SCHEDULED_REFRESH_INTERVAL)
    if (!needsRefresh) {
      console.info('[CRON] Scheduled refresh not needed yet')
      return { success: true, reason: 'Not time for refresh', skipped: true }
    }

    // Try to acquire lock (autonomous)
    const lockAcquired = await cacheService.acquireRefreshLock()
    if (!lockAcquired) {
      console.warn('[CRON] Could not acquire refresh lock - another process running')
      return { success: true, reason: 'Another refresh in progress', skipped: true }
    }

    console.info('[CRON] Starting RSS fetch from all sources')
    
    // Fetch fresh articles autonomously
    const freshArticles = await rssService.fetchAllFeedsBackground(
      CACHE_CONFIG.ITEMS_PER_SOURCE,
      CACHE_CONFIG.MAX_ARTICLES
    )
    
    if (freshArticles && freshArticles.length > 0) {
      // Cache the articles using CacheService
      await cacheService.setCachedArticles(freshArticles)
      await cacheService.setLastScheduledRun()
      
      const duration = Date.now() - startTime
      console.info(`[CRON] Autonomous refresh completed successfully in ${duration}ms, cached ${freshArticles.length} articles`)
      
      return { 
        success: true, 
        articlesCount: freshArticles.length,
        duration: duration,
        timestamp: new Date().toISOString(),
        autonomous: true
      }
    } else {
      console.warn('[CRON] No articles fetched during refresh')
      return { 
        success: false, 
        reason: 'No articles fetched',
        articlesCount: 0 
      }
    }
    
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[CRON] Autonomous refresh failed', { 
      error: error.message, 
      duration: `${duration}ms`,
      stack: error.stack?.substring(0, 500)
    })
    return { 
      success: false, 
      reason: error.message,
      autonomous: true,
      duration: duration
    }
  } finally {
    // Always release lock
    try {
      const { cacheService } = initializeServices(env)
      await cacheService.releaseRefreshLock()
      console.info('[CRON] Refresh lock released')
    } catch (lockError) {
      console.error('[CRON] Failed to release lock:', lockError.message)
    }
  }
}

// Initial data loading function - AUTONOMOUS
async function ensureInitialData(env) {
  try {
    console.info('[INIT] Checking if initial data load is needed')
    
    const { cacheService, rssService } = initializeServices(env)
    
    // Check if we have any cached articles
    const existingArticles = await cacheService.getCachedArticles()
    
    if (existingArticles && existingArticles.length > 0) {
      console.info(`[INIT] Found ${existingArticles.length} cached articles, no initial load needed`)
      return { success: true, reason: 'Data already available', articlesCount: existingArticles.length }
    }
    
    console.info('[INIT] No cached data found, performing initial load')
    
    // Try to acquire lock for initial load
    const lockAcquired = await cacheService.acquireRefreshLock()
    if (!lockAcquired) {
      console.info('[INIT] Another process is loading data, waiting...')
      return { success: true, reason: 'Another process loading', skipped: true }
    }
    
    try {
      // Perform initial RSS fetch
      const articles = await rssService.fetchAllFeedsBackground(
        CACHE_CONFIG.ITEMS_PER_SOURCE,
        CACHE_CONFIG.MAX_ARTICLES
      )
      
      if (articles && articles.length > 0) {
        await cacheService.setCachedArticles(articles)
        await cacheService.setLastScheduledRun()
        
        console.info(`[INIT] Initial load completed: ${articles.length} articles`)
        return { 
          success: true, 
          articlesCount: articles.length,
          initialLoad: true 
        }
      } else {
        console.warn('[INIT] No articles loaded during initial fetch')
        return { success: false, reason: 'No articles fetched' }
      }
      
    } finally {
      await cacheService.releaseRefreshLock()
    }
    
  } catch (error) {
    console.error('[INIT] Initial data load failed:', error.message)
    return { success: false, reason: error.message }
  }
}

// MISSING: Validate environment function with CORRECT binding names
function validateEnvironment(env) {
  const issues = []
  const warnings = []
  
  // Critical bindings - FIXED names
  if (!env.NEWS_STORAGE) issues.push('NEWS_STORAGE KV binding missing')
  if (!env.CONFIG_STORAGE) issues.push('CONFIG_STORAGE KV binding missing')
  if (!env.CONTENT_CACHE) issues.push('CONTENT_CACHE KV binding missing')
  
  // Optional but recommended - FIXED name
  if (!env.USER_STORAGE) warnings.push('USER_STORAGE binding missing (user features disabled)')
  if (!env.CATEGORY_CLICKS) warnings.push('CATEGORY_CLICKS Analytics binding missing')
  if (!env.NEWS_INTERACTIONS) warnings.push('NEWS_INTERACTIONS Analytics binding missing')
  if (!env.SEARCH_QUERIES) warnings.push('SEARCH_QUERIES Analytics binding missing')
  
  // Image service
  if (!env.CLOUDFLARE_ACCOUNT_ID) warnings.push('CLOUDFLARE_ACCOUNT_ID missing (image optimization disabled)')
  if (!env.CLOUDFLARE_API_TOKEN) warnings.push('CLOUDFLARE_API_TOKEN missing (image optimization disabled)')
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    bindingsOk: issues.length === 0,
    allFeaturesAvailable: issues.length === 0 && warnings.length === 0
  }
}

// Basic HTML fallback with embedded React app
function getBasicHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harare Metro - Zimbabwe News</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🇿🇼</text></svg>">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            text-align: center;
        }
        .logo {
            background: white;
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .logo h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: #2563eb;
        }
        .logo p {
            color: #666;
            font-size: 1.1rem;
        }
        .loading {
            background: rgba(255,255,255,0.95);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 40px;
        }
        .feature {
            background: rgba(255,255,255,0.9);
            padding: 20px;
            border-radius: 10px;
            backdrop-filter: blur(5px);
        }
        .feature h3 {
            color: #2563eb;
            margin-bottom: 10px;
        }
        @media (max-width: 768px) {
            .container { padding: 20px 15px; }
            .logo { padding: 30px 20px; }
            .logo h1 { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🇿🇼 Harare Metro</h1>
            <p>Zimbabwe's Premier News Aggregator</p>
        </div>
        
        <div class="loading">
            <div class="spinner"></div>
            <h3>Loading Latest News...</h3>
            <p>Aggregating news from trusted Zimbabwean sources</p>
        </div>

        <div class="features">
            <div class="feature">
                <h3>📰 Local Sources</h3>
                <p>News from Herald, NewsDay, ZimLive, and more</p>
            </div>
            <div class="feature">
                <h3>🔍 Smart Search</h3>
                <p>Find exactly what you're looking for</p>
            </div>
            <div class="feature">
                <h3>📱 Mobile Ready</h3>
                <p>Perfect experience on any device</p>
            </div>
        </div>
    </div>

    <div id="root"></div>
    
    <script>
        // Auto-refresh after 5 seconds if still showing fallback
        setTimeout(() => {
            if (document.getElementById('root').innerHTML === '') {
                window.location.reload();
            }
        }, 5000);
    </script>
</body>
</html>`
}

// Export utility functions that the API file might need
export {
  CACHE_CONFIG,
  initializeServices,
  runScheduledRefresh
}

// Main Cloudflare Worker export
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url)
      
      // Pass CONFIG_STORAGE to ConfigService, not the main KV storage
      const configService = new ConfigService(env.CONFIG_STORAGE) // ✅ Correct
      
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID',
          }
        })
      }
      
      // Handle API requests (delegates to api.js)
      if (url.pathname.startsWith('/api/')) {
        return await handleApiRequest(request, env, ctx)
      }
      
      // Handle static files - SIMPLIFIED for Vite build structure
      const isAssetRequest = (
        url.pathname.startsWith('/assets/') ||     // Vite assets folder
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.css') || 
        url.pathname.endsWith('.ico') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.jpg') ||
        url.pathname.endsWith('.jpeg') ||
        url.pathname.endsWith('.webp') ||
        url.pathname.endsWith('.woff') ||
        url.pathname.endsWith('.woff2') ||
        url.pathname.endsWith('.ttf') ||
        url.pathname.endsWith('.map') ||          // Add source maps
        url.pathname === '/favicon.ico' ||
        url.pathname === '/vite.svg' ||
        url.pathname === '/manifest.json'
      )
      
      if (isAssetRequest) {
        try {
          // Check if we have static content binding
          if (!env.__STATIC_CONTENT) {
            // For source maps, return 404 silently
            if (url.pathname.endsWith('.map')) {
              return new Response('Source map not available', { 
                status: 404,
                headers: { 'Content-Type': 'text/plain' }
              })
            }
            
            console.warn(`Static content not available for: ${url.pathname}`)
            
            // For missing favicon, return a simple one
            if (url.pathname === '/favicon.ico' || url.pathname === '/vite.svg') {
              return new Response(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <text y="24" font-size="24">🇿🇼</text>
                </svg>
              `, { 
                status: 200,
                headers: { 
                  'Content-Type': 'image/svg+xml',
                  'Cache-Control': 'public, max-age=86400'
                }
              })
            }
            
            return new Response('Static content not configured', { 
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            })
          }

          // Try to get the asset directly from KV
          const response = await getAssetFromKV({
            request,
            waitUntil: ctx.waitUntil.bind(ctx),
          }, {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
          })
          
          const newResponse = new Response(response.body, response)
          
          // Set appropriate cache headers based on file type
          if (url.pathname.startsWith('/assets/')) {
            // Vite assets are hashed and immutable
            newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
          } else if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
            newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
          } else if (url.pathname.endsWith('.map')) {
            // Source maps - shorter cache
            newResponse.headers.set('Cache-Control', 'public, max-age=3600')
          } else {
            newResponse.headers.set('Cache-Control', 'public, max-age=86400')
          }
          
          return newResponse
          
        } catch (e) {
          // Handle source maps silently
          if (url.pathname.endsWith('.map')) {
            return new Response('Source map not found', { 
              status: 404,
              headers: { 'Content-Type': 'text/plain' }
            })
          }
          
          // Only log actual missing assets, not common ones
          if (!url.pathname.includes('favicon') && 
              !url.pathname.includes('vite.svg') && 
              !url.pathname.includes('manifest.json') &&
              !url.pathname.endsWith('.map')) {
            console.warn(`Asset not found: ${url.pathname}`)
          }
          
          // For missing favicon/vite.svg, return a simple SVG
          if (url.pathname === '/favicon.ico' || url.pathname === '/vite.svg') {
            return new Response(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="#2563eb"/>
                <text x="16" y="22" font-size="16" text-anchor="middle" fill="white">🇿🇼</text>
              </svg>
            `, { 
              status: 200,
              headers: { 
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=86400'
              }
            })
          }
          
          // Return proper 404 for other missing assets
          return new Response('Asset not found', { 
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          })
        }
      }

      // Serve React app (SPA fallback) for all other routes
      try {
        // Check if we have static content
        if (!env.__STATIC_CONTENT) {
          console.info('Static content not available, serving enhanced fallback HTML')
          return new Response(getBasicHTML(), {
            headers: { 
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': 'public, max-age=300'
            }
          })
        }

        // Always serve index.html for SPA routes
        const response = await getAssetFromKV({
          request: new Request(new URL('/index.html', request.url)),
          waitUntil: ctx.waitUntil.bind(ctx),
        }, {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
        })
        
        const newResponse = new Response(response.body, response)
        newResponse.headers.set('Cache-Control', 'public, max-age=3600')
        newResponse.headers.set('Content-Type', 'text/html;charset=UTF-8')
        return newResponse
        
      } catch (e) {
        console.info('index.html not found, serving enhanced fallback HTML')
        return new Response(getBasicHTML(), {
          headers: { 
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=300'
          }
        })
      }

    } catch (error) {
      console.error('Worker error:', { 
        error: error.message, 
        url: request.url,
        stack: error.stack 
      })
      return new Response('Internal Server Error', { status: 500 })
    }
  },

  // Scheduled event handler for Cloudflare Cron Triggers
  async scheduled(controller, env, ctx) {
    console.info('[CRON] Cron trigger executed')
    
    try {
      const result = await runScheduledRefresh(env)
      
      if (result.success) {
        console.info(`[CRON] Scheduled refresh successful: ${result.articlesCount} articles in ${result.duration}ms`)
      } else {
        console.warn(`[CRON] Scheduled refresh skipped: ${result.reason}`)
      }
      
      return result
    } catch (error) {
      console.error('[CRON] Scheduled event handler failed:', error)
      return { success: false, error: error.message }
    }
  }
}