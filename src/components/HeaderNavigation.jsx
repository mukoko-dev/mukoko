// src/components/HeaderNavigation.jsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { IconGroup, IconGroupToolbar } from '@/components/ui/icon-group'
import { cn } from '@/lib/utils'
import { 
  MagnifyingGlassIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  HomeIcon,
  VideoCameraIcon,
  UserCircleIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'
import {
  SunIcon as SunSolidIcon,
  MoonIcon as MoonSolidIcon,
  HomeIcon as HomeSolidIcon,
  VideoCameraIcon as VideoCameraSolidIcon,
  UserCircleIcon as UserCircleSolidIcon,
  MagnifyingGlassIcon as MagnifyingGlassSolidIcon,
  Squares2X2Icon as Squares2X2SolidIcon,
  ListBulletIcon as ListBulletSolidIcon
} from '@heroicons/react/24/solid'
import Logo from './Logo'

const HeaderNavigation = ({ 
  theme, 
  setTheme, 
  onSearchClick, 
  onBytesClick,
  onProfileClick,
  currentView,
  setCurrentView,
  viewMode,
  setViewMode,
  title = "Mukoko"
}) => {
  const navigation = [
    { id: 'home', name: 'Feed', icon: Squares2X2Icon, iconSolid: Squares2X2SolidIcon },
    { id: 'search', name: 'Search', icon: MagnifyingGlassIcon, iconSolid: MagnifyingGlassSolidIcon }
  ]

  const handleNavClick = (navId) => {
    setCurrentView?.(navId)
    
    // Trigger appropriate actions
    switch(navId) {
      case 'search':
        onSearchClick?.()
        break
      case 'profile':
        onProfileClick?.()
        break
      case 'home':
        setCurrentView?.('home')
        break
      default:
        break
    }
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme?.(newTheme)
  }

  return (
    <header className={cn(
      "sticky top-0 z-50",
      "bg-white/90 dark:bg-black/90 backdrop-blur-md",
      "border-b border-black/10 dark:border-white/10"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-16">
          
          {/* Mobile: Centered Logo, Desktop: Left Logo */}
          <div className="flex items-center lg:flex-none">
            {/* Mobile: Spacer + Centered Logo */}
            <div className="lg:hidden flex-1 flex justify-center">
              <Logo 
                variant="compact"
                theme={theme}
                size="sm"
                className="flex-shrink-0"
              />
            </div>
            
            {/* Desktop: Horizontal Logo */}
            <div className="hidden lg:block">
              <Logo 
                variant="horizontal"
                theme={theme}
                size="md"
                className="flex-shrink-0"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 lg:flex-none">
            
            {/* Desktop Navigation - Using IconGroupToolbar */}
            <nav className="hidden lg:block">
              <IconGroupToolbar>
                {navigation.map((item) => {
                  const isActive = currentView === item.id
                  const IconComponent = isActive ? item.iconSolid : item.icon
                  
                  return (
                    <IconButton
                      key={item.id}
                      variant="icon"
                      size="icon"
                      onClick={() => handleNavClick(item.id)}
                      tooltip={item.name}
                      className={cn(
                        "transition-all duration-200",
                        isActive && "text-black dark:text-white",
                        !isActive && "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                      )}
                    >
                      <IconComponent className="h-5 w-5" />
                    </IconButton>
                  )
                })}
              </IconGroupToolbar>
            </nav>

            {/* Theme Toggle */}
            <IconButton
              variant="icon"
              size="icon"
              onClick={handleThemeToggle}
              tooltip={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-all duration-200"
            >
              {theme === 'dark' ? (
                <SunSolidIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </IconButton>

            {/* Profile Icon - Furthest Right on Desktop */}
            <IconButton
              variant="icon"
              size="icon"
              onClick={() => handleNavClick('profile')}
              tooltip="Profile"
              className={cn(
                "hidden lg:flex transition-all duration-200",
                currentView === 'profile' && "text-black dark:text-white",
                currentView !== 'profile' && "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              )}
            >
              {currentView === 'profile' ? (
                <UserCircleSolidIcon className="h-5 w-5" />
              ) : (
                <UserCircleIcon className="h-5 w-5" />
              )}
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderNavigation