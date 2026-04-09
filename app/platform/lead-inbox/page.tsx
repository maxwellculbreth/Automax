import Link from 'next/link'
import { ArrowRight, Check, Inbox, Zap, Clock, MessageSquare, Filter, TrendingUp } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function InboxMock() {
  const leads = [
    { name: 'Marcus T.',  job: 'House Wash',     amount: '$380',   status: 'NEW',    statusColor: 'bg-blue-500/20 text-blue-300',   active: true  },
    { name: 'Jordan M.',  job: 'Driveway Seal',  amount: '$620',   status: 'QUOTED', statusColor: 'bg-amber-500/20 text-amber-300', active: false },
    { name: 'Angela S.',  job: 'Deep Clean',     amount: '$280',   status: 'WON',    statusColor: 'bg-emerald-500/20 text-emerald-300', active: false },
  ]

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-blue-600/12 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Lead Inbox</div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="rounded-md bg-blue-600/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300">3 new</div>
          </div>
        </div>

        <div className="grid grid-cols-[160px_1fr] divide-x divide-white/8 h-[270px]">
          {/* Sidebar list */}
          <div className="overflow-hidden">
            {leads.map(lead => (
              <div
                key={lead.name}
                className={`px-3 py-2.5 border-b border-white/6 cursor-pointer ${lead.active ? 'bg-blue-600/10' : 'hover:bg-white/4'}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">
                    {lead.name[0]}
                  </div>
                  <span className="text-[12px] font-semibold text-white/85 truncate">{lead.name}</span>
                </div>
                <div className="text-[10.5px] text-white/40 truncate mb-1.5">{lead.job}</div>
                <div className={`inline-flex text-[9.5px] font-bold px-1.5 py-0.5 rounded-md ${lead.statusColor}`}>
                  {lead.status}
                </div>
              </div>
            ))}
          </div>

          {/* Conversation panel */}
          <div className="flex flex-col p-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[13px] font-bold text-white">Marcus T.</div>
                <div className="text-[11px] text-white/40">House Wash · Est. $380 · just now</div>
              </div>
              <div className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[9.5px] font-semibold text-blue-300">NEW LEAD</div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-2 mb-3">
              <div className="flex justify-start">
                <div className="rounded-xl rounded-tl-sm bg-white/8 px-3 py-2 max-w-[85%]">
                  <div className="text-[11.5px] text-white/75 leading-snug">Hi, I need my house washed. 2-story, ~2,400 sqft. Available weekends. How much?</div>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="rounded-xl rounded-tr-sm bg-blue-600/25 border border-blue-500/25 px-3 py-2 max-w-[88%]">
                  <div className="flex items-center gap-1 mb-1">
                    <Zap className="h-3 w-3 text-blue-400" />
                    <span className="text-[9.5px] font-semibold text-blue-400">AI Draft</span>
                  </div>
                  <div className="text-[11.5px] text-white/80 leading-snug">Hi Marcus! Great timing — we have weekend slots open. For a 2-story at that size, we typically quote $340–$420. Can I get your address to give you an exact number?</div>
                </div>
              </div>
            </div>

            {/* Action row */}
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg bg-blue-600 py-1.5 text-center text-[11px] font-semibold text-white cursor-pointer hover:bg-blue-500 transition-colors">
                Send Reply
              </div>
              <div className="rounded-lg border border-white/12 px-3 py-1.5 text-[11px] font-medium text-white/50 cursor-pointer hover:text-white hover:border-white/25 transition-colors">
                Edit
              </div>
              <div className="rounded-lg border border-white/12 px-3 py-1.5 text-[11px] font-medium text-white/50 cursor-pointer">
                Quote
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating stat */}
      <div className="absolute -top-5 -right-3 sm:-right-6 w-[168px] rounded-xl border border-blue-500/25 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-[10px] text-white/35 mb-0.5">Avg. response time</div>
        <div className="text-[22px] font-bold text-white">&lt; 60s</div>
        <div className="text-[10px] text-emerald-400 font-medium">↑ vs. industry avg 4h</div>
      </div>
    </div>
  )
}

export default function LeadInboxPage() {
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
                <div className="mb-5"><SectionLabel>Platform · Lead Inbox</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Every lead.<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Answered instantly.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax centralizes every inbound lead into a single smart inbox. AI responds within 60 seconds, qualifies the job, and keeps the conversation warm until you step in to close.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Responds 24/7, including weekends', 'No missed leads', 'One inbox for all sources'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <InboxMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '< 60s', label: 'AI response time' },
          { value: '98%', label: 'Lead capture rate' },
          { value: '2.4×', label: 'More leads converted' },
          { value: '24/7', label: 'Always-on coverage' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you get</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Stop losing jobs to slow response times.
              </h2>
              <p className="mt-3 text-[15px] text-white/45 max-w-xl mx-auto">
                The average contractor responds to leads in 4+ hours. Your competitors lose 78% of leads that aren&apos;t contacted within 5 minutes. Automax fixes this permanently.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Inbox, color: 'bg-blue-500/15 text-blue-400', title: 'Unified Lead Inbox', desc: 'Leads from your website, Google Business, texts, and social all flow into one clean inbox. Nothing falls through the cracks.' },
                { icon: Zap, color: 'bg-violet-500/15 text-violet-400', title: 'AI First Response', desc: 'The moment a lead comes in, AI sends a personalized reply — asking the right qualifying questions and gathering job details.' },
                { icon: MessageSquare, color: 'bg-amber-500/15 text-amber-400', title: 'Smart Conversation Drafts', desc: 'Before you reply, AI has already drafted a response. Edit it, send it as-is, or let it auto-send based on your preferences.' },
                { icon: Filter, color: 'bg-emerald-500/15 text-emerald-400', title: 'Lead Qualification', desc: 'AI scores and labels leads by job type, size, location, and likelihood to book — so you focus your time on the best opportunities.' },
                { icon: Clock, color: 'bg-teal-500/15 text-teal-400', title: 'Follow-Up Sequences', desc: 'Leads that don\'t respond get a smart follow-up 2h, 24h, and 72h later. Automated, personalized, and paused the moment they reply.' },
                { icon: TrendingUp, color: 'bg-pink-500/15 text-pink-400', title: 'Conversion Tracking', desc: 'See which sources produce the best leads, your response time by day and hour, and how many leads convert to booked jobs.' },
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
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionLabel>The lead flow</SectionLabel>
                <h2 className="mt-4 text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-tight mb-6">
                  From first contact to booked job in minutes.
                </h2>
                <div className="space-y-5">
                  {[
                    { num: '1', title: 'Lead arrives', desc: 'Via any channel — website form, Google click, text, or referral. All land in one inbox.' },
                    { num: '2', title: 'AI responds in seconds', desc: 'Personalized reply goes out immediately. Qualifies the job, collects address and details.' },
                    { num: '3', title: 'You step in to close', desc: 'AI hands it off with full context. You review, send a quote, and book the job.' },
                    { num: '4', title: 'Follow-ups run automatically', desc: 'If they go quiet, Automax follows up on a smart schedule until you get a response.' },
                  ].map(s => (
                    <div key={s.num} className="flex gap-4">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/20 ring-1 ring-blue-500/25 text-[12px] font-bold text-blue-400">
                        {s.num}
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
                  { metric: '78%', desc: 'of leads book with the first responder', accent: true },
                  { metric: '4h+', desc: 'average contractor response time — we fix this', accent: false },
                  { metric: '2.4×', desc: 'more leads converted with instant response', accent: false },
                  { metric: '0', desc: 'leads missed when Automax AI is active', accent: false },
                ].map(s => (
                  <div key={s.metric} className={`rounded-2xl border p-5 ${s.accent ? 'border-blue-500/30 bg-blue-500/8' : 'border-white/8 bg-white/[0.02]'}`}>
                    <div className={`text-[32px] font-bold leading-none ${s.accent ? 'text-blue-400' : 'text-white'}`}>{s.metric}</div>
                    <p className="mt-2 text-[12.5px] text-white/45 leading-snug">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Never miss a lead.<br /><span className="text-blue-400">Ever again.</span></>}
          sub="Start your free trial and have AI answering leads today. Takes less than 10 minutes to set up."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
