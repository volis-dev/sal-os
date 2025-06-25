import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup']

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

  // Get current session - SIMPLE CHECK
  let session = null
  try {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    session = currentSession
  } catch (error) {
    console.error('Middleware session error:', error)
    // Continue with null session
  }

  const { pathname } = request.nextUrl
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  console.log(`Middleware: ${pathname} | Authenticated: ${!!session}`)

  // SIMPLE RULE 1: Authenticated users cannot access auth pages
  if (session && isAuthRoute) {
    console.log('Authenticated user on auth route -> redirect to home')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // SIMPLE RULE 2: Unauthenticated users cannot access protected pages
  if (!session && !isPublicRoute) {
    console.log('Unauthenticated user on protected route -> redirect to login')
    const loginUrl = new URL('/login', request.url)
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // SIMPLE RULE 3: Email confirmation check (optional)
  if (session && !session.user.email_confirmed_at && !isPublicRoute) {
    console.log('Email not confirmed -> redirect to login')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('message', 'email-not-confirmed')
    return NextResponse.redirect(loginUrl)
  }

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
