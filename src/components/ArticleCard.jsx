// ArticleCard.jsx - Updated with new styling system and fixed modal integration
import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { IconButton } from './ui/icon-button'
import { IconGroup } from './ui/icon-group'
import { 
  GlobeAltIcon, 
  ShareIcon, 
  PhotoIcon,
  ArrowsPointingOutIcon 
} from '@heroicons/react/24/outline'
import { cn } from '../lib/utils'

function ArticleCard({ 
  article, 
  onArticleClick, 
  onShare,
  currentColors,
  savedArticles = [],
  onToggleSave 
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  const hasImage = article.optimizedImageUrl && !imageError

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const handleReadMore = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onArticleClick) {
      onArticleClick(article)
    }
  }, [article, onArticleClick])

  const handleShareClick = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onShare) {
      onShare(article)
    }
  }, [article, onShare])

  const handleOriginalClick = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(article.link, '_blank', 'noopener,noreferrer')
  }, [article.link])

  return (
    <Card 
      className={cn(
        "article-card overflow-hidden cursor-pointer group",
        "bg-card text-card-foreground border border-border"
      )}
      onClick={handleReadMore}
    >
      {/* Image Section */}
      {hasImage && (
        <div className="relative w-full overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="animate-pulse flex flex-col items-center">
                <PhotoIcon className="h-12 w-12 text-muted-foreground mb-2" />
                <div className="text-xs text-muted-foreground">Loading...</div>
              </div>
            </div>
          )}
          
          <img
            src={article.optimizedImageUrl}
            alt={article.imageAlt || article.title}
            className={cn(
              "w-full h-48 object-cover transition-all duration-300",
              imageLoaded ? 'opacity-100' : 'opacity-0',
              "group-hover:scale-105"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
          
          {article.priority && (
            <Badge 
              variant="primary" 
              size="sm"
              className="absolute top-3 right-3"
            >
              🇿🇼 Priority
            </Badge>
          )}
        </div>
      )}

      {/* Content */}
      <CardHeader className="pb-3">
        {/* Source and Date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <Badge variant="muted" size="sm" className="font-semibold">
            {article.source}
          </Badge>
          <span className="whitespace-nowrap ml-2 text-xs">
            {new Date(article.pubDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        
        {/* Title */}
        <h2 className="text-base sm:text-lg font-bold leading-tight line-clamp-3">
          {article.title}
          {article.priority && !hasImage && (
            <Badge 
              variant="primary" 
              size="sm"
              className="ml-2"
            >
              🇿🇼
            </Badge>
          )}
        </h2>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        {article.description && (
          <div className="mb-4">
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {article.description.length > 250 
                ? `${article.description.substring(0, 250)}...`
                : article.description
              }
            </p>
          </div>
        )}

        {/* Keywords */}
        {article.keywords && article.keywords.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5">
              {article.keywords.slice(0, 3).map((keyword, keywordIndex) => (
                <Badge
                  key={`${article.guid}-keyword-${keywordIndex}`}
                  variant="ghost"
                  size="sm"
                  className="text-xs cursor-pointer hover:bg-accent"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Handle keyword search here if needed
                  }}
                >
                  #{keyword}
                </Badge>
              ))}
              {article.keywords.length > 3 && (
                <Badge variant="ghost" size="sm" className="text-xs">
                  +{article.keywords.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleReadMore}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              Read More
              <ArrowsPointingOutIcon className="w-3 h-3" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOriginalClick}
              className="gap-1"
            >
              <GlobeAltIcon className="w-3 h-3" />
              Original
            </Button>
          </div>

          <IconGroup>
            <IconButton
              variant="icon"
              size="icon"
              onClick={handleShareClick}
              tooltip="Share article"
            >
              <ShareIcon className="h-4 w-4" />
            </IconButton>
          </IconGroup>
        </div>
      </CardContent>
    </Card>
  )
}

export default ArticleCard