import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Database } from '@/types/database'

// Create server-side Supabase client
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie setting error
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie removal error
          }
        },
      },
    }
  )
}

// Server-side auth utilities
export const serverAuth = {
  // Get authenticated user on server
  getUser: async () => {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Server auth error:', error)
      return null
    }
    
    return user
  },

  // Get session on server
  getSession: async () => {
    const supabase = await createServerSupabaseClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Server session error:', error)
      return null
    }
    
    return session
  },

  // Require authentication (redirects if not authenticated)
  requireAuth: async (redirectTo: string = '/login') => {
    const user = await serverAuth.getUser()
    
    if (!user) {
      redirect(redirectTo)
    }
    
    return user
  },

  // Require email confirmation
  requireEmailConfirmation: async (redirectTo: string = '/login') => {
    const user = await serverAuth.requireAuth(redirectTo)
    
    if (!user.email_confirmed_at) {
      redirect('/login?message=email-not-confirmed')
    }
    
    return user
  },

  // Check if user is authenticated without redirecting
  isAuthenticated: async (): Promise<boolean> => {
    const user = await serverAuth.getUser()
    return !!user
  },

  // Check if email is confirmed without redirecting
  isEmailConfirmed: async (): Promise<boolean> => {
    const user = await serverAuth.getUser()
    return user?.email_confirmed_at ? true : false
  }
}

// Middleware auth utilities
export const middlewareAuth = {
  // Create middleware Supabase client
  createMiddlewareClient: (request: Request) => {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.headers.get('cookie')?.match(`${name}=([^;]+)`)?.[1]
          },
          set(name: string, value: string, options: any) {
            // Handle in middleware
          },
          remove(name: string, options: any) {
            // Handle in middleware
          },
        },
      }
    )
    
    return supabase
  },

  // Check auth in middleware
  checkAuth: async (request: Request) => {
    const supabase = middlewareAuth.createMiddlewareClient(request)
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
} 