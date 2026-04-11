// GET /api/q/[token]
// Public endpoint — no auth required.
// Fetches a quote by its public_token for customer-facing quote viewing.

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getQuoteByPublicToken } from '@/lib/quotes'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  if (!token) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const supabase = createServiceClient()
  const quote = await getQuoteByPublicToken(supabase, token)

  if (!quote) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
  }

  return NextResponse.json({ quote })
}
