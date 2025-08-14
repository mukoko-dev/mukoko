// src/App.jsx - Updated to use consolidated useFeeds hook and Supabase auth
import React, { useState, useEffect, useCallback } from 'react'

// Import existing components
import HeaderNavigation from './components/HeaderNavigation'
import MobileNavigation from './components/MobileNavigation'
import FilterControls from './components/FilterControls'
import CategoryFilter from './components/CategoryFilter'
import ArticleCard from './components/ArticleCard'
import SearchPage from './components/SearchPage'
import ProfilePage from './components/ProfilePage'
import NewsBytes from './components/NewsBytes'
import SaveForLater from './components/SaveForLater'
import PersonalInsights from './components/PersonalInsights'
import ErrorBoundary from './components/ErrorBoundary'

// Import new auth components
import AuthModal from './components/auth/AuthModal'
import UserProfile from './components/auth/UserProfile'

// Import hooks - UPDATED to use consolidated useFeeds
import { useHead } from './hooks/useHead'
import { useFeeds } from './hooks/useFeeds'
import { useAnalytics } from './hooks/useAnalytics'
import { useAuth } from './contexts/AuthContext'

// Simple cn utility function
function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Lucide React icons
import { 
  ArrowUp, 
  RefreshCw, 
  X, 
  Check
} from 'lucide-react'

function App() {
  // Auth state
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth()
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentView, setCurrentView] = useState('home')
  const [viewMode, setViewMode] = useState('grid')
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // User preferences state (localStorage based)
  const [userPreferences, setUserPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('mukoko_preferences')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  
  const [readingHistory, setReadingHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mukoko_reading_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('mukoko_recent_searches')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // HOOK ORDER IS CRITICAL - ALL HOOKS MUST BE CALLED IN THE SAME ORDER EVERY TIME
  const {
    // Feed data
    feeds,
    allFeeds,
    loading,
    loadingMore,
    error,
    totalCount,
    hasMore,
    meta,
    
    // User data
    likes: likedArticles,
    bookmarks: bookmarkedArticles,
    userProfile,
    
    // Actions
    loadFeeds,
    loadMoreFeeds,
    refreshFeeds,
    forceRefresh,
    loadUserData,
    toggleLike,
    toggleBookmark,
    
    // Scroll
    scrollDirection,
    hasReached25Percent,
    scrollToTop
  } = useFeeds({
    selectedCategory,
    searchQuery,
    selectedTimeframe,
    sortBy,
    itemsPerPage: 100,
    enableInfiniteScroll: true,
    autoRefresh: false
  })

  const {
    trackEvent,
    trackPageView,
    trackFeedLoad,
    trackArticleClick,
    trackUserInteraction,
    trackCategoryClick,
    trackSearch,
    trackError
  } = useAnalytics()

  const { updateHead } = useHead()

  // Update theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Save user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('mukoko_preferences', JSON.stringify(userPreferences))
  }, [userPreferences])

  useEffect(() => {
    localStorage.setItem('mukoko_reading_history', JSON.stringify(readingHistory.slice(0, 100)))
  }, [readingHistory])

  useEffect(() => {
    localStorage.setItem('mukoko_recent_searches', JSON.stringify(recentSearches))
  }, [recentSearches])

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Mukoko...')
        if (loadUserData) {
          await loadUserData()
        }
      } catch (error) {
        console.warn('Failed to load user data, continuing with defaults:', error.message)
      }
    }
    
    initializeApp()
  }, [loadUserData])

  // Track page view on mount
  useEffect(() => {
    if (trackPageView) {
      trackPageView('home', document.referrer)
    }
  }, [trackPageView])

  // Track feed loads
  useEffect(() => {
    if (!loading && feeds && feeds.length > 0 && trackFeedLoad) {
      trackFeedLoad({
        category: selectedCategory,
        searchQuery,
        sortBy,
        timeframe: selectedTimeframe,
        resultCount: feeds.length
      })
    }
  }, [loading, feeds?.length, selectedCategory, searchQuery, sortBy, selectedTimeframe, trackFeedLoad])

  // UPDATED handlers to use new consolidated functions
  const handleLikeArticle = useCallback(async (article) => {
    try {
      if (toggleLike) {
        await toggleLike(article)
      }
      // Track analytics using new method
      if (trackEvent) {
        await trackEvent('article_view', {
          articleId: article.id || article.link,
          articleTitle: article.title,
          source: article.source,
          category: article.category,
          action: 'like'
        })
      }
    } catch (error) {
      console.log('Error liking article:', error)
    }
  }, [toggleLike, trackEvent])

  const handleBookmarkArticle = useCallback(async (article) => {
    try {
      if (toggleBookmark) {
        await toggleBookmark(article)
      }
      if (trackEvent) {
        await trackEvent('article_view', {
          articleId: article.id || article.link,
          articleTitle: article.title,
          source: article.source,
          category: article.category,
          action: 'bookmark'
        })
      }
    } catch (error) {
      console.log('Error bookmarking article:', error)
    }
  }, [toggleBookmark, trackEvent])

  const handleArticleView = useCallback(async (article) => {
    const historyEntry = {
      ...article,
      viewedAt: new Date().toISOString(),
      readingTime: Math.floor(Math.random() * 180) + 30
    }
    
    setReadingHistory(prev => [historyEntry, ...prev.slice(0, 99)])
    
    if (trackArticleClick) {
      await trackArticleClick(article)
    }
  }, [trackArticleClick])

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query)
    
    if (query.trim()) {
      setRecentSearches(prev => {
        const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 10)
        return newSearches
      })
      
      if (trackSearch) {
        await trackSearch(query, selectedCategory, feeds?.length || 0)
      }
    }
  }, [selectedCategory, feeds?.length, trackSearch])

  const handleCategoryChange = useCallback(async (category) => {
    setSelectedCategory(category)
    
    if (trackCategoryClick) {
      await trackCategoryClick(category)
    }
  }, [trackCategoryClick])

  const handleRefresh = useCallback(async () => {
    try {
      await refreshFeeds()
      if (trackEvent) {
        await trackEvent('refresh_triggered', { type: 'manual' })
      }
    } catch (error) {
      console.error('Refresh failed:', error)
      if (trackError) {
        await trackError('refresh_failed', error.message)
      }
    }
  }, [refreshFeeds, trackEvent, trackError])

  const handleForceRefresh = useCallback(async () => {
    try {
      await forceRefresh()
      if (trackEvent) {
        await trackEvent('refresh_triggered', { type: 'force' })
      }
    } catch (error) {
      console.error('Force refresh failed:', error)
      if (trackError) {
        await trackError('force_refresh_failed', error.message)
      }
    }
  }, [forceRefresh, trackEvent, trackError])

  const handleViewChange = useCallback((view) => {
    setCurrentView(view)
    
    if (trackPageView) {
      trackPageView(view)
    }
  }, [trackPageView])

  const handleAuthClick = useCallback(() => {
    if (isAuthenticated) {
      setCurrentView('profile')
    } else {
      setShowAuthModal(true)
    }
  }, [isAuthenticated])

  // Update head meta tags
  useEffect(() => {
    updateHead({
      title: 'Mukoko - Modern News Aggregation',
      description: 'Stay informed with the latest news from multiple sources. Mukoko provides real-time news aggregation with advanced features.',
      keywords: 'news, aggregation, mukoko, real-time, articles',
      image: '/og-image.jpg'
    })
  }, [updateHead])

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Mukoko...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={cn(
        "min-h-screen bg-white dark:bg-black text-black dark:text-white",
        "transition-colors duration-200"
      )}>
        
        {/* Header Navigation */}
        <HeaderNavigation
          theme={theme}
          setTheme={setTheme}
          onSearchClick={() => handleViewChange('search')}
          onBytesClick={() => handleViewChange('bytes')}
          onProfileClick={handleAuthClick}
          currentView={currentView}
          setCurrentView={handleViewChange}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isAuthenticated={isAuthenticated}
          user={user}
          profile={profile}
        />

        {/* Mobile Navigation */}
        <MobileNavigation
          currentView={currentView}
          onViewChange={handleViewChange}
          onSearchClick={() => handleViewChange('search')}
          onProfileClick={handleAuthClick}
          isAuthenticated={isAuthenticated}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Home View */}
          {currentView === 'home' && (
            <div className="space-y-6">
              {/* Filter Controls */}
              <FilterControls
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                selectedTimeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onRefresh={handleRefresh}
                onForceRefresh={handleForceRefresh}
                loading={loading}
                totalCount={totalCount}
                hasReached25Percent={hasReached25Percent}
              />

              {/* Category Filter */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                categories={meta?.categories || []}
              />

              {/* Articles Grid */}
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">Error loading articles: {error}</p>
                    <button
                      onClick={handleRefresh}
                      className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!loading && !error && feeds && feeds.length > 0 && (
                  <div className={cn(
                    "grid gap-4",
                    viewMode === 'grid' 
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                      : "grid-cols-1"
                  )}>
                    {feeds.map((article, index) => (
                      <ArticleCard
                        key={article.id || `${article.link}-${index}`}
                        article={article}
                        viewMode={viewMode}
                        isLiked={likedArticles.has(article.id || article.link)}
                        isBookmarked={bookmarkedArticles.some(b => (b.article_id || b.id || b.link) === (article.id || article.link))}
                        onLike={handleLikeArticle}
                        onBookmark={handleBookmarkArticle}
                        onView={handleArticleView}
                        showSource={true}
                        showCategory={true}
                        showTimestamp={true}
                      />
                    ))}
                  </div>
                )}

                {!loading && !error && feeds && feeds.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No articles found for your current filters.
                    </p>
                    <button
                      onClick={handleRefresh}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Refresh feeds
                    </button>
                  </div>
                )}

                {/* Load More Button */}
                {hasMore && !loadingMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMoreFeeds}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}

                {loadingMore && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading more articles...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search View */}
          {currentView === 'search' && (
            <SearchPage
              searchQuery={searchQuery}
              onSearch={handleSearch}
              recentSearches={recentSearches}
              onClearSearches={() => setRecentSearches([])}
            />
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <UserProfile />
          )}

          {/* News Bytes View */}
          {currentView === 'bytes' && (
            <NewsBytes
              feeds={allFeeds}
              onArticleClick={handleArticleView}
            />
          )}

          {/* Save For Later View */}
          {currentView === 'saved' && (
            <SaveForLater
              bookmarks={bookmarkedArticles}
              onRemoveBookmark={handleBookmarkArticle}
              onArticleClick={handleArticleView}
            />
          )}

          {/* Personal Insights View */}
          {currentView === 'insights' && (
            <PersonalInsights
              readingHistory={readingHistory}
              likedArticles={Array.from(likedArticles)}
              bookmarkedArticles={bookmarkedArticles}
              onArticleClick={handleArticleView}
            />
          )}
        </main>

        {/* Scroll to Top Button */}
        {scrollDirection === 'down' && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App