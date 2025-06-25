"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireEmailConfirmation?: boolean
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireEmailConfirmation = true 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, isEmailConfirmed } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push('/login')
        return
      }

      if (requireEmailConfirmation && isAuthenticated && !isEmailConfirmed) {
        router.push('/login?message=email-not-confirmed')
        return
      }
    }
  }, [isLoading, isAuthenticated, isEmailConfirmed, requireAuth, requireEmailConfirmation, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if auth requirements not met
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requireEmailConfirmation && isAuthenticated && !isEmailConfirmed) {
    return null
  }

  return <>{children}</>
} 