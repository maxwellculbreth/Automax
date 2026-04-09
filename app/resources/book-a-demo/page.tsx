import Link from 'next/link'
import { ArrowRight, Check, CalendarDays, Clock, Users, Star, Shield, Zap } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, SectionLabel, StatStrip } from '@/components/marketing/platform-shared'

export default function BookADemoPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-blue-700/18 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/12 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Left: copy */}
              <div>
                <div className="mb-5">
                  <SectionLabel>Resources · Book a Demo</SectionLabel>
                </div>
                <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                  See Automax live<br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    in 20 minutes.
                  </span>
                </h1>
                <p className="text-[17px] text-white/55 leading-relaxed max-w-[460px] mb-8">
                  We'll walk you through the platform live — your industry, your workflow, your questions. No sales pressure. Just a real look at how Automax works for businesses like yours.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: Clock,   text: '20-minute call — focused and efficient' },
                    { icon: Users,   text: 'Tailored to your specific business type' },
                    { icon: Shield,  text: 'No pressure — see it before you commit' },
                    { icon: Zap,     text: 'Live demo of AI response, quoting, and automation' },
                  ].map(item => {
                    const Icon = item.icon
                    return (
                      <div key={item.text} className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 flex-shrink-0">
                          <Icon className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                        <span className="text-[14px] text-white/65">{item.text}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {['No credit card required', 'Setup in under 10 minutes', '14-day free trial after demo'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[13px] text-white/40">
                      <Check className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: demo booking card */}
              <div className="rounded-2xl border border-white/10 bg-[#0d1831] p-8 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                    <CalendarDays className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-white">Book Your Demo</div>
                    <div className="text-[12px] text-white/40">Usually available within 24 hours</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {['Monday – Friday, 9am – 6pm ET', 'Same-day slots often available', 'Or start your free trial right now'].map(line => (
                    <div key={line} className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-[13px] text-white/55">{line}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Link
                    href="/auth/sign-up"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-3.5 text-[14px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.40)] hover:from-blue-400 hover:to-blue-500 transition-all"
                  >
                    Start Free Trial Instead <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="text-center text-[12px] text-white/30">
                    Prefer to just try it? Free trial includes full access — no demo needed.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/8">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-semibold text-white/70">What others say about the demo</span>
                  </div>
                  {[
                    { text: '"20 minutes and I knew it was exactly what I needed."', name: 'Marcus T., pressure washing' },
                    { text: '"No fluff. They showed me exactly how it would work for my business."', name: 'Jordan M., landscaping' },
                  ].map(q => (
                    <div key={q.name} className="mb-3 last:mb-0">
                      <p className="text-[12px] text-white/50 italic leading-snug">{q.text}</p>
                      <p className="text-[11px] text-white/30 mt-1">{q.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <StatStrip stats={[
          { value: '20m',  label: 'Average demo length' },
          { value: '94%',  label: 'Start trial after demo' },
          { value: '< 24h', label: 'To get a slot' },
          { value: '500+', label: 'Businesses onboarded' },
        ]} />

        {/* What we cover */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What we cover</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                Focused. Practical.<br className="hidden sm:block" />
                No wasted time.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { num: '01', title: 'Your Business First', desc: 'We start by understanding your business — service type, team size, biggest pain points. Then we show you what\'s relevant.' },
                { num: '02', title: 'Lead-to-Job Walkthrough', desc: 'Live demo of how a new lead flows through AI response, quoting, scheduling, and payment collection.' },
                { num: '03', title: 'Automation in Action', desc: 'We show you the follow-up sequences, review requests, and workflows that run automatically after you set them up once.' },
                { num: '04', title: 'Revenue Dashboard', desc: 'A quick look at the insights and reporting so you understand how Automax tracks your growth over time.' },
                { num: '05', title: 'Your Questions', desc: 'We leave plenty of time for your questions. No topic is off limits — pricing, integrations, setup time, migration.' },
                { num: '06', title: 'Next Steps', desc: 'We\'ll help you figure out the fastest path to getting started — free trial, migration help, or a custom onboarding plan.' },
              ].map(s => (
                <div key={s.num} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
                  <div className="text-[11px] font-bold text-blue-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0a1525] border-y border-white/8 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
            <SectionLabel>Ready to see it?</SectionLabel>
            <h2 className="mt-4 text-[32px] sm:text-[42px] font-bold text-white tracking-tight leading-tight mb-4">
              20 minutes could change<br />how you run your business.
            </h2>
            <p className="text-[16px] text-white/45 max-w-md mx-auto mb-8">
              Or skip the demo and start your free trial right now. Full access, no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/sign-up" className={BLUE_BTN}>
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
