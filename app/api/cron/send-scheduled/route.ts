// GET /api/cron/send-scheduled
//
// Vercel Cron Job — runs every 5 minutes via vercel.json cron config.
// Reads all pending scheduled_messages where send_at <= NOW(),
// sends each via Twilio, and updates the row status.
//
// Secured by CRON_SECRET env var. Vercel sets the Authorization header
// automatically when invoking cron routes.
//
// To enable: add to vercel.json:
//   {
//     "crons": [{ "path": "/api/cron/send-scheduled", "schedule": "*/5 * * * *" }]
//   }

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron (or internally)
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  const now = new Date().toISOString()

  // Fetch all pending messages that are due
  const { data: pending, error: fetchError } = await supabase
    .from("scheduled_messages")
    .select("*, leads(phone, name), businesses(name)")
    .eq("status", "pending")
    .lte("send_at", now)
    .limit(50) // process max 50 per run to stay within timeout

  if (fetchError) {
    console.error("Cron: failed to fetch scheduled messages:", fetchError)
    return NextResponse.json({ error: "Failed to fetch pending messages" }, { status: 500 })
  }

  if (!pending?.length) {
    return NextResponse.json({ sent: 0, message: "No pending messages" })
  }

  const results = { sent: 0, failed: 0, errors: [] as string[] }

  for (const msg of pending) {
    const lead = msg.leads as { phone: string; name: string } | null
    if (!lead?.phone) {
      await supabase
        .from("scheduled_messages")
        .update({ status: "failed", error: "Lead has no phone number" })
        .eq("id", msg.id)
      results.failed++
      continue
    }

    // Fetch Twilio credentials for this business
    const { data: integration } = await supabase
      .from("integrations")
      .select("config, enabled")
      .eq("business_id", msg.company_id)
      .eq("type", "twilio")
      .single()

    if (!integration?.enabled || !integration.config) {
      await supabase
        .from("scheduled_messages")
        .update({ status: "failed", error: "Twilio integration not configured" })
        .eq("id", msg.id)
      results.failed++
      continue
    }

    const { account_sid, auth_token, from_number } = integration.config as {
      account_sid: string
      auth_token: string
      from_number: string
    }

    // Send via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${account_sid}/Messages.json`
    const twilioBody = new URLSearchParams({
      To: lead.phone,
      From: from_number,
      Body: msg.content,
    })

    try {
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
        await supabase
          .from("scheduled_messages")
          .update({ status: "failed", error: twilioData.message ?? "Twilio error" })
          .eq("id", msg.id)
        results.failed++
        results.errors.push(`msg ${msg.id}: ${twilioData.message}`)
        continue
      }

      // Mark as sent
      await supabase
        .from("scheduled_messages")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          twilio_sid: twilioData.sid,
        })
        .eq("id", msg.id)

      // Record the sent message in the messages table for the inbox
      await supabase.from("messages").insert({
        lead_id: msg.lead_id,
        company_id: msg.company_id,
        content: msg.content,
        sender_type: "ai",
        sender_id: null,
        channel: "sms",
        is_read: true,
      })

      results.sent++
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error"
      await supabase
        .from("scheduled_messages")
        .update({ status: "failed", error: errMsg })
        .eq("id", msg.id)
      results.failed++
      results.errors.push(`msg ${msg.id}: ${errMsg}`)
    }
  }

  console.log(`Cron send-scheduled: sent=${results.sent} failed=${results.failed}`)
  return NextResponse.json(results)
}
