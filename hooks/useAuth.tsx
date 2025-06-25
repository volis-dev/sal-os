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
        // Try to get session first (in case Supabase already has it)
        let { data: { session } } = await supabase.auth.getSession()
        
        // If no session, try to recover from localStorage
        if (!session) {
          const storedToken = localStorage.getItem('sb-rrlahnmnyuinoymrfufl-auth-token')
          if (storedToken) {
            try {
              const tokenData = JSON.parse(storedToken)
              if (tokenData.access_token && tokenData.refresh_token) {
                // Set session and check if it worked
                const { data, error } = await supabase.auth.setSession({
                  access_token: tokenData.access_token,
                  refresh_token: tokenData.refresh_token
                })
                
                if (error) {
                  console.error('Failed to restore session:', error)
                  localStorage.removeItem('sb-rrlahnmnyuinoymrfufl-auth-token')
                } else if (data.session) {
                  session = data.session
                }
              }
            } catch (e) {
              console.error('Failed to parse stored token:', e)
              localStorage.removeItem('sb-rrlahnmnyuinoymrfufl-auth-token')
            }
          }
        }
        
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
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
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Sign in
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
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