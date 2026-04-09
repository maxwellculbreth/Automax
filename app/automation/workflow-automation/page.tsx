import Link from 'next/link'
import { ArrowRight, Check, Zap, GitBranch, Bell, FileText, Repeat, Shield, Settings } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { BLUE_BTN, GHOST_BTN, SectionLabel, PageCTA, StatStrip } from '@/components/marketing/platform-shared'

export default function WorkflowAutomationPage() {
  return (
    <MarketingShell>
      <div className="bg-[#080f1e] min-h-screen">
        <MarketingNav />

        <section className="relative overflow-hidden pt-16">
          <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-violet-700/15 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-indigo-700/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-[700px]">
              <div className="mb-5">
                <SectionLabel>Automation · Workflow Automation</SectionLabel>
              </div>
              <h1 className="text-[38px] sm:text-[50px] lg:text-[56px] font-bold leading-[1.07] tracking-tight text-white mb-6">
                Automate the busywork.<br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Focus on the work.
                </span>
              </h1>
              <p className="text-[17px] text-white/55 leading-relaxed max-w-[540px] mb-8">
                Build trigger-action workflows that run your business in the background — from new lead to collected payment, without a single manual step.
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
                {['No code required', 'Dozens of pre-built templates', 'Custom triggers and actions'].map(f => (
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
          { value: '6h+',  label: 'Admin time saved per week' },
          { value: '40+',  label: 'Pre-built workflow templates' },
          { value: '100%', label: 'No-code setup' },
          { value: '0',    label: 'Tasks that fall through the cracks' },
        ]} />

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <SectionLabel>What it does</SectionLabel>
              <h2 className="mt-4 text-[32px] sm:text-[40px] font-bold tracking-tight text-white leading-tight">
                If this happens, do that.<br className="hidden sm:block" />
                Automatically.
              </h2>
              <p className="mt-4 text-[16px] text-white/45 max-w-xl mx-auto">
                Connect the dots between your leads, quotes, jobs, and payments with workflows that run 24/7 without you.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: GitBranch, color: 'bg-violet-500/15 text-violet-400',
                  title: 'Visual Workflow Builder',
                  desc: 'Build trigger-action sequences with a drag-and-drop editor. No code needed — if you can describe the process, you can automate it.',
                },
                {
                  icon: Zap, color: 'bg-blue-500/15 text-blue-400',
                  title: 'Dozens of Triggers',
                  desc: 'New lead, quote opened, quote approved, job scheduled, job completed, payment received — any event can kick off a workflow.',
                },
                {
                  icon: Bell, color: 'bg-amber-500/15 text-amber-400',
                  title: 'Automated Notifications',
                  desc: 'Notify yourself, your crew, or your customer at exactly the right moment. Every time, without fail.',
                },
                {
                  icon: FileText, color: 'bg-emerald-500/15 text-emerald-400',
                  title: 'Document Generation',
                  desc: 'Auto-generate job sheets, invoices, and receipts when a job status changes. Everything in writing, automatically.',
                },
                {
                  icon: Repeat, color: 'bg-pink-500/15 text-pink-400',
                  title: 'Recurring Job Logic',
                  desc: 'For repeat clients on weekly, monthly, or seasonal schedules — auto-schedule the next job when the current one closes.',
                },
                {
                  icon: Settings, color: 'bg-teal-500/15 text-teal-400',
                  title: 'Pre-Built Templates',
                  desc: 'Get started in minutes with 40+ templates built for service businesses — new lead response, post-job review request, payment reminder, and more.',
                },
              ].map(f => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-violet-500/25 hover:bg-violet-500/[0.04] transition-all duration-200">
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
                Pick a trigger. Define the action. Done.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Choose a Trigger', desc: 'Select any event in Automax — new lead, quote sent, job completed, payment received.' },
                { num: '02', title: 'Add Conditions', desc: 'Optional filters narrow when the workflow runs — by service type, value, location, or lead source.' },
                { num: '03', title: 'Define Actions', desc: 'Send a text, create a task, move a pipeline stage, generate a document — or chain multiple actions.' },
                { num: '04', title: 'Activate and Go', desc: 'Turn it on and walk away. Every matching event triggers your workflow instantly and reliably.' },
              ].map(s => (
                <div key={s.num} className="relative pl-0">
                  <div className="text-[11px] font-bold text-violet-500/50 mb-3 tracking-wider">{s.num}</div>
                  <h3 className="text-[15px] font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PageCTA
          headline={<>Less busywork.<br /><span className="text-violet-400">More business.</span></>}
          sub="Build the workflows once and let Automax run your back office while you focus on the job."
        />

        <MarketingFooter />
      </div>
    </MarketingShell>
  )
}
