import Link from 'next/link'
import { ArrowRight, Check, MousePointerClick, Inbox, BarChart2, Clock, Zap, TrendingUp } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function LeadCaptureMock() {
  const sources = [
    { label: 'Website Form',    pct: 42, w: '42%',  color: 'bg-blue-500' },
    { label: 'Google Business', pct: 28, w: '28%',  color: 'bg-violet-500' },
    { label: 'Referral',        pct: 18, w: '18%',  color: 'bg-emerald-500' },
    { label: 'Other',           pct: 12, w: '12%',  color: 'bg-white/20' },
  ]

  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-blue-600/12 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Lead Sources</div>
          <div className="ml-auto rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">5 new today</div>
        </div>

        <div className="p-4">
          {/* Funnel stats row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Visitors',  value: '340', arrow: false },
              { label: 'Inquiries', value: '48',  arrow: true },
              { label: 'Qualified', value: '31',  arrow: true },
              { label: 'Booked',    value: '19',  arrow: true },
            ].map((s, i) => (
              <div key={s.label} className="relative">
                {i > 0 && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-[10px] text-white/20">›</div>
                )}
                <div className="rounded-xl border border-white/8 bg-[#0a1525] px-2.5 py-2 text-center">
                  <div className="text-[16px] font-bold text-white">{s.value}</div>
                  <div className="text-[9.5px] text-white/30">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversion rate */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/8 px-3 py-2.5 mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-blue-300/70">Visitor → Booked Rate</div>
              <div className="text-[20px] font-bold text-blue-400">39%</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/30">Industry avg</div>
              <div className="text-[20px] font-bold text-white/30">12%</div>
            </div>
          </div>

          {/* Lead sources */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2.5">Lead Sources</div>
            <div className="space-y-2.5">
              {sources.map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="text-[11.5px] text-white/55 w-28 flex-shrink-0">{s.label}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-white/8">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: s.w }} />
                  </div>
                  <div className="text-[11.5px] font-semibold text-white/60 w-8 text-right">{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating — new lead */}
      <div className="absolute -top-5 -right-3 sm:-right-5 w-[176px] rounded-xl border border-blue-500/25 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MousePointerClick className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[11px] font-semibold text-white">Form Submitted</span>
        </div>
        <div className="text-[11.5px] font-semibold text-white">Ryan K.</div>
        <div className="text-[10.5px] text-white/40 mt-0.5">House wash · just now</div>
        <div className="text-[10px] text-blue-400 font-medium mt-0.5">→ Added to inbox</div>
      </div>

      {/* Floating — response */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 w-[162px] rounded-xl border border-emerald-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-[10px] text-white/30 mb-0.5">AI Response Time</div>
        <div className="text-[20px] font-bold text-white">&lt; 60s</div>
        <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">Every lead, always</div>
      </div>
    </div>
  )
}

export default function LeadCapturePage() {
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
                <div className="mb-5"><SectionLabel>Growth · Lead Capture</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Turn website visitors<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    into booked jobs.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax captures leads from every channel — your website, Google Business Profile, and more — routing them directly to your inbox for an AI-powered instant response.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['All sources in one inbox', 'AI responds in under 60s', 'Zero missed leads'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <LeadCaptureMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '39%', label: 'Visitor-to-booked rate' },
          { value: '4×',  label: 'More leads captured vs manual' },
          { value: '0',   label: 'Leads slipping through the cracks' },
          { value: '< 60s', label: 'AI response to every form fill' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you get</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Every lead. Every channel. One place.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: MousePointerClick, color: 'bg-blue-500/15 text-blue-400', title: 'Website Lead Forms', desc: 'Embeddable forms on your site or Automax-hosted landing pages route directly into your inbox — no third-party tools, no setup headaches.' },
                { icon: Inbox, color: 'bg-violet-500/15 text-violet-400', title: 'Unified Lead Inbox', desc: 'Leads from your website, Google, texts, and referrals all arrive in one clean inbox. No toggling between apps or missing messages.' },
                { icon: Zap, color: 'bg-amber-500/15 text-amber-400', title: 'Instant AI Response', desc: 'The moment a lead submits a form, AI responds in under 60 seconds — qualifying the job, asking the right questions, keeping them engaged.' },
                { icon: BarChart2, color: 'bg-emerald-500/15 text-emerald-400', title: 'Source Attribution', desc: 'Know exactly which channels drive the most leads — website, Google Business, referrals — so you invest in what actually works.' },
                { icon: Clock, color: 'bg-teal-500/15 text-teal-400', title: 'Response Time Tracking', desc: 'See your average response time per channel and day. Businesses that respond in under 5 minutes close 78% more leads.' },
                { icon: TrendingUp, color: 'bg-pink-500/15 text-pink-400', title: 'Conversion Funnel', desc: 'Track visitors → inquiries → qualified → booked. See exactly where leads drop off and optimize your capture funnel over time.' },
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

        {/* ── Funnel breakdown ──────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>The capture funnel</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[36px] font-bold text-white tracking-tight">
                From first click to booked job.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Visitor lands', desc: 'Someone searches "pressure washing near me." Your website or Google profile appears. They click.' },
                { num: '02', title: 'Form is submitted', desc: 'They fill out your simple quote request form. It routes instantly to your Automax inbox.' },
                { num: '03', title: 'AI responds in 60s', desc: 'Before you even see the notification, AI has responded, qualified the job, and asked for details.' },
                { num: '04', title: 'Lead is booked', desc: 'Quote sent. Approved. Scheduled. The whole thing can happen in under 10 minutes — automatically.' },
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
          headline={<>Stop missing leads.<br /><span className="text-blue-400">Start capturing them all.</span></>}
          sub="Start your free trial and capture your first lead today — from any channel, automatically."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
