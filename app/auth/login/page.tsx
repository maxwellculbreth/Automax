'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Check, ArrowRight } from 'lucide-react'

// ─── Branding panel (desktop left column) ────────────────────────────────────

const FEATURES = [
  "AI qualifies and responds to leads instantly",
  "Automated follow-ups that close more jobs",
  "Intelligent scheduling, zero manual effort",
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
          <span className="font-bold text-white">Auto</span>
          <span className="font-light text-blue-400/80">max</span>
        </span>
      </div>

      {/* Hero copy — pushed to bottom half */}
      <div className="relative z-10 mt-auto">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-400/70">
          AI-powered · Built for service businesses
        </p>
        <h2 className="text-[33px] font-bold leading-[1.14] tracking-tight text-white xl:text-[37px]">
          Your AI runs<br />
          the business.<br />
          You run the decisions.
        </h2>
        <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/50">
          Automax uses AI to qualify leads, automate follow-ups, and fill your schedule — so you focus on the work.
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
        Automate the work. Keep the profit.
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
          <span className="font-bold text-white">Auto</span>
          <span className="font-light text-blue-400/80">max</span>
        </span>
      </div>
      <p className="text-[18px] font-bold leading-snug text-white">
        Your AI runs the business.<br />
        You run the decisions.
      </p>
      <p className="mt-1.5 text-[13px] text-white/50">
        AI-powered lead automation and scheduling for service businesses.
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Auth logic — unchanged
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
            <div className="rounded-2xl border border-border/50 bg-card px-7 py-8 shadow-[0_4px_32px_-4px_rgba(0,0,0,0.08),0_1px_6px_-1px_rgba(0,0,0,0.04)]">

              {/* Header */}
              <div className="mb-7">
                <h1 className="text-[26px] font-bold tracking-tight text-foreground">
                  Welcome back
                </h1>
                <p className="mt-1.5 text-[14px] text-muted-foreground">
                  Your AI is already working. Step back in.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">

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
                    className="h-11 text-[13px] rounded-xl border-border/60 bg-muted/40 focus:bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[13px] font-medium">Password</Label>
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
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-11 text-[13px] rounded-xl border-border/60 bg-muted/40 focus:bg-background focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-3.5 py-2.5">
                    <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-[11px] text-[14px] font-semibold text-white shadow-[0_2px_10px_rgba(59,130,246,0.30)] hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_4px_18px_rgba(59,130,246,0.40)] hover:-translate-y-px active:translate-y-0 active:shadow-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                    : <>Sign in <ArrowRight className="h-4 w-4" /></>
                  }
                </button>

              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-[13px] text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/sign-up" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Create account
                </Link>
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
