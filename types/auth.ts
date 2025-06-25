import type { User, Session } from '@supabase/supabase-js'

// Auth state types - ALIGNED WITH IMPLEMENTATION
export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  // NOTE: isEmailConfirmed removed - not currently implemented in AuthProvider
  // Add back when email confirmation tracking is needed
}

// Auth context types - ALIGNED WITH IMPLEMENTATION
export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  // NOTE: resetPassword, resendConfirmation, refreshSession removed
  // Add back when these features are implemented in AuthProvider
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

// Auth error types
export interface AuthError {
  message: string
  code?: string
  field?: string
}

// Route protection types
export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireEmailConfirmation?: boolean
}

// Middleware types
export interface MiddlewareConfig {
  publicRoutes: string[]
  authRoutes: string[]
  redirectTo: string
}
