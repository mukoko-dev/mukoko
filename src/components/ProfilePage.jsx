// src/components/ProfilePage.jsx - TikTok-styled with Personal Insights integration
import React, { useState, useMemo } from 'react'
import {
  UserCircle,
  Settings,
  Bell,
  Eye,
  BarChart3,
  Clock,
  Bookmark,
  Share,
  Smartphone,
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  Info,
  TrendingUp,
  Flame,
  Newspaper,
  Check,
  User,
  Heart,
  Target,
  Lightbulb
} from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import SaveForLater from './SaveForLater'
import PersonalInsights from './PersonalInsights'

const ProfilePage = ({
  currentColors,
  theme,
  onThemeChange,
  savedArticles = [],
  onToggleSave,
  onShare,
  onArticleClick,
  userStats = {},
  allFeeds = [],
  lastUpdated,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview')

  // Enhanced user data with personal insights integration
  const userData = useMemo(() => {
    const readArticles = JSON.parse(localStorage.getItem('harare_metro_read_articles') || '[]')
    const likedArticles = JSON.parse(localStorage.getItem('harare_metro_liked_articles') || '[]')
    const bookmarkedArticles = JSON.parse(localStorage.getItem('harare_metro_bookmarks') || '[]')
    const visitHistory = JSON.parse(localStorage.getItem('harare_metro_visit_history') || '[]')
    
    const memberSince = visitHistory.length > 0 
      ? new Date(Math.min(...visitHistory.map(v => new Date(v.timestamp))))
      : new Date('2024-01-15')
    
    const daysSince = Math.floor((new Date() - memberSince) / (1000 * 60 * 60 * 24))
    
    // Calculate reading streak
    const calculateStreak = () => {
      if (visitHistory.length === 0) return 0
      
      const dates = visitHistory
        .map(v => new Date(v.timestamp).toDateString())
        .filter((date, index, arr) => arr.indexOf(date) === index)
        .sort((a, b) => new Date(b) - new Date(a))
      
      let streak = 0
      let currentDate = new Date()
      
      for (let i = 0; i < dates.length; i++) {
        const checkDate = currentDate.toDateString()
        if (dates.includes(checkDate)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }
      
      return streak
    }

    // Get favorite category
    const categoryCount = readArticles.reduce((acc, read) => {
      const article = allFeeds.find(f => f.id === read.id || f.link === read.link)
      if (article && article.category) {
        acc[article.category] = (acc[article.category] || 0) + 1
      }
      return acc
    }, {})
    
    const favoriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Technology'

    return {
      name: 'News Reader',
      email: 'user@example.com',
      joinDate: memberSince.toISOString().split('T')[0],
      readingStats: {
        articlesRead: readArticles.length || userStats.articlesRead || 247,
        timeSpent: userStats.timeSpent || '5.2h',
        favoriteCategory: favoriteCategory,
        readingStreak: calculateStreak() || userStats.readingStreak || 12,
        totalLikes: likedArticles.length,
        totalBookmarks: bookmarkedArticles.length,
        totalSessions: visitHistory.length,
        daysSince
      }
    }
  }, [allFeeds, userStats])

  const upcomingFeatures = [
    {
      name: 'Advanced Reading Analytics',
      description: 'Deep insights into your reading habits and time patterns',
      icon: BarChart3,
      status: 'Live Now!',
      variant: 'success'
    },
    {
      name: 'Personalized Recommendations',
      description: 'AI-curated news based on your reading history',
      icon: Lightbulb,
      status: 'Live Now!',
      variant: 'success'
    },
    {
      name: 'Push Notifications',
      description: 'Get notified about breaking news and saved articles',
      icon: Bell,
      status: 'Planned',
      variant: 'muted'
    },
    {
      name: 'Social Sharing',
      description: 'Share and discuss articles with friends',
      icon: Share,
      status: 'Planned',
      variant: 'muted'
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserCircle },
    { id: 'insights', name: 'Insights', icon: BarChart3 },
    { id: 'saved', name: 'Saved Articles', icon: Bookmark },
    { id: 'settings', name: 'Preferences', icon: Settings }
  ]

  // Custom Toggle Component - fixed to look like proper toggle switches
  const Toggle = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200
        ${disabled 
          ? 'cursor-not-allowed opacity-50 bg-gray-200 dark:bg-gray-700' 
          : checked 
            ? 'bg-blue-600 dark:bg-blue-500' 
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
          ${disabled ? 'opacity-50' : 'shadow-lg'}
        `}
      />
    </button>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Insights Preview */}
      <div className={`${currentColors.cardBg} shadow-lg rounded-xl p-6`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-500" />
            Your Reading Journey
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quick overview of your reading habits and achievements
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg shadow bg-blue-50 dark:bg-blue-900/20">
            <div className="text-center">
              <Heart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.readingStats.totalLikes}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Liked
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg shadow bg-green-50 dark:bg-green-900/20">
            <div className="text-center">
              <Bookmark className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {savedArticles.length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Saved
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg shadow bg-orange-50 dark:bg-orange-900/20">
            <div className="text-center">
              <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.readingStats.readingStreak}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Day Streak
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg shadow bg-purple-50 dark:bg-purple-900/20">
            <div className="text-center">
              <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {userData.readingStats.articlesRead}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Articles Read
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setActiveTab('insights')}
            className="inline-flex items-center space-x-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span>View Detailed Insights</span>
          </Button>
        </div>
      </div>

      {/* Features & Updates */}
      <div className={`${currentColors.cardBg} shadow-lg rounded-xl p-6`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Features & Updates
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            What's new and what's coming next
          </p>
        </div>
        <div className="space-y-4">
          {upcomingFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 rounded-lg shadow bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                  <feature.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {feature.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
              <Badge variant={feature.variant} size="sm">
                {feature.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderReadingStats = () => {
    return (
      <div className="space-y-4">
        <div className={`${currentColors.cardBg} shadow-lg rounded-xl p-4`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span>Reading Summary</span>
          </h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Favorite Category
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your most read topic
                </p>
              </div>
              <Badge variant="default" size="sm">
                {userData.readingStats.favoriteCategory}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Reading Level
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on your activity
                </p>
              </div>
              <Badge variant="success" size="sm">
                {userData.readingStats.articlesRead > 100 ? 'Avid Reader' : 
                 userData.readingStats.articlesRead > 50 ? 'Regular Reader' : 
                 'Getting Started'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Member Duration
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Days since you joined
                </p>
              </div>
              <Badge variant="default" size="sm">
                {userData.readingStats.daysSince} days
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <div className={`${currentColors.cardBg} shadow-lg rounded-xl p-6`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <span>Appearance</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Customize how the app looks and feels
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="space-y-1">
              <label className="text-base font-medium text-gray-900 dark:text-white">
                Dark Mode
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {theme === 'dark' ? 'Dark mode is enabled' : 'Light mode is enabled'}
              </p>
            </div>
            <Toggle
              checked={theme === 'dark'}
              onChange={onThemeChange}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings - Coming Soon */}
      <div className={`${currentColors.cardBg} shadow-lg rounded-xl p-6 opacity-60`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Bell className="h-4 w-4 text-gray-400" />
            </div>
            <span>Notifications</span>
            <Badge variant="muted" size="sm">
              Coming Soon
            </Badge>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay updated with breaking news and your saved articles
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <label className="text-base font-medium text-gray-900 dark:text-white">
                  Breaking News
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about important news updates
                </p>
              </div>
            </div>
            <Toggle checked={false} onChange={() => {}} disabled />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <div>
                <label className="text-base font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications on your device
                </p>
              </div>
            </div>
            <Toggle checked={false} onChange={() => {}} disabled />
          </div>
        </div>
      </div>

      {/* Privacy Settings - Coming Soon */}
      <div className={`${currentColors.cardBg} shadow-lg rounded-xl p-6 opacity-60`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ShieldCheck className="h-4 w-4 text-gray-400" />
            </div>
            <span>Privacy & Data</span>
            <Badge variant="muted" size="sm">
              Coming Soon
            </Badge>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Control your data and privacy preferences
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
              <div>
                <label className="text-base font-medium text-gray-900 dark:text-white">
                  Data Collection
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow anonymous usage analytics
                </p>
              </div>
            </div>
            <Toggle checked={false} onChange={() => {}} disabled />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <div>
                <label className="text-base font-medium text-gray-900 dark:text-white">
                  Personalized Content
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize content based on reading habits
                </p>
              </div>
            </div>
            <Toggle checked={false} onChange={() => {}} disabled />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* App Info */}
      <div className={`${currentColors.cardBg} shadow-lg rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50`}>
        <div className="text-center space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Harare Metro News
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Version 2.1.0 • Built with ❤️ in Zimbabwe
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`max-w-4xl mx-auto space-y-6 p-3 ${className}`}>
      {/* Profile Header */}
      <div className={`px-4 pt-3 flex flex-col items-center sm:flex-row sm:items-start sm:space-x-8 justify-center bottom-0 sm:justify-start bg-white dark:bg-gray-900 rounded-lg shadow-lg`}>
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-pink-500 via-yellow-400 to-purple-500 flex items-center justify-center shadow-lg overflow-hidden">
            <span className="text-white dark:text-gray-900 text-3xl font-bold select-none">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          {/* Badges */}
          <div className="flex space-x-3 mt-2 gap-2 items-center justify-center">
            <Badge variant="success" size="sm" className="mt-2">
              Active Reader
            </Badge>
            <Badge variant="default" size="sm" className="flex items-center space-x-1">
              <Check className="h-4 w-4 mr-1" />
              <span>Verified Member</span>
            </Badge>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 mt-4 sm:mt-0 flex flex-col items-center sm:items-start w-full">
          <div className="flex flex-col sm:flex-row sm:items-center w-full justify-center sm:justify-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
                {userData.name}
              </h2>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-mono">@newsreader</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Member since {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex justify-center items-center text-center py-2 gap-x-8 w-full mt-4">
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{userData.readingStats.totalLikes}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Likes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{userData.readingStats.articlesRead}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Articles</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{userData.readingStats.readingStreak}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Streak</div>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-3 text-gray-700 dark:text-gray-300 text-center sm:text-left text-sm max-w-md w-full">
              <span>
                Passionate about news, technology, and staying informed. <span className="text-blue-500">#HarareMetro</span>
              </span>
            </div>

            {/* Personal Link */}
            <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
              <a
                href="https://hararemetro.co.zw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                hararemetro.co.zw
              </a>
            </div>
              
            {/* Edit Profile */}
            <div className="flex items-center space-x-2 mt-3 sm:mt-2 justify-center">
              <Button
                variant="link"
                size="link"
                onClick={() => {/* Open edit profile modal */}}
                className="font-medium"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <nav className="p-2 flex gap-4 items-center justify-around w-full sm:w-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="icon"
              size="lg"
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl transition-all duration-200 shadow ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-md dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="h-6 w-6" />
              <span className="hidden sm:inline">{tab.name}</span>
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <PersonalInsights 
              currentColors={currentColors} 
              allFeeds={allFeeds || []}
              lastUpdated={lastUpdated}
            />
          </div>
        )}
        {activeTab === 'saved' && (
          <SaveForLater
            savedArticles={savedArticles}
            onToggleSave={onToggleSave}
            onShare={onShare}
            onArticleClick={onArticleClick}
            currentColors={currentColors}
          />
        )}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  )
}

export default ProfilePage