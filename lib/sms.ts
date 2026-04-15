// lib/sms.ts
//
// SMS delivery abstraction. Send priority (first match wins):
//
//   1. DB integrations row (company_id, type='twilio', enabled=true):
//      a. if config.messaging_service_sid → send via MessagingServiceSid (A2P 10DLC compliant)
//      b. else if config.from_number      → send via From number (legacy / pre-A2P)
//   2. Env vars (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN):
//      a. if TWILIO_MESSAGING_SERVICE_SID → send via MessagingServiceSid
//      b. else if TWILIO_PHONE_NUMBER     → send via From number
//   3. Mock — logs to console, returns fake SID, no error thrown.
//
// Supported integrations.config shape:
//   {
//     "account_sid":            "AC…",   // required for real delivery
//     "auth_token":             "…",     // required for real delivery
//     "messaging_service_sid":  "MG…",   // preferred — use after A2P campaign approved
//     "from_number":            "+1…",   // fallback if no messaging_service_sid
//     "compliance_status":      "pending" | "approved" | "failed" | "mock"
//   }

// Normalise any US phone string to E.164 (+1XXXXXXXXXX).
// Twilio rejects (555) 123-4567, 555-123-4567, 5551234567, etc.
function toE164Format(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return phone // already E.164 or unknown format — pass through
}

export type SMSResult = {
  sid: string   // Twilio message SID, or "mock_<timestamp>" in mock mode
  mock: boolean // true when no Twilio credentials were resolved
}

type TwilioConfig = {
  account_sid:           string
  auth_token:            string
  messaging_service_sid?: string  // preferred: A2P 10DLC MessagingService
  from_number?:          string   // fallback: direct From number
}

// Resolve credentials from DB config or env vars.
// Returns null if neither is sufficiently configured → mock mode.
function resolveConfig(dbConfig: Partial<TwilioConfig> | null): TwilioConfig | null {
  // DB config takes priority
  if (dbConfig?.account_sid && dbConfig?.auth_token) {
    if (dbConfig.messaging_service_sid || dbConfig.from_number) {
      return dbConfig as TwilioConfig
    }
  }

  // Env var fallback
  const sid   = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const mgSid = process.env.TWILIO_MESSAGING_SERVICE_SID
  const from  = process.env.TWILIO_PHONE_NUMBER

  if (sid && token && (mgSid || from)) {
    return {
      account_sid:           sid,
      auth_token:            token,
      messaging_service_sid: mgSid,
      from_number:           from,
    }
  }

  return null
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
  // 1. Look up per-business Twilio config from integrations table.
  const { data: integration } = await supabase
    .from("integrations")
    .select("config, enabled")
    .eq("company_id", businessId)
    .eq("type", "twilio")
    .eq("enabled", true)
    .single()

  const config = resolveConfig(integration?.config ?? null)

  if (!config) {
    // No credentials found — intentional mock mode
    console.log(`[SMS mock] to=${to} businessId=${businessId} body="${body}"`)
    return { sid: `mock_${Date.now()}`, mock: true }
  }

  // 2. Resolve sender: MessagingServiceSid > From number
  const toE164 = toE164Format(to)
  const sender: Record<string, string> = config.messaging_service_sid
    ? { MessagingServiceSid: config.messaging_service_sid }
    : { From: config.from_number! }

  // 3. Send via Twilio REST API
  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.account_sid}/Messages.json`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${config.account_sid}:${config.auth_token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: toE164, Body: body, ...sender }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Twilio ${res.status}: ${data.message ?? JSON.stringify(data)}`)
  }
  return { sid: data.sid, mock: false }
}
