'use client'

import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('')
  const [error,     setError]     = useState<string | null>(null)
  const [sent,      setSent]      = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Supabase will append the recovery token and redirect here after the
        // user clicks the link in their email. Build this page later if needed;
        // for now Supabase's default hosted page handles the password update.
        redirectTo: `${window.location.origin}/auth/login`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-14">
      <div className="w-full max-w-[400px]">

        {/* Wordmark */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-600 to-indigo-700">
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="select-none text-[15px] tracking-tight">
            <span className="font-bold text-foreground">Auto</span>
            <span className="font-light text-blue-400/80">max</span>
          </span>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card px-7 py-8 shadow-[0_4px_32px_-4px_rgba(0,0,0,0.08),0_1px_6px_-1px_rgba(0,0,0,0.04)]">

          {sent ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold tracking-tight text-foreground">Check your email</h1>
                <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
                  We sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                  Check your inbox and follow the instructions.
                </p>
              </div>
              <p className="text-[12px] text-muted-foreground/60">
                Didn&apos;t get it? Check your spam folder, or{' '}
                <button
                  onClick={() => { setSent(false); setError(null) }}
                  className="text-blue-600 hover:text-blue-500 underline underline-offset-2 transition-colors"
                >
                  try again
                </button>
                .
              </p>
              <Link
                href="/auth/login"
                className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="mb-7">
                <h1 className="text-[26px] font-bold tracking-tight text-foreground">Reset password</h1>
                <p className="mt-1.5 text-[14px] text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                    : <>Send reset link <ArrowRight className="h-4 w-4" /></>
                  }
                </button>
              </form>

              <p className="mt-6 text-center text-[13px] text-muted-foreground">
                Remember it?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
