// GET /api/quotes/[id]  — fetch single quote with items
// PUT /api/quotes/[id]  — update quote + items

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyId, getQuoteWithItems, updateQuote } from '@/lib/quotes'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const quote = await getQuoteWithItems(supabase, id, companyId)
    if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ quote })
  } catch (err) {
    console.error(`GET /api/quotes/${id}:`, err)
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    await updateQuote(supabase, id, body, companyId)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`PUT /api/quotes/${id}:`, err)
    const detail = err instanceof Error ? err.message : JSON.stringify(err)
    return NextResponse.json({ error: 'Failed to update quote', detail }, { status: 500 })
  }
}
