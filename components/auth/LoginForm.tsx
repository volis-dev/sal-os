"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, isLoading, isAuthenticated, session } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loginTriggered, setLoginTriggered] = useState(false)

  // Handle URL messages
  useEffect(() => {
    const messageParam = searchParams.get('message')
    if (messageParam) {
      switch (messageParam) {
        case 'check-email':
          setMessage('Please check your email for a confirmation link.')
          break
        case 'email-not-confirmed':
          setMessage('Please confirm your email address before signing in.')
          break
        case 'password-reset':
          setMessage('Password reset link sent. Please check your email.')
          break
        default:
          setMessage(messageParam)
      }
    }
  }, [searchParams])

  // EVENT-DRIVEN REDIRECT - FIXED STATE MANAGEMENT
  useEffect(() => {
    if (loginTriggered && isAuthenticated && session) {
      console.log('Auth state confirmed, executing redirect')
      setLoginTriggered(false) // Reset flag but keep isSubmitting true
      
      const redirectPath = searchParams.get('redirect') || '/'
      console.log('Redirecting to:', redirectPath)
      
      try {
        router.push(redirectPath)
        // Don't reset isSubmitting here - let the navigation complete
      } catch (err) {
        console.error('Navigation failed:', err)
        setError('Navigation failed. Please try again.')
        setIsSubmitting(false) // Only reset on navigation failure
      }
    }
  }, [loginTriggered, isAuthenticated, session, router, searchParams])

  // SIMPLE LOGIN HANDLER
  const handleSubmit = async () => {
    console.log('🔥 LOGIN BUTTON CLICKED')
    console.log('Form data:', { email: formData.email, hasPassword: !!formData.password })
    
    setError(null)
    setIsSubmitting(true)

    try {
      console.log('🔐 Calling signIn...')
      const { error } = await signIn(formData.email, formData.password)
      
      if (error) {
        console.log('❌ Login failed:', error)
        setError(error)
        setIsSubmitting(false)
        setLoginTriggered(false)
      } else {
        console.log('✅ Login successful, setting trigger...')
        setLoginTriggered(true)
        // Keep isSubmitting true until redirect completes
      }
    } catch (err) {
      console.error('💥 Login exception:', err)
      setError('An unexpected error occurred')
      setIsSubmitting(false)
      setLoginTriggered(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  // DEBUG INFO
  console.log('🔍 LoginForm State:', {
    isSubmitting,
    loginTriggered,
    isAuthenticated,
    hasSession: !!session,
    isLoading
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to SAL OS
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loginTriggered ? 'Redirecting...' : 'Signing in...'}
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <div className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  )
}
