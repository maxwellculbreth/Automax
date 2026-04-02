'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Check, ArrowRight } from 'lucide-react'

// ── Shared left branding panel ─────────────────────────────────────────────────

const FEATURES = [
  "Respond to leads faster",
  "Turn jobs into 5-star reviews",
  "Stay organized with a simple pipeline",
]

function BrandingPanel() {
  return (
    <div className="relative flex flex-col overflow-hidden bg-[#080f1e] px-10 py-12 xl:px-14">
      {/* Background glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-indigo-700/15 blur-[80px]" />
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-600 to-indigo-700">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="select-none text-[15px] tracking-tight">
          <span className="font-semibold text-white">Auto</span>
          <span className="font-medium text-white/40">max</span>
        </span>
      </div>

      {/* Hero */}
      <div className="relative z-10 mt-auto pt-16">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400/80">
          Built for service businesses
        </p>
        <h2 className="text-[32px] font-bold leading-[1.15] tracking-tight text-white xl:text-[36px]">
          Run your business.<br />
          We&apos;ll handle the rest.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-white/50">
          Automax helps you manage leads, follow up automatically, and grow your business — all in one place.
        </p>

        <ul className="mt-8 space-y-3.5">
          {FEATURES.map(f => (
            <li key={f} className="flex items-center gap-3">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/20 ring-1 ring-blue-500/30">
                <Check className="h-3 w-3 text-blue-400" />
              </span>
              <span className="text-[14px] text-white/70">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust line */}
      <p className="relative z-10 mt-12 text-[11px] text-white/25">
        Used by growing service businesses
      </p>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[500px_1fr] xl:grid-cols-[560px_1fr]">

      {/* Left — branding panel (desktop only) */}
      <BrandingPanel />

      {/* Right — form */}
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">

        {/* Mobile wordmark */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-gradient-to-br from-blue-600 to-indigo-700">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="select-none text-[15px] tracking-tight">
            <span className="font-semibold text-foreground">Auto</span>
            <span className="font-medium text-foreground/40">max</span>
          </span>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Form header */}
          <div className="mb-8">
            <h1 className="text-[26px] font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">Log in to your Automax account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 text-[13px]"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-medium text-foreground">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="h-10 text-[13px]"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2.5">
                <span className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-500">✕</span>
                <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              ) : (
                <>Log in <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create account
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
