import Link from 'next/link'
import {
  ArrowRight, Check,
  Droplets, Leaf, Sparkles, Car,
  Bug, Waves, Trash2, Grid2x2,
  FileText, MessageSquare, Zap,
} from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel } from '@/components/marketing/platform-shared'

const INDUSTRIES = [
  {
    slug: 'pressure-washing',
    label: 'Pressure Washing',
    desc: 'Service-type quote templates, seasonal re-engagement, and automatic review requests built for wash pros.',
    icon: Droplets,
    accent: 'group-hover:border-blue-500/35 group-hover:bg-blue-500/[0.04]',
    iconColor: 'bg-blue-500/15 text-blue-400',
    highlights: ['House wash & roof treatment templates', 'Spring season campaigns', 'Upsell add-ons built in'],
  },
  {
    slug: 'landscaping',
    label: 'Landscaping',
    desc: 'Recurring job automation, crew scheduling, and seasonal campaigns for businesses that run on volume.',
    icon: Leaf,
    accent: 'group-hover:border-emerald-500/35 group-hover:bg-emerald-500/[0.04]',
    iconColor: 'bg-emerald-500/15 text-emerald-400',
    highlights: ['Recurring mowing & maintenance schedules', 'Route-optimized crew dispatch', 'Seasonal campaign triggers'],
  },
  {
    slug: 'cleaning',
    label: 'Cleaning',
    desc: 'Recurring booking automation, detailed client profiles, and cancellation recovery for residential and commercial cleaners.',
    icon: Sparkles,
    accent: 'group-hover:border-purple-500/35 group-hover:bg-purple-500/[0.04]',
    iconColor: 'bg-purple-500/15 text-purple-400',
    highlights: ['Recurring schedule automation', 'Cancellation recovery sequences', 'Automatic review requests'],
  },
  {
    slug: 'mobile-detailing',
    label: 'Mobile Detailing',
    desc: 'Mobile-first quoting, route optimization, and smart upsells for detailers who are always on the road.',
    icon: Car,
    accent: 'group-hover:border-amber-500/35 group-hover:bg-amber-500/[0.04]',
    iconColor: 'bg-amber-500/15 text-amber-400',
    highlights: ['Mobile-first quote & payment flow', 'Route optimization by zone', 'Return booking triggers'],
  },
  {
    slug: 'pest-control',
    label: 'Pest Control',
    desc: 'Instant lead response, treatment-specific quotes, and recurring plan upsells for pest control operators.',
    icon: Bug,
    accent: 'group-hover:border-orange-500/35 group-hover:bg-orange-500/[0.04]',
    iconColor: 'bg-orange-500/15 text-orange-400',
    highlights: ['Same-day booking flow', 'Recurring treatment plan upsells', 'Route-optimized scheduling'],
  },
  {
    slug: 'pool-service',
    label: 'Pool Service',
    desc: 'Weekly route management, seasonal opening/closing campaigns, and repair quote templates for pool pros.',
    icon: Waves,
    accent: 'group-hover:border-cyan-500/35 group-hover:bg-cyan-500/[0.04]',
    iconColor: 'bg-cyan-500/15 text-cyan-400',
    highlights: ['Weekly recurring route automation', 'Seasonal campaign triggers', 'Equipment repair quotes'],
  },
  {
    slug: 'junk-removal',
    label: 'Junk Removal',
    desc: 'Fast quotes, same-day booking, and route-optimized dispatch for junk removal operators who need to move fast.',
    icon: Trash2,
    accent: 'group-hover:border-slate-400/25 group-hover:bg-slate-500/[0.04]',
    iconColor: 'bg-slate-500/20 text-slate-300',
    highlights: ['Same-day booking automation', 'Load-based quote templates', 'Multi-stop route stacking'],
  },
  {
    slug: 'window-cleaning',
    label: 'Window Cleaning',
    desc: 'Recurring schedule automation, res/commercial quote templates, and route optimization for window cleaning businesses.',
    icon: Grid2x2,
    accent: 'group-hover:border-sky-500/35 group-hover:bg-sky-500/[0.04]',
    iconColor: 'bg-sky-500/15 text-sky-400',
    highlights: ['Recurring schedule automation', 'Res & commercial quote templates', 'Commercial account management'],
  },
]

const SHARED_CAPABILITIES = [
  { icon: MessageSquare, label: 'AI lead response in under 60 seconds' },
  { icon: FileText,      label: 'Industry-aware quote templates' },
  { icon: Zap,           label: 'Automated follow-ups and review requests' },
]

export default function IndustriesIndexPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[760px]">
              <div className="mb-5">
                <SectionLabel>Industry Portals</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[58px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Built for how your<br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  industry actually runs.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[560px] mb-8">
                Automax adapts to the quoting logic, follow-up style, and workflow of each service trade — not the other way around. Every industry portal is tuned to how operators in that trade actually price, schedule, and communicate.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/auth/sign-up" className={BLUE_BTN}>
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className={GHOST_BTN}>
                  View Pricing
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {SHARED_CAPABILITIES.map(c => {
                  const Icon = c.icon
                  return (
                    <div key={c.label} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Icon className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                      {c.label}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── How it adapts ────────────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-y border-white/8 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Industry-Aware Quoting',
                  desc: 'Templates, line items, and pricing structures are tuned for each trade — from load-based junk removal quotes to pane-count window cleaning estimates.',
                },
                {
                  title: 'AI Tuned to Your Trade',
                  desc: 'AutoMe learns how operators in your industry respond to leads, qualify jobs, and handle objections — so its replies feel natural, not generic.',
                },
                {
                  title: 'Workflows That Match How You Work',
                  desc: 'Recurring routes for pool and cleaning, seasonal campaigns for landscaping, same-day urgency for junk removal. The flow fits your trade.',
                },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-blue-500/25 mt-0.5">
                    <Check className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-[13px] text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Industry grid ────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>Supported Industries</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[42px] font-bold tracking-tight text-white leading-tight">
                8 specialized portals.<br className="hidden sm:block" />
                One platform.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Each portal is built around how that trade operates — with quoting logic, workflows, and AI behavior tuned accordingly. The underlying platform is shared. The experience is specific.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {INDUSTRIES.map(ind => {
                const Icon = ind.icon
                return (
                  <Link
                    key={ind.slug}
                    href={`/industries/${ind.slug}`}
                    className={`group rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-200 flex flex-col ${ind.accent}`}
                  >
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${ind.iconColor} mb-4 flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-white transition-colors">{ind.label}</h3>
                    <p className="text-[12.5px] text-white/40 leading-relaxed mb-5 flex-1">{ind.desc}</p>
                    <ul className="space-y-1.5 mb-5">
                      {ind.highlights.map(h => (
                        <li key={h} className="flex items-start gap-2 text-[12px] text-white/35">
                          <Check className="h-3 w-3 text-emerald-400/60 flex-shrink-0 mt-0.5" />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1 text-[12.5px] font-semibold text-white/35 group-hover:text-blue-400 transition-colors mt-auto">
                      View portal <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── More coming callout ──────────────────────────────────────────── */}
        <section className="bg-[#0a1525] border-t border-white/8 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/8 via-indigo-600/5 to-transparent p-8 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <SectionLabel>More Industries Coming</SectionLabel>
                <h2 className="mt-4 text-[26px] sm:text-[32px] font-bold text-white tracking-tight leading-tight mb-3">
                  Don't see your trade?
                </h2>
                <p className="text-[15px] text-white/50 leading-relaxed max-w-xl">
                  Automax is built on a flexible foundation — the quoting logic, AI behavior, and workflows are configurable to nearly any local service trade. If your industry isn't listed yet, you can start on our general platform today while we build out a dedicated portal.
                </p>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {['HVAC', 'Electrical', 'Plumbing', 'Painting', 'Roofing', 'Tree Service'].map(trade => (
                    <li key={trade} className="text-[13px] text-white/35 font-medium">{trade}</li>
                  ))}
                  <li className="text-[13px] text-white/20 font-medium">+ more</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3 lg:min-w-[220px]">
                <Link href="/auth/sign-up" className={BLUE_BTN}>
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/resources/book-a-demo" className={GHOST_BTN}>
                  Book a Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
