'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { QuoteForm } from '@/components/quotes/quote-form'
import { DEMO_QUOTES } from '@/lib/data/demo-quotes'

export default function EditQuotePage() {
  const { id } = useParams<{ id: string }>()
  const quote = DEMO_QUOTES.find((q) => q.id === id)

  if (!quote) {
    return (
      <div className="min-h-screen bg-background pt-14 lg:pt-0 flex flex-col items-center justify-center gap-4 px-5">
        <div className="text-center space-y-2">
          <h1 className="text-[18px] font-bold text-foreground">Quote not found</h1>
          <p className="text-[13px] text-muted-foreground">
            The quote you&apos;re looking for doesn&apos;t exist or has been removed.
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
