// POST /api/waitlist — public endpoint, no auth required.
// Inserts a signup into the waitlist table.
// Returns 409 if the email already exists, 400 on bad input, 500 on DB error.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, phone, business_type, company_name, source } = body

    if (!full_name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from('waitlist').insert({
      full_name:     full_name.trim(),
      email:         email.trim().toLowerCase(),
      phone:         phone?.trim()        || null,
      business_type: business_type        || null,
      company_name:  company_name?.trim() || null,
      source:        source               || 'early-access',
    })

    if (error) {
      // 23505 = unique_violation — email already exists
      if (error.code === '23505') {
        return NextResponse.json({ error: 'duplicate' }, { status: 409 })
      }
      console.error('POST /api/waitlist db error:', error)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('POST /api/waitlist:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
