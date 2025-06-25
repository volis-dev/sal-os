"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// Simplified auth state - no complex flags
interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Simplified auth context - no redirect methods
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Centralized Auth Provider - SINGLE SOURCE OF TRUTH
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true
  })

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          isAuthenticated: !!session?.user,
          isLoading: false
        })
      } catch (error) {
        console.error('Auth initialization error:', error)
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    initializeAuth()

    // Listen for auth state changes - SINGLE EVENT HANDLER
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'no user')
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          isAuthenticated: !!session?.user,
          isLoading: false
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign in - PURE FUNCTION, NO REDIRECTS
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  // Sign up - PURE FUNCTION, NO REDIRECTS
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?message=check-email`
        }
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  // Sign out - PURE FUNCTION, NO REDIRECTS
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [])

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Simple hook - NO REDIRECT LOGIC
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
