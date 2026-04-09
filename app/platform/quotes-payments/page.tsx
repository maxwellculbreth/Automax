import Link from 'next/link'
import { ArrowRight, Check, FileText, Clock, DollarSign, Send, ThumbsUp, Repeat } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function QuoteMock() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-blue-600/12 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Quote Q-2025-048</div>
        </div>

        <div className="p-4">
          {/* Quote header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[15px] font-bold text-white">Sarah M.</div>
              <div className="text-[12px] text-white/40">House Wash + Driveway · 3,200 sqft</div>
              <div className="text-[11px] text-white/30 mt-0.5">Sent April 8, 2025</div>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1">
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-[11.5px] font-bold text-emerald-400">Approved</span>
            </div>
          </div>

          {/* Line items */}
          <div className="rounded-xl border border-white/8 bg-[#0a1525] overflow-hidden mb-3">
            <div className="grid grid-cols-[1fr_auto] text-[10px] font-semibold uppercase tracking-wider text-white/25 px-3 py-2 border-b border-white/6">
              <span>Service</span><span>Amount</span>
            </div>
            {[
              { service: 'Exterior House Wash', note: '3,200 sqft · soft wash', amount: '$380' },
              { service: 'Driveway Pressure Wash', note: '~800 sqft', amount: '$120' },
              { service: 'Deck Treatment', note: 'Cedar, ~400 sqft', amount: '$95' },
            ].map(item => (
              <div key={item.service} className="grid grid-cols-[1fr_auto] px-3 py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-[12px] font-semibold text-white/80">{item.service}</div>
                  <div className="text-[10.5px] text-white/35">{item.note}</div>
                </div>
                <div className="text-[13px] font-bold text-white self-center">{item.amount}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="rounded-xl border border-white/8 bg-[#0a1525] px-3 py-2.5 mb-3">
            <div className="flex justify-between text-[12px] text-white/40 mb-1.5">
              <span>Subtotal</span><span>$595</span>
            </div>
            <div className="flex justify-between text-[12px] text-white/40 mb-2.5">
              <span>Tax (8%)</span><span>$47.60</span>
            </div>
            <div className="flex justify-between border-t border-white/8 pt-2">
              <span className="text-[13px] font-bold text-white">Total</span>
              <span className="text-[16px] font-bold text-white">$642.60</span>
            </div>
          </div>

          {/* Deposit */}
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-3 py-2.5">
            <div>
              <div className="text-[11.5px] font-semibold text-emerald-400">Deposit Collected</div>
              <div className="text-[11px] text-white/35">$200 · via card on file</div>
            </div>
            <div className="text-[15px] font-bold text-emerald-400">$200</div>
          </div>
        </div>
      </div>

      {/* Floating — Opened notification */}
      <div className="absolute -top-5 -right-3 sm:-right-6 w-[175px] rounded-xl border border-white/12 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span className="text-[11px] font-semibold text-white">Quote Opened</span>
        </div>
        <div className="text-[10.5px] text-white/40">Sarah M. viewed quote</div>
        <div className="text-[10px] text-white/25 mt-0.5">just now · 2 min read</div>
      </div>

      {/* Floating — Quote list pill */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 w-[170px] rounded-xl border border-white/12 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-[10px] text-white/30 mb-1.5">This week</div>
        <div className="text-[22px] font-bold text-white">$4,820</div>
        <div className="text-[10.5px] text-white/40 mt-0.5">in quotes sent</div>
        <div className="text-[10px] text-emerald-400 font-medium mt-0.5">↑ 62% close rate</div>
      </div>
    </div>
  )
}

export default function QuotesPaymentsPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-5"><SectionLabel>Platform · Quotes & Payments</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Send quotes fast.<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Get paid faster.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Create and send professional, line-item quotes in under 60 seconds. Customers approve with one tap. Deposits collect automatically. Follow-ups send themselves.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Professional quotes in under 60s', 'Auto follow-ups on unopened quotes', 'Deposit collection built-in'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <QuoteMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '< 60s', label: 'Time to send a quote' },
          { value: '62%', label: 'Avg. close rate' },
          { value: '3×', label: 'Faster than competitors' },
          { value: '$8M+', label: 'Quotes sent monthly' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you get</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Professional quotes that close more business.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: FileText, color: 'bg-blue-500/15 text-blue-400', title: 'Line-Item Quotes', desc: 'Build detailed, professional quotes with line items, quantities, notes, and optional add-ons. Customers see exactly what they\'re getting.' },
                { icon: Clock, color: 'bg-violet-500/15 text-violet-400', title: 'Send in Under 60 Seconds', desc: 'Use saved service templates or let AI draft a quote from the conversation. Review and send — no manual data entry.' },
                { icon: Send, color: 'bg-amber-500/15 text-amber-400', title: 'Text & Email Delivery', desc: 'Quotes are delivered via text with a clean preview link. Customers open, review, and approve on their phone without creating an account.' },
                { icon: ThumbsUp, color: 'bg-emerald-500/15 text-emerald-400', title: 'One-Tap Approval', desc: 'Customer taps "Approve" — you get notified instantly. Optionally require a deposit signature before the job is confirmed.' },
                { icon: DollarSign, color: 'bg-teal-500/15 text-teal-400', title: 'Deposit Collection', desc: 'Request a deposit automatically when a quote is approved. Card on file, no friction. Protects your schedule and cash flow.' },
                { icon: Repeat, color: 'bg-pink-500/15 text-pink-400', title: 'Auto Follow-Up Sequences', desc: 'Quote opened but not approved? Automax follows up at 24h, 48h, and 7 days. Sequences stop the moment they respond.' },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-blue-500/25 hover:bg-blue-500/[0.04] transition-all duration-200">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.color} mb-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-[13px] text-white/45 leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Workflow ──────────────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>The quote workflow</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[36px] font-bold text-white tracking-tight">
                From inquiry to deposit in minutes.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Start from a lead', desc: 'Open the lead conversation and tap "Create Quote." Job details auto-fill from the conversation.' },
                { num: '02', title: 'Build your quote', desc: 'Add line items, adjust pricing, attach photos if needed. Takes under 60 seconds with templates.' },
                { num: '03', title: 'Send via text', desc: 'Customer gets a text with a clean preview link. No app, no login — just a beautiful quote on their phone.' },
                { num: '04', title: 'Approved + paid', desc: 'Customer approves with one tap. Deposit collects automatically. Job moves to Scheduled.' },
              ].map(s => (
                <div key={s.num}>
                  <div className="text-[11px] font-bold text-blue-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Close more jobs.<br /><span className="text-blue-400">With less effort.</span></>}
          sub="Start your free trial and send your first professional quote in under 10 minutes."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
