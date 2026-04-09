import Link from 'next/link'
import { ArrowRight, Check, Bell, Clock, MessageSquare, Repeat, TrendingUp, Zap, Users } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function SmartFollowUpsPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-amber-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-orange-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Automation · Smart Follow-Ups</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Follow up without<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  lifting a finger.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Most jobs are won on the second or third touch. Smart Follow-Ups automatically sends the right message at the right time — so no lead ever goes cold.
              </p>
              <div className="flex flex-wrap gap-3 mb-9">
                <Link href="/auth/sign-up" className={BLUE_BTN}>
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className={GHOST_BTN}>
                  View Pricing
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['Fully automated sequences', 'Stops when they reply', 'Works for leads and past clients'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                    <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '68%',  label: 'Leads need follow-up to close' },
          { value: '2.4x', label: 'More jobs closed with follow-ups' },
          { value: '0',    label: 'Manual sends required' },
          { value: '30d',  label: 'Default re-engagement window' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What it does</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                The follow-up you always meant<br className="hidden sm:block" />
                to send.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                It runs in the background while you work. When someone goes quiet, Automax follows up — automatically, on schedule, and on brand.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Clock, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Timed Sequences',
                  desc: 'Set follow-ups to send at day 1, day 3, and day 7 after a quote. Timing is based on your conversions, not guesswork.',
                },
                {
                  icon: MessageSquare, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Messages That Sound Human',
                  desc: 'No generic "just checking in" texts. Automax crafts messages that reference the job, the timeline, and the customer\'s original request.',
                },
                {
                  icon: Zap, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Stops When They Reply',
                  desc: 'As soon as a customer responds, the follow-up sequence stops and the conversation moves to your inbox. No awkward overlapping messages.',
                },
                {
                  icon: Users, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Re-Engages Past Clients',
                  desc: 'Seasonal re-engagement sequences go out automatically based on when clients last booked. Spring is coming — they\'ll hear from you first.',
                },
                {
                  icon: Repeat, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Works Across All Channels',
                  desc: 'SMS, email, or both — based on what the customer used to reach out. Meet them where they already are.',
                },
                {
                  icon: TrendingUp, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Tracks What Converts',
                  desc: 'See open rates, reply rates, and job close rates for each sequence. Know which messages are actually winning you work.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-amber-500/25 hover:bg-amber-500/[0.04] transition-all duration-200">
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

        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight leading-tight">
                Set it once. It runs forever.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Lead Goes Quiet', desc: 'A quote was sent, but no response. Automax detects the silence and starts the sequence.' },
                { num: '02', title: 'First Follow-Up Sent', desc: 'A friendly, personalized message is sent at the optimal time — referencing their specific request.' },
                { num: '03', title: 'Sequence Continues', desc: 'If no response, a second and third message go out on schedule. Each one is different and natural.' },
                { num: '04', title: 'Lead Responds', desc: 'The moment they reply, the sequence stops and the conversation lands in your inbox, ready to close.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-amber-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>The jobs you almost lost<br /><span className="text-amber-400">are still closeable.</span></>}
          sub="Most cold leads just needed one more message. Automax sends it automatically."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
