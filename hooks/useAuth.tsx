"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { AuthContextType, AuthState, LoginFormData, SignupFormData } from '@/types/auth'

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
    isEmailConfirmed: false
  })

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...')
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session fetch error:', error)
        }
        
        console.log('Initial session:', session?.user?.email || 'none')
        
        if (session) {
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAuthenticated: true,
            isEmailConfirmed: !!session.user.email_confirmed_at
          })
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            isEmailConfirmed: false
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
          isEmailConfirmed: false
        })
      }
    }

    initializeAuth()

    // Listen for auth changes - THIS IS THE CRITICAL PART
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'no user')
        
        // Always update state when auth changes, regardless of event type
        if (session) {
          console.log('✅ Setting authenticated state')
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            isAuthenticated: true,
            isEmailConfirmed: !!session.user.email_confirmed_at
          })
        } else {
          console.log('❌ Setting unauthenticated state')
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
            isEmailConfirmed: false
          })
        }
      }
    )

    return () => {
      console.log('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  // Sign in - simplified to rely on auth state change
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
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

  // Sign up
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
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

  // Sign out
  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Signing out...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [])

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?message=check-email`
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  // Resend confirmation email
  const resendConfirmation = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?message=check-email`
        }
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error('Resend confirmation error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session refresh error:', error)
        return
      }

      if (session) {
        setAuthState({
          user: session.user,
          session,
          isLoading: false,
          isAuthenticated: true,
          isEmailConfirmed: !!session.user.email_confirmed_at
        })
      }
    } catch (error) {
      console.error('Session refresh error:', error)
    }
  }, [])

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    resendConfirmation,
    refreshSession
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Hook for protected components
export function useRequireAuth() {
  const { isAuthenticated, isLoading, isEmailConfirmed } = useAuth()
  
  return {
    isAuthenticated,
    isLoading,
    isEmailConfirmed,
    isReady: !isLoading
  }
}
