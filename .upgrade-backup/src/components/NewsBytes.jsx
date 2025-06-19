// src/components/NewsBytes.jsx - Fixed ArticleModal integration with new styling
import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { IconButton } from './ui/icon-button'
import { cn } from '../lib/utils'
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowsPointingOutIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid'
import ArticleModal from './ArticleModal'
import ShareModal from './ShareModal'

const NewsBytes = ({ 
  currentColors, 
  articles = [], 
  viewMode = 'grid',
  savedArticles = [],
  onToggleSave,
  onShare
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likedArticles, setLikedArticles] = useState(new Set())
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set())
  const [showShareModal, setShowShareModal] = useState(false)
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [expandedContent, setExpandedContent] = useState(false)
  const containerRef = useRef(null)
  const touchStartRef = useRef({ y: 0, time: 0, moved: false })

  // Filter articles that have images
  const validArticles = articles.filter(article => article.optimizedImageUrl || article.imageUrl || article.image)

  // Auto-advance to next article
  useEffect(() => {
    if (!isPlaying || validArticles.length === 0) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % validArticles.length)
    }, 10000) // 10 seconds per article

    return () => clearInterval(timer)
  }, [isPlaying, validArticles.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle keyboard events when modals are open
      if (showShareModal || showArticleModal) {
        if (e.key === 'Escape') {
          setShowShareModal(false)
          setShowArticleModal(false)
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setCurrentIndex(prev => prev > 0 ? prev - 1 : validArticles.length - 1)
          break
        case 'ArrowDown':
          e.preventDefault()
          setCurrentIndex(prev => (prev + 1) % validArticles.length)
          break
        case ' ':
          e.preventDefault()
          setIsPlaying(prev => !prev)
          break
        case 'Enter':
          e.preventDefault()
          setShowArticleModal(true)
          setIsPlaying(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [validArticles.length, showShareModal, showArticleModal])

  // Enhanced touch navigation with better gesture recognition
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e) => {
      touchStartRef.current = {
        y: e.touches[0].clientY,
        time: Date.now(),
        moved: false
      }
    }

    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      const startTouch = touchStartRef.current
      const deltaY = Math.abs(touch.clientY - startTouch.y)
      
      if (deltaY > 10) {
        touchStartRef.current.moved = true
        e.preventDefault() // Prevent default scrolling
      }
    }

    const handleTouchEnd = (e) => {
      const endTouch = e.changedTouches[0]
      const startTouch = touchStartRef.current
      const deltaY = startTouch.y - endTouch.clientY
      const deltaTime = Date.now() - startTouch.time
      
      // Only process swipes if there was movement and it was intentional
      if (touchStartRef.current.moved && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swipe up - next article
          setCurrentIndex(prev => (prev + 1) % validArticles.length)
        } else {
          // Swipe down - previous article
          setCurrentIndex(prev => prev > 0 ? prev - 1 : validArticles.length - 1)
        }
      } else if (!touchStartRef.current.moved && deltaTime < 300) {
        // Quick tap without movement - toggle play/pause
        setIsPlaying(prev => !prev)
      }
    }

    const handleWheel = (e) => {
      e.preventDefault()
      // Add debouncing for wheel events
      const now = Date.now()
      if (handleWheel.lastCall && now - handleWheel.lastCall < 100) return
      handleWheel.lastCall = now
      
      if (e.deltaY > 0) {
        setCurrentIndex(prev => (prev + 1) % validArticles.length)
      } else {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : validArticles.length - 1)
      }
    }

    // Use passive: false for better control
    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('wheel', handleWheel)
    }
  }, [validArticles.length])

  // Helper functions
  const toggleLike = (articleId) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(articleId)) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
      }
      return newSet
    })
  }

  const toggleBookmark = (articleId) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(articleId)) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
      }
      return newSet
    })
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const handleOpenArticleModal = () => {
    setShowArticleModal(true)
    setIsPlaying(false) // Pause playback when opening modal
  }

  const handleCloseArticleModal = () => {
    setShowArticleModal(false)
  }

  const handleShare = () => {
    if (onShare) {
      onShare(currentArticle)
    } else {
      setShowShareModal(true)
    }
  }

  if (validArticles.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Visual Stories Available
          </h3>
          <p className="text-muted-foreground">
            We're working on bringing you more visual content soon!
          </p>
        </div>
      </div>
    )
  }

  const currentArticle = validArticles[currentIndex]

  return (
    <>
      <div 
        ref={containerRef}
        className="relative h-screen overflow-hidden bg-black select-none"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentArticle.optimizedImageUrl || currentArticle.imageUrl || currentArticle.image}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable="false"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
        </div>

        {/* Progress Indicators */}
        <div className="absolute top-2 left-4 right-4 z-20 pt-safe">
          <div className="flex space-x-1">
            {validArticles.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-white" 
                    : index < currentIndex 
                      ? "bg-white/60" 
                      : "bg-white/20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Header Info - Minimal like reels */}
        <div className="absolute top-8 left-4 right-4 z-20 pt-safe">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-white font-medium text-sm">{currentArticle.source || 'Unknown Source'}</p>
                <p className="text-white/70 text-xs">
                  {formatTimeAgo(currentArticle.publishedAt || currentArticle.pubDate || currentArticle.published)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Reels Style */}
        <div className="absolute inset-0 flex">
          
          
          {/* Left side - Content (75%) */}
          <div className="flex-1 flex items-end pb-36 lg:pb-8 px-6">
            <div className="w-full max-w-[85%]">
              {/* Header Info - Minimal like reels */}
              <div>
                <h2 className="text-white font-bold text-sm">
                {currentArticle.source || 'Unknown Source'}
                </h2>

              </div>
              

              {/* Title */}
              <h2 className="text-white text-lg font-bold leading-tight mb-3">
                {currentArticle.title}
              </h2>
              
              {/* Description */}
              {currentArticle.description && (
                <p className="text-white/90 text-sm leading-relaxed mb-3 line-clamp-3">
                  {currentArticle.description}
                </p>
              )}
              
              {/* Published Date */}
              <p className="text-white/70 text-xs">
                  {formatTimeAgo(currentArticle.publishedAt || currentArticle.pubDate || currentArticle.published)}
              </p>

              {/* Category Badge */}
              {currentArticle.category && (
                <div className="mb-3">
                  <Badge variant="glass" size="sm">
                    #{currentArticle.category}
                  </Badge>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {/* Read More Button - Opens ArticleModal */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleOpenArticleModal}
                  className="gap-1 bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30"
                >
                  Read More
                  <ArrowsPointingOutIcon className="w-4 h-4" />
                </Button>

                {/* Read Original Button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(currentArticle.link, '_blank')}
                  className="gap-1 bg-white/10 text-white backdrop-blur-sm border border-white/20 hover:bg-white/20"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  Original
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons (25%) */}
          <div className="w-16 flex flex-col justify-end pb-36 lg:pb-6 items-center space-y-6 px-2">
            {/* Like Button */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-800">
                    {currentArticle.source?.charAt(0).toUpperCase() || 'N'}
                  </span>
                </div>
              </div>

            {/* Like Button */}
            <div className="flex flex-col items-center">
              <IconButton
                variant="icon"
                onClick={() => toggleLike(currentArticle.link)}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
                tooltip="Like"
              >
                {likedArticles.has(currentArticle.link) ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6" />
                )}
              </IconButton>
              <span className="text-white text-xs mt-1 font-medium">
                {Math.floor(Math.random() * 999) + 1}
              </span>
            </div>

            {/* Share Button */}
            <div className="flex flex-col items-center">
              <IconButton
                variant="icon"
                onClick={handleShare}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
                tooltip="Share"
              >
                <ShareIcon className="h-6 w-6" />
              </IconButton>
              <span className="text-white text-xs mt-1 font-medium">Share</span>
            </div>

            {/* Bookmark Button */}
            <div className="flex flex-col items-center">
              <IconButton
                variant="icon"
                onClick={() => {
                  if (onToggleSave) {
                    onToggleSave(currentArticle)
                  } else {
                    toggleBookmark(currentArticle.link)
                  }
                }}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
                tooltip="Save"
              >
                {(savedArticles && savedArticles.some(saved => saved.link === currentArticle.link)) || bookmarkedArticles.has(currentArticle.link) ? (
                  <BookmarkSolidIcon className="h-6 w-6 text-yellow-500" />
                ) : (
                  <BookmarkIcon className="h-6 w-6" />
                )}
              </IconButton>
              <span className="text-white text-xs mt-1 font-medium">Save</span>
            </div>

            {/* Play/Pause Button */}
            <div className="flex flex-col items-center">
              <IconButton
                variant="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
                tooltip={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </IconButton>
              <span className="text-white text-xs mt-1 font-medium">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </div>
          </div>
        </div>

        {/* Touch Hints - Mobile Only */}
        <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/50 rounded-lg px-3 py-2">
            <div className="text-white text-xs text-center">
              <div>Swipe ↑↓ • Tap to play/pause</div>
            </div>
          </div>
        </div>

        {/* Navigation Hints - Desktop Only */}
        <div className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-black/50 rounded-lg p-3">
            <div className="text-white text-xs space-y-1">
              <div className="flex items-center space-x-2">
                <span>↑↓</span>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Space</span>
                <span>Play/Pause</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Enter</span>
                <span>Read More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Modal - Fixed integration */}
      {showArticleModal && currentArticle && (
        <ArticleModal
          article={currentArticle}
          onClose={handleCloseArticleModal}
          currentColors={currentColors}
          onShare={onShare}
          savedArticles={savedArticles}
          onToggleSave={onToggleSave}
        />
      )}

      {/* Share Modal - Only show if not using custom onShare */}
      {showShareModal && !onShare && currentArticle && (
        <ShareModal
          article={currentArticle}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          currentColors={currentColors}
        />
      )}
    </>
  )
}

export default NewsBytes