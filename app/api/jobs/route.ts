// GET  /api/jobs          — list all jobs for the current user's company
// GET  /api/jobs?lead_id= — list jobs for a specific lead
// POST /api/jobs          — create a new job record

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyId } from '@/lib/quotes'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const leadId = req.nextUrl.searchParams.get('lead_id')

  let query = supabase
    .from('jobs')
    .select('*')
    .eq('company_id', companyId)
    .order('scheduled_date', { ascending: true })

  if (leadId) {
    query = query.eq('lead_id', leadId)
  }

  const { data, error } = await query

  if (error) {
    console.error('GET /api/jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }

  return NextResponse.json({ jobs: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      lead_id,
      quote_id,
      title,
      service_type,
      customer_name,
      customer_phone,
      customer_email,
      property_address,
      city,
      state,
      zip,
      scheduled_date,
      start_time,
      end_time,
      quoted_amount,
      priority = 'normal',
      status = 'scheduled',
      notes,
    } = body

    if (!lead_id) {
      return NextResponse.json({ error: 'lead_id is required' }, { status: 400 })
    }
    if (!title?.trim()) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const { data: job, error: jobErr } = await supabase
      .from('jobs')
      .insert({
        company_id: companyId,
        lead_id,
        quote_id: quote_id || null,
        title: title.trim(),
        service_type: service_type || null,
        customer_name: customer_name || '',
        customer_phone: customer_phone || null,
        customer_email: customer_email || null,
        property_address: property_address || null,
        city: city || null,
        state: state || null,
        zip: zip || null,
        scheduled_date: scheduled_date || null,
        start_time: start_time || null,
        end_time: end_time || null,
        quoted_amount: Number(quoted_amount) || 0,
        priority,
        status,
        notes: notes || null,
      })
      .select('*')
      .single()

    if (jobErr) {
      console.error('POST /api/jobs insert:', jobErr)
      return NextResponse.json({ error: 'Failed to create job', detail: jobErr.message }, { status: 500 })
    }

    // Sync lead: update status to scheduled and scheduled_at
    const scheduledAt = scheduled_date && start_time
      ? new Date(`${scheduled_date}T${start_time}:00`).toISOString()
      : scheduled_date
      ? new Date(`${scheduled_date}T08:00:00`).toISOString()
      : null

    await supabase
      .from('leads')
      .update({
        status: 'scheduled',
        ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
      })
      .eq('id', lead_id)
      .eq('company_id', companyId)

    // Optionally mark linked quote converted
    if (quote_id) {
      await supabase
        .from('quotes')
        .update({ status: 'converted' })
        .eq('id', quote_id)
        .eq('company_id', companyId)
    }

    return NextResponse.json({ job }, { status: 201 })
  } catch (err) {
    console.error('POST /api/jobs:', err)
    const message = err instanceof Error ? err.message : 'Failed to create job'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
