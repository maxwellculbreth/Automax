'use client'

import { createClient } from '@/lib/supabase/client'
import { createCompanyForUser } from '@/lib/data-service'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      
      // Create company for the new user
      if (data.user) {
        await createCompanyForUser(data.user.id, companyName || "My Business")
      }
      
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          {/* Branding */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Automa</h1>
            <p className="text-sm font-medium text-slate-500">Automation for Service Businesses</p>
          </div>
          
          {/* Auth Card */}
          <Card className="shadow-lg shadow-slate-200/50 border-slate-200/80 rounded-2xl">
            <CardHeader className="space-y-1.5 px-8 pt-8 pb-2">
              <CardTitle className="text-2xl font-semibold text-slate-900">Get started</CardTitle>
              <CardDescription className="text-slate-500">
                Create your account and start automating
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-4">
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="company" className="text-slate-700 font-medium">Business Name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="My Business"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="h-11 px-4 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 px-4 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 px-4 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password" className="text-slate-700 font-medium">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 px-4 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mt-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </div>
                <div className="mt-6 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline underline-offset-4 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Tagline */}
          <p className="text-center text-sm text-slate-400">
            Turn leads into booked jobs — automatically
          </p>
        </div>
      </div>
    </div>
  )
}
