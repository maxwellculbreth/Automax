// GET  /api/quotes      — list all quotes for the current user's company
// POST /api/quotes      — create a new quote (+ items)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyId, listQuotes, createQuote } from '@/lib/quotes'

export async function GET() {
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const quotes = await listQuotes(supabase, companyId)
    return NextResponse.json({ quotes })
  } catch (err) {
    console.error('GET /api/quotes:', err)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const quote = await createQuote(supabase, body, companyId)
    return NextResponse.json({ quote }, { status: 201 })
  } catch (err) {
    console.error('POST /api/quotes:', err)
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
  }
}
