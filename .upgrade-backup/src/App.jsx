// src/App.jsx - Enhanced version with seamless background refresh
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'

// Import existing components
import HeaderNavigation from './components/HeaderNavigation'
import MobileNavigation from './components/MobileNavigation'
import FilterControls from './components/FilterControls'
import CategoryFilter from './components/CategoryFilter'
import SearchPage from './components/SearchPage'
import ProfilePage from './components/ProfilePage'
import ArticleCard from './components/ArticleCard'
import NewsBytes from './components/NewsBytes'
import ErrorBoundary from './components/ErrorBoundary'
import PWAPrompt from './components/PWAPrompt'

// Import existing hooks
import { usePWA } from './hooks/usePWA'
import { useHead } from './hooks/useHead'
import { useScrollAndFeed } from './hooks/useScrollAndFeed'

// Import utilities
import { CacheManager } from './utils/cache'
import { cn } from './lib/utils'

// Icons
import { ArrowUpIcon, ArrowPathIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

// Cache manager instance
const cache = new CacheManager()

function App() {
  const { isOffline } = usePWA()

  // Core state
  const [allFeeds, setAllFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  
  // Background refresh state
  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false)
  const [newArticlesAvailable, setNewArticlesAvailable] = useState(0)
  const [showNewArticlesBanner, setShowNewArticlesBanner] = useState(false)
  const backgroundRefreshRef = useRef(null)
  const lastBackgroundCheck = useRef(null)
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentView, setCurrentView] = useState('home')
  const [viewMode, setViewMode] = useState('grid')
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Theme colors
  const currentColors = {
    bg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    headerBg: theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    textMuted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  }

  // Use unified scroll and feed hook
  const {
    displayedFeeds,
    filteredFeeds,
    loadingMore,
    hasMore,
    scrollToTop,
    hasReached25Percent
  } = useScrollAndFeed({
    allFeeds,
    selectedCategory,
    searchQuery,
    selectedTimeframe,
    sortBy,
    itemsPerPage: 25
  })

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  // Update theme in localStorage and DOM
  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Simple feed processing
  const processFeeds = useCallback((feeds) => {
    return feeds || []
  }, [])

  // Background refresh function - doesn't trigger loading states
  const backgroundRefresh = useCallback(async () => {
    if (backgroundRefreshing || isOffline) return
    
    try {
      setBackgroundRefreshing(true)
      
      const params = new URLSearchParams({
        category: selectedCategory,
        limit: '500',
        format: 'json',
        timestamp: Date.now() // Bypass cache
      })

      const response = await fetch(`/api/feeds?${params}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const articles = data.articles || data
      const processedFeeds = processFeeds(articles)

      // Compare with existing articles to detect new ones
      const existingIds = new Set(allFeeds.map(article => article.id || article.link))
      const newArticles = processedFeeds.filter(article => 
        !existingIds.has(article.id || article.link)
      )

      if (newArticles.length > 0) {
        // Store new articles in cache but don't update UI immediately
        const cacheKey = `feeds_${selectedCategory}_new`
        cache.set(cacheKey, { articles: processedFeeds, timestamp: Date.now() })
        
        setNewArticlesAvailable(newArticles.length)
        setShowNewArticlesBanner(true)
        
        console.log(`📥 Background refresh: ${newArticles.length} new articles available`)
      } else {
        console.log('🔄 Background refresh: No new articles')
      }
      
      lastBackgroundCheck.current = Date.now()
      
    } catch (err) {
      console.error('Background refresh failed:', err)
      // Don't show error to user for background refresh failures
    } finally {
      setBackgroundRefreshing(false)
    }
  }, [selectedCategory, processFeeds, allFeeds, backgroundRefreshing, isOffline])

  // Apply new articles when user chooses to
  const applyNewArticles = useCallback(async () => {
    const cacheKey = `feeds_${selectedCategory}_new`
    const cachedData = cache.get(cacheKey)
    
    if (cachedData) {
      const processedFeeds = processFeeds(cachedData.articles)
      setAllFeeds(processedFeeds)
      setLastUpdated(new Date())
      
      // Update main cache
      const mainCacheKey = `feeds_${selectedCategory}`
      cache.set(mainCacheKey, cachedData)
      
      // Clear new articles cache
      cache.delete(cacheKey)
      setNewArticlesAvailable(0)
      setShowNewArticlesBanner(false)
      
      console.log('✅ Applied new articles to feed')
    }
  }, [selectedCategory, processFeeds])

  // Main load feeds function (only for initial load and manual refresh)
  const loadFeeds = useCallback(async (forceRefresh = false) => {
    const cacheKey = `feeds_${selectedCategory}`
    
    if (!forceRefresh && cache.isValid(cacheKey)) {
      const cachedData = cache.get(cacheKey)
      if (cachedData) {
        const processedFeeds = processFeeds(cachedData.articles || cachedData)
        setAllFeeds(processedFeeds)
        setLoading(false)
        return
      }
    }

    try {
      if (forceRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        category: selectedCategory,
        limit: '500',
        format: 'json'
      })

      const response = await fetch(`/api/feeds?${params}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const articles = data.articles || data
      const processedFeeds = processFeeds(articles)

      setAllFeeds(processedFeeds)
      setLastUpdated(new Date())
      cache.set(cacheKey, data)

    } catch (err) {
      console.error('Error loading feeds:', err)
      if (err.message.includes('429')) {
        setError('Too many requests. Please try again in a moment.')
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        setError('Network connection failed. Please check your connection.')
      } else {
        setError(`Failed to load news: ${err.message}`)
      }
      setAllFeeds([])
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [selectedCategory, processFeeds])

  // Load feeds on mount
  useEffect(() => {
    loadFeeds(false)
  }, [loadFeeds])

  // Set up background refresh interval
  useEffect(() => {
    if (loading || isOffline) return

    // Start background refresh after 2 minutes
    const initialDelay = setTimeout(() => {
      backgroundRefresh()
    }, 2 * 60 * 1000)

    // Then refresh every 5 minutes
    const interval = setInterval(() => {
      backgroundRefresh()
    }, 5 * 60 * 1000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [backgroundRefresh, loading, isOffline])

  // Clean up background refresh on unmount
  useEffect(() => {
    return () => {
      if (backgroundRefreshRef.current) {
        clearInterval(backgroundRefreshRef.current)
      }
    }
  }, [])

  // Hide new articles banner after category change
  useEffect(() => {
    setShowNewArticlesBanner(false)
    setNewArticlesAvailable(0)
  }, [selectedCategory])

  // Navigation handlers
  const handleSearchClick = () => setCurrentView('search')
  const handleBytesClick = () => setCurrentView('bytes')
  const handleProfileClick = () => setCurrentView('profile')

  // Articles with images for bytes view
  const articlesWithImages = allFeeds.filter(article => article.optimizedImageUrl)

  // Use head hook for SEO
  useHead({
    title: `Harare Metro - Zimbabwe News${selectedCategory !== 'all' ? ` - ${selectedCategory}` : ''}${searchQuery ? ` - "${searchQuery}"` : ''}`,
    description: "Stay informed with the latest news from Zimbabwe",
    keywords: "Zimbabwe news, Harare Metro, politics, economy, sports"
  })

  // Loading state
  if (loading) {
    return (
      <ErrorBoundary>
        <div className={`min-h-screen ${currentColors.bg}`}>
          <HeaderNavigation
            theme={theme}
            setTheme={setTheme}
            currentView={currentView}
            setCurrentView={setCurrentView}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onSearchClick={handleSearchClick}
            onBytesClick={handleBytesClick}
            onProfileClick={handleProfileClick}
          />
          <div className="pt-12 lg:pt-16">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white mb-4"></div>
              <p className={`text-lg ${currentColors.textMuted}`}>Loading news...</p>
            </div>
          </div>
          <MobileNavigation
            currentView={currentView}
            setCurrentView={setCurrentView}
            onSearchClick={handleSearchClick}
            onBytesClick={handleBytesClick}
            onProfileClick={handleProfileClick}
          />
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${currentColors.bg} transition-colors duration-300`}>
        <PWAPrompt currentColors={currentColors} />
        
        {/* Header */}
        <HeaderNavigation
          theme={theme}
          setTheme={setTheme}
          currentView={currentView}
          setCurrentView={setCurrentView}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onSearchClick={handleSearchClick}
          onBytesClick={handleBytesClick}
          onProfileClick={handleProfileClick}
        />

        {/* Main Content */}
        <div className="pt-2 pb-20 lg:pb-6">
          {/* Search View */}
          {currentView === 'search' && (
            <SearchPage
              currentColors={currentColors}
              allFeeds={allFeeds}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <ProfilePage currentColors={currentColors} />
          )}

          {/* News Bytes View */}
          {currentView === 'bytes' && (
            <NewsBytes 
              currentColors={currentColors}
              articles={articlesWithImages}
              viewMode={viewMode}
            />
          )}

          {/* Home View */}
          {currentView === 'home' && (
            <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
              {/* New Articles Banner */}
              {showNewArticlesBanner && newArticlesAvailable > 0 && (
                <div className="mb-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 border rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse mr-3"></div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-100">
                            New Articles Available
                          </h3>
                          <p className="text-sm text-blue-600 dark:text-blue-200">
                            {newArticlesAvailable} new article{newArticlesAvailable !== 1 ? 's' : ''} ready to view
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={applyNewArticles}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-1"
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span>Load New</span>
                        </button>
                        <button
                          onClick={() => setShowNewArticlesBanner(false)}
                          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Background Refresh Indicator */}
              {backgroundRefreshing && (
                <div className="mb-3">
                  <div className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 border rounded-xl p-2">
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-4 w-4 text-green-400 mr-2 animate-spin" />
                      <p className="text-xs text-green-800 dark:text-green-100">
                        Checking for new articles...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="mb-3">
                  <div className={`${isOffline ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'} border rounded-xl p-3`}>
                    <div className="flex items-center">
                      <XMarkIcon className={`h-5 w-5 ${isOffline ? 'text-orange-400' : 'text-red-400'} mr-3`} />
                      <div>
                        <h3 className={`text-sm font-medium ${isOffline ? 'text-orange-800 dark:text-orange-100' : 'text-red-800 dark:text-red-100'}`}>
                          {isOffline ? 'Offline Mode' : 'Error Loading News'}
                        </h3>
                        <p className={`mt-1 text-sm ${isOffline ? 'text-orange-600 dark:text-orange-200' : 'text-red-600 dark:text-red-200'}`}>
                          {isOffline ? 'Showing cached articles. Connect to internet for latest updates.' : error}
                        </p>
                      </div>
                      <button
                        onClick={() => loadFeeds(true)}
                        className={`ml-auto ${isOffline ? 'text-orange-600 dark:text-orange-300' : 'text-red-600 dark:text-red-300'}`}
                        disabled={isOffline}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual Refreshing Indicator */}
              {refreshing && (
                <div className="mb-3">
                  <div className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 border rounded-xl p-3">
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-5 w-5 text-blue-400 mr-3 animate-spin" />
                      <p className="text-sm text-blue-800 dark:text-blue-100">
                        Refreshing news...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories only */}
              <div className="mb-3">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  feeds={allFeeds}
                />
              </div>

              {/* Separate FilterControls for timeframe and sorting only */}
              <div className="mb-3">
                <FilterControls
                  selectedTimeframe={selectedTimeframe}
                  setSelectedTimeframe={setSelectedTimeframe}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  feeds={allFeeds}
                  currentColors={currentColors}
                />
              </div>

              {/* Articles Grid with Infinite Scroll */}
              {displayedFeeds.length === 0 ? (
                <div className={`${currentColors.cardBg} ${currentColors.border} border p-8 rounded-xl text-center`}>
                  <div className="text-6xl mb-4">
                    {searchQuery ? '🔍' : selectedCategory !== 'all' ? '📂' : '📰'}
                  </div>
                  <h3 className={`text-xl font-semibold ${currentColors.text} mb-2`}>
                    {searchQuery ? 'No Search Results' : 'No Articles Found'}
                  </h3>
                  <p className={`${currentColors.textMuted}`}>
                    {searchQuery 
                      ? `No articles found for "${searchQuery}". Try different search terms.`
                      : 'Try adjusting your filters or check back later for new content.'
                    }
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('all')
                      }}
                      className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Articles Count */}
                  <div className="mb-4">
                    <p className={`text-sm ${currentColors.textMuted}`}>
                      Showing {displayedFeeds.length} of {filteredFeeds.length} articles
                      {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                      {lastUpdated && (
                        <span className="ml-2">
                          • Last updated {new Date(lastUpdated).toLocaleTimeString()}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Articles Grid */}
                  <div className={`grid gap-4 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {displayedFeeds.map((article, index) => (
                      <ArticleCard
                        key={`${article.link}-${index}`}
                        article={article}
                        currentColors={currentColors}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Loading More Indicator */}
                  {loadingMore && (
                    <div className="flex justify-center py-6">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                        <span className={`text-sm ${currentColors.textMuted}`}>
                          Loading more articles...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* End of Results */}
                  {!hasMore && displayedFeeds.length > 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🎉</div>
                      <p className={`${currentColors.textMuted} mb-2`}>
                        You've reached the end!
                      </p>
                      <p className={`text-sm ${currentColors.textMuted}`}>
                        {filteredFeeds.length} total articles loaded
                      </p>
                    </div>
                  )}
                </>
              )}
            </main>
          )}
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          onSearchClick={handleSearchClick}
          onBytesClick={handleBytesClick}
          onProfileClick={handleProfileClick}
        />

        {/* Scroll to Top Button */}
        {hasReached25Percent && (
          <button
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-24 lg:bottom-6 right-4 z-40 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
              "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
            )}
            aria-label="Scroll to top"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App