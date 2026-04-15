-- Add compliance_status to integrations table.
-- Tracks A2P 10DLC registration state per company integration.
--
-- compliance_status values:
--   mock     → no real credentials; app uses mock delivery
--   pending  → A2P campaign submitted, awaiting carrier approval (~10 days)
--   approved → campaign approved; messaging_service_sid active
--   failed   → registration rejected; needs remediation
--
-- Run in Supabase: Dashboard → SQL Editor → New query → paste → Run.

ALTER TABLE integrations
  ADD COLUMN IF NOT EXISTS compliance_status text
    NOT NULL DEFAULT 'mock'
    CHECK (compliance_status IN ('mock', 'pending', 'approved', 'failed'));

COMMENT ON COLUMN integrations.compliance_status IS
  'A2P 10DLC registration state. mock = no Twilio credentials configured.';
