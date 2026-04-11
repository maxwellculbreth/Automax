// GET   /api/jobs/[id] — fetch a single job
// PATCH /api/jobs/[id] — update a job

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyId } from '@/lib/quotes'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .eq('company_id', companyId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  return NextResponse.json({ job: data })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()

    // Whitelist updatable fields
    const allowed = [
      'title', 'status', 'priority', 'service_type',
      'customer_name', 'customer_phone', 'customer_email',
      'property_address', 'city', 'state', 'zip',
      'scheduled_date', 'start_time', 'end_time', 'duration_minutes',
      'quoted_amount', 'actual_amount', 'payment_status', 'deposit_collected',
      'assigned_to', 'notes', 'completed_at', 'cancelled_at',
    ]

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const key of allowed) {
      if (key in body) updates[key] = body[key]
    }

    // Auto-set completed_at / cancelled_at on status transitions
    if (body.status === 'completed' && !updates.completed_at) {
      updates.completed_at = new Date().toISOString()
    }
    if (body.status === 'cancelled' && !updates.cancelled_at) {
      updates.cancelled_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .eq('company_id', companyId)
      .select('*')
      .single()

    if (error || !data) {
      console.error('PATCH /api/jobs/[id]:', error)
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
    }

    // Sync lead scheduled_at if schedule changed
    if (body.scheduled_date !== undefined || body.start_time !== undefined) {
      const scheduledAt = data.scheduled_date && data.start_time
        ? new Date(`${data.scheduled_date}T${data.start_time}:00`).toISOString()
        : null
      if (scheduledAt) {
        await supabase
          .from('leads')
          .update({ scheduled_at: scheduledAt })
          .eq('id', data.lead_id)
          .eq('company_id', companyId)
      }
    }

    return NextResponse.json({ job: data })
  } catch (err) {
    console.error('PATCH /api/jobs/[id]:', err)
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 })
  }
}
