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

// Separate component that uses useSearchParams
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
  const [redirecting, setRedirecting] = useState(false)

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

  // Handle redirect when authenticated - SIMPLIFIED LOGIC
  useEffect(() => {
    if (isAuthenticated && session && !isLoading && !redirecting) {
      console.log('User is authenticated, executing redirect...')
      setRedirecting(true)
      
      const redirectPath = searchParams.get('redirect') || '/'
      
      // Use window.location.replace for immediate redirect
      window.location.replace(redirectPath)
    }
  }, [isAuthenticated, session, isLoading, redirecting, searchParams])

  const handleSubmit = async () => {
    if (redirecting) return // Prevent multiple submissions during redirect
    
    setError(null)
    setIsSubmitting(true)

    try {
      console.log('Starting login process...')
      const result = await signIn(formData.email, formData.password)
      const { error } = result
      
      if (error) {
        console.log('Login failed:', error)
        setError(error)
        setIsSubmitting(false)
      } else {
        console.log('Login successful, waiting for auth state change...')
        // Don't set isSubmitting to false - let the redirect handle it
      }
    } catch (err) {
      console.error('Login error caught:', err)
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null) // Clear error when user starts typing
  }

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
                  disabled={isSubmitting || redirecting}
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
                  disabled={isSubmitting || redirecting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  disabled={isSubmitting || redirecting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting || isLoading || redirecting}
            >
              {redirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Forgot your password?
            </Link>
            
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

// Main component wrapped in Suspense
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
