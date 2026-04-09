import Link from 'next/link'
import { ArrowRight, Check, Shield, Star, TrendingUp, Globe, MessageSquare, Award } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function ReputationMock() {
  const signals = [
    { label: 'Google Reviews',   score: 98,  value: '4.9★ · 127',  color: 'bg-amber-400' },
    { label: 'Response Time',    score: 95,  value: '< 2 min avg',  color: 'bg-blue-400' },
    { label: 'Website Presence', score: 88,  value: 'Active + SEO', color: 'bg-emerald-400' },
    { label: 'Profile Complete', score: 100, value: '100% filled',  color: 'bg-violet-400' },
  ]

  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-emerald-600/10 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Reputation</div>
        </div>

        <div className="p-4">
          {/* Score hero */}
          <div className="grid grid-cols-[1fr_auto] gap-4 mb-4 items-center">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-1">Reputation Score</div>
              <div className="text-[48px] font-bold text-white leading-none">94</div>
              <div className="text-[11px] text-white/35 mt-1">/ 100 · Excellent</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/25 mb-1">vs. avg competitor</div>
              <div className="text-[28px] font-bold text-white/20">61</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">+33 ahead</div>
            </div>
          </div>

          {/* Signal bars */}
          <div className="space-y-2.5 mb-4">
            {signals.map(s => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11.5px] font-medium text-white/65">{s.label}</span>
                  <span className="text-[11px] text-white/40">{s.value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/8">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent trust actions */}
          <div className="rounded-xl border border-white/8 bg-[#0a1525] px-3 py-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-2">Recent Activity</div>
            <div className="space-y-2">
              {[
                { text: '5★ review posted — Angela S.', dot: 'bg-amber-400', time: '2h' },
                { text: 'Lead response: 48 seconds',    dot: 'bg-blue-400',  time: '3h' },
                { text: 'Google profile viewed 34×',    dot: 'bg-violet-400', time: '1d' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                  <div className="flex-1 text-[11px] text-white/55">{item.text}</div>
                  <div className="text-[10px] text-white/25">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating — rank */}
      <div className="absolute -top-5 -right-3 sm:-right-5 w-[172px] rounded-xl border border-amber-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-[11px] font-semibold text-white">Top Rated</span>
        </div>
        <div className="text-[10.5px] text-white/40">#1 in your service area</div>
        <div className="text-[10px] text-amber-400 mt-0.5 font-medium">via Google Maps</div>
      </div>

      {/* Floating — profile view */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 w-[162px] rounded-xl border border-violet-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-[10px] text-white/30 mb-0.5">Profile views this month</div>
        <div className="text-[22px] font-bold text-white">840</div>
        <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">↑ 3.2× growth</div>
      </div>
    </div>
  )
}

export default function ReputationToolsPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-emerald-700/12 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-blue-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-5"><SectionLabel>Growth · Reputation Tools</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Be the most trusted<br />
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    name in your market.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax builds and protects your local reputation across every signal that matters — reviews, response time, web presence, and referral trust. All tracked. All improving.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Reputation score tracked automatically', 'All trust signals in one view', 'Outrank local competitors'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <ReputationMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '94/100', label: 'Avg. reputation score' },
          { value: '4.9★',   label: 'After 90 days with Automax' },
          { value: '3.2×',   label: 'More Google profile views' },
          { value: '+33',    label: 'Points ahead of avg competitor' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What we track</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Local reputation is more than just reviews.
              </h2>
              <p className="mt-3 text-[15px] text-white/45 max-w-xl mx-auto">
                Google ranks businesses based on dozens of trust signals. Automax monitors and improves every one of them — putting you ahead of competitors who only think about star ratings.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Star, color: 'bg-amber-500/15 text-amber-400', title: 'Review Velocity', desc: 'Consistent monthly review growth signals authority to Google. Automax automates requests to keep your review count climbing.' },
                { icon: TrendingUp, color: 'bg-emerald-500/15 text-emerald-400', title: 'Reputation Score', desc: 'A single composite score tracking all trust signals — reviews, response time, profile completeness, website presence.' },
                { icon: MessageSquare, color: 'bg-blue-500/15 text-blue-400', title: 'Response Time', desc: 'Fast lead response is a trust signal. Automax AI keeps your average response time under 60 seconds — 24/7, automatically.' },
                { icon: Globe, color: 'bg-violet-500/15 text-violet-400', title: 'Web Presence', desc: 'A professional, indexed website with service area pages signals credibility and expands your local search footprint.' },
                { icon: Shield, color: 'bg-teal-500/15 text-teal-400', title: 'Profile Completeness', desc: 'Fully completed Google Business Profiles rank higher and convert more viewers into callers. Automax guides every field.' },
                { icon: Award, color: 'bg-pink-500/15 text-pink-400', title: 'Competitive Standing', desc: 'See how your reputation score compares to the average competitor in your service area — so you know exactly where you lead.' },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all duration-200">
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

        {/* ── How it stacks up ──────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>Why it matters</SectionLabel>
                <h2 className="mt-4 text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-tight mb-6">
                  Reputation is your cheapest source of new business.
                </h2>
                <div className="space-y-5">
                  {[
                    { title: 'Before Automax', desc: 'Scattered reviews, slow response times, no website, incomplete Google profile. Invisible to most local searchers.' },
                    { title: 'After 30 days',  desc: 'Consistent review flow, sub-2 minute AI response time, professional website live, profile fully optimized.' },
                    { title: 'After 90 days',  desc: '4.9★ rating, 100+ reviews, Google Maps top 3, 3× more profile views, reputation score: 94/100.' },
                    { title: 'Ongoing',        desc: 'Automax keeps all signals improving automatically. Your reputation compounds — more reviews, more visibility, more calls.' },
                  ].map((s, i) => (
                    <div key={s.title} className="flex gap-4">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600/20 ring-1 ring-emerald-500/25 text-[12px] font-bold text-emerald-400">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-white mb-1">{s.title}</div>
                        <div className="text-[13px] text-white/45 leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { metric: '3.2×', desc: 'More Google profile views after 90 days of reputation work', accent: true },
                  { metric: '88%',  desc: 'Of customers choose the business with more reviews', accent: false },
                  { metric: '#1',   desc: 'Average local ranking after 90 days on Automax growth tier', accent: false },
                  { metric: '40%',  desc: 'More calls from Google when your rating goes from 4.2 to 4.9', accent: false },
                ].map(s => (
                  <div key={s.metric} className={`rounded-2xl border p-5 ${s.accent ? 'border-emerald-500/30 bg-emerald-500/8' : 'border-white/8 bg-white/[0.02]'}`}>
                    <div className={`text-[32px] font-bold leading-none ${s.accent ? 'text-emerald-400' : 'text-white'}`}>{s.metric}</div>
                    <p className="mt-2 text-[12.5px] text-white/45 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Become the obvious choice<br /><span className="text-emerald-400">in your area.</span></>}
          sub="Start your free trial and begin building a local reputation that brings in jobs on autopilot."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
