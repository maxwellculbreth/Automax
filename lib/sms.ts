// lib/sms.ts
//
// Thin SMS delivery abstraction.
//
// Behaviour:
//   - If a Twilio integration row exists (type='twilio', enabled=true) with valid
//     credentials, the message is sent for real via Twilio.
//   - Otherwise, the message is mock-delivered: logged to console, returned with
//     a fake SID. No error is thrown — the automation engine keeps running.
//
// To enable Twilio later:
//   1. Insert an `integrations` row for the business with type='twilio', enabled=true
//   2. Set config: { account_sid, auth_token, from_number }
//   Nothing else needs to change.

export type SMSResult = {
  sid: string   // Twilio SID, or "mock_<timestamp>" in mock mode
  mock: boolean // true when no Twilio credentials were found
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendSMS(
  // Accept any Supabase client (server or service-role) without coupling to a specific type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  {
    to,
    body,
    businessId,
  }: {
    to: string
    body: string
    businessId: string
  }
): Promise<SMSResult> {
  // Look up Twilio credentials for this business
  const { data: integration } = await supabase
    .from("integrations")
    .select("config, enabled")
    .eq("business_id", businessId)
    .eq("type", "twilio")
    .eq("enabled", true)
    .single()

  const config = integration?.config as {
    account_sid?: string
    auth_token?: string
    from_number?: string
  } | null

  if (config?.account_sid && config?.auth_token && config?.from_number) {
    // --- Real Twilio delivery ---
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.account_sid}/Messages.json`
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${config.account_sid}:${config.auth_token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: to,
        From: config.from_number,
        Body: body,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message ?? "Twilio error")
    return { sid: data.sid, mock: false }
  }

  // --- Mock delivery ---
  console.log(`[SMS mock] to=${to} businessId=${businessId} body="${body}"`)
  return { sid: `mock_${Date.now()}`, mock: true }
}
