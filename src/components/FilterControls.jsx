// src/components/FilterControls.jsx - Updated with new button/badge styling
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { IconButton } from './ui/icon-button'
import { IconGroup, IconGroupToolbar } from './ui/icon-group'
import { cn } from '../lib/utils'
import { 
  FunnelIcon, 
  ChevronDownIcon,
  ClockIcon,
  ArrowsUpDownIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'
import {
  Squares2X2Icon as Squares2X2SolidIcon,
  ListBulletIcon as ListBulletSolidIcon,
  FunnelIcon as FunnelSolidIcon
} from '@heroicons/react/24/solid'

const FilterControls = ({
  selectedTimeframe,
  setSelectedTimeframe,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  feeds = [],
  currentColors,
  className = ''
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const timeframeOptions = [
    { id: 'all', label: 'All Time', icon: '📅' },
    { id: '1h', label: 'Last Hour', icon: '⏰' },
    { id: '6h', label: 'Last 6 Hours', icon: '🕕' },
    { id: '24h', label: 'Last 24 Hours', icon: '📆' },
    { id: '7d', label: 'Last 7 Days', icon: '📅' }
  ]

  const sortOptions = [
    { id: 'newest', label: 'Newest First', icon: '⬇️' },
    { id: 'oldest', label: 'Oldest First', icon: '⬆️' },
    { id: 'source', label: 'By Source', icon: '📰' },
    { id: 'category', label: 'By Category', icon: '📂' }
  ]

  // Check if filters are active (not default)
  const hasActiveFilters = selectedTimeframe !== 'all' || sortBy !== 'newest'

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Filter Dropdown */}
      <div className="relative">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "gap-2",
            hasActiveFilters && "ring-2 ring-black/20 dark:ring-white/20"
          )}
        >
          {hasActiveFilters ? (
            <FunnelSolidIcon className="h-4 w-4" />
          ) : (
            <FunnelIcon className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Filter</span>
          {hasActiveFilters && (
            <Badge variant="count" size="sm">
              {(selectedTimeframe !== 'all' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {/* Dropdown Menu */}
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsFilterOpen(false)}
            />
            
            {/* Dropdown with glassmorphism */}
            <div className={cn(
              "absolute top-full left-0 mt-2 w-72 z-20 max-h-96 overflow-y-auto",
              "bg-white/95 dark:bg-black/95 backdrop-blur-md",
              "border border-black/10 dark:border-white/10",
              "rounded-xl shadow-lg"
            )}>
              <div className="p-3">
                
                {/* Timeframe Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10 dark:border-white/10 mb-3">
                    <ClockIcon className="h-4 w-4 text-black/60 dark:text-white/60" />
                    <span className="text-xs font-medium text-black/60 dark:text-white/60 uppercase tracking-wide">
                      Timeframe
                    </span>
                  </div>
                  <div className="space-y-1">
                    {timeframeOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedTimeframe(option.id)
                          setIsFilterOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 text-sm",
                          "hover:bg-black/5 dark:hover:bg-white/5",
                          selectedTimeframe === option.id && cn(
                            "bg-black/10 dark:bg-white/10 text-black dark:text-white",
                            "backdrop-blur-sm border border-black/20 dark:border-white/20"
                          ),
                          selectedTimeframe !== option.id && "text-black/80 dark:text-white/80"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {selectedTimeframe === option.id && (
                          <div className="w-2 h-2 bg-black dark:bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Section */}
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10 dark:border-white/10 mb-3">
                    <ArrowsUpDownIcon className="h-4 w-4 text-black/60 dark:text-white/60" />
                    <span className="text-xs font-medium text-black/60 dark:text-white/60 uppercase tracking-wide">
                      Sort By
                    </span>
                  </div>
                  <div className="space-y-1">
                    {sortOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id)
                          setIsFilterOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 text-sm",
                          "hover:bg-black/5 dark:hover:bg-white/5",
                          sortBy === option.id && cn(
                            "bg-black/10 dark:bg-white/10 text-black dark:text-white",
                            "backdrop-blur-sm border border-black/20 dark:border-white/20"
                          ),
                          sortBy !== option.id && "text-black/80 dark:text-white/80"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {sortBy === option.id && (
                          <div className="w-2 h-2 bg-black dark:bg-white rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Mode Toggle using IconGroupToolbar */}
      <IconGroupToolbar>
        <IconButton
          variant="icon"
          size="icon"
          onClick={() => setViewMode?.('grid')}
          tooltip="Grid View"
          className={cn(
            "transition-all duration-200",
            viewMode === 'grid' && "text-black dark:text-white",
            viewMode !== 'grid' && "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          )}
        >
          {viewMode === 'grid' ? (
            <Squares2X2SolidIcon className="h-4 w-4" />
          ) : (
            <Squares2X2Icon className="h-4 w-4" />
          )}
        </IconButton>
        
        <IconButton
          variant="icon"
          size="icon"
          onClick={() => setViewMode?.('list')}
          tooltip="List View"
          className={cn(
            "transition-all duration-200",
            viewMode === 'list' && "text-black dark:text-white",
            viewMode !== 'list' && "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          )}
        >
          {viewMode === 'list' ? (
            <ListBulletSolidIcon className="h-4 w-4" />
          ) : (
            <ListBulletIcon className="h-4 w-4" />
          )}
        </IconButton>
      </IconGroupToolbar>
    </div>
  )
}

export default FilterControls