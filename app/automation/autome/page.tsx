import Link from 'next/link'
import { ArrowRight, Check, BrainCircuit, MessageSquare, Sliders, TrendingUp, Shield, Repeat, Sparkles } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function AutoMePage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-indigo-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-purple-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-5">
                  <SectionLabel>Automation · AutoMe</SectionLabel>
                </div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  AI that learns how<br />
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    you run the business.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[480px] mb-8">
                  AutoMe doesn't just automate tasks — it learns your pricing logic, your communication style, and your way of working. Then it does the work the way you would.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Get Early Access <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/auth/sign-up" className={GHOST_BTN}>
                    See How It Works
                  </Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Learns from your real jobs', 'You stay in control', 'Gets smarter over time'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI mock panel */}
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <div className="relative w-full max-w-[500px] mx-auto lg:mx-0">
                  <div className="absolute inset-0 -m-8 bg-indigo-600/12 blur-[70px] rounded-full" />
                  <div className="relative rounded-2xl border border-indigo-500/20 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
                      <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                      <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                      <div className="ml-3 text-[11px] font-semibold text-white/35 tracking-tight">AutoMe · Learning Mode Active</div>
                      <div className="ml-auto flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        <span className="text-[10px] text-indigo-400/70">Live</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {[
                        { label: 'Pricing patterns learned', value: '47 jobs', color: 'text-indigo-400', bar: 'bg-indigo-500', w: '78%' },
                        { label: 'Communication style match', value: '94%', color: 'text-purple-400', bar: 'bg-purple-500', w: '94%' },
                        { label: 'Quote accuracy', value: '±3%', color: 'text-emerald-400', bar: 'bg-emerald-500', w: '88%' },
                        { label: 'Response confidence', value: 'High', color: 'text-blue-400', bar: 'bg-blue-500', w: '85%' },
                      ].map(row => (
                        <div key={row.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[12px] text-white/50">{row.label}</span>
                            <span className={`text-[12px] font-semibold tabular-nums ${row.color}`}>{row.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                            <div className={`h-full rounded-full ${row.bar} transition-all`} style={{ width: row.w }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/8 p-4 space-y-2.5">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2">Recent Actions</div>
                      {[
                        { text: 'Draft reply sent to Marcus T. — House Wash + Driveway', flag: 'Sent', dot: 'bg-emerald-400' },
                        { text: 'Quote generated: $340 (±2% of your avg)', flag: 'Approved', dot: 'bg-blue-400' },
                        { text: 'Follow-up scheduled for Jordan M. — 3 days', flag: 'Queued', dot: 'bg-amber-400' },
                      ].map((a, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${a.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] text-white/55 leading-snug">{a.text}</div>
                          </div>
                          <div className="text-[10px] text-white/25 flex-shrink-0">{a.flag}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -top-4 -right-3 sm:-right-5 rounded-xl border border-indigo-500/30 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20">
                        <Sparkles className="h-3 w-3 text-indigo-400" />
                      </div>
                      <span className="text-[11px] font-semibold text-white">Flagship AI</span>
                    </div>
                    <div className="text-[10.5px] text-white/40 leading-snug">Learns as you work</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <StatStrip stats={[
          { value: '< 60s', label: 'Average response time' },
          { value: '94%',   label: 'Style match accuracy' },
          { value: '3x',    label: 'Faster than manual quotes' },
          { value: '41%',   label: 'Average revenue lift' },
        ]} />

        {/* ── Benefits ──────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What AutoMe does</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Not just automated.<br className="hidden sm:block" />
                Actually intelligent.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                AutoMe is trained on your real jobs, your real quotes, and your real conversations — so it acts like you, not like a generic bot.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: TrendingUp, color: 'bg-indigo-500/15 text-indigo-400',
                  title: 'Learns Your Pricing Logic',
                  desc: 'AutoMe observes your completed quotes over time and builds a model of your pricing for each service type, property size, and location.',
                },
                {
                  icon: MessageSquare, color: 'bg-purple-500/15 text-purple-400',
                  title: 'Mirrors Your Voice',
                  desc: 'It analyzes how you write — your greeting style, your tone, how you explain prices — and drafts replies that sound like you wrote them.',
                },
                {
                  icon: Sliders, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Confidence Thresholds',
                  desc: 'You set exactly how confident AutoMe needs to be before it acts independently. Below that threshold, it drafts and waits for your approval.',
                },
                {
                  icon: Repeat, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Gets Smarter Every Job',
                  desc: 'Every time you approve, edit, or override AutoMe\'s suggestion, it learns. Your corrections become its training data.',
                },
                {
                  icon: Shield, color: 'bg-amber-500/15 text-amber-400',
                  title: 'You Stay in Control',
                  desc: 'AutoMe never commits to anything without your sign-off on high-stakes actions. It surfaces uncertainty so you can step in where it matters.',
                },
                {
                  icon: BrainCircuit, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Qualifies Leads Instantly',
                  desc: 'AutoMe asks the right questions to assess job size, location, and fit — so your time goes to real opportunities, not tire-kickers.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-indigo-500/25 hover:bg-indigo-500/[0.04] transition-all duration-200">
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

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                From day one to fully trained.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Connect Your Data', desc: 'AutoMe reads your existing quotes, completed jobs, and conversations to build its initial model.' },
                { num: '02', title: 'Learns Your Patterns', desc: 'Within weeks, it understands your pricing logic, your common job types, and how you communicate.' },
                { num: '03', title: 'Works in the Background', desc: 'Replies to leads, drafts quotes, schedules follow-ups — you review and approve before anything goes out.' },
                { num: '04', title: 'Improves Over Time', desc: 'Every correction and approval makes it more accurate. The longer you use it, the less you need to review.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-indigo-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Built to work<br /><span className="text-indigo-400">the way you work.</span></>}
          sub="AutoMe adapts to your business — not the other way around. Start free and see how fast it learns."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
