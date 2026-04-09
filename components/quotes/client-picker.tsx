'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Users, Phone, Mail, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface PickedClient {
  full_name: string
  phone: string | null
  email: string | null
  address: string | null
}

interface Client {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  address: string | null
  status: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (client: PickedClient) => void
}

export function ClientPicker({ open, onOpenChange, onSelect }: Props) {
  const [search, setSearch]     = useState('')
  const [clients, setClients]   = useState<Client[]>([])
  const [loading, setLoading]   = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!open) { setSearch(''); setClients([]); return }
    load('')
  }, [open])

  function load(q: string) {
    setLoading(true)
    const url = q.trim() ? `/api/clients?q=${encodeURIComponent(q)}` : '/api/clients'
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setClients(d.clients ?? []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }

  function handleSearch(value: string) {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => load(value), 250)
  }

  function handleSelect(client: Client) {
    onSelect({
      full_name: client.full_name,
      phone: client.phone,
      email: client.email,
      address: client.address,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border">
          <DialogTitle className="text-[15px] font-bold">Select Client</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="h-9 pl-8 text-[13px]"
              placeholder="Search by name, phone, or email…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[340px]">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Users className="h-6 w-6 text-muted-foreground/30" />
              <p className="text-[13px] text-muted-foreground">
                {search ? 'No clients match your search' : 'No clients yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleSelect(client)}
                  className={cn(
                    'w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors',
                    'hover:bg-secondary/50 active:bg-secondary'
                  )}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600 font-semibold text-[13px] select-none">
                    {client.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-foreground">{client.full_name}</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      {client.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Phone className="h-3 w-3" />{client.phone}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[160px]">{client.email}</span>
                        </div>
                      )}
                    </div>
                    {client.address && (
                      <div className="text-[11px] text-muted-foreground/60 mt-0.5 truncate">{client.address}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
