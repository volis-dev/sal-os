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

  // Get current session - simplified and more reliable
  let session = null
  try {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    session = currentSession
  } catch (error) {
    console.error('Middleware session fetch error:', error)
    // Continue with null session - be permissive on errors
  }

  // Get current pathname
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  console.log(`🛡️  Middleware: ${pathname} | Session: ${session?.user?.email || 'none'} | Public: ${isPublicRoute}`)

  // CRITICAL: Only redirect authenticated users away from auth pages
  // Do NOT redirect unauthenticated users TO auth pages to avoid loops
  if (session && isAuthRoute) {
    // User is authenticated and trying to access login/signup
    console.log('✅ Authenticated user accessing auth route, redirecting to home')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // CRITICAL: Only redirect unauthenticated users from protected routes
  // Be very conservative here to avoid middleware loops
  if (!session && !isPublicRoute) {
    // User is not authenticated and accessing protected route
    console.log('❌ Unauthenticated user accessing protected route, redirecting to login')
    const loginUrl = new URL('/login', request.url)
    if (pathname !== '/') { // Only set redirect param if not home page
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Email confirmation check - be more lenient to avoid loops
  if (session && !session.user.email_confirmed_at && !isPublicRoute) {
    // Only redirect if this is clearly not a fresh auth flow
    const referer = request.headers.get('referer')
    const isFromAuthFlow = referer && (referer.includes('/login') || referer.includes('/signup'))
    
    if (!isFromAuthFlow) {
      console.log('📧 Email not confirmed, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('message', 'email-not-confirmed')
      return NextResponse.redirect(loginUrl)
    }
  }

  console.log('✅ Middleware allowing request')
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
