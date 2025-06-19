// CategoryFilter.jsx - Updated to use the new Button component
import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { Card, CardContent } from './ui/card'
import { cn } from '../lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'

const CategoryFilter = ({ 
  selectedCategory, 
  setSelectedCategory, 
  feeds = [],
  showStats = true
}) => {
  // Category configuration - simplified for horizontal layout
  const categories = [
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

  // Calculate category counts
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return feeds.length
    return feeds.filter(article => 
      article.category?.toLowerCase() === categoryId.toLowerCase()
    ).length
  }

  // Filter categories that have articles
  const availableCategories = categories.filter(category => 
    category.id === 'all' || getCategoryCount(category.id) > 0
  )

  return (
    <div className={showStats ? "space-y-4" : ""}>
      {/* Horizontal Scrolling Category Buttons */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-3 items-center overflow-x-auto p-2">
          {availableCategories.map(category => {
            const count = getCategoryCount(category.id)
            const isSelected = selectedCategory === category.id
            
            return (
              <Button
                key={category.id}
                variant="category"
                size="category"
                active={isSelected}
                onClick={() => setSelectedCategory(category.id)}
                aria-label={`Filter by ${category.name} category (${count} articles)`}
              >
                <span className="text-category">{category.emoji}</span>
                <span className="text-category">{category.name}</span>
                <Badge 
                  variant="count" 
                  size="sm"
                >
                  {count}
                </Badge>
              </Button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {showStats && (
        <>
          {/* Active Filter Display */}
          {selectedCategory !== 'all' && (
            <Card className="border-l-5 border-l-foreground">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {categories.find(c => c.id === selectedCategory)?.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      Filtered by: {categories.find(c => c.id === selectedCategory)?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Showing {getCategoryCount(selectedCategory)} articles
                    </p>
                  </div>
                </div>
                <Button
                  variant="icon"
                  size="icon"
                  onClick={() => setSelectedCategory('all')}
                  aria-label="Clear filter"
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default CategoryFilter