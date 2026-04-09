import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyId } from '@/lib/quotes'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error || !client) {
    if (error) console.error(`GET /api/clients/${id}:`, error)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Fetch related quotes by matching phone or email
  const conditions: string[] = []
  if (client.email) conditions.push(`email.eq.${client.email}`)
  if (client.phone) conditions.push(`phone.eq.${client.phone}`)

  let quotes: unknown[] = []
  if (conditions.length > 0) {
    const { data } = await supabase
      .from('quotes')
      .select('id, quote_number, quote_title, status, total, created_at')
      .eq('company_id', companyId)
      .or(conditions.join(','))
      .order('created_at', { ascending: false })
      .limit(10)
    quotes = data ?? []
  }

  return NextResponse.json({ client, quotes })
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
    const { error } = await supabase
      .from('clients')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('company_id', companyId)

    if (error) {
      console.error(`PUT /api/clients/${id}:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`PUT /api/clients/${id} exception:`, err)
    const detail = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update client', detail }, { status: 500 })
  }
}
