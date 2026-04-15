// lib/sms.ts
//
// Thin SMS delivery abstraction.
//
// Credential resolution order (first match wins):
//   1. integrations table row: type='twilio', enabled=true, company_id=<businessId>
//   2. Environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
//   3. Mock delivery — logged to console, fake SID returned, no error thrown.
//
// To enable per-business Twilio via DB:
//   INSERT INTO integrations (company_id, type, enabled, config) VALUES
//     ('<uuid>', 'twilio', true, '{"account_sid":"AC…","auth_token":"…","from_number":"+1…"}');
//
// To enable global Twilio via env (simpler for single-tenant):
//   Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env.local / Vercel.

// Normalise any US phone string to E.164 (+1XXXXXXXXXX).
// Twilio rejects (555) 123-4567, 555-123-4567, 5551234567, etc.
function toE164Format(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return phone // already E.164 or unknown format — pass through
}

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
  // 1. Look up per-business Twilio credentials from integrations table.
  //    Live schema uses company_id (not business_id).
  const { data: integration } = await supabase
    .from("integrations")
    .select("config, enabled")
    .eq("company_id", businessId)
    .eq("type", "twilio")
    .eq("enabled", true)
    .single()

  const dbConfig = integration?.config as {
    account_sid?: string
    auth_token?: string
    from_number?: string
  } | null

  // 2. Fall back to environment variables when no integrations row is present.
  const config = (dbConfig?.account_sid && dbConfig?.auth_token && dbConfig?.from_number)
    ? dbConfig
    : (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER)
      ? {
          account_sid: process.env.TWILIO_ACCOUNT_SID,
          auth_token:  process.env.TWILIO_AUTH_TOKEN,
          from_number: process.env.TWILIO_PHONE_NUMBER,
        }
      : null

  if (config?.account_sid && config?.auth_token && config?.from_number) {
    // Normalise to E.164 (+1XXXXXXXXXX). Twilio rejects anything else.
    const toE164 = toE164Format(to)

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
        To: toE164,
        From: config.from_number,
        Body: body,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      // Surface the real Twilio error so it propagates up and gets logged
      throw new Error(`Twilio ${res.status}: ${data.message ?? JSON.stringify(data)}`)
    }
    return { sid: data.sid, mock: false }
  }

  // --- Mock delivery ---
  console.log(`[SMS mock] to=${to} businessId=${businessId} body="${body}"`)
  return { sid: `mock_${Date.now()}`, mock: true }
}
