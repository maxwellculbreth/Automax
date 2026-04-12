import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { PublicNav } from '@/components/public/public-nav'
import { PublicFooter } from '@/components/public/public-footer'
import { WaitlistForm } from './waitlist-form'

export const metadata: Metadata = {
  title: 'Join the Waitlist — Automax',
  description:
    'Request early access to Automax — the AI operating system for service businesses. Be among the first when we launch.',
}

const PERKS = [
  'Early access pricing — locked in before public launch',
  'Priority onboarding and hands-on setup',
  'Direct input on the product roadmap',
]

export default function WaitlistPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen flex flex-col">
        <PublicNav />

        {/* ── Main content ──────────────────────────────────────────────── */}
        <main className="relative flex-1 overflow-hidden pt-16">
          {/* Background */}
          <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-blue-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/10 blur-[120px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />

          <div className="relative mx-auto max-w-3xl px-5 sm:px-6 py-20 sm:py-24">

            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-3.5 py-1.5 mb-6">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="text-[12px] font-semibold text-blue-300 tracking-wide">Early Access</span>
              </div>

              <h1 className="text-[36px] sm:text-[48px] font-bold text-white tracking-tight leading-[1.08] mb-4">
                Get in early.<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Shape what we build.
                </span>
              </h1>

              <p className="text-[16px] text-white/45 leading-relaxed max-w-lg mx-auto">
                Automax is in active development. We&apos;re onboarding a small number of early access
                partners — leave your info and we&apos;ll reach out first.
              </p>
            </div>

            {/* Perks */}
            <ul className="flex flex-col gap-2 mb-10 max-w-md mx-auto">
              {PERKS.map(perk => (
                <li key={perk} className="flex items-start gap-3 text-[14px] text-white/50">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/15 ring-1 ring-blue-500/25">
                    <Check className="h-3 w-3 text-blue-400" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            {/* Form card */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8 shadow-[0_4px_32px_rgba(0,0,0,0.3)]">
              <WaitlistForm source="waitlist-page" />
            </div>

            {/* Curiosity link */}
            <p className="text-center mt-7 text-[12px] text-white/25">
              Curious what we&apos;re building first?{' '}
              <Link href="/features" className="text-blue-400/60 hover:text-blue-400 transition-colors underline underline-offset-2">
                See what&apos;s coming
              </Link>
            </p>
          </div>
        </main>

        <PublicFooter />
      </div>
    </MarketingShell>
  )
}
