import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '@/lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        
        // Get current session
        const { session } = await auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          
          // Load user profile
          const { data: profileData } = await db.profiles.get(session.user.id)
          setProfile(profileData)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = auth.supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (session?.user) {
          setUser(session.user)
          
          // Load or create profile
          const { data: profileData } = await db.profiles.get(session.user.id)
          if (profileData) {
            setProfile(profileData)
          } else {
            // Create default profile
            const defaultProfile = {
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || '',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              preferences: {
                theme: 'dark',
                notifications: true,
                email_updates: false
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            const { data: newProfile } = await db.profiles.upsert(defaultProfile)
            setProfile(newProfile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Auth methods
  const signUp = async (email, password, metadata = {}) => {
    try {
      setError(null)
      const { data, error } = await auth.signUp(email, password, metadata)
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      setError(null)
      const { data, error } = await auth.signIn(email, password)
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  const signInWithOAuth = async (provider) => {
    try {
      setError(null)
      const { data, error } = await auth.signInWithOAuth(provider)
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await auth.signOut()
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      setUser(null)
      setProfile(null)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  const updateProfile = async (updates) => {
    try {
      setError(null)
      
      if (!user) {
        throw new Error('No user logged in')
      }
      
      const { data, error } = await db.profiles.update(user.id, {
        ...updates,
        updated_at: new Date().toISOString()
      })
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      setProfile(data)
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  const resetPassword = async (email) => {
    try {
      setError(null)
      const { data, error } = await auth.resetPassword(email)
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  const updatePassword = async (password) => {
    try {
      setError(null)
      const { data, error } = await auth.updatePassword(password)
      
      if (error) {
        setError(error.message)
        return { error }
      }
      
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}