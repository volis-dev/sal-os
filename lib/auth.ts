// DEPRECATED - UNUSED SERVER-SIDE AUTH UTILITIES
// This file has been deprecated in favor of simplified middleware-only auth
// All server-side auth is now handled directly in middleware.ts

/*
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

// DEPRECATED - All auth logic moved to middleware
export const serverAuth = {
  getUser: async () => null,
  getSession: async () => null,
  requireAuth: async () => null,
  requireEmailConfirmation: async () => null,
  isAuthenticated: async (): Promise<boolean> => false,
  isEmailConfirmed: async (): Promise<boolean> => false
}

export const middlewareAuth = {
  createMiddlewareClient: () => null,
  checkAuth: async () => null
}
*/

// THIS FILE IS DEPRECATED - DO NOT USE
export const DEPRECATED_FILE = true
