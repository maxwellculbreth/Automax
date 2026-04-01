-- Automa Database Schema
-- Run this migration to set up the database in Supabase
-- 
-- This schema supports:
-- - Multi-tenant businesses
-- - Lead management with full conversation history
-- - Pipeline tracking with status changes
-- - Automation configurations
-- - Activity logging for audit trails
-- - Job scheduling
-- - AI generation history

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted', 
  'quote_scheduled',
  'quote_sent',
  'follow_up',
  'booked',
  'completed',
  'lost'
);

CREATE TYPE automation_type AS ENUM (
  'missed_call',
  'new_lead',
  'quote_follow_up',
  'review_request',
  'reactivation'
);

CREATE TYPE activity_type AS ENUM (
  'lead_created',
  'lead_updated',
  'message_sent',
  'message_received',
  'quote_sent',
  'job_booked',
  'job_completed',
  'automation_triggered',
  'follow_up_scheduled',
  'review_received',
  'note_added'
);

CREATE TYPE user_role AS ENUM (
  'owner',
  'admin',
  'crew_lead',
  'viewer'
);

CREATE TYPE message_channel AS ENUM (
  'sms',
  'email',
  'phone',
  'web_form',
  'chat'
);

CREATE TYPE job_status AS ENUM (
  'scheduled',
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE property_type AS ENUM (
  'residential',
  'commercial'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- Businesses (multi-tenant support)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/Chicago',
  ai_voice_tone TEXT DEFAULT 'friendly',
  ai_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (team members)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  auth_user_id UUID UNIQUE, -- Links to Supabase Auth
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  phone TEXT,
  avatar_url TEXT,
  notification_email BOOLEAN NOT NULL DEFAULT true,
  notification_sms BOOLEAN NOT NULL DEFAULT true,
  notification_push BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, email)
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  service TEXT NOT NULL,
  source TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  estimated_value DECIMAL(10,2),
  property_type property_type,
  sqft INTEGER,
  notes TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  last_contact_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages (conversation history)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('lead', 'business', 'ai')),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  channel message_channel NOT NULL DEFAULT 'sms',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automations
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type automation_type NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}',
  trigger_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activities (audit log)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type activity_type NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Jobs (scheduled work)
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status job_status NOT NULL DEFAULT 'scheduled',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Generations (history of AI-generated content)
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('reply', 'follow_up', 'quote', 'sop', 'review_request')),
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  was_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Integrations (third-party connections)
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('google_business', 'quickbooks', 'housecall_pro', 'jobber', 'twilio', 'stripe')),
  name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  config JSONB,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, type)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Leads
CREATE INDEX idx_leads_business_id ON leads(business_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_at) WHERE next_follow_up_at IS NOT NULL;
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to) WHERE assigned_to IS NOT NULL;

-- Messages
CREATE INDEX idx_messages_lead_id ON messages(lead_id);
CREATE INDEX idx_messages_business_id ON messages(business_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(lead_id) WHERE is_read = false;

-- Activities
CREATE INDEX idx_activities_business_id ON activities(business_id);
CREATE INDEX idx_activities_lead_id ON activities(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- Jobs
CREATE INDEX idx_jobs_business_id ON jobs(business_id);
CREATE INDEX idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_assigned_to ON jobs(assigned_to) WHERE assigned_to IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's business_id
CREATE OR REPLACE FUNCTION get_user_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM users WHERE auth_user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Businesses: Users can only access their own business
CREATE POLICY "Users can view own business" ON businesses
  FOR SELECT USING (id = get_user_business_id());

CREATE POLICY "Owners can update own business" ON businesses
  FOR UPDATE USING (id = get_user_business_id());

-- Users: Users can view teammates, owners can manage
CREATE POLICY "Users can view teammates" ON users
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Owners can insert users" ON users
  FOR INSERT WITH CHECK (
    business_id = get_user_business_id() 
    AND EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Owners can update users" ON users
  FOR UPDATE USING (
    business_id = get_user_business_id()
    AND EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role = 'owner')
  );

-- Leads: Team can view all, assigned users can update
CREATE POLICY "Team can view leads" ON leads
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Team can insert leads" ON leads
  FOR INSERT WITH CHECK (business_id = get_user_business_id());

CREATE POLICY "Team can update leads" ON leads
  FOR UPDATE USING (business_id = get_user_business_id());

-- Messages: Team can view and send
CREATE POLICY "Team can view messages" ON messages
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Team can send messages" ON messages
  FOR INSERT WITH CHECK (business_id = get_user_business_id());

CREATE POLICY "Team can update messages" ON messages
  FOR UPDATE USING (business_id = get_user_business_id());

-- Automations: Team can view, admins can manage
CREATE POLICY "Team can view automations" ON automations
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Admins can manage automations" ON automations
  FOR ALL USING (
    business_id = get_user_business_id()
    AND EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Activities: Team can view all
CREATE POLICY "Team can view activities" ON activities
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Team can log activities" ON activities
  FOR INSERT WITH CHECK (business_id = get_user_business_id());

-- Jobs: Team can view and manage
CREATE POLICY "Team can view jobs" ON jobs
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Team can manage jobs" ON jobs
  FOR ALL USING (business_id = get_user_business_id());

-- AI Generations: Team can view and create
CREATE POLICY "Team can view ai_generations" ON ai_generations
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Team can create ai_generations" ON ai_generations
  FOR INSERT WITH CHECK (business_id = get_user_business_id());

-- Integrations: Admins can manage
CREATE POLICY "Team can view integrations" ON integrations
  FOR SELECT USING (business_id = get_user_business_id());

CREATE POLICY "Admins can manage integrations" ON integrations
  FOR ALL USING (
    business_id = get_user_business_id()
    AND EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update last_contact_at when messages are added
CREATE OR REPLACE FUNCTION update_lead_last_contact()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leads SET last_contact_at = NEW.created_at WHERE id = NEW.lead_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_last_contact_on_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_lead_last_contact();

-- Log activity when lead status changes
CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO activities (business_id, lead_id, type, description, metadata)
    VALUES (
      NEW.business_id,
      NEW.id,
      'lead_updated',
      'Lead status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status, 'lead_name', NEW.name)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_lead_status_change_trigger
  AFTER UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_lead_status_change();
