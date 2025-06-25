import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password']

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client for middleware
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get current session with retry logic for race conditions
  let session = null
  try {
    const { data: { session: initialSession } } = await supabase.auth.getSession()
    session = initialSession
    
    // If no session found but we have auth cookies, try once more
    // This helps with race conditions where cookies exist but session isn't immediately available
    if (!session) {
      const authCookie = request.cookies.get('sb-rrlahnmnyuinoymrfufl-auth-token')
      if (authCookie) {
        console.log('🔄 Auth cookie found, retrying session fetch...')
        // Small delay to allow session to propagate
        await new Promise(resolve => setTimeout(resolve, 100))
        const { data: { session: retrySession } } = await supabase.auth.getSession()
        session = retrySession
      }
    }
  } catch (error) {
    console.error('Middleware session fetch error:', error)
    // Continue with null session
  }

  // Get current pathname
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  console.log(`🛡️  Middleware: ${pathname} | Session: ${session?.user?.email || 'none'} | Public: ${isPublicRoute}`)

  // CRITICAL: Be more lenient with auth route redirects to avoid middleware fights
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (session && isAuthRoute) {
    console.log('✅ Authenticated user on auth route, redirecting to dashboard')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!session && !isPublicRoute) {
    console.log('❌ Unauthenticated user on protected route, redirecting to login')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated but email not confirmed, redirect to login with message
  // BUT be more permissive during the auth flow to avoid race conditions
  if (session && !session.user.email_confirmed_at && !isPublicRoute) {
    // Add a small exception: if this is likely a fresh auth flow, be more lenient
    const isLikelyFreshAuth = request.headers.get('referer')?.includes('/login')
    
    if (!isLikelyFreshAuth) {
      console.log('📧 Email not confirmed, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('message', 'email-not-confirmed')
      return NextResponse.redirect(loginUrl)
    }
  }

  console.log('✅ Middleware allowing request to proceed')
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
