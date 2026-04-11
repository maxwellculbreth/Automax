// POST /api/quotes/[id]/send
//
// Send a quote to the customer via SMS or email.
// Reuses sendSMS() from lib/sms.ts — falls back to mock if Twilio not configured.
// Email is mock-only until an email provider is wired.
//
// Body: { channel: 'sms' | 'email' }
// Returns: { mock: boolean, channel: string, recipient: string }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompanyId, sendQuoteToCustomer } from '@/lib/quotes'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const companyId = await getCompanyId(supabase)
  if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { channel, lead_id } = await req.json()
    if (channel !== 'sms' && channel !== 'email') {
      return NextResponse.json({ error: 'channel must be "sms" or "email"' }, { status: 400 })
    }

    const origin = req.headers.get('origin') ?? `https://${req.headers.get('host')}`
    const result = await sendQuoteToCustomer(supabase, id, channel, companyId, {
      leadId: lead_id ?? undefined,
      baseUrl: origin,
    })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send quote'
    console.error(`POST /api/quotes/${id}/send:`, err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
