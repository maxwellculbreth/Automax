import Link from 'next/link'
import { ArrowRight, Check, Globe, Zap, MapPin, Smartphone, Search, Users } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

function WebsiteMock() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto lg:mx-0">
      <div className="absolute inset-0 -m-8 bg-blue-600/10 blur-[70px] rounded-full" />

      {/* Browser frame */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0d1831] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-[#080f1e]/70">
          <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <div className="flex-1 mx-3 flex items-center gap-2 rounded-md bg-white/6 px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-[10.5px] text-white/40">pro-wash.automax.site</span>
          </div>
          <div className="text-[9px] text-white/25 flex-shrink-0">
            <Smartphone className="h-3 w-3" />
          </div>
        </div>

        {/* Website content mock */}
        <div className="bg-[#0a1525]">
          {/* Hero area */}
          <div className="relative px-5 py-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/20" />
            <div className="relative">
              <div className="text-[9.5px] font-semibold uppercase tracking-wider text-blue-400/80 mb-1.5">Austin, TX · Licensed & Insured</div>
              <div className="text-[18px] font-bold text-white leading-tight mb-2">
                Premium Pressure Washing<br />
                <span className="text-blue-400">for Austin Homeowners</span>
              </div>
              <p className="text-[11px] text-white/50 mb-4 max-w-[280px] leading-snug">
                Driveways, roofs, and home exteriors. Same-week scheduling available.
              </p>
              <div className="flex gap-2">
                <div className="rounded-lg bg-blue-600 px-4 py-1.5 text-[11px] font-bold text-white">Get a Free Quote</div>
                <div className="rounded-lg border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/70">See Our Work</div>
              </div>
            </div>
          </div>

          {/* Service cards */}
          <div className="border-t border-white/8 px-4 py-3">
            <div className="text-[9.5px] font-semibold uppercase tracking-wider text-white/25 mb-2.5">Our Services</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'House Wash', from: 'From $280' },
                { name: 'Driveway',   from: 'From $120' },
                { name: 'Roof Wash',  from: 'From $380' },
              ].map(s => (
                <div key={s.name} className="rounded-xl border border-white/8 bg-[#0d1831] px-2.5 py-2.5">
                  <div className="text-[11.5px] font-semibold text-white/85">{s.name}</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">{s.from}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead form preview */}
          <div className="border-t border-white/8 px-4 py-3">
            <div className="text-[9.5px] font-semibold uppercase tracking-wider text-white/25 mb-2">Quick Quote Request</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="h-6 rounded-md bg-white/6 border border-white/8" />
              <div className="h-6 rounded-md bg-white/6 border border-white/8" />
            </div>
            <div className="h-6 rounded-md bg-white/6 border border-white/8 mb-2" />
            <div className="h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <span className="text-[10.5px] font-bold text-white">Submit Request →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating — lead from site */}
      <div className="absolute -top-5 -right-3 sm:-right-5 w-[178px] rounded-xl border border-blue-500/25 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span className="text-[11px] font-semibold text-white">New Lead</span>
        </div>
        <div className="text-[10.5px] text-white/40">Via your website · just now</div>
        <div className="text-[11px] font-semibold text-white mt-1">Ryan K. · House Wash</div>
      </div>

      {/* Floating — SEO stat */}
      <div className="absolute -bottom-4 -left-3 sm:-left-5 w-[168px] rounded-xl border border-emerald-500/20 bg-[#0d1831] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-1">
          <Search className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-white">Local SEO</span>
        </div>
        <div className="text-[10.5px] text-white/40">340 visitors this month</div>
        <div className="text-[10px] text-emerald-400 font-medium mt-0.5">↑ 48 form submissions</div>
      </div>
    </div>
  )
}

export default function WebsiteBuilderPage() {
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
                <div className="mb-5"><SectionLabel>Growth · Website Builder</SectionLabel></div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  Your next customer<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    is searching now.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  Every Growth and Max plan includes professional website setup — built for local search, designed to convert, and wired directly into your Automax lead inbox.
                </p>
                <div className="flex flex-wrap gap-3 mb-9">
                  <Link href="/auth/sign-up" className={BLUE_BTN}>
                    Start Free Trial <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/pricing" className={GHOST_BTN}>View Pricing</Link>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['Included with Growth & Max plans', 'Mobile-first and fast', 'Leads flow straight into your inbox'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end pt-8 pb-8">
                <WebsiteMock />
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '< 7d', label: 'Average launch time' },
          { value: '68%', label: 'Leads arrive on mobile' },
          { value: '4.2×', label: 'More form fills vs avg site' },
          { value: '100%', label: 'Local SEO optimized' },
        ]} />

        {/* ── Benefits ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What you get</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[38px] font-bold text-white tracking-tight">
                Built to launch fast. Built to convert.
              </h2>
              <p className="mt-3 text-[15px] text-white/45 max-w-xl mx-auto">
                A professional, high-converting website that looks great and works hard — connected to your Automax system from day one.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Globe, color: 'bg-blue-500/15 text-blue-400', title: 'Professional Design', desc: 'Clean, modern layouts built for service businesses. Showcases your services, reviews, and contact details clearly.' },
                { icon: Smartphone, color: 'bg-violet-500/15 text-violet-400', title: 'Mobile-First', desc: '68% of service searches happen on phones. Your site is built mobile-first — fast, clean, and optimized for conversions on small screens.' },
                { icon: Search, color: 'bg-amber-500/15 text-amber-400', title: 'Local SEO Ready', desc: 'Structured for Google — service area pages, business schema, speed optimization, and all the signals that help you rank locally.' },
                { icon: Users, color: 'bg-emerald-500/15 text-emerald-400', title: 'Lead Capture Built In', desc: 'Every lead form on your site flows directly into your Automax inbox. No integrations, no third-party tools.' },
                { icon: Zap, color: 'bg-teal-500/15 text-teal-400', title: 'Fast Load Times', desc: 'Optimized images, clean code, and edge delivery. A fast website ranks better, converts better, and keeps visitors on the page.' },
                { icon: MapPin, color: 'bg-pink-500/15 text-pink-400', title: 'Service Area Pages', desc: 'Dedicated pages for each city or neighborhood you serve. More local search coverage, more calls from more areas.' },
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

        {/* ── How it works ──────────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-4 text-[30px] sm:text-[36px] font-bold text-white tracking-tight">
                From signup to live site in days.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'You sign up', desc: 'Subscribe to a Growth or Max plan. Your website setup is included — no extra charge.' },
                { num: '02', title: 'We gather your details', desc: 'Quick onboarding form: your business name, service area, services offered, and any photos.' },
                { num: '03', title: 'We build your site', desc: 'Our team builds a professional, mobile-first website in under 7 days. You review before it goes live.' },
                { num: '04', title: 'Leads flow in automatically', desc: 'Every form submission goes straight to your Automax inbox. No setup needed on your end.' },
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
          headline={<>A website that works<br /><span className="text-blue-400">as hard as you do.</span></>}
          sub="Included with Growth and Max plans. Start your free trial and get your site launched in days."
        />
        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
