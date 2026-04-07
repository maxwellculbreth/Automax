'use client'

import { createClient } from '@/lib/supabase/client'
import { createCompanyForUser } from '@/lib/data-service'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Check, ArrowRight } from 'lucide-react'

// ─── Branding panel (desktop left column) ────────────────────────────────────

const FEATURES = [
  "Respond to leads faster",
  "Turn jobs into 5-star reviews",
  "Stay organized with a simple pipeline",
]

function BrandingPanel() {
  return (
    <div className="relative hidden lg:flex flex-col overflow-hidden bg-[#080f1e] px-10 py-12 xl:px-14">
      {/* Top accent line */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      {/* Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[480px] w-[480px] rounded-full bg-blue-600/25 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-56 w-56 rounded-full bg-blue-500/10 blur-[70px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-700/20 blur-[90px]" />
      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* Wordmark */}
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

      {/* Hero copy — pushed to bottom half */}
      <div className="relative z-10 mt-auto">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400/70">
          Built for service businesses
        </p>
        <h2 className="text-[33px] font-bold leading-[1.14] tracking-tight text-white xl:text-[37px]">
          Run your business.<br />
          We&apos;ll handle the rest.
        </h2>
        <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/50">
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

      <p className="relative z-10 mt-10 text-[11px] text-white/25">
        Used by growing service businesses
      </p>
    </div>
  )
}

// ─── Mobile branding strip ────────────────────────────────────────────────────

function MobileHeader() {
  return (
    <div className="lg:hidden bg-[#080f1e] px-6 py-7 sm:px-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br from-blue-600 to-indigo-700">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="select-none text-[14px] tracking-tight">
          <span className="font-semibold text-white">Auto</span>
          <span className="font-medium text-white/40">max</span>
        </span>
      </div>
      <p className="text-[18px] font-bold leading-snug text-white">
        Run your business.<br />
        We&apos;ll handle the rest.
      </p>
      <p className="mt-1.5 text-[13px] text-white/50">
        Manage leads, follow up automatically, and grow.
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignUpPage() {
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName,     setCompanyName]     = useState('')
  const [error,           setError]           = useState<string | null>(null)
  const [isLoading,       setIsLoading]       = useState(false)
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

      if (data.user) {
        await createCompanyForUser(data.user.id, companyName || 'My Business')
      }

      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[500px_1fr] xl:grid-cols-[560px_1fr]">

      {/* Left — desktop branding panel */}
      <BrandingPanel />

      {/* Right — form column */}
      <div className="flex flex-col">

        {/* Mobile branding strip */}
        <MobileHeader />

        {/* Form — vertically centered in remaining space */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-[400px]">

            {/* Card */}
            <div className="rounded-2xl border border-border/60 bg-card px-7 py-8 shadow-sm">

              {/* Header */}
              <div className="mb-7">
                <h1 className="text-[28px] font-bold tracking-tight text-foreground">
                  Create your account
                </h1>
                <p className="mt-1.5 text-[14px] text-muted-foreground">
                  Start using Automax today
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignUp} className="space-y-5">

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-[13px] font-medium">Business Name</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="My Business"
                    autoComplete="organization"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="h-10 text-[13px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-10 text-[13px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[13px] font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-10 text-[13px]"
                  />
                  <p className="text-[11px] text-muted-foreground/60">At least 6 characters</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-[13px] font-medium">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="h-10 text-[13px]"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3.5 py-2.5">
                    <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-[11px] text-[14px] font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
                    : <>Create account <ArrowRight className="h-4 w-4" /></>
                  }
                </button>

              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-[13px] text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Log in
                </Link>
              </p>

              {/* Terms note */}
              <p className="mt-4 text-center text-[11px] text-muted-foreground/40">
                By creating an account you agree to our terms of service.
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
