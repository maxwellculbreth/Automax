-- Waitlist table for public early-access signups.
-- No auth required to insert — RLS policy allows public writes.
-- Run in Supabase: Dashboard → SQL Editor → New query → paste → Run.

CREATE TABLE IF NOT EXISTS waitlist (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  full_name     text        NOT NULL,
  email         text        NOT NULL,
  phone         text,
  business_type text,
  company_name  text,
  source        text        NOT NULL DEFAULT 'early-access',

  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS waitlist_email_idx      ON waitlist (lower(email));
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist (created_at DESC);

-- Row-level security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Public (unauthenticated) can insert — required for the waitlist form to work without login.
CREATE POLICY "waitlist_public_insert" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admins) can read waitlist entries.
CREATE POLICY "waitlist_authenticated_select" ON waitlist
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
