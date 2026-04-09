import Link from 'next/link'
import { ArrowRight, Check, Mail, Clock, TrendingUp, Repeat, Bell, MessageSquare } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function FollowUpMock() {
  const steps = [
    { day: 'Day 0',  label: 'Quote Sent',         status: 'sent',     msg: 'Hi Marcus, here\'s your quote for the house wash. Tap to review.', icon: '📤' },
    { day: 'Day 1',  label: 'Follow-Up #1',        status: 'opened',   msg: 'Just checking in — did you get a chance to look at the quote?', icon: '👀' },
    { day: 'Day 3',  label: 'Follow-Up #2',        status: 'replied',  msg: 'We still have slots open this week if you\'d like to get scheduled.', icon: '✅' },
    { day: 'Day 7',  label: 'Final Nudge',         status: 'booked',   msg: '"Yes! Let\'s go — Friday works." → Job booked automatically.', icon: '🎉' },
  ]

  const statusStyle: Record<string, string> = {
    sent:    'text-white/35 bg-white/6 border-white/8',
    opened:  'text-blue-300 bg-blue-500/15 border-blue-500/20',
    replied: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/20',
    booked:  'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
  }

  return (
    <div className="relative w-full max-w-[500px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-violet-600/10 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Follow-Up Sequence</div>
          <div className="ml-auto text-[11px] text-white/25">Marcus T.</div>
        </div>

        <div className="p-4">
          {/* Sequence title */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] font-bold text-white">Quote Follow-Up</div>
              <div className="text-[11px] text-white/35">Q-2025-047 · House Wash · $642</div>
            </div>
            <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1">
              <span className="text-[11px] font-bold text-emerald-400">Booked ✓</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-[28px] top-3 bottom-3 w-px bg-white/8" />
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-[13px] ${statusStyle[s.status]}`}>
                      {s.icon}
                    </div>
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-bold text-white">{s.label}</span>
                      <span className="text-[9.5px] text-white/30">{s.day}</span>
                    </div>
                    <div className={`text-[11px] leading-snug rounded-lg px-2.5 py-1.5 border ${statusStyle[s.status]}`}>
                      {s.msg}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response stat */}
          <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/8 px-3 py-2.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-violet-300/70">Reply rate with follow-ups</div>
              <div className="text-[18px] font-bold text-violet-400">+34%</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/30">Without follow-ups</div>
              <div className="text-[18px] font-bold text-white/30">21%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating — sequence paused */}
      <div className="absolute -top-5 -right-3 sm:-right-5 w-[182px] rounded-xl border border-emerald-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <Bell className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-white">Sequence Paused</span>
        </div>
        <div className="text-[10.5px] text-white/40">Marcus replied — no more</div>
        <div className="text-[10px] text-white/25 mt-0.5">follow-ups needed</div>
      </div>
    </div>
  )
}

export default function FollowUpCampaignsPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-violet-700/14 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-blue-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="mb-5"><SectionLabel>Growth · Follow-Up Campaigns</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Your best jobs are<br />
                  <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                    the ones you almost lost.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax sends smart, timed follow-up sequences on every quote — automatically re-engaging cold leads and getting responses without you lifting a finger.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Sequences run automatically', 'Pause the moment they reply', 'No leads left behind'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <FollowUpMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '+34%', label: 'Reply rate improvement' },
          { value: '7d',   label: 'Automated sequence length' },
          { value: '0',    label: 'Manual follow-ups needed' },
          { value: '2×',   label: 'Close rate vs single message' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you get</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Never let a warm lead go cold again.
              </h2>
              <p className="mt-3 text-[15px] text-white/45 max-w-xl mx-auto">
                Most service businesses send one quote and hope for the best. Automax keeps working after you send — following up at the exact right moments until you get an answer.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Mail, color: 'bg-violet-500/15 text-violet-400', title: 'Quote Follow-Up Sequences', desc: 'Every sent quote automatically triggers a follow-up sequence. Day 1, Day 3, Day 7 — each message is smart, contextual, and personalized.' },
                { icon: Bell, color: 'bg-blue-500/15 text-blue-400', title: 'Cold Lead Re-Engagement', desc: 'Leads that went quiet 30, 60, or 90 days ago? Automax sends a friendly re-engagement message on a smart schedule — hands-free.' },
                { icon: Repeat, color: 'bg-amber-500/15 text-amber-400', title: 'Smart Pause on Reply', desc: 'The moment a lead responds, all follow-ups stop automatically. No awkward double messages. The conversation resumes where it left off.' },
                { icon: MessageSquare, color: 'bg-emerald-500/15 text-emerald-400', title: 'AI-Drafted Messages', desc: 'Every follow-up message is generated by AI — personalized with the lead\'s name, job type, and context. Never feels like spam.' },
                { icon: Clock, color: 'bg-teal-500/15 text-teal-400', title: 'Optimal Timing', desc: 'Sequences are timed based on proven response rate data — not just random intervals. Each touch goes out when it\'s most likely to work.' },
                { icon: TrendingUp, color: 'bg-pink-500/15 text-pink-400', title: 'Reply Rate Analytics', desc: 'See which messages get the most responses, which sequences perform best, and how follow-ups impact your overall close rate over time.' },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-violet-500/20 hover:bg-violet-500/[0.03] transition-all duration-200">
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

        {/* ── Sequence breakdown ────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>The sequence</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[36px] font-bold text-white tracking-tight">
                7 days of smart follow-up. Zero effort.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { day: 'Day 0', title: 'Quote Sent', desc: 'Professional quote delivered via text. Link opens on any phone without an app.' },
                { day: 'Day 1', title: 'Gentle Check-In', desc: '"Just checking you got the quote — let me know if you have any questions."' },
                { day: 'Day 3', title: 'Value Reminder', desc: '"We still have openings this week and can get you scheduled quickly."' },
                { day: 'Day 7', title: 'Final Nudge', desc: '"Last chance to grab your quote before we fill our schedule. Happy to answer any questions."' },
              ].map(s => (
                <div key={s.day} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="text-[11px] font-bold text-violet-500/60 mb-2 tracking-wider">{s.day}</div>
                  <h3 className="text-[14px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[12.5px] text-white/45 leading-snug italic">{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[13px] text-white/30 mt-6">All sequences pause automatically the moment a lead replies or books a job.</p>
          </div>
        </section>

        <PageCTA
          headline={<>Close the jobs<br /><span className="text-violet-400">you nearly missed.</span></>}
          sub="Start your free trial and let Automax follow up on every quote — automatically."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
