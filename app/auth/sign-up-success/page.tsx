import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'

export default function SignUpSuccessPage() {
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
          <div className="flex flex-col items-center text-center gap-4">

            {/* Success icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>

            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-foreground">
                Check your email
              </h1>
              <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
                We sent you a confirmation link. Click it to activate your
                account and finish setting up Automax.
              </p>
            </div>

            <p className="text-[12px] text-muted-foreground/60">
              Didn&apos;t get it? Check your spam folder, or{' '}
              <Link
                href="/auth/sign-up"
                className="text-blue-600 hover:text-blue-500 underline underline-offset-2 transition-colors"
              >
                try again
              </Link>
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
        </div>

      </div>
    </div>
  )
}
