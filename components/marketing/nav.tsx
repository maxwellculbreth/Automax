'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Menu, X, ChevronDown, ArrowRight,
  LayoutDashboard, Inbox, FileText, Users, Kanban, BarChart2,
  Star, Globe, MousePointerClick, Mail, Shield,
  Bot, Bell, Calendar, Zap, TrendingUp,
  Droplets, Leaf, Sparkles, Car, Bug, Waves, Trash2, Grid2x2,
  BookOpen, CalendarDays, HelpCircle, Calculator,
  BrainCircuit,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  desc: string
  href: string
  icon: React.ElementType
  badge?: string
}

type NavMenu = {
  label: string
  cols: 2 | 3 | 4
  items: NavItem[]
  featuredItem?: NavItem & { tagline?: string }
  footerLink?: { label: string; href: string }
}

const NAV_MENUS: Record<string, NavMenu> = {
  platform: {
    label: 'Platform',
    cols: 3,
    items: [
      { label: 'CRM Overview',       desc: 'Your full business in one place',       href: '/platform/crm-overview',       icon: LayoutDashboard },
      { label: 'Lead Inbox',          desc: 'Capture and respond instantly',         href: '/platform/lead-inbox',          icon: Inbox },
      { label: 'Quotes & Payments',   desc: 'Send professional quotes in minutes',   href: '/platform/quotes-payments',     icon: FileText },
      { label: 'Clients',             desc: 'Manage relationships and history',      href: '/platform/clients',             icon: Users },
      { label: 'Pipeline & Jobs',     desc: 'Track every job from lead to done',     href: '/platform/pipeline-jobs',       icon: Kanban },
      { label: 'Business Dashboard',  desc: 'Revenue, jobs, and KPIs at a glance',  href: '/platform/business-dashboard',  icon: BarChart2 },
    ],
  },
  growth: {
    label: 'Growth',
    cols: 3,
    items: [
      { label: 'Google Reviews',      desc: 'Automate review requests after every job', href: '/growth/google-reviews',       icon: Star },
      { label: 'Website Builder',     desc: 'Professional site built free for you',     href: '/growth/website-builder',      icon: Globe },
      { label: 'Lead Capture',        desc: 'Convert website visitors into leads',      href: '/growth/lead-capture',         icon: MousePointerClick },
      { label: 'Follow-Up Campaigns', desc: 'Re-engage cold leads automatically',       href: '/growth/follow-up-campaigns',  icon: Mail },
      { label: 'Reputation Tools',    desc: 'Dominate local search and trust signals',  href: '/growth/reputation-tools',     icon: Shield },
    ],
  },
  automation: {
    label: 'Automation',
    cols: 2,
    featuredItem: {
      label: 'AutoMe',
      desc: 'AI that learns how you run the business — your pricing, your voice, your way of working.',
      tagline: 'Flagship AI',
      href: '/automation/autome',
      icon: BrainCircuit,
    },
    items: [
      { label: 'AI Assistant',        desc: 'Qualifies leads and drafts replies',    href: '/automation/ai-assistant',        icon: Bot },
      { label: 'Smart Follow-Ups',    desc: 'Never let a lead go cold again',        href: '/automation/smart-follow-ups',    icon: Bell },
      { label: 'Scheduling',          desc: 'Book jobs without the back-and-forth',  href: '/automation/scheduling',          icon: Calendar },
      { label: 'Workflow Automation', desc: 'Build custom trigger-action sequences', href: '/automation/workflow-automation', icon: Zap },
      { label: 'Revenue Insights',    desc: 'Forecast and track growth over time',   href: '/automation/revenue-insights',    icon: TrendingUp },
    ],
  },
  industries: {
    label: 'Industries',
    cols: 4,
    items: [
      { label: 'Pressure Washing', desc: 'Built for wash pros',         href: '/industries/pressure-washing', icon: Droplets },
      { label: 'Landscaping',      desc: 'Manage seasonal volume',      href: '/industries/landscaping',      icon: Leaf },
      { label: 'Cleaning',         desc: 'Recurring client tools',      href: '/industries/cleaning',         icon: Sparkles },
      { label: 'Mobile Detailing', desc: 'Route and book faster',       href: '/industries/mobile-detailing', icon: Car },
      { label: 'Pest Control',     desc: 'Route, quote, and follow up', href: '/industries/pest-control',     icon: Bug },
      { label: 'Pool Service',     desc: 'Recurring route management',  href: '/industries/pool-service',     icon: Waves },
      { label: 'Junk Removal',     desc: 'Fast quotes, full calendar',  href: '/industries/junk-removal',     icon: Trash2 },
      { label: 'Window Cleaning',  desc: 'Residential & commercial',    href: '/industries/window-cleaning',  icon: Grid2x2 },
    ],
    footerLink: { label: 'View all supported industries', href: '/industries' },
  },
  resources: {
    label: 'Resources',
    cols: 2,
    items: [
      { label: 'Case Studies',   desc: 'See how contractors grow with Automax', href: '/resources/case-studies',   icon: BookOpen },
      { label: 'Book a Demo',    desc: 'See the platform live in 20 minutes',   href: '/resources/book-a-demo',    icon: CalendarDays },
      { label: 'Help Center',    desc: 'Guides, docs, and support',             href: '/resources/help-center',    icon: HelpCircle },
      { label: 'ROI Calculator', desc: 'Estimate your growth potential',        href: '/resources/roi-calculator', icon: Calculator },
    ],
  },
}

type MenuKey = keyof typeof NAV_MENUS

export function MarketingNav() {
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function openMenu(key: MenuKey) {
    if (timerRef.current) clearTimeout(timerRef.current)
    setActiveMenu(key)
  }
  function scheduleClose() {
    timerRef.current = setTimeout(() => setActiveMenu(null), 140)
  }
  function cancelClose() {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const menu = activeMenu ? NAV_MENUS[activeMenu] : null

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-[#080f1e]/95 backdrop-blur-md border-b border-white/8 shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-500 to-indigo-700 shadow-[0_2px_10px_rgba(59,130,246,0.35)]">
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] tracking-tight select-none">
              <span className="font-bold text-white">Auto</span>
              <span className="font-light text-blue-400/80">max</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {(Object.keys(NAV_MENUS) as MenuKey[]).map(key => (
              <button
                key={key}
                onMouseEnter={() => openMenu(key)}
                onMouseLeave={scheduleClose}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-md text-[13px] font-medium transition-colors',
                  activeMenu === key ? 'text-white' : 'text-white/60 hover:text-white',
                )}
              >
                {NAV_MENUS[key].label}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-150', activeMenu === key && 'rotate-180')} />
              </button>
            ))}
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-md text-[13px] font-medium text-white/60 hover:text-white transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <Link href="/auth/login" className="text-[13px] font-medium text-white/60 hover:text-white transition-colors px-3 py-2">
              Log In
            </Link>
            <Link
              href="/auth/sign-up"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(59,130,246,0.35)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_18px_rgba(59,130,246,0.45)] transition-all duration-150"
            >
              Start Free Trial
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mega-menu dropdown ───────────────────────────────────────────── */}
      {activeMenu && menu && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="hidden lg:block absolute top-full inset-x-0 border-t border-white/8 bg-[#080f1e]/98 backdrop-blur-md shadow-[0_20px_60px_-8px_rgba(0,0,0,0.6)]"
        >
          <div className="mx-auto max-w-7xl px-10 py-7">

            {/* Featured item (AutoMe) */}
            {menu.featuredItem && (() => {
              const FeaturedIcon = menu.featuredItem.icon
              return (
                <Link
                  href={menu.featuredItem.href}
                  className="flex items-center gap-4 rounded-xl px-5 py-4 mb-5 bg-gradient-to-r from-indigo-600/12 via-purple-600/8 to-transparent border border-indigo-500/20 hover:border-indigo-400/35 hover:from-indigo-600/18 hover:via-purple-600/12 transition-all duration-200 group max-w-[680px]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/20 ring-1 ring-indigo-400/30 group-hover:ring-indigo-400/50 transition-colors">
                    <FeaturedIcon className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-bold text-white group-hover:text-white transition-colors">{menu.featuredItem.label}</span>
                      {menu.featuredItem.tagline && (
                        <span className="text-[10px] font-semibold tracking-wide text-indigo-300 bg-indigo-500/15 border border-indigo-400/20 rounded-full px-2 py-0.5">{menu.featuredItem.tagline}</span>
                      )}
                    </div>
                    <div className="text-[12.5px] text-white/45 group-hover:text-white/60 transition-colors leading-snug">{menu.featuredItem.desc}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              )
            })()}

            <div
              className={cn(
                'grid',
                menu.cols === 4
                  ? 'grid-cols-4 gap-x-5 gap-y-1 max-w-[1080px]'
                  : menu.cols === 3
                  ? 'grid-cols-3 gap-x-8 gap-y-1 max-w-[960px]'
                  : 'grid-cols-2 gap-x-8 gap-y-1 max-w-[660px]',
              )}
            >
              {menu.items.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-3.5 rounded-xl px-4 py-3.5 hover:bg-white/[0.05] transition-colors group"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-white/10 group-hover:bg-blue-600/15 group-hover:ring-blue-500/25 transition-colors mt-0.5">
                      <Icon className="h-4 w-4 text-white/40 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold text-white/85 group-hover:text-white transition-colors leading-snug">{item.label}</div>
                      {item.desc && <div className="text-[12px] text-white/40 mt-0.5 leading-snug">{item.desc}</div>}
                    </div>
                  </Link>
                )
              })}
            </div>

            {menu.footerLink && (
              <div className="mt-4 pt-4 border-t border-white/8">
                <Link
                  href={menu.footerLink.href}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-white/40 hover:text-blue-300 transition-colors group"
                >
                  {menu.footerLink.label}
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile menu ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#080f1e] border-t border-white/8">
          <div className="px-5 py-4 space-y-1">
            {(Object.keys(NAV_MENUS) as MenuKey[]).map(key => (
              <div key={key}>
                <div className="px-3 py-2 text-[11px] font-semibold text-white/35 uppercase tracking-wider">
                  {NAV_MENUS[key].label}
                </div>
                {/* Featured item on mobile */}
                {NAV_MENUS[key].featuredItem && (() => {
                  const fi = NAV_MENUS[key].featuredItem!
                  const FiIcon = fi.icon
                  return (
                    <Link
                      key={fi.label}
                      href={fi.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-semibold text-indigo-300 hover:text-white transition-colors"
                    >
                      <FiIcon className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                      {fi.label}
                      {fi.tagline && <span className="text-[10px] text-indigo-400/70 font-normal ml-1">— {fi.tagline}</span>}
                    </Link>
                  )
                })()}
                {NAV_MENUS[key].items.map(item => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-white/65 hover:text-white transition-colors"
                    >
                      <Icon className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            ))}
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-[14px] font-medium text-white/65 hover:text-white">Pricing</Link>
          </div>
          <div className="px-5 pb-5 pt-3 border-t border-white/8 flex flex-col gap-2.5">
            <Link href="/auth/login" className="flex items-center justify-center rounded-lg border border-white/15 px-4 py-2.5 text-[14px] font-medium text-white/70 hover:text-white">
              Log In
            </Link>
            <Link href="/auth/sign-up" className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2.5 text-[14px] font-semibold text-white">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
