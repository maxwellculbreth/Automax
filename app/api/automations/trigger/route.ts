// POST /api/automations/trigger
//
// Called internally when a lead status changes (from updateLead in data-service.ts).
// Checks which automations are enabled for this business, determines if any match
// the trigger event, and enqueues a scheduled_message for each match.
//
// Body: { lead_id: string, trigger_event: string, lead_status: string }
//
// trigger_event examples:
//   "lead_status_changed:completed"
//   "lead_status_changed:quoted"
//   "lead_status_changed:scheduled"
//
// Automation type → trigger mapping:
//   review_request    → lead_status_changed:completed
//   quote_follow_up   → lead_status_changed:quoted
//   new_lead          → lead_status_changed:new

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// How many minutes after the trigger event to send each automation type
const DELAY_MINUTES: Record<string, number> = {
  review_request: 60 * 24,    // 24 hours after job completed
  quote_follow_up: 60 * 48,   // 48 hours after quote sent
  new_lead: 2,                 // 2 minutes after new lead comes in
  missed_call: 1,              // 1 minute after missed call
  reactivation: 0,             // immediate (scheduled externally)
}

// Default message templates per automation type
// Businesses will eventually be able to override these via the Automations settings page
function buildMessage(type: string, leadName: string, businessName: string, reviewLink?: string): string {
  const first = leadName.split(" ")[0]
  switch (type) {
    case "review_request":
      return `Hi ${first}! Thanks for choosing ${businessName}. If you're happy with the work, we'd love a quick review: ${reviewLink ?? "[review link]"}. Takes 30 seconds and means the world to us! 🙏`
    case "quote_follow_up":
      return `Hi ${first}, just following up on the quote we sent over. Any questions or ready to get scheduled? Reply here or call us anytime.`
    case "new_lead":
      return `Hi ${first}! Thanks for reaching out to ${businessName}. We'll get back to you shortly — usually within the hour. Talk soon!`
    case "missed_call":
      return `Hi ${first}! We missed your call at ${businessName}. Reply here or call us back and we'll get you taken care of right away.`
    default:
      return `Hi ${first}, just checking in from ${businessName}. Let us know if there's anything we can help with!`
  }
}

// Map automation type to the trigger events that should fire it
const AUTOMATION_TRIGGERS: Record<string, string[]> = {
  review_request: ["lead_status_changed:completed"],
  quote_follow_up: ["lead_status_changed:quoted"],
  new_lead: ["lead_status_changed:new"],
  missed_call: ["missed_call"],
  reactivation: [], // triggered manually / externally
}

export async function POST(req: NextRequest) {
  try {
    const { lead_id, trigger_event } = await req.json()

    if (!lead_id || !trigger_event) {
      return NextResponse.json({ error: "lead_id and trigger_event are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Authenticate
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userRow } = await supabase
      .from("users")
      .select("business_id")
      .eq("auth_user_id", user.id)
      .single()

    if (!userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { business_id } = userRow

    // Fetch the lead
    const { data: lead } = await supabase
      .from("leads")
      .select("id, name, phone")
      .eq("id", lead_id)
      .eq("business_id", business_id)
      .single()

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Fetch the business name
    const { data: business } = await supabase
      .from("businesses")
      .select("name")
      .eq("id", business_id)
      .single()

    const businessName = business?.name ?? "us"

    // Fetch enabled automations for this business
    const { data: automations } = await supabase
      .from("automations")
      .select("id, type, config")
      .eq("business_id", business_id)
      .eq("enabled", true)

    if (!automations?.length) {
      return NextResponse.json({ scheduled: 0, skipped: "no enabled automations" })
    }

    const scheduled: string[] = []
    const now = new Date()

    for (const automation of automations) {
      const triggers = AUTOMATION_TRIGGERS[automation.type] ?? []

      if (!triggers.includes(trigger_event)) continue

      // Log that this automation was triggered
      await supabase.from("automation_logs").insert({
        business_id,
        automation_id: automation.id,
        lead_id,
        trigger_event,
        status: "triggered",
        metadata: { lead_name: lead.name, lead_phone: lead.phone },
      })

      const delayMinutes = DELAY_MINUTES[automation.type] ?? 60
      const sendAt = new Date(now.getTime() + delayMinutes * 60 * 1000)

      // Get review link from automation config if it's a review_request
      const config = automation.config as { review_link?: string } | null
      const reviewLink = config?.review_link

      const content = buildMessage(automation.type, lead.name, businessName, reviewLink)

      const { data: scheduledMsg, error: scheduleError } = await supabase
        .from("scheduled_messages")
        .insert({
          business_id,
          lead_id,
          automation_id: automation.id,
          content,
          channel: "sms",
          send_at: sendAt.toISOString(),
          status: "pending",
        })
        .select("id")
        .single()

      if (scheduleError) {
        console.error(`Failed to schedule message for automation ${automation.id}:`, scheduleError)

        await supabase.from("automation_logs").insert({
          business_id,
          automation_id: automation.id,
          lead_id,
          trigger_event,
          status: "failed",
          metadata: { error: scheduleError.message },
        })
        continue
      }

      // Update automation log to executed
      await supabase.from("automation_logs").insert({
        business_id,
        automation_id: automation.id,
        lead_id,
        trigger_event,
        status: "executed",
        metadata: {
          scheduled_message_id: scheduledMsg?.id,
          send_at: sendAt.toISOString(),
        },
      })

      // Increment trigger count on the automation
      await supabase.rpc("increment_automation_trigger_count", { automation_id: automation.id })
        .then(() => null) // ignore error if RPC doesn't exist yet — count is best-effort

      scheduled.push(automation.id)
    }

    return NextResponse.json({ scheduled: scheduled.length, automation_ids: scheduled })
  } catch (err) {
    console.error("Unexpected error in /api/automations/trigger:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
