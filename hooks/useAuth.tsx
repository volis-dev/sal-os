"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// Simplified auth state - MATCHES types/auth.ts
interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Simplified auth context - MATCHES types/auth.ts
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
        console.log('Initializing auth state...')
        const { data: { session } } = await supabase.auth.getSession()
        
        console.log('Initial session:', session?.user?.email || 'none')
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
        console.log('🔄 Auth state change:', event, session?.user?.email || 'no user')
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          isAuthenticated: !!session?.user,
          isLoading: false
        })
      }
    )

    return () => {
      console.log('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  // Sign in - PURE FUNCTION, NO REDIRECTS
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Sign in error:', error.message)
        return { error: error.message }
      }

      console.log('✅ Sign in successful, auth state change will trigger automatically')
      return { error: null }
    } catch (error) {
      console.error('❌ Sign in exception:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  // Sign up - PURE FUNCTION, NO REDIRECTS
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      console.log('📝 Attempting sign up for:', email)
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?message=check-email`
        }
      })

      if (error) {
        console.error('❌ Sign up error:', error.message)
        return { error: error.message }
      }

      console.log('✅ Sign up successful')
      return { error: null }
    } catch (error) {
      console.error('❌ Sign up exception:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  // Sign out - PURE FUNCTION, NO REDIRECTS
  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Signing out...')
      await supabase.auth.signOut()
      console.log('✅ Sign out successful')
    } catch (error) {
      console.error('❌ Sign out error:', error)
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
