import Link from 'next/link'
import { ArrowRight, Check, Kanban, Eye, MoveRight, Calendar, BarChart2, Layers } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function PipelineMock() {
  const stages = [
    {
      label: 'New Leads',  color: 'border-blue-500/30 bg-blue-500/5',    dot: 'bg-blue-400',    count: 5,
      cards: [
        { name: 'Marcus T.', desc: 'House Wash · $380' },
        { name: 'Derek P.',  desc: 'Gutter Clean · $240' },
      ],
    },
    {
      label: 'Quoted',     color: 'border-violet-500/30 bg-violet-500/5', dot: 'bg-violet-400',  count: 8,
      cards: [
        { name: 'Sarah M.', desc: 'Full Wash · $642' },
        { name: 'Jordan M.', desc: 'Driveway · $320' },
      ],
    },
    {
      label: 'Scheduled',  color: 'border-amber-500/30 bg-amber-500/5',   dot: 'bg-amber-400',   count: 4,
      cards: [
        { name: 'Angela S.', desc: 'Deep Clean · $280' },
        { name: 'Tyler R.',  desc: 'Roof Wash · $460' },
      ],
    },
    {
      label: 'Done',       color: 'border-emerald-500/30 bg-emerald-500/5', dot: 'bg-emerald-400', count: 19,
      cards: [
        { name: 'Chris W.', desc: 'House Wash · $420' },
      ],
    },
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
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Pipeline</div>
          <div className="ml-auto text-[11px] text-white/25">April 2025</div>
        </div>

        <div className="p-3">
          {/* Pipeline summary row */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {stages.map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-[18px] font-bold ${s.dot === 'bg-blue-400' ? 'text-blue-400' : s.dot === 'bg-violet-400' ? 'text-violet-400' : s.dot === 'bg-amber-400' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {s.count}
                </div>
                <div className="text-[9.5px] text-white/30 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Kanban columns */}
          <div className="grid grid-cols-4 gap-2">
            {stages.map(s => (
              <div key={s.label} className={`rounded-xl border p-2 ${s.color}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  <span className="text-[9.5px] font-semibold text-white/50 leading-tight">{s.label}</span>
                </div>
                <div className="space-y-1.5">
                  {s.cards.map(card => (
                    <div key={card.name} className="rounded-lg bg-[#0d1831] border border-white/8 p-2">
                      <div className="text-[11px] font-semibold text-white/85 leading-tight">{card.name}</div>
                      <div className="text-[10px] text-white/35 leading-tight mt-0.5">{card.desc}</div>
                    </div>
                  ))}
                  {s.count > s.cards.length && (
                    <div className="text-[9.5px] text-white/25 text-center py-0.5">
                      +{s.count - s.cards.length} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating — Job moved */}
      <div className="absolute -top-5 -right-3 sm:-right-6 w-[178px] rounded-xl border border-emerald-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <MoveRight className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-white">Job Scheduled</span>
        </div>
        <div className="text-[10.5px] text-white/40">Angela S. → Friday 9am</div>
        <div className="text-[10px] text-white/25 mt-0.5">Auto-confirmation sent</div>
      </div>

      {/* Floating — Revenue */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 w-[160px] rounded-xl border border-white/12 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-[10px] text-white/30 mb-0.5">Pipeline value</div>
        <div className="text-[20px] font-bold text-white">$6,840</div>
        <div className="text-[10px] text-blue-400 mt-0.5 font-medium">17 open jobs</div>
      </div>
    </div>
  )
}

export default function PipelineJobsPage() {
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
                <div className="mb-5"><SectionLabel>Platform · Pipeline & Jobs</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  See every job.<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Move them forward.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax Pipeline gives you a real-time view of every lead, quote, and job as it moves from first contact to completed and paid. Nothing falls through the cracks.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Real-time pipeline view', 'Stage-based job tracking', 'Auto-confirmations & reminders'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <PipelineMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '5', label: 'Pipeline stages' },
          { value: '0', label: 'Jobs lost to disorganization' },
          { value: '31%', label: 'More jobs completed monthly' },
          { value: '$6,840', label: 'Avg. open pipeline value' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you get</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Total visibility from lead to done.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Kanban, color: 'bg-blue-500/15 text-blue-400', title: 'Visual Kanban Board', desc: 'Drag-and-drop job cards across stages: New Lead → Quoted → Scheduled → In Progress → Completed. Real-time updates.' },
                { icon: Eye, color: 'bg-violet-500/15 text-violet-400', title: 'Live Pipeline Metrics', desc: 'Total open pipeline value, jobs by stage, average time per stage, and velocity — so you know where bottlenecks are.' },
                { icon: Calendar, color: 'bg-amber-500/15 text-amber-400', title: 'Job Scheduling', desc: 'Move a job to Scheduled and it appears on your crew calendar. Customer gets an automatic confirmation text.' },
                { icon: MoveRight, color: 'bg-emerald-500/15 text-emerald-400', title: 'Stage Automation', desc: 'When a job advances to a new stage, automated actions trigger: send a quote, request a deposit, or send a reminder.' },
                { icon: Layers, color: 'bg-teal-500/15 text-teal-400', title: 'Job Cards with Full Context', desc: 'Each card holds the client details, quote amount, scheduled date, photos, and conversation history. No context switching.' },
                { icon: BarChart2, color: 'bg-pink-500/15 text-pink-400', title: 'Throughput Reports', desc: 'Track how many jobs move through each stage per week and month. Identify where leads are going cold and fix it.' },
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
              <SectionLabel>The job lifecycle</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[36px] font-bold text-white tracking-tight">
                Five stages. Zero confusion.
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { stage: 'New Lead',   color: 'border-blue-500/30 bg-blue-500/5',     dot: 'bg-blue-400',    desc: 'Lead arrives from any source. AI responds instantly.' },
                { stage: 'Quoted',     color: 'border-violet-500/30 bg-violet-500/5', dot: 'bg-violet-400',  desc: 'Quote sent. Follow-up sequences activate automatically.' },
                { stage: 'Scheduled', color: 'border-amber-500/30 bg-amber-500/5',   dot: 'bg-amber-400',   desc: 'Job on the calendar. Customer gets confirmation + reminders.' },
                { stage: 'In Progress', color: 'border-orange-500/30 bg-orange-500/5', dot: 'bg-orange-400', desc: 'Crew is on-site. Job card is live with notes and photos.' },
                { stage: 'Completed', color: 'border-emerald-500/30 bg-emerald-500/5', dot: 'bg-emerald-400', desc: 'Job done, payment collected, review request sent.' },
              ].map(s => (
                <div key={s.stage} className={`rounded-xl border p-4 ${s.color}`}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`h-2 w-2 rounded-full ${s.dot}`} />
                    <span className="text-[12.5px] font-bold text-white">{s.stage}</span>
                  </div>
                  <p className="text-[12px] text-white/45 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Total clarity on<br /><span className="text-blue-400">every job you run.</span></>}
          sub="Start your free trial and get your entire pipeline organized in minutes."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
