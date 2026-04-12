import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PublicNav } from '@/components/public/public-nav'
import { PublicFooter } from '@/components/public/public-footer'

export const metadata: Metadata = {
  title: "You're on the list — Automax",
  description:
    "Thanks for joining the Automax early access waitlist. We'll reach out when we're ready to onboard the first partners.",
}

export default function WaitlistSuccessPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen flex flex-col">
        <PublicNav />

        {/* ── Success content ───────────────────────────────────────────── */}
        <main className="relative flex-1 flex items-center justify-center overflow-hidden pt-16">
          {/* Glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-blue-600/10 blur-[100px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />

          <div className="relative mx-auto max-w-lg px-5 sm:px-6 py-20 text-center">

            {/* Check icon */}
            <div className="mx-auto mb-10 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-600/15 ring-1 ring-blue-500/25 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-blue-500 to-blue-600 shadow-[0_4px_20px_rgba(59,130,246,0.50)]">
                <Check className="h-7 w-7 text-white stroke-[2.5]" />
              </div>
            </div>

            {/* Copy */}
            <h1 className="text-[42px] sm:text-[52px] font-bold text-white tracking-tight leading-[1.06] mb-4">
              You&apos;re on the list.
            </h1>

            <p className="text-[17px] text-white/50 leading-relaxed mb-3">
              Thanks for joining the Automax early access waitlist.
            </p>

            <p className="text-[15px] text-white/30 leading-relaxed mb-12 max-w-sm mx-auto">
              We&apos;ll reach out personally when we&apos;re ready to onboard early partners — you&apos;ll be among the first to know.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/early-access"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-[14px] font-semibold text-white/60 hover:text-white hover:border-white/22 hover:bg-white/[0.04] transition-all duration-150"
              >
                Back to home
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.40)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_24px_rgba(59,130,246,0.55)] hover:-translate-y-px active:translate-y-0 transition-all duration-150"
              >
                See what&apos;s coming <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </main>

        <PublicFooter />
      </div>
    </MarketingShell>
  )
}
