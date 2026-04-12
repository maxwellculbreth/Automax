// Admin-only waitlist viewer — protected by middleware (requires auth).
// Accessible at /admin/waitlist once logged in.

import { createClient } from '@/lib/supabase/server'
import { Users, Mail, Phone, Building2, Calendar, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

type WaitlistEntry = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string | null
  business_type: string | null
  company_name: string | null
  source: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function AdminWaitlistPage() {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = (entries ?? []) as WaitlistEntry[]
  const total = rows.length

  return (
    <div className="px-6 py-8 max-w-6xl">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Waitlist</h1>
          </div>
          <p className="text-[13px] text-muted-foreground ml-10">
            Early-access signups from the public landing page
          </p>
        </div>

        {/* Total count badge */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
          <span className="text-[26px] font-bold text-foreground tabular-nums leading-none">{total}</span>
          <span className="text-[12px] text-muted-foreground leading-tight">
            total<br />signup{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Error state ──────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/[0.07] px-5 py-4 mb-6">
          <p className="text-[13px] text-destructive font-medium">Failed to load waitlist</p>
          <p className="text-[12px] text-destructive/70 mt-0.5">
            Make sure the <code className="font-mono">waitlist</code> table exists in Supabase and the RLS policies are applied.
          </p>
          <Link
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-[12px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open Supabase Dashboard <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {!error && rows.length === 0 && (
        <div className="rounded-2xl border border-border bg-card px-8 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mx-auto mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-[15px] font-semibold text-foreground mb-1">No signups yet</p>
          <p className="text-[13px] text-muted-foreground">
            Waitlist entries will appear here once visitors submit the form at{' '}
            <Link href="/early-access" className="text-blue-500 hover:text-blue-400 transition-colors">
              /early-access
            </Link>
          </p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────── */}
      {rows.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Name</span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Business</span>
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    Industry
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Signed up</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map(entry => (
                  <tr key={entry.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap">
                      {entry.full_name}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      <a
                        href={`mailto:${entry.email}`}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {entry.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      {entry.phone ? (
                        <a href={`tel:${entry.phone}`} className="hover:text-foreground transition-colors">
                          {entry.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground max-w-[180px] truncate">
                      {entry.company_name ?? <span className="text-muted-foreground/40">—</span>}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {entry.business_type ? (
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {entry.business_type}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap text-[12px]">
                      {formatDate(entry.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="border-t border-border px-5 py-3 bg-muted/20">
            <p className="text-[12px] text-muted-foreground">
              {total} signup{total !== 1 ? 's' : ''} · most recent first
            </p>
          </div>
        </div>
      )}

      {/* ── Setup note (always shown) ────────────────────────────────── */}
      <div className="mt-6 rounded-xl border border-border/50 bg-muted/20 px-5 py-4">
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground/70">Database setup required?</span>{' '}
          Run <code className="font-mono text-blue-400 text-[11px] bg-blue-500/10 px-1.5 py-0.5 rounded">
            supabase/migrations/20260412_add_waitlist.sql
          </code>{' '}
          in your Supabase SQL editor if the table does not exist yet.
        </p>
      </div>
    </div>
  )
}
