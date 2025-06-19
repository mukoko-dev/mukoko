import { useState, useCallback, useMemo } from 'react'

// User ID management
function generateUserId() {
  const stored = localStorage.getItem('harare_metro_user_id')
  if (stored) return stored
  
  const newId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2)
  localStorage.setItem('harare_metro_user_id', newId)
  return newId
}

// Main API hook
export function useAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const userId = useMemo(() => generateUserId(), [])

  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
      'X-Timestamp': Date.now().toString(),
      ...options.headers
    }

    try {
      const response = await fetch(`/api/${endpoint}`, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Network request failed')
    }
  }, [userId])

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiRequest(endpoint, options)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiRequest])

  return {
    request,
    apiRequest,
    loading,
    error,
    userId,
    clearError: () => setError(null)
  }
}

// Enhanced feeds hook
export function useFeeds() {
  const { apiRequest } = useAPI()
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState({})

  const loadFeeds = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams({
        limit: '100',
        ...params
      })
      
      const response = await apiRequest(`feeds?${queryParams}`)
      
      if (response.success) {
        setFeeds(response.articles || [])
        setMeta(response.meta || {})
      } else {
        throw new Error(response.message || 'Failed to load feeds')
      }
    } catch (err) {
      setError(err)
      setFeeds([])
    } finally {
      setLoading(false)
    }
  }, [apiRequest])

  const refreshFeeds = useCallback(() => {
    return loadFeeds({ force: true, timestamp: Date.now() })
  }, [loadFeeds])

  return { 
    feeds, 
    loading, 
    error, 
    meta, 
    loadFeeds, 
    refreshFeeds 
  }
}

// Enhanced user data hook
export function useUserData() {
  const { apiRequest } = useAPI()
  const [likes, setLikes] = useState(new Set())
  const [bookmarks, setBookmarks] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadUserData = useCallback(async () => {
    setLoading(true)
    try {
      const [likesResponse, bookmarksResponse, profileResponse] = await Promise.all([
        apiRequest('user/likes'),
        apiRequest('user/bookmarks'),
        apiRequest('user/profile')
      ])

      if (likesResponse.success) {
        const likedIds = new Set(likesResponse.likes.map(article => article.article_id))
        setLikes(likedIds)
      }

      if (bookmarksResponse.success) {
        setBookmarks(bookmarksResponse.bookmarks || [])
      }

      if (profileResponse.success) {
        setUserProfile(profileResponse.user)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }, [apiRequest])

  const toggleLike = useCallback(async (article) => {
    const articleId = article.id || article.link
    const isLiked = likes.has(articleId)

    try {
      if (isLiked) {
        await apiRequest(`user/likes/${encodeURIComponent(articleId)}`, { 
          method: 'DELETE' 
        })
        setLikes(prev => {
          const newSet = new Set(prev)
          newSet.delete(articleId)
          return newSet
        })
      } else {
        await apiRequest('user/likes', {
          method: 'POST',
          body: JSON.stringify({ article })
        })
        setLikes(prev => new Set(prev).add(articleId))
      }
      return !isLiked
    } catch (error) {
      console.error('Error toggling like:', error)
      throw error
    }
  }, [likes, apiRequest])

  const toggleBookmark = useCallback(async (article) => {
    const articleId = article.id || article.link
    const isBookmarked = bookmarks.some(b => (b.article_id || b.id || b.link) === articleId)

    try {
      if (isBookmarked) {
        await apiRequest(`user/bookmarks/${encodeURIComponent(articleId)}`, { 
          method: 'DELETE' 
        })
        setBookmarks(prev => prev.filter(b => (b.article_id || b.id || b.link) !== articleId))
      } else {
        const response = await apiRequest('user/bookmarks', {
          method: 'POST',
          body: JSON.stringify({ article })
        })
        if (response.success) {
          const bookmarkData = { 
            ...article, 
            article_id: articleId,
            savedAt: new Date().toISOString() 
          }
          setBookmarks(prev => [...prev, bookmarkData])
        }
      }
      return !isBookmarked
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      throw error
    }
  }, [bookmarks, apiRequest])

  return {
    likes,
    bookmarks,
    userProfile,
    loading,
    loadUserData,
    toggleLike,
    toggleBookmark,
    isLiked: (articleId) => likes.has(articleId),
    isBookmarked: (articleId) => bookmarks.some(b => (b.article_id || b.id || b.link) === articleId)
  }
}

// Analytics hook
export function useAnalytics() {
  const { apiRequest } = useAPI()

  const trackEvent = useCallback(async (eventType, data) => {
    try {
      await apiRequest('analytics/track', {
        method: 'POST',
        body: JSON.stringify({ eventType, data, timestamp: Date.now() })
      })
    } catch (error) {
      // Don't throw analytics errors - just log them
      console.warn('Analytics tracking failed:', error)
    }
  }, [apiRequest])

  const trackArticleView = useCallback((article, metadata = {}) => {
    return trackEvent('article_view', {
      articleId: article.id || article.link,
      articleTitle: article.title,
      source: article.source,
      category: article.category,
      ...metadata
    })
  }, [trackEvent])

  const trackSearch = useCallback((query, results) => {
    return trackEvent('search', {
      query,
      resultsCount: results.length,
      searchTime: Date.now()
    })
  }, [trackEvent])

  const trackCategoryClick = useCallback((category) => {
    return trackEvent('category_click', { category })
  }, [trackEvent])

  return {
    trackEvent,
    trackArticleView,
    trackSearch,
    trackCategoryClick
  }
}