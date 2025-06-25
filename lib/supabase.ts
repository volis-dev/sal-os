import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// SINGLE CONSISTENT SUPABASE CLIENT - NO COMPLEX CONFIGS
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
})

// Simple auth utilities - NO COMPLEX LOGIC
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session?.user
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}
