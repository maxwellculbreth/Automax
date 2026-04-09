import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const BLUE_BTN = [
  'inline-flex items-center gap-2 rounded-xl',
  'bg-gradient-to-b from-blue-500 to-blue-600',
  'px-6 py-3 text-[14px] font-semibold text-white',
  'shadow-[0_2px_14px_rgba(59,130,246,0.40)]',
  'hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_24px_rgba(59,130,246,0.55)] hover:-translate-y-px',
  'active:translate-y-0 transition-all duration-150',
].join(' ')

export const GHOST_BTN = [
  'inline-flex items-center gap-2 rounded-xl',
  'border border-white/15 px-6 py-3 text-[14px] font-semibold text-white/80',
  'hover:text-white hover:border-white/30 hover:bg-white/5',
  'transition-all duration-150',
].join(' ')

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
      <span className="text-[12px] font-semibold text-blue-300 tracking-wide">{children}</span>
    </div>
  )
}

export function PageCTA({ headline, sub }: { headline?: React.ReactNode; sub?: string }) {
  return (
    <section className="relative bg-[#080f1e] overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-blue-600/15 blur-[100px]" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <h2 className="text-[36px] sm:text-[44px] font-bold text-white tracking-tight leading-tight mb-5">
          {headline ?? (
            <>Ready to see it<br /><span className="text-blue-400">in action?</span></>
          )}
        </h2>
        <p className="text-[16px] text-white/50 mb-8 max-w-lg mx-auto leading-relaxed">
          {sub ?? 'Start your free trial today. No credit card required.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/auth/sign-up" className={`${BLUE_BTN} !text-[15px] !px-7 !py-3.5`}>
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/pricing" className={`${GHOST_BTN} !text-[15px] !px-7 !py-3.5`}>
            View Pricing
          </Link>
        </div>
        <p className="mt-5 text-[12px] text-white/25">No credit card required · Free 14-day trial · Cancel anytime</p>
      </div>
    </section>
  )
}

export function StatStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section className="bg-[#0a1525] border-y border-white/8 py-7">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-[28px] font-bold text-white tracking-tight">{s.value}</div>
              <div className="text-[12px] text-white/40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
