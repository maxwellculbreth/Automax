// POST /api/sms/send
//
// Sends an outbound SMS via Twilio and records the message in the `messages` table.
//
// Body: { lead_id: string, content: string, business_id: string }
//
// Twilio credentials are read from the `integrations` table (type = 'twilio').
// Expected config shape: { account_sid: string, auth_token: string, from_number: string }
//
// STATUS: Twilio call is live. Ensure the `integrations` row exists and is enabled
// before calling this endpoint.

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { lead_id, content } = await req.json()

    if (!lead_id || !content) {
      return NextResponse.json({ error: "lead_id and content are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the authenticated user's business_id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userRow } = await supabase
      .from("users")
      .select("business_id, id")
      .eq("auth_user_id", user.id)
      .single()

    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { business_id, id: sender_id } = userRow

    // Fetch the lead to get recipient phone number
    const { data: lead } = await supabase
      .from("leads")
      .select("phone, name")
      .eq("id", lead_id)
      .eq("business_id", business_id)
      .single()

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Fetch Twilio credentials from integrations table
    const { data: integration } = await supabase
      .from("integrations")
      .select("config, enabled")
      .eq("business_id", business_id)
      .eq("type", "twilio")
      .single()

    if (!integration?.enabled || !integration.config) {
      return NextResponse.json(
        { error: "Twilio integration not configured. Add credentials in Settings > Integrations." },
        { status: 422 }
      )
    }

    const { account_sid, auth_token, from_number } = integration.config as {
      account_sid: string
      auth_token: string
      from_number: string
    }

    if (!account_sid || !auth_token || !from_number) {
      return NextResponse.json(
        { error: "Twilio config is incomplete (requires account_sid, auth_token, from_number)" },
        { status: 422 }
      )
    }

    // Send SMS via Twilio REST API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${account_sid}/Messages.json`
    const twilioBody = new URLSearchParams({
      To: lead.phone,
      From: from_number,
      Body: content,
    })

    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${account_sid}:${auth_token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: twilioBody,
    })

    const twilioData = await twilioRes.json()

    if (!twilioRes.ok) {
      console.error("Twilio error:", twilioData)
      return NextResponse.json(
        { error: `Twilio error: ${twilioData.message ?? "Unknown error"}` },
        { status: 502 }
      )
    }

    // Record the sent message in the messages table
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        lead_id,
        company_id: business_id,
        content,
        sender_type: "business",
        sender_id,
        channel: "sms",
        is_read: true,
      })
      .select()
      .single()

    if (msgError) {
      // Message was sent via Twilio but DB write failed — log and continue
      console.error("Failed to record sent message:", msgError)
    }

    return NextResponse.json({ success: true, message, twilio_sid: twilioData.sid })
  } catch (err) {
    console.error("Unexpected error in /api/sms/send:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
