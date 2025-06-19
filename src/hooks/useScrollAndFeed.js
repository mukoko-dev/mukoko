// src/hooks/useScrollAndFeed.js
import { useState, useEffect, useMemo, useCallback } from 'react'

export function useScrollAndFeed({ 
  allFeeds = [], 
  selectedCategory = 'all', 
  searchQuery = '', 
  selectedTimeframe = 'all',
  sortBy = 'newest',
  itemsPerPage = 25 
}) {
  // Feed state
  const [currentPage, setCurrentPage] = useState(0)
  const [displayedFeeds, setDisplayedFeeds] = useState([])
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Scroll state
  const [scrollDirection, setScrollDirection] = useState('up')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hasReached25Percent, setHasReached25Percent] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // Filter and sort feeds
  const filteredFeeds = useMemo(() => {
    let filtered = [...allFeeds]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(feed => feed.category === selectedCategory)
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(feed => 
        feed.title?.toLowerCase().includes(query) ||
        feed.description?.toLowerCase().includes(query) ||
        feed.source?.toLowerCase().includes(query)
      )
    }

    // Timeframe filter
    if (selectedTimeframe !== 'all') {
      const now = Date.now()
      const timeframes = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
      }
      
      const cutoff = now - timeframes[selectedTimeframe]
      filtered = filtered.filter(feed => {
        const feedTime = new Date(feed.publishedAt || feed.pubDate).getTime()
        return feedTime >= cutoff
      })
    }

    // Sort feeds
    filtered.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.pubDate)
      const dateB = new Date(b.publishedAt || b.pubDate)
      
      switch (sortBy) {
        case 'oldest':
          return dateA - dateB
        case 'source':
          return a.source.localeCompare(b.source)
        case 'category':
          return (a.category || '').localeCompare(b.category || '')
        case 'newest':
        default:
          return dateB - dateA
      }
    })

    return filtered
  }, [allFeeds, selectedCategory, searchQuery, selectedTimeframe, sortBy])

  // Calculate if there are more items to load
  const hasMore = useMemo(() => {
    return (currentPage + 1) * itemsPerPage < filteredFeeds.length
  }, [currentPage, itemsPerPage, filteredFeeds.length])

  // Scroll tracking effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
      setLastScrollY(currentScrollY)
      
      // 25% scroll tracking
      const scrollPercent = currentScrollY / (documentHeight - windowHeight)
      setHasReached25Percent(scrollPercent >= 0.25)
      
      // Infinite scroll trigger
      if (windowHeight + currentScrollY >= documentHeight - 1000 && hasMore && !loadingMore) {
        setIsFetching(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, hasMore, loadingMore])

  // Update displayed feeds when filters change
  useEffect(() => {
    setDisplayedFeeds(filteredFeeds.slice(0, itemsPerPage))
    setCurrentPage(0)
  }, [filteredFeeds, itemsPerPage])

  // Load more feeds function
  const loadMoreFeeds = useCallback(() => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)

    setTimeout(() => {
      const nextPage = currentPage + 1
      const endIndex = (nextPage + 1) * itemsPerPage
      
      setDisplayedFeeds(filteredFeeds.slice(0, endIndex))
      setCurrentPage(nextPage)
      setLoadingMore(false)
    }, 300)
  }, [currentPage, filteredFeeds, hasMore, itemsPerPage, loadingMore])

  // Handle infinite scroll trigger
  useEffect(() => {
    if (!isFetching) return
    loadMoreFeeds()
    setIsFetching(false)
  }, [isFetching, loadMoreFeeds])

  // Refresh feeds function
  const refreshFeeds = useCallback(() => {
    setCurrentPage(0)
    setDisplayedFeeds(filteredFeeds.slice(0, itemsPerPage))
  }, [filteredFeeds, itemsPerPage])

  // Reset to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return {
    // Feed data
    displayedFeeds,
    filteredFeeds,
    loadingMore,
    hasMore,
    currentPage,
    loadMoreFeeds,
    refreshFeeds,
    
    // Scroll data
    scrollDirection,
    hasReached25Percent,
    scrollToTop
  }
}