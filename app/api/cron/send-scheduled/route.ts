// GET /api/cron/send-scheduled
//
// Vercel Cron Job — runs daily via vercel.json (Hobby plan limit).
// Reads all pending scheduled_messages where send_at <= NOW(),
// delivers each via sendSMS() (Twilio or mock), and updates the row status.
//
// Auth:
//   - If CRON_SECRET env var is set: requires Authorization: Bearer <secret>
//   - If CRON_SECRET is not set (dev / preview): open — call it directly to test
//
// Uses service-role Supabase client to bypass RLS (no user session in cron context).

import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/service"
import { sendSMS } from "@/lib/sms"

export async function GET(req: NextRequest) {
  // Enforce CRON_SECRET only when it is configured
  const secret = process.env.CRON_SECRET
  if (secret) {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Service-role client bypasses RLS — required for cron context (no user session)
  const supabase = createServiceClient()
  const now = new Date().toISOString()

  const { data: pending, error: fetchError } = await supabase
    .from("scheduled_messages")
    .select("id, lead_id, company_id, content, leads(phone, name)")
    .eq("status", "pending")
    .lte("send_at", now)
    .limit(50)

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

    try {
      const { sid, mock } = await sendSMS(supabase, {
        to: lead.phone,
        body: msg.content,
        businessId: msg.company_id,
      })

      await supabase
        .from("scheduled_messages")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          twilio_sid: sid,
        })
        .eq("id", msg.id)

      await supabase.from("messages").insert({
        lead_id: msg.lead_id,
        company_id: msg.company_id,
        content: msg.content,
        sender_type: "ai",
        sender_id: null,
        channel: "sms",
        is_read: true,
      })

      if (mock) console.log(`[cron] Mock-sent msg ${msg.id} to ${lead.phone}`)
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
