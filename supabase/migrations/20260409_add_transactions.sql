-- Manual finance entries table
-- Used for income/expense rows entered directly in the Finance UI.
-- System-generated income (from leads/jobs) is derived on the fly and never stored here.
-- Run this in Supabase SQL editor: Dashboard → SQL Editor → New query → paste → Run.

CREATE TABLE IF NOT EXISTS transactions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       uuid        NOT NULL,
  created_by       uuid,
  client_id        uuid,
  lead_id          uuid,
  type             text        NOT NULL CHECK (type IN ('income', 'expense')),
  source_type      text        NOT NULL DEFAULT 'manual',
  source_id        uuid,
  category         text,
  description      text,
  amount           numeric     NOT NULL CHECK (amount > 0),
  transaction_date date        NOT NULL DEFAULT CURRENT_DATE,
  payment_method   text,
  status           text,
  editable         boolean     NOT NULL DEFAULT true,
  deletable        boolean     NOT NULL DEFAULT true,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- Index for company scoping
CREATE INDEX IF NOT EXISTS transactions_company_id_idx  ON transactions (company_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx         ON transactions (transaction_date DESC);
CREATE INDEX IF NOT EXISTS transactions_type_idx         ON transactions (type);

-- Row-level security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: users can only access their own company's rows
-- Matches pattern used by leads, expenses, etc.
CREATE POLICY "transactions_company_isolation" ON transactions
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );
