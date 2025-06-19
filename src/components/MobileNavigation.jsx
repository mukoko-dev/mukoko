// src/components/MobileNavigation.jsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { IconGroup } from '@/components/ui/icon-group'
import { cn } from '@/lib/utils'
import { 
  Squares2X2Icon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import {
  Squares2X2Icon as Squares2X2SolidIcon,
  VideoCameraIcon as VideoCameraIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserCircleIcon as UserCircleIconSolid
} from '@heroicons/react/24/solid'

const MobileNavigation = ({ 
  currentView, 
  setCurrentView,
  onSearchClick,
  onBytesClick,
  onProfileClick,
  className = ''
}) => {
  const navigation = [
    { 
      id: 'home', 
      name: 'Feed', 
      icon: Squares2X2Icon, 
      iconSolid: Squares2X2SolidIcon,
      action: () => setCurrentView('home')
    },
    { 
      id: 'bytes', 
      name: 'Bytes', 
      icon: VideoCameraIcon, 
      iconSolid: VideoCameraIconSolid,
      action: () => {
        setCurrentView('bytes')
        onBytesClick?.()
      }
    },
    { 
      id: 'search', 
      name: 'Search', 
      icon: MagnifyingGlassIcon, 
      iconSolid: MagnifyingGlassIconSolid,
      action: () => {
        setCurrentView('search')
        onSearchClick?.()
      }
    },
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: UserCircleIcon, 
      iconSolid: UserCircleIconSolid,
      action: () => {
        setCurrentView('profile')
        onProfileClick?.()
      }
    }
  ]

  return (
    <nav className={cn(
      // Glassmorphism navigation bar
      "lg:hidden fixed bottom-0 left-0 right-0 z-50",
      "bg-white/90 dark:bg-black/90 backdrop-blur-md",
      "border-t border-black/10 dark:border-white/10",
      className
    )}>
      <div className="safe-area-bottom">
        {/* Navigation container with glassmorphism */}
        <div className="px-4 py-2">
          <IconGroup 
            variant="separated" 
            className="justify-around w-full"
          >
            {navigation.map((item) => {
              const isActive = currentView === item.id
              const IconComponent = isActive ? item.iconSolid : item.icon
              
              return (
                <div key={item.id} className="flex flex-col items-center">
                  <IconButton
                    onClick={item.action}
                    variant="icon"
                    size="icon"
                    tooltip={item.name}
                    className={cn(
                      "p-3 rounded-xl transition-all duration-200",
                      isActive && cn(
                        // Active state with glassmorphism
                        "bg-black/10 dark:bg-white/10",
                        "text-black dark:text-white",
                        "backdrop-blur-sm border border-black/20 dark:border-white/20"
                      ),
                      !isActive && cn(
                        // Inactive state
                        "text-black/60 dark:text-white/60",
                        "hover:text-black dark:hover:text-white",
                        "hover:bg-black/5 dark:hover:bg-white/5"
                      )
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Navigate to ${item.name}`}
                  >
                    <IconComponent className="h-6 w-6" />
                  </IconButton>
                  
                  {/* Active indicator dot */}
                  <div className={cn(
                    "w-1 h-1 rounded-full mt-1 transition-all duration-200",
                    isActive 
                      ? "bg-black dark:bg-white opacity-100" 
                      : "bg-transparent opacity-0"
                  )} />
                </div>
              )
            })}
          </IconGroup>
        </div>
      </div>
    </nav>
  )
}

export default MobileNavigation