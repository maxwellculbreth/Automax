import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyId } from '@/lib/quotes'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const search = searchParams.get('q')?.trim() || ''

  let query = supabase
    .from('clients')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,address.ilike.%${search}%`
    )
  }

  const { data, error } = await query
  if (error) {
    console.error('GET /api/clients:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ clients: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { full_name, first_name, last_name, phone, email, address, status, source, notes } = body

    if (!full_name && !first_name) {
      return NextResponse.json({ error: 'full_name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        company_id: companyId,
        full_name: full_name || `${first_name || ''} ${last_name || ''}`.trim(),
        first_name: first_name || null,
        last_name: last_name || null,
        phone: phone || null,
        email: email || null,
        address: address || null,
        status: status || 'active',
        source: source || null,
        notes: notes || null,
        total_revenue: 0,
        total_jobs: 0,
        total_quotes: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('POST /api/clients:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ client: data }, { status: 201 })
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to create client', detail }, { status: 500 })
  }
}
