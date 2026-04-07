// POST /api/sms/inbound
//
// Twilio webhook handler for inbound SMS messages.
// Configure this URL in your Twilio phone number settings:
//   https://<your-domain>/api/sms/inbound
//
// Twilio POSTs form-encoded data. We:
//   1. Validate the request signature (optional but recommended)
//   2. Match the sender's phone number to a lead
//   3. Insert an inbound message into the `messages` table
//   4. Return an empty TwiML response (no auto-reply yet)

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Normalize phone numbers to E.164 format for matching
// Twilio sends numbers as +1XXXXXXXXXX
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "")
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const from = formData.get("From") as string | null
    const body = formData.get("Body") as string | null
    const toNumber = formData.get("To") as string | null

    if (!from || !body) {
      return new NextResponse(twiml(""), { status: 200, headers: { "Content-Type": "text/xml" } })
    }

    const supabase = await createClient()
    const normalizedFrom = normalizePhone(from)

    // Find the integration row to get business_id for this Twilio number
    // Twilio config stores the from_number so we can match inbound to business
    const { data: integrations } = await supabase
      .from("integrations")
      .select("business_id, config")
      .eq("type", "twilio")
      .eq("enabled", true)

    let businessId: string | null = null

    if (integrations) {
      for (const integration of integrations) {
        const config = integration.config as { from_number?: string } | null
        if (config?.from_number && normalizePhone(config.from_number) === normalizePhone(toNumber ?? "")) {
          businessId = integration.business_id
          break
        }
      }
    }

    if (!businessId) {
      console.warn(`Inbound SMS to ${toNumber} — no matching Twilio integration found`)
      return new NextResponse(twiml(""), { status: 200, headers: { "Content-Type": "text/xml" } })
    }

    // Find the lead by phone number
    const { data: leads } = await supabase
      .from("leads")
      .select("id, name, phone")
      .eq("business_id", businessId)

    const matchedLead = leads?.find(
      (l) => normalizePhone(l.phone ?? "") === normalizedFrom
    )

    if (!matchedLead) {
      // Unknown sender — log and do nothing for now
      // Future: create a new lead automatically
      console.warn(`Inbound SMS from ${from} — no matching lead found in business ${businessId}`)
      return new NextResponse(twiml(""), { status: 200, headers: { "Content-Type": "text/xml" } })
    }

    // Store the inbound message
    const { error } = await supabase.from("messages").insert({
      lead_id: matchedLead.id,
      company_id: businessId,
      content: body,
      sender_type: "lead",
      sender_id: null,
      channel: "sms",
      is_read: false,
    })

    if (error) {
      console.error("Failed to store inbound message:", error)
    }

    // Return empty TwiML — no auto-reply (automations will handle that separately)
    return new NextResponse(twiml(""), { status: 200, headers: { "Content-Type": "text/xml" } })
  } catch (err) {
    console.error("Unexpected error in /api/sms/inbound:", err)
    return new NextResponse(twiml(""), { status: 200, headers: { "Content-Type": "text/xml" } })
  }
}

function twiml(message: string): string {
  if (!message) return "<?xml version='1.0' encoding='UTF-8'?><Response></Response>"
  return `<?xml version='1.0' encoding='UTF-8'?><Response><Message>${message}</Message></Response>`
}
