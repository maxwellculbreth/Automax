'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Zap } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingShell } from '@/components/marketing/marketing-shell'
import { cn } from '@/lib/utils'

// ── Plan definitions ──────────────────────────────────────────────────────────

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    tagline: 'Everything to get organized and quoting.',
    monthlyPrice: 49,
    annualMonthly: 39,
    annualTotal: 468,
    highlight: false,
    badge: null,
    cta: 'Start Free Trial',
    features: [
      'Lead Inbox',
      'Pipeline & Jobs',
      'Quotes (unlimited)',
      'Clients CRM',
      'Finance basics',
      'Review request automation',
      'Basic follow-up reminders',
      '1 user',
      'Email support',
      'Basic reporting',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    tagline: 'Automated growth for serious operators.',
    monthlyPrice: 119,
    annualMonthly: 89,
    annualTotal: 1068,
    highlight: false,
    badge: 'Most Popular',
    cta: 'Start Free Trial',
    features: [
      'Everything in Starter',
      'Automated follow-up sequences',
      'Two-way messaging hub',
      'AI reply suggestions',
      'Website + lead capture tools',
      'Review growth campaigns',
      'Advanced automations',
      'Complimentary website setup',
      'Up to 3 users',
      'Priority email support',
      'Advanced reporting',
      'API access',
    ],
  },
  {
    key: 'max',
    name: 'Max',
    tagline: 'The full operating system. No limits.',
    monthlyPrice: 199,
    annualMonthly: 149,
    annualTotal: 1788,
    highlight: true,
    badge: 'Best Value',
    cta: 'Start Free Trial',
    features: [
      'Everything in Pro',
      'Advanced AI Assistant',
      'AI quote drafting & estimating',
      'Premium workflow automation',
      'Revenue insights & projections',
      'Premium website + conversion tools',
      'Complimentary website setup',
      'Unlimited users',
      'Dedicated onboarding',
      'Priority phone & chat support',
      'White-label client portal',
      'Custom integrations',
    ],
  },
]

const FAQ = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — all plans include a 14-day free trial with no credit card required. You can explore the full feature set for your plan before committing.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Absolutely. You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately.',
  },
  {
    q: 'What counts as a "user"?',
    a: 'A user is any team member who has a login to your Automax account. Starter supports 1 user, Pro supports up to 3, and Max supports unlimited users.',
  },
  {
    q: 'How does the free website work?',
    a: 'Pro and Max subscribers receive a complimentary professional website built by our team. We design it, you review and approve it, then we launch it — connected to your Automax lead inbox. There are no hidden fees or catch. It\'s part of your plan.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Automax is built on enterprise-grade infrastructure with row-level security, encrypted data at rest and in transit, and strict access controls. We never sell your data.',
  },
  {
    q: 'Do you offer discounts for annual plans?',
    a: 'Yes — paying annually saves you up to 25% compared to monthly. You can see the exact savings in the pricing cards above when you toggle to Annual.',
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <MarketingShell>
    <div className="bg-background">
      <MarketingNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#080f1e] overflow-hidden pt-16 pb-20">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="relative mx-auto max-w-3xl px-5 sm:px-6 text-center pt-14 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 mb-5">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            <span className="text-[12px] font-semibold text-blue-300 tracking-wide">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-[40px] sm:text-[52px] font-bold text-white tracking-tight leading-tight mb-4">
            Pick the plan that<br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              fits your operation.
            </span>
          </h1>
          <p className="text-[17px] text-white/50 max-w-md mx-auto leading-relaxed">
            All plans include a 14-day free trial. No credit card required to start.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                'rounded-lg px-5 py-2 text-[13px] font-semibold transition-all',
                !annual ? 'bg-white text-[#080f1e] shadow-sm' : 'text-white/50 hover:text-white',
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                'rounded-lg px-5 py-2 text-[13px] font-semibold transition-all flex items-center gap-2',
                annual ? 'bg-white text-[#080f1e] shadow-sm' : 'text-white/50 hover:text-white',
              )}
            >
              Annual
              <span className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors',
                annual ? 'bg-emerald-500/15 text-emerald-600' : 'bg-emerald-500/15 text-emerald-400',
              )}>
                Save 25%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Plan cards ───────────────────────────────────────────────────── */}
      <section className="bg-background -mt-10 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-5 items-stretch">
            {PLANS.map(plan => {
              const price = annual ? plan.annualMonthly : plan.monthlyPrice

              return (
                <div
                  key={plan.key}
                  className={cn(
                    'relative flex flex-col rounded-3xl border transition-all duration-200',
                    plan.highlight
                      ? 'border-blue-500/40 bg-gradient-to-b from-[#0d1f48] to-[#0a1630] shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_24px_80px_-12px_rgba(59,130,246,0.25)]'
                      : 'border-border bg-card shadow-sm hover:border-blue-500/20 hover:shadow-md',
                  )}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className={cn(
                        'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider',
                        plan.highlight
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_4px_14px_rgba(59,130,246,0.4)]'
                          : 'bg-gradient-to-r from-amber-950/90 to-yellow-950/90 border border-amber-500/40 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.18)]',
                      )}>
                        {plan.highlight && <Zap className="h-3 w-3" />}
                        {!plan.highlight && (
                          <svg className="h-3 w-3 fill-amber-400" viewBox="0 0 12 12">
                            <path d="M6 1l1.12 3.45H11l-2.94 2.14 1.12 3.45L6 8l-3.18 2.04 1.12-3.45L.94 4.45H4.88z"/>
                          </svg>
                        )}
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    {/* Plan header */}
                    <div className="mb-6">
                      <h2 className="text-[18px] font-bold mb-1 text-white">
                        {plan.name}
                      </h2>
                      <p className={cn('text-[13px]', plan.highlight ? 'text-white/60' : 'text-white/50')}>
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <div className="flex items-end gap-1">
                        <span className="text-[48px] font-bold tracking-tight leading-none text-white">
                          ${price}
                        </span>
                        <span className={cn('text-[14px] mb-2', plan.highlight ? 'text-white/45' : 'text-white/40')}>
                          /mo
                        </span>
                      </div>
                      {annual && (
                        <div className={cn('text-[12px] mt-1', plan.highlight ? 'text-white/40' : 'text-white/35')}>
                          ${plan.annualTotal.toLocaleString()}/year · billed annually
                        </div>
                      )}
                      {!annual && (
                        <div className={cn('text-[12px] mt-1', plan.highlight ? 'text-white/40' : 'text-white/35')}>
                          Or ${plan.annualMonthly}/mo billed annually
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-5 mb-7">
                      {plan.highlight ? (
                        <Link
                          href="/auth/sign-up"
                          className="relative flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-5 py-3 text-[14px] font-bold text-white overflow-hidden group"
                          style={{
                            boxShadow: '0 2px 14px rgba(59,130,246,0.45)',
                          }}
                        >
                          {/* Pulse shimmer */}
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                          <span className="relative">{plan.cta}</span>
                          <ArrowRight className="relative h-4 w-4" />
                        </Link>
                      ) : (
                        <Link
                          href="/auth/sign-up"
                          className="flex items-center justify-center gap-2 w-full rounded-xl border border-white/15 bg-white/6 px-5 py-3 text-[14px] font-semibold text-white/85 hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white transition-all"
                        >
                          {plan.cta} <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                    {/* Divider */}
                    <div className={cn('border-t mb-6', plan.highlight ? 'border-white/10' : 'border-border')} />

                    {/* Features */}
                    <ul className="space-y-3 flex-1">
                      {plan.features.map(feature => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 ring-1 ring-blue-400/30">
                            <Check className="h-2.5 w-2.5 text-blue-300" />
                          </span>
                          <span className={cn('text-[13px] leading-snug', plan.highlight ? 'text-white/85' : 'text-white/75')}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Guarantee note */}
          <p className="text-center text-[13px] text-white/45 mt-8">
            All plans include a <strong className="text-white/65 font-semibold">14-day free trial</strong> — no credit card required. Cancel or change plans anytime.
          </p>
        </div>
      </section>

      {/* ── Comparison note ───────────────────────────────────────────────── */}
      <section className="bg-muted/40 dark:bg-secondary/20 border-y border-border py-16">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 text-center">
          <h2 className="text-[24px] sm:text-[30px] font-bold text-foreground tracking-tight mb-3">
            Not sure which plan is right?
          </h2>
          <p className="text-[15px] text-muted-foreground mb-6 max-w-md mx-auto">
            Start on Starter and upgrade when you&apos;re ready. Most growing businesses move to Pro within 60 days.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors"
            >
              Book a Demo
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-[14px] font-medium text-foreground hover:border-blue-500/30 hover:text-blue-600 transition-colors"
            >
              See ROI Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          <h2 className="text-[28px] sm:text-[36px] font-bold text-foreground tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQ.map(item => (
              <div key={item.q} className="rounded-2xl border border-border bg-card px-6 py-5">
                <h3 className="text-[14px] font-bold text-foreground mb-2">{item.q}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="relative bg-[#080f1e] overflow-hidden py-20 sm:py-24">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="relative mx-auto max-w-2xl px-5 sm:px-6 text-center">
          <h2 className="text-[30px] sm:text-[40px] font-bold text-white tracking-tight mb-4">
            Start your free trial today.
          </h2>
          <p className="text-[16px] text-white/50 mb-8">
            Join 500+ service businesses using Automax to win more jobs and grow their revenue.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(59,130,246,0.45)] hover:from-blue-400 hover:to-blue-500 hover:-translate-y-px transition-all"
          >
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[12px] text-white/25">No credit card required · 14-day trial · Cancel anytime</p>
        </div>
      </section>

      <MarketingFooter />
    </div>
    </MarketingShell>
  )
}
