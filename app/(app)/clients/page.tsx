'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users, UserCheck, UserPlus, TrendingUp,
  Search, Plus, Loader2, Phone, Mail, ChevronRight, Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AddClientDialog } from '@/components/clients/add-client-dialog'
import { ImportClientsDialog } from '@/components/clients/import-clients-dialog'

interface Client {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  address: string | null
  status: string
  source: string | null
  total_revenue: number
  total_jobs: number
  total_quotes: number
  last_activity_at: string | null
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active:   { label: 'Active',   className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  vip:      { label: 'VIP',      className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  inactive: { label: 'Inactive', className: 'bg-secondary text-muted-foreground' },
}

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status] ?? { label: status, className: 'bg-secondary text-muted-foreground' }
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function startOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

export default function ClientsPage() {
  const [clients, setClients]     = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAdd,    setShowAdd]    = useState(false)
  const [showImport, setShowImport] = useState(false)

  const load = () => {
    setIsLoading(true)
    fetch('/api/clients')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setClients(d.clients ?? []))
      .catch(() => setClients([]))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = clients
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.full_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.address?.toLowerCase().includes(q)
      )
    }
    return list
  }, [clients, search, statusFilter])

  const totalCount   = clients.length
  const activeCount  = clients.filter(c => c.status === 'active' || c.status === 'vip').length
  const newCount     = clients.filter(c => c.created_at >= startOfMonth()).length
  const topClient    = clients.reduce<Client | null>((top, c) =>
    !top || c.total_revenue > top.total_revenue ? c : top, null)

  const stats = [
    { label: 'Total Clients',  value: totalCount,  icon: Users,      iconClass: 'text-muted-foreground', bgClass: 'bg-secondary' },
    { label: 'Active',         value: activeCount, icon: UserCheck,   iconClass: 'text-emerald-600',      bgClass: 'bg-emerald-500/10' },
    { label: 'New This Month', value: newCount,    icon: UserPlus,    iconClass: 'text-blue-600',         bgClass: 'bg-blue-500/10' },
    {
      label: 'Top by Revenue',
      value: topClient ? formatCurrency(topClient.total_revenue) : '—',
      sub: topClient?.full_name ?? undefined,
      icon: TrendingUp,
      iconClass: 'text-violet-600',
      bgClass: 'bg-violet-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-14 lg:pt-0">

      {/* Header */}
      <div className="border-b border-border bg-card px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-bold text-foreground">Clients</h1>
            <p className="text-[12px] text-muted-foreground mt-0.5">Manage your client relationships</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-[13px] font-semibold"
              onClick={() => setShowImport(true)}
            >
              <Upload className="h-3.5 w-3.5" />
              Import List
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px]"
              onClick={() => setShowAdd(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Client
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-xl border border-border bg-card px-4 py-3.5">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[12px] text-muted-foreground">{stat.label}</span>
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', stat.bgClass)}>
                  <stat.icon className={cn('h-3.5 w-3.5', stat.iconClass)} />
                </div>
              </div>
              <div className="text-[22px] font-bold text-foreground leading-none tabular-nums">
                {isLoading ? <span className="text-muted-foreground/30">—</span> : stat.value}
              </div>
              {'sub' in stat && stat.sub && (
                <div className="text-[11px] text-muted-foreground mt-1 truncate">{stat.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="h-8 pl-8 text-[13px]"
              placeholder="Search clients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-8 rounded-md border border-input bg-background px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : clients.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center py-16 gap-3">
            <Users className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-[14px] font-medium text-foreground">No clients yet</p>
            <p className="text-[13px] text-muted-foreground">Add your first client to get started</p>
            <Button
              size="sm"
              className="mt-1 h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px]"
              onClick={() => setShowAdd(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Client
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-12 gap-2">
            <Search className="h-6 w-6 text-muted-foreground/30" />
            <p className="text-[13px] text-muted-foreground">No clients match your search</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    {['Client', 'Contact', 'Address', 'Status', 'Last Activity', 'Revenue', ''].map((h, i) => (
                      <th
                        key={i}
                        className={cn(
                          'px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-left',
                          i === 5 && 'text-right',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map(client => {
                    const cfg = getStatusCfg(client.status)
                    return (
                      <tr key={client.id} className="group hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/clients/${client.id}`}
                            className="text-[13px] font-semibold text-foreground hover:text-blue-600 transition-colors block"
                          >
                            {client.full_name}
                          </Link>
                          {client.total_jobs > 0 && (
                            <div className="text-[11px] text-muted-foreground/60 mt-0.5">
                              {client.total_jobs} job{client.total_jobs !== 1 ? 's' : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            {client.phone && (
                              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                {client.phone}
                              </div>
                            )}
                            {client.email && (
                              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate max-w-[160px]">{client.email}</span>
                              </div>
                            )}
                            {!client.phone && !client.email && (
                              <span className="text-[12px] text-muted-foreground/40">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] text-muted-foreground truncate max-w-[180px] block">
                            {client.address || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', cfg.className)}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] text-muted-foreground">
                            {timeAgo(client.last_activity_at)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-[13px] font-semibold tabular-nums">
                            {client.total_revenue > 0 ? formatCurrency(client.total_revenue) : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/clients/${client.id}`}
                            className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2.5">
              {filtered.map(client => {
                const cfg = getStatusCfg(client.status)
                return (
                  <Link key={client.id} href={`/clients/${client.id}`}>
                    <div className="rounded-xl border border-border bg-card p-4 active:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="text-[14px] font-semibold text-foreground truncate">{client.full_name}</div>
                          {client.address && (
                            <div className="text-[12px] text-muted-foreground truncate">{client.address}</div>
                          )}
                        </div>
                        <span className={cn('flex-shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold', cfg.className)}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                              <Phone className="h-3 w-3" />{client.phone}
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                              <Mail className="h-3 w-3" /><span className="truncate">{client.email}</span>
                            </div>
                          )}
                        </div>
                        {client.total_revenue > 0 && (
                          <span className="text-[13px] font-bold tabular-nums">{formatCurrency(client.total_revenue)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>

      <AddClientDialog open={showAdd} onOpenChange={setShowAdd} onCreated={load} />
      <ImportClientsDialog
        open={showImport}
        onOpenChange={setShowImport}
        onImported={load}
        existingClients={clients}
      />
    </div>
  )
}
