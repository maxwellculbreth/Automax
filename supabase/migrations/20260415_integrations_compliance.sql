-- Create integrations table and add compliance_status.
-- This table was defined in scripts/001_create_schema.sql but never applied
-- to the live database. Creating it fresh with the correct live schema
-- (company_id, not business_id).
--
-- Run in Supabase: Dashboard → SQL Editor → New query → paste → Run.

CREATE TABLE IF NOT EXISTS integrations (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  company_id         uuid        NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type               text        NOT NULL,           -- e.g. 'twilio'
  enabled            boolean     NOT NULL DEFAULT false,
  compliance_status  text        NOT NULL DEFAULT 'mock'
                       CHECK (compliance_status IN ('mock', 'pending', 'approved', 'failed')),
  config             jsonb       NOT NULL DEFAULT '{}'::jsonb,

  CONSTRAINT integrations_company_type_unique UNIQUE (company_id, type)
);

-- config JSONB shape for type='twilio':
-- {
--   "account_sid":            "AC…",
--   "auth_token":             "…",
--   "messaging_service_sid":  "MG…",   -- preferred (A2P 10DLC)
--   "from_number":            "+1…",   -- fallback
-- }

CREATE INDEX IF NOT EXISTS integrations_company_id_idx ON integrations (company_id);
CREATE INDEX IF NOT EXISTS integrations_type_idx       ON integrations (type);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Only authenticated users belonging to the company can read their integrations.
CREATE POLICY "integrations_select_own" ON integrations
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Only authenticated users belonging to the company can insert/update.
CREATE POLICY "integrations_modify_own" ON integrations
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE user_id = auth.uid()
    )
  );

COMMENT ON COLUMN integrations.compliance_status IS
  'A2P 10DLC state: mock=no credentials, pending=submitted, approved=active, failed=rejected.';
