"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Inbox,
  Kanban,
  Zap,
  Bot,
  Settings,
  ChevronLeft,
  Menu,
  Megaphone,
  LogOut,
  DollarSign,
  Sparkles,
  TrendingUp,
  Star,
  FileText,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation: { name: string; href: string; icon: React.ElementType; badge?: number; pro?: boolean; max?: boolean }[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lead Inbox", href: "/leads", icon: Inbox, badge: 2 },
  { name: "Pipeline", href: "/pipeline", icon: Kanban },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Marketing", href: "/marketing", icon: Megaphone, pro: true },
  { name: "Reviews",   href: "/reviews",   icon: Star,     pro: true },
  { name: "Automations", href: "/automations", icon: Zap },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "Autome", href: "/autome", icon: Sparkles, max: true },
  { name: "Projection", href: "/projection", icon: TrendingUp, max: true },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    // Use window.location for logout to avoid router initialization timing issues
    window.location.href = '/auth/login'
  }

  return (
    <>
      {/* Mobile menu button - prominent, always visible */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden h-14 bg-card border-b border-border flex items-center px-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-border bg-background shadow-sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2.5 ml-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br from-blue-600 to-indigo-700">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[14px] tracking-tight select-none">
            <span className="font-semibold text-foreground">Auto</span><span className="font-medium text-blue-500 dark:text-blue-400">max</span>
          </span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-200 ease-in-out",
          collapsed ? "w-[68px]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={cn(
              "flex h-14 items-center border-b border-border",
              collapsed ? "justify-center px-2" : "justify-between px-4"
            )}
          >
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2.5",
                collapsed && "justify-center"
              )}
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-blue-600 to-indigo-700">
                <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 16.5 L10 3.5 L16 16.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="7" y1="12.5" x2="13" y2="12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              {!collapsed && (
                <span className="text-[15px] tracking-tight select-none">
                  <span className="font-semibold text-foreground">Auto</span><span className="font-medium text-blue-500 dark:text-blue-400">max</span>
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-medium text-white">
                            {item.badge}
                          </span>
                        )}
                        {item.pro && (
                          <span className="flex items-center rounded bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wide">
                            Pro
                          </span>
                        )}
                        {item.max && (
                          <span className="flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-widest shadow-sm">
                            Max
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Bottom section */}
          <div className="border-t border-border px-3 py-3">
            <Link
              href="/settings"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
                pathname === "/settings" && "bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
                collapsed && "justify-center px-2"
              )}
            >
              <Settings className="h-[18px] w-[18px]" />
              {!collapsed && <span>Settings</span>}
            </Link>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground w-full",
                collapsed && "justify-center px-2"
              )}
            >
              <LogOut className="h-[18px] w-[18px]" />
              {!collapsed && <span>Logout</span>}
            </button>
            
            {/* Collapse button - desktop only */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "mt-2 hidden w-full lg:flex text-muted-foreground hover:text-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )} />
              {!collapsed && <span className="ml-2 text-[13px]">Collapse</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div
        className={cn(
          "hidden lg:block flex-shrink-0 transition-all duration-200",
          collapsed ? "w-[68px]" : "w-60"
        )}
      />
    </>
  )
}
