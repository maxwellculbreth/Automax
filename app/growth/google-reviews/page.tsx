import Link from 'next/link'
import { ArrowRight, Check, Star, Send, TrendingUp, Clock, Repeat, MapPin } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function ReviewsMock() {
  const months = [
    { label: 'Nov', count: 4,  h: '22%' },
    { label: 'Dec', count: 6,  h: '33%' },
    { label: 'Jan', count: 5,  h: '28%' },
    { label: 'Feb', count: 9,  h: '50%' },
    { label: 'Mar', count: 14, h: '78%' },
    { label: 'Apr', count: 18, h: '100%' },
  ]

  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-amber-600/10 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Reviews</div>
          <div className="ml-auto flex gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
            <span className="text-[11px] font-semibold text-white/60 ml-1">4.9</span>
          </div>
        </div>

        <div className="p-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Total Reviews', value: '127',   sub: '+18 this month', accent: false },
              { label: 'Avg Rating',    value: '4.9★',  sub: 'Up from 4.2★',  accent: true  },
              { label: 'Request Rate',  value: '94%',   sub: 'Delivery rate',  accent: false },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border px-3 py-2.5 ${s.accent ? 'border-amber-500/25 bg-amber-500/8' : 'border-white/8 bg-[#0a1525]'}`}>
                <div className="text-[9.5px] text-white/30 mb-1">{s.label}</div>
                <div className={`text-[15px] font-bold ${s.accent ? 'text-amber-400' : 'text-white'}`}>{s.value}</div>
                <div className="text-[9.5px] text-emerald-400 mt-0.5 font-medium">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Review growth chart */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25">Monthly Reviews</div>
              <div className="text-[10px] text-emerald-400 font-medium">↑ 4.5× growth</div>
            </div>
            <div className="flex items-end gap-2 h-[72px]">
              {months.map(m => (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[9px] font-semibold text-white/40">{m.count}</div>
                  <div
                    className="w-full rounded-t-md bg-amber-400/70"
                    style={{ height: m.h }}
                  />
                  <div className="text-[9px] text-white/25">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent review */}
          <div className="rounded-xl border border-white/8 bg-[#0a1525] p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-[10px] text-white/25">2 days ago · via Automax</span>
            </div>
            <div className="text-[12px] font-semibold text-white mb-1">Marcus T.</div>
            <p className="text-[11.5px] text-white/55 leading-snug">&ldquo;Incredible service. They responded within minutes and the job was flawless. Will use again.&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Floating — trigger */}
      <div className="absolute -top-5 -right-3 sm:-right-5 w-[178px] rounded-xl border border-emerald-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-white">Job Completed</span>
        </div>
        <div className="text-[10.5px] text-white/40">Review request sent in 24h</div>
        <div className="text-[10px] text-white/25 mt-0.5">→ Angela S.</div>
      </div>

      {/* Floating — new review */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 w-[164px] rounded-xl border border-amber-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1 mb-1.5">
          {[1,2,3,4,5].map(i => <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />)}
        </div>
        <div className="text-[11px] font-semibold text-white">New Review</div>
        <div className="text-[10px] text-white/40 mt-0.5">Google · just now</div>
      </div>
    </div>
  )
}

export default function GoogleReviewsPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-amber-700/12 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-blue-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-5"><SectionLabel>Growth · Google Reviews</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  More 5-star reviews.<br />
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    Every single month.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax automatically sends a review request after every completed job — growing your Google rating consistently, month after month, with zero manual follow-up.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Zero manual effort required', 'Review requests via SMS', 'Grows every month automatically'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <ReviewsMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '4.9★', label: 'Avg. rating after 90 days' },
          { value: '127',  label: 'Avg. reviews per business' },
          { value: '94%',  label: 'Review request delivery rate' },
          { value: '4.5×', label: 'Review growth in 6 months' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Why it matters</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                Your Google rating is your<br className="hidden sm:block" />
                first impression online.
              </h2>
              <p className="mt-3 text-[15px] text-white/45 max-w-xl mx-auto">
                88% of local customers trust online reviews as much as personal recommendations. A 4.9★ listing with 100+ reviews will win jobs before a competitor even gets a chance to quote.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Send, color: 'bg-amber-500/15 text-amber-400', title: 'Automatic Review Requests', desc: 'When a job is marked complete, Automax sends a personalized review request via text 24 hours later. No setup, no reminders.' },
                { icon: Star, color: 'bg-yellow-500/15 text-yellow-400', title: '5-Star Outcomes by Default', desc: 'Review requests go to satisfied customers at the right moment — right after a great experience — maximizing your star rating.' },
                { icon: TrendingUp, color: 'bg-emerald-500/15 text-emerald-400', title: 'Consistent Monthly Growth', desc: 'Every job adds to your review count. Contractors using Automax average 18 new reviews per month without lifting a finger.' },
                { icon: Clock, color: 'bg-blue-500/15 text-blue-400', title: 'Perfect Timing Every Time', desc: '24-hour delay is proven to maximize review response rate — sent when the experience is fresh but the job dust has settled.' },
                { icon: MapPin, color: 'bg-violet-500/15 text-violet-400', title: 'Local Search Ranking Boost', desc: 'More reviews = higher Google Maps ranking. A stronger review profile means more profile views, more calls, more jobs.' },
                { icon: Repeat, color: 'bg-pink-500/15 text-pink-400', title: 'Always On — No Manual Work', desc: 'Set it once during onboarding. Automax handles every request from that point forward, month after month, automatically.' },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-amber-500/20 hover:bg-amber-500/[0.03] transition-all duration-200">
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
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>How it works</SectionLabel>
                <h2 className="mt-4 text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-tight mb-6">
                  One setup. Reviews forever.
                </h2>
                <div className="space-y-5">
                  {[
                    { title: 'Job is marked complete', desc: 'Your crew finishes the job and marks it done in Automax. That\'s the only trigger needed.' },
                    { title: 'Request sent 24h later', desc: 'Automax sends a personalized SMS with your business name, thanking them and asking for a review.' },
                    { title: 'Customer leaves a review', desc: 'Link goes straight to your Google review page — no app, no account, just one tap to review.' },
                    { title: 'Your profile grows', desc: 'New 5-star review posted. Review count ticks up. Your Google ranking improves. Repeat every job.' },
                  ].map((s, i) => (
                    <div key={s.title} className="flex gap-4">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-600/20 ring-1 ring-amber-500/25 text-[12px] font-bold text-amber-400">
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
                  { metric: '4.2★', desc: 'Average rating before Automax reviews', accent: false },
                  { metric: '4.9★', desc: 'Average rating after 90 days of automation', accent: true },
                  { metric: '18/mo', desc: 'New reviews per month on average', accent: false },
                  { metric: '88%', desc: 'Of customers trust reviews as much as referrals', accent: false },
                ].map(s => (
                  <div key={s.metric} className={`rounded-2xl border p-5 ${s.accent ? 'border-amber-500/30 bg-amber-500/8' : 'border-white/8 bg-white/[0.02]'}`}>
                    <div className={`text-[32px] font-bold leading-none ${s.accent ? 'text-amber-400' : 'text-white'}`}>{s.metric}</div>
                    <p className="mt-2 text-[12.5px] text-white/45 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Build a reputation<br /><span className="text-amber-400">that works for you.</span></>}
          sub="Start your free trial and get your first review request out within 24 hours of your next completed job."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
