'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { QuoteForm } from '@/components/quotes/quote-form'
import type { Quote } from '@/lib/types/quotes'

export default function EditQuotePage() {
  const { id } = useParams<{ id: string }>()
  const [quote, setQuote] = useState<Quote | null | 'not-found'>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/quotes/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setQuote(data.quote))
      .catch(() => setQuote('not-found'))
  }, [id])

  if (quote === null) {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (quote === 'not-found') {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex flex-col items-center justify-center gap-4 px-5">
        <div className="text-center space-y-2">
          <h1 className="text-[18px] font-bold text-foreground">Quote not found</h1>
          <p className="text-[13px] text-muted-foreground">
            This quote doesn&apos;t exist or you don&apos;t have access.
          </p>
        </div>
        <Link
          href="/quotes"
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Link>
      </div>
    )
  }

  return <QuoteForm mode="edit" initialData={quote} quoteId={id} />
}
