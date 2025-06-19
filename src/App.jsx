// src/App.jsx - Updated with shadcn/ui components and fixes
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { cn } from './lib/utils'

// Import shadcn/ui components
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Alert, AlertDescription } from './components/ui/alert'

// Import existing components
import HeaderNavigation from './components/HeaderNavigation'
import MobileNavigation from './components/MobileNavigation'
import FilterControls from './components/FilterControls'
import CategoryFilter from './components/CategoryFilter'
import SearchPage from './components/SearchPage'
import ProfilePage from './components/ProfilePage'
import NewsBytes from './components/NewsBytes'
import SaveForLater from './components/SaveForLater'
import PersonalInsights from './components/PersonalInsights'
import ErrorBoundary from './components/ErrorBoundary'
import PWAPrompt from './components/PWAPrompt'

// Import existing hooks
import { usePWA } from './hooks/usePWA'
import { useHead } from './hooks/useHead'
import { useScrollAndFeed } from './hooks/useScrollAndFeed'

// Icons
import { 
  ArrowUpIcon, 
  ArrowPathIcon, 
  XMarkIcon, 
  CheckIcon, 
  HeartIcon, 
  BookmarkIcon,
  GlobeAltIcon,
  PhotoIcon 
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid'

// User ID generation and management
function generateUserId() {
  const stored = localStorage.getItem('harare_metro_user_id')
  if (stored) return stored
  
  const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2)
  localStorage.setItem('harare_metro_user_id', newId)
  return newId
}

// Categories data
const CATEGORIES = [
  { id: 'all', name: 'All News', emoji: '📰' },
  { id: 'politics', name: 'Politics', emoji: '🏛️' },
  { id: 'economy', name: 'Economy', emoji: '💰' },
  { id: 'business', name: 'Business', emoji: '💼' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'harare', name: 'Harare', emoji: '🏙️' },
  { id: 'technology', name: 'Technology', emoji: '💻' },
  { id: 'agriculture', name: 'Agriculture', emoji: '🌾' },
  { id: 'health', name: 'Health', emoji: '🏥' },
  { id: 'education', name: 'Education', emoji: '🎓' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎭' },
  { id: 'environment', name: 'Environment', emoji: '🌍' },
  { id: 'crime', name: 'Crime & Security', emoji: '🚔' },
  { id: 'international', name: 'International', emoji: '🌐' },
  { id: 'lifestyle', name: 'Lifestyle', emoji: '✨' },
  { id: 'finance', name: 'Finance', emoji: '💳' }
]

// Enhanced ArticleCard component using shadcn/ui
function ArticleCard({ article, onClick, likedArticles, bookmarkedArticles, onLike, onBookmark, onShare }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const categoryInfo = CATEGORIES.find(cat => cat.id === article.category)
  const hasImage = article.optimizedImageUrl && !imageError
  const articleId = article.id || article.link
  const isLiked = likedArticles?.has(articleId)
  const isBookmarked = bookmarkedArticles?.some(b => (b.id || b.link) === articleId)

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const getCategoryColor = (category) => {
    const colors = {
      politics: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      economy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      business: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      harare: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      technology: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
    return colors[category] || colors.default
  }

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1" onClick={onClick}>
      {/* Image Section */}
      {hasImage && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <div className="animate-pulse flex flex-col items-center">
                <PhotoIcon className="h-12 w-12 text-muted-foreground mb-2" />
                <div className="text-xs text-muted-foreground">Loading image...</div>
              </div>
            </div>
          )}
          
          <img
            src={article.optimizedImageUrl}
            alt={article.imageAlt || article.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant={isLiked ? "default" : "secondary"}
              className={cn(
                "h-8 w-8 rounded-full p-0",
                isLiked ? "bg-red-500 hover:bg-red-600" : ""
              )}
              onClick={(e) => {
                e.stopPropagation()
                onLike?.(article)
              }}
            >
              {isLiked ? (
                <HeartSolidIcon className="h-4 w-4 text-white" />
              ) : (
                <HeartIcon className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant={isBookmarked ? "default" : "secondary"}
              className={cn(
                "h-8 w-8 rounded-full p-0",
                isBookmarked ? "bg-blue-500 hover:bg-blue-600" : ""
              )}
              onClick={(e) => {
                e.stopPropagation()
                onBookmark?.(article)
              }}
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="h-4 w-4 text-white" />
              ) : (
                <BookmarkIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs font-medium">
            {article.source}
          </Badge>
          <time className="text-xs text-muted-foreground">
            {new Date(article.pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </time>
        </div>
        
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {article.title}
          {article.priority && (
            <Badge className="ml-2 bg-gradient-to-r from-green-500 to-yellow-500 text-white">
              🇿🇼 Priority
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {article.description && (
          <CardDescription className="text-sm leading-relaxed line-clamp-3 mb-4">
            {article.description}
          </CardDescription>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t">
          <Badge variant="secondary" className={getCategoryColor(article.category)}>
            <span className="mr-1">{categoryInfo?.emoji || '📰'}</span>
            {article.category}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs group"
            asChild
          >
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Read Full Article
              <GlobeAltIcon className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function App() {
  const { isOffline } = usePWA()
  const userId = useMemo(() => generateUserId(), [])

  // Core state
  const [allFeeds, setAllFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  
  // Configuration state
  const [categories, setCategories] = useState([])
  const [sources, setSources] = useState([])
  
  // Background refresh state
  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false)
  const [newArticlesAvailable, setNewArticlesAvailable] = useState(0)
  const [showNewArticlesBanner, setShowNewArticlesBanner] = useState(false)
  
  // User data state (localStorage based)
  const [likedArticles, setLikedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('harare_metro_liked_articles')
      return new Set(saved ? JSON.parse(saved) : [])
    } catch {
      return new Set()
    }
  })
  
  const [bookmarkedArticles, setBookmarkedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('harare_metro_bookmarked_articles')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  
  const [userPreferences, setUserPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('harare_metro_preferences')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  
  const [readingHistory, setReadingHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('harare_metro_reading_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentView, setCurrentView] = useState('home')
  const [viewMode, setViewMode] = useState('grid')
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('harare_metro_recent_searches')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

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

  // Initialize theme
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

  // Save user data to localStorage
  useEffect(() => {
    localStorage.setItem('harare_metro_liked_articles', JSON.stringify(Array.from(likedArticles)))
  }, [likedArticles])

  useEffect(() => {
    localStorage.setItem('harare_metro_bookmarked_articles', JSON.stringify(bookmarkedArticles))
  }, [bookmarkedArticles])

  useEffect(() => {
    localStorage.setItem('harare_metro_preferences', JSON.stringify(userPreferences))
  }, [userPreferences])

  useEffect(() => {
    localStorage.setItem('harare_metro_reading_history', JSON.stringify(readingHistory.slice(0, 100)))
  }, [readingHistory])

  useEffect(() => {
    localStorage.setItem('harare_metro_recent_searches', JSON.stringify(recentSearches))
  }, [recentSearches])

  // Load feeds with enhanced error handling
  const loadFeeds = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true)
      else setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        category: selectedCategory,
        limit: '500',
        format: 'json'
      })

      if (forceRefresh) {
        params.append('timestamp', Date.now().toString())
      }

      const response = await fetch(`/api/feeds?${params}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      
      if (data.success && Array.isArray(data.articles)) {
        setAllFeeds(data.articles)
        setLastUpdated(new Date())
        
        // Update categories and sources from meta
        if (data.meta) {
          if (data.meta.categories) {
            setCategories(data.meta.categories)
          }
          if (data.meta.sources) {
            setSources(data.meta.sources)
          }
        }
      } else {
        throw new Error(data.message || 'Invalid response format')
      }

    } catch (err) {
      console.error('Error loading feeds:', err)
      if (err.message.includes('429')) {
        setError('Too many requests. Please try again in a moment.')
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        setError('Network connection failed. Please check your connection.')
      } else {
        setError(`Failed to load news: ${err.message}`)
      }
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }, [selectedCategory])

  // Background refresh for new articles
  const backgroundRefresh = useCallback(async () => {
    if (backgroundRefreshing || isOffline) return
    
    try {
      setBackgroundRefreshing(true)
      
      const params = new URLSearchParams({
        category: selectedCategory,
        limit: '500',
        format: 'json',
        timestamp: Date.now()
      })

      const response = await fetch(`/api/feeds?${params}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      
      if (data.success && Array.isArray(data.articles)) {
        const existingIds = new Set(allFeeds.map(article => article.id || article.link))
        const newArticles = data.articles.filter(article => 
          !existingIds.has(article.id || article.link)
        )

        if (newArticles.length > 0) {
          setNewArticlesAvailable(newArticles.length)
          setShowNewArticlesBanner(true)
          console.log(`📥 Background refresh: ${newArticles.length} new articles available`)
        }
      }
      
    } catch (err) {
      console.error('Background refresh failed:', err)
    } finally {
      setBackgroundRefreshing(false)
    }
  }, [selectedCategory, allFeeds, backgroundRefreshing, isOffline])

  // Apply new articles when user chooses to
  const applyNewArticles = useCallback(async () => {
    await loadFeeds(true)
    setNewArticlesAvailable(0)
    setShowNewArticlesBanner(false)
  }, [loadFeeds])

  // User interaction handlers (localStorage only)
  const handleLikeArticle = useCallback((article) => {
    const articleId = article.id || article.link
    const isLiked = likedArticles.has(articleId)

    setLikedArticles(prev => {
      const newSet = new Set(prev)
      if (isLiked) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
      }
      return newSet
    })
  }, [likedArticles])

  const handleBookmarkArticle = useCallback((article) => {
    const articleId = article.id || article.link
    const isBookmarked = bookmarkedArticles.some(b => (b.id || b.link) === articleId)

    if (isBookmarked) {
      setBookmarkedArticles(prev => prev.filter(b => (b.id || b.link) !== articleId))
    } else {
      setBookmarkedArticles(prev => [...prev, { ...article, savedAt: new Date().toISOString() }])
    }
  }, [bookmarkedArticles])

  const handleArticleView = useCallback((article) => {
    const historyEntry = {
      ...article,
      viewedAt: new Date().toISOString(),
      readingTime: Math.floor(Math.random() * 180) + 30
    }
    
    setReadingHistory(prev => [historyEntry, ...prev.slice(0, 99)])
  }, [])

  const handleAddRecentSearch = useCallback((query) => {
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 10)
      return newSearches
    })
  }, [])

  const handleShare = useCallback(async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.link
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(article.link)
      } catch (error) {
        console.error('Error copying to clipboard:', error)
      }
    }
  }, [])

  // Load feeds on mount and category change
  useEffect(() => {
    loadFeeds(false)
  }, [loadFeeds])

  // Set up background refresh interval
  useEffect(() => {
    if (loading || isOffline) return

    const interval = setInterval(() => {
      backgroundRefresh()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [backgroundRefresh, loading, isOffline])

  // Hide new articles banner after category change
  useEffect(() => {
    setShowNewArticlesBanner(false)
    setNewArticlesAvailable(0)
  }, [selectedCategory])

  // Navigation handlers
  const handleSearchClick = () => setCurrentView('search')
  const handleBytesClick = () => setCurrentView('bytes')
  const handleProfileClick = () => setCurrentView('profile')
  const handleSavedClick = () => setCurrentView('saved')
  const handleInsightsClick = () => setCurrentView('insights')

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
        <div className="min-h-screen bg-background">
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
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading news...</p>
            </div>
          </div>
          <MobileNavigation
            currentView={currentView}
            setCurrentView={setCurrentView}
            onSearchClick={handleSearchClick}
            onBytesClick={handleBytesClick}
            onProfileClick={handleProfileClick}
            onSavedClick={handleSavedClick}
            onInsightsClick={handleInsightsClick}
          />
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background transition-colors duration-300">
        <PWAPrompt />
        
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
          likedCount={likedArticles.size}
          bookmarkedCount={bookmarkedArticles.length}
        />

        {/* Main Content */}
        <div className="pt-2 pb-20 lg:pb-6">
          {/* Search View */}
          {currentView === 'search' && (
            <SearchPage
              allFeeds={allFeeds}
              onClose={() => setCurrentView('home')}
              onSelectArticle={handleArticleView}
              lastUpdated={lastUpdated}
              recentSearches={recentSearches}
              onAddRecentSearch={handleAddRecentSearch}
            />
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <ProfilePage 
              userPreferences={userPreferences}
              onUpdatePreferences={setUserPreferences}
            />
          )}

          {/* News Bytes View */}
          {currentView === 'bytes' && (
            <NewsBytes 
              articles={articlesWithImages}
              viewMode={viewMode}
              onLikeArticle={handleLikeArticle}
              onBookmarkArticle={handleBookmarkArticle}
              onShare={handleShare}
              likedArticles={likedArticles}
              bookmarkedArticles={bookmarkedArticles}
              savedArticles={bookmarkedArticles}
              onToggleSave={handleBookmarkArticle}
            />
          )}

          {/* Saved Articles View */}
          {currentView === 'saved' && (
            <SaveForLater
              savedArticles={bookmarkedArticles}
              onToggleSave={handleBookmarkArticle}
              onShare={handleShare}
              onArticleClick={handleArticleView}
              className="max-w-7xl mx-auto px-4 lg:px-6 py-6"
            />
          )}

          {/* Personal Insights View */}
          {currentView === 'insights' && (
            <PersonalInsights
              allFeeds={allFeeds}
              lastUpdated={lastUpdated}
              readingHistory={readingHistory}
              className="max-w-7xl mx-auto px-4 lg:px-6 py-6"
            />
          )}

          {/* Home View */}
          {currentView === 'home' && (
            <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
              {/* New Articles Banner */}
              {showNewArticlesBanner && newArticlesAvailable > 0 && (
                <div className="mb-3">
                  <Alert>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse mr-3"></div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">New Articles Available</h3>
                          <AlertDescription>
                            {newArticlesAvailable} new article{newArticlesAvailable !== 1 ? 's' : ''} ready to view
                          </AlertDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button onClick={applyNewArticles} size="sm">
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Load New
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewArticlesBanner(false)}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Alert>
                </div>
              )}

              {/* Background Refresh Indicator */}
              {backgroundRefreshing && (
                <div className="mb-3">
                  <Alert>
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      <AlertDescription>Checking for new articles...</AlertDescription>
                    </div>
                  </Alert>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="mb-3">
                  <Alert variant="destructive">
                    <div className="flex items-center">
                      <XMarkIcon className="h-5 w-5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium">
                          {isOffline ? 'Offline Mode' : 'Error Loading News'}
                        </h3>
                        <AlertDescription>
                          {isOffline ? 'Showing cached articles. Connect to internet for latest updates.' : error}
                        </AlertDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadFeeds(true)}
                        disabled={isOffline}
                        className="ml-auto"
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </Alert>
                </div>
              )}

              {/* Manual Refreshing Indicator */}
              {refreshing && (
                <div className="mb-3">
                  <Alert>
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-5 w-5 mr-3 animate-spin" />
                      <AlertDescription>Refreshing news...</AlertDescription>
                    </div>
                  </Alert>
                </div>
              )}

              {/* Categories */}
              <div className="mb-3">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  feeds={allFeeds}
                  categories={categories}
                />
              </div>

              {/* Filter Controls */}
              <div className="mb-3">
                <FilterControls
                  selectedTimeframe={selectedTimeframe}
                  setSelectedTimeframe={setSelectedTimeframe}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  feeds={allFeeds}
                />
              </div>

              {/* Articles Grid with Infinite Scroll */}
              {displayedFeeds.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="text-6xl mb-4">
                    {searchQuery ? '🔍' : selectedCategory !== 'all' ? '📂' : '📰'}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {searchQuery ? 'No Search Results' : 'No Articles Found'}
                  </CardTitle>
                  <CardDescription>
                    {searchQuery 
                      ? `No articles found for "${searchQuery}". Try different search terms.`
                      : 'Try adjusting your filters or check back later for new content.'
                    }
                  </CardDescription>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('all')
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Card>
              ) : (
                <>
                  {/* Articles Count */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
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
                  <div className={cn(
                    "grid gap-4",
                    viewMode === 'grid' 
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                      : "grid-cols-1"
                  )}>
                    {displayedFeeds.map((article, index) => (
                      <ArticleCard
                        key={`${article.link || article.id}-${index}`}
                        article={article}
                        onClick={() => handleArticleView(article)}
                        likedArticles={likedArticles}
                        bookmarkedArticles={bookmarkedArticles}
                        onLike={handleLikeArticle}
                        onBookmark={handleBookmarkArticle}
                        onShare={handleShare}
                      />
                    ))}
                  </div>

                  {/* Loading More Indicator */}
                  {loadingMore && (
                    <div className="flex justify-center py-6">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-sm text-muted-foreground">
                          Loading more articles...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* End of Results */}
                  {!hasMore && displayedFeeds.length > 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🎉</div>
                      <p className="text-muted-foreground mb-2">
                        You've reached the end!
                      </p>
                      <p className="text-sm text-muted-foreground">
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
          onSavedClick={handleSavedClick}
          onInsightsClick={handleInsightsClick}
          likedCount={likedArticles.size}
          bookmarkedCount={bookmarkedArticles.length}
        />

        {/* Scroll to Top Button */}
        {hasReached25Percent && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-24 lg:bottom-6 right-4 z-40 rounded-full shadow-lg"
          >
            <ArrowUpIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App