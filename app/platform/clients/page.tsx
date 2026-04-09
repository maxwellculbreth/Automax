import Link from 'next/link'
import { ArrowRight, Check, Users, Heart, History, Star, Phone, Mail, MapPin } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function ClientsMock() {
  const clients = [
    { init: 'S', name: 'Sarah M.',   jobs: 14, revenue: '$4,640', status: 'Active',   statusColor: 'bg-emerald-500/15 text-emerald-400', active: true },
    { init: 'M', name: 'Marcus T.',  jobs: 7,  revenue: '$2,180', status: 'Active',   statusColor: 'bg-emerald-500/15 text-emerald-400', active: false },
    { init: 'J', name: 'Jordan M.',  jobs: 4,  revenue: '$1,920', status: 'Active',   statusColor: 'bg-emerald-500/15 text-emerald-400', active: false },
    { init: 'A', name: 'Angela S.',  jobs: 11, revenue: '$3,300', status: 'VIP',      statusColor: 'bg-amber-500/15 text-amber-400', active: false },
    { init: 'T', name: 'Tyler R.',   jobs: 2,  revenue: '$640',   status: 'Inactive', statusColor: 'bg-white/10 text-white/40', active: false },
  ]

  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-blue-600/12 blur-[70px] rounded-full" />

      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-[#080f1e]/60">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="ml-3 text-[11px] font-semibold text-white/35">Automax · Clients</div>
          <div className="ml-auto text-[11px] text-white/25">48 total</div>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[28px_1fr_52px_60px_60px] gap-2 items-center px-4 py-2 border-b border-white/6 bg-white/[0.02]">
          <div />
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/25">Client</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/25 text-center">Jobs</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/25 text-right">Revenue</div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/25 text-right">Status</div>
        </div>

        {/* Rows */}
        <div>
          {clients.map(c => (
            <div
              key={c.name}
              className={`grid grid-cols-[28px_1fr_52px_60px_60px] gap-2 items-center px-4 py-2.5 border-b border-white/5 last:border-0 ${c.active ? 'bg-blue-600/8' : 'hover:bg-white/[0.025]'} transition-colors cursor-pointer`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white/70">
                {c.init}
              </div>
              <div>
                <div className={`text-[12.5px] font-semibold ${c.active ? 'text-white' : 'text-white/75'}`}>{c.name}</div>
                <div className="text-[10.5px] text-white/30">Last job: 3 days ago</div>
              </div>
              <div className="text-[12.5px] font-semibold text-white/65 text-center">{c.jobs}</div>
              <div className="text-[12.5px] font-semibold text-white text-right">{c.revenue}</div>
              <div className={`text-right`}>
                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md ${c.statusColor}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected detail panel */}
        <div className="border-t border-white/8 bg-[#080f1e]/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 ring-1 ring-blue-500/30 text-[14px] font-bold text-blue-300">S</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-white">Sarah M.</div>
              <div className="flex items-center gap-3 mt-0.5">
                <div className="flex items-center gap-1 text-[11px] text-white/35"><Phone className="h-3 w-3" />(555) 284-1920</div>
                <div className="flex items-center gap-1 text-[11px] text-white/35"><Mail className="h-3 w-3" />sarah@gmail.com</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-white/30">Lifetime value</div>
              <div className="text-[16px] font-bold text-white">$4,640</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating — milestone */}
      <div className="absolute -top-5 -right-3 sm:-right-6 w-[170px] rounded-xl border border-amber-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-semibold text-white">VIP Client</span>
        </div>
        <div className="text-[10.5px] text-white/40">Angela S. — 11 jobs this year</div>
      </div>
    </div>
  )
}

export default function ClientsPage() {
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
                <div className="mb-5"><SectionLabel>Platform · Clients</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Know every client.<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Serve them better.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Automax keeps complete relationship histories for every client — every job, quote, payment, and conversation, all in one place. Know who your best customers are and give them the experience they deserve.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Full job and payment history', 'VIP client identification', 'Automated re-engagement'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <ClientsMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '48+', label: 'Avg. clients per business' },
          { value: '3×', label: 'More repeat bookings' },
          { value: '40%', label: 'Revenue from repeat clients' },
          { value: '100%', label: 'Contact history preserved' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you get</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Your most valuable asset is your client list.
              </h2>
              <p className="mt-3 text-[15px] text-white/45 max-w-xl mx-auto">
                Repeat clients cost 5× less to book than new ones. Automax helps you identify, nurture, and re-engage your best customers automatically.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Users, color: 'bg-blue-500/15 text-blue-400', title: 'Complete Client Profiles', desc: 'Name, contact, address, property notes, job history, quotes sent, and payments received — all in one clean view.' },
                { icon: History, color: 'bg-violet-500/15 text-violet-400', title: 'Full Relationship Timeline', desc: 'See every touchpoint — messages, quotes, jobs, reviews, and payments — in chronological order for every client.' },
                { icon: Star, color: 'bg-amber-500/15 text-amber-400', title: 'VIP Client Identification', desc: 'Automax automatically flags your highest-value clients based on job count and revenue so you can prioritize them.' },
                { icon: Heart, color: 'bg-pink-500/15 text-pink-400', title: 'Re-Engagement Campaigns', desc: 'Clients who haven\'t booked in 60, 90, or 120 days get an automatic follow-up — personalized, friendly, effective.' },
                { icon: MapPin, color: 'bg-emerald-500/15 text-emerald-400', title: 'Address & Property Notes', desc: 'Save property details, gate codes, preferred scheduling windows, and recurring service notes per client.' },
                { icon: Phone, color: 'bg-teal-500/15 text-teal-400', title: 'One-Tap Communication', desc: 'Text, call, or email any client directly from their profile. Communication history is logged automatically.' },
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
                <SectionLabel>Client lifecycle</SectionLabel>
                <h2 className="mt-4 text-[28px] sm:text-[36px] font-bold text-white tracking-tight leading-tight mb-6">
                  Turn first-time customers into long-term clients.
                </h2>
                <div className="space-y-5">
                  {[
                    { title: 'First job completed', desc: 'Client record is created automatically with full contact and job details.' },
                    { title: 'Review requested', desc: 'Automax sends a review request via text 24h after the job. No manual action needed.' },
                    { title: 'Second booking triggered', desc: 'After 60 days, a friendly re-engagement message goes out to bring them back.' },
                    { title: 'VIP status earned', desc: 'After 5+ jobs, the client is flagged as VIP — giving you a clear priority list to protect.' },
                  ].map((s, i) => (
                    <div key={s.title} className="flex gap-4">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/20 ring-1 ring-blue-500/25 text-[12px] font-bold text-blue-400">
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
                  { metric: '5×', desc: 'Cheaper to re-book a past client than acquire a new one', accent: true },
                  { metric: '40%', desc: 'Of top-performing contractors\' revenue comes from repeat clients', accent: false },
                  { metric: '3×', desc: 'More repeat bookings with automated re-engagement', accent: false },
                  { metric: '4.9★', desc: 'Average Google rating after 90 days of review automation', accent: false },
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
          headline={<>Build relationships<br /><span className="text-blue-400">that last for years.</span></>}
          sub="Start your free trial and see your full client history in one place — from day one."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
