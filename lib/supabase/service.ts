// Service-role Supabase client — bypasses RLS entirely.
// Use ONLY in server-side background jobs (crons, webhooks) that need to
// operate across all businesses without a user session.
// Never expose this client or SUPABASE_SERVICE_ROLE_KEY to the browser.

import { createClient } from "@supabase/supabase-js"

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
