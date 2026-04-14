// POST /api/sms/send
//
// Sends an outbound SMS and records it in the `messages` table.
// Uses Twilio if configured; falls back to mock delivery otherwise.
//
// Body: { lead_id: string, content: string }

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendSMS } from "@/lib/sms"

export async function POST(req: NextRequest) {
  try {
    const { lead_id, content } = await req.json()

    if (!lead_id || !content) {
      return NextResponse.json({ error: "lead_id and content are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Resolve company_id via the profiles table (actual live schema).
    // The old code queried a "users" table with auth_user_id — that table
    // does not exist in the live database.
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("user_id", user.id)
      .single()

    if (!profile?.company_id) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    const company_id = profile.company_id

    // Leads table uses company_id, not business_id
    const { data: lead } = await supabase
      .from("leads")
      .select("phone, customer_name")
      .eq("id", lead_id)
      .eq("company_id", company_id)
      .single()

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Send (real or mock — determined by sendSMS based on integration config)
    const { sid, mock } = await sendSMS(supabase, {
      to: lead.phone,
      body: content,
      businessId: company_id,
    })

    // Record in messages table. sender_id is nullable — we have no FK to a
    // users table in the live schema, so we omit it.
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        lead_id,
        company_id,
        content,
        sender_type: "business",
        sender_id: null,
        channel: "sms",
        is_read: true,
      })
      .select()
      .single()

    if (msgError) {
      console.error("Failed to record sent message:", msgError)
    }

    return NextResponse.json({ success: true, mock, message, twilio_sid: sid })
  } catch (err) {
    console.error("Unexpected error in /api/sms/send:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
