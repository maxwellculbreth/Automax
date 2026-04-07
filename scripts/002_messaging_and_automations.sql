-- Migration 002: Messaging & Automation Foundation
-- Run this after 001_create_schema.sql
--
-- Adds:
--   1. scheduled_messages  — queue for outbound SMS triggered by automations
--   2. automation_logs     — record of every automation execution

-- ============================================================================
-- scheduled_messages
-- Holds outbound messages that are queued to be sent at a future time.
-- The cron job at /api/cron/send-scheduled reads pending rows and sends via Twilio.
-- ============================================================================

CREATE TABLE scheduled_messages (
  id                UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id        UUID        NOT NULL REFERENCES businesses(id)   ON DELETE CASCADE,
  lead_id           UUID        NOT NULL REFERENCES leads(id)         ON DELETE CASCADE,
  automation_id     UUID                 REFERENCES automations(id)  ON DELETE SET NULL,

  -- What to send
  content           TEXT        NOT NULL,
  channel           message_channel NOT NULL DEFAULT 'sms',

  -- When to send
  send_at           TIMESTAMPTZ NOT NULL,

  -- Delivery tracking
  status            TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at           TIMESTAMPTZ,
  twilio_sid        TEXT,                   -- SID returned by Twilio on success
  error             TEXT,                   -- Error message if status = 'failed'

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scheduled_messages_business_id  ON scheduled_messages(business_id);
CREATE INDEX idx_scheduled_messages_lead_id      ON scheduled_messages(lead_id);
CREATE INDEX idx_scheduled_messages_send_at      ON scheduled_messages(send_at)
  WHERE status = 'pending';               -- Partial index — only pending rows need scanning

ALTER TABLE scheduled_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can view scheduled_messages" ON scheduled_messages
  FOR SELECT USING (company_id = get_user_business_id());

CREATE POLICY "Team can insert scheduled_messages" ON scheduled_messages
  FOR INSERT WITH CHECK (company_id = get_user_business_id());

CREATE POLICY "Team can update scheduled_messages" ON scheduled_messages
  FOR UPDATE USING (company_id = get_user_business_id());

-- ============================================================================
-- automation_logs
-- One row per automation execution attempt. Use this to debug misfires,
-- track success rates, and prevent double-sending.
-- ============================================================================

CREATE TABLE automation_logs (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id     UUID        NOT NULL REFERENCES businesses(id)   ON DELETE CASCADE,
  automation_id   UUID        NOT NULL REFERENCES automations(id)  ON DELETE CASCADE,
  lead_id         UUID                 REFERENCES leads(id)         ON DELETE SET NULL,

  -- What triggered this
  trigger_event   TEXT        NOT NULL,   -- e.g. 'lead_status_changed:completed'

  -- Outcome
  status          TEXT        NOT NULL DEFAULT 'triggered'
                  CHECK (status IN ('triggered', 'executed', 'skipped', 'failed')),

  -- Flexible context (lead snapshot, config used, skip reason, etc.)
  metadata        JSONB,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automation_logs_business_id   ON automation_logs(business_id);
CREATE INDEX idx_automation_logs_automation_id ON automation_logs(automation_id);
CREATE INDEX idx_automation_logs_lead_id       ON automation_logs(lead_id)
  WHERE lead_id IS NOT NULL;
CREATE INDEX idx_automation_logs_created_at    ON automation_logs(created_at DESC);

ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can view automation_logs" ON automation_logs
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Team can insert automation_logs" ON automation_logs
  FOR INSERT WITH CHECK (business_id = get_user_business_id());
