// Supabase-ready database types
// These types mirror the expected Supabase table structure

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          industry: string
          phone: string
          email: string
          address: string
          website: string | null
          timezone: string
          ai_voice_tone: string | null
          ai_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry: string
          phone: string
          email: string
          address: string
          website?: string | null
          timezone?: string
          ai_voice_tone?: string | null
          ai_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string
          phone?: string
          email?: string
          address?: string
          website?: string | null
          timezone?: string
          ai_voice_tone?: string | null
          ai_instructions?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          business_id: string
          email: string
          name: string
          role: "owner" | "admin" | "crew_lead" | "viewer"
          phone: string | null
          avatar_url: string | null
          notification_email: boolean
          notification_sms: boolean
          notification_push: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          email: string
          name: string
          role?: "owner" | "admin" | "crew_lead" | "viewer"
          phone?: string | null
          avatar_url?: string | null
          notification_email?: boolean
          notification_sms?: boolean
          notification_push?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          email?: string
          name?: string
          role?: "owner" | "admin" | "crew_lead" | "viewer"
          phone?: string | null
          avatar_url?: string | null
          notification_email?: boolean
          notification_sms?: boolean
          notification_push?: boolean
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          business_id: string
          name: string
          phone: string
          email: string | null
          address: string | null
          service: string
          source: string | null
          status: LeadStatusDB
          estimated_value: number | null
          property_type: "residential" | "commercial" | null
          sqft: number | null
          notes: string | null
          assigned_to: string | null
          last_contact_at: string | null
          next_follow_up_at: string | null
          scheduled_at: string | null
          completed_at: string | null
          lost_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          phone: string
          email?: string | null
          address?: string | null
          service: string
          source?: string | null
          status?: LeadStatusDB
          estimated_value?: number | null
          property_type?: "residential" | "commercial" | null
          sqft?: number | null
          notes?: string | null
          assigned_to?: string | null
          last_contact_at?: string | null
          next_follow_up_at?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          lost_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          phone?: string
          email?: string | null
          address?: string | null
          service?: string
          source?: string | null
          status?: LeadStatusDB
          estimated_value?: number | null
          property_type?: "residential" | "commercial" | null
          sqft?: number | null
          notes?: string | null
          assigned_to?: string | null
          last_contact_at?: string | null
          next_follow_up_at?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          lost_at?: string | null
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          lead_id: string
          business_id: string
          content: string
          sender_type: "lead" | "business" | "ai"
          sender_id: string | null
          channel: "sms" | "email" | "phone" | "web_form" | "chat"
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          business_id: string
          content: string
          sender_type: "lead" | "business" | "ai"
          sender_id?: string | null
          channel?: "sms" | "email" | "phone" | "web_form" | "chat"
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          business_id?: string
          content?: string
          sender_type?: "lead" | "business" | "ai"
          sender_id?: string | null
          channel?: "sms" | "email" | "phone" | "web_form" | "chat"
          is_read?: boolean
        }
      }
      automations: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          type: AutomationTypeDB
          enabled: boolean
          config: Json
          trigger_count: number
          success_count: number
          last_triggered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          type: AutomationTypeDB
          enabled?: boolean
          config?: Json
          trigger_count?: number
          success_count?: number
          last_triggered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          type?: AutomationTypeDB
          enabled?: boolean
          config?: Json
          trigger_count?: number
          success_count?: number
          last_triggered_at?: string | null
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          business_id: string
          lead_id: string | null
          user_id: string | null
          type: ActivityTypeDB
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          lead_id?: string | null
          user_id?: string | null
          type: ActivityTypeDB
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          lead_id?: string | null
          user_id?: string | null
          type?: ActivityTypeDB
          description?: string
          metadata?: Json | null
        }
      }
      jobs: {
        Row: {
          id: string
          business_id: string
          lead_id: string
          assigned_to: string | null
          title: string
          description: string | null
          status: "scheduled" | "in_progress" | "completed" | "cancelled"
          scheduled_date: string
          scheduled_time: string | null
          estimated_duration: number | null
          actual_duration: number | null
          price: number
          notes: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          lead_id: string
          assigned_to?: string | null
          title: string
          description?: string | null
          status?: "scheduled" | "in_progress" | "completed" | "cancelled"
          scheduled_date: string
          scheduled_time?: string | null
          estimated_duration?: number | null
          actual_duration?: number | null
          price: number
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          lead_id?: string
          assigned_to?: string | null
          title?: string
          description?: string | null
          status?: "scheduled" | "in_progress" | "completed" | "cancelled"
          scheduled_date?: string
          scheduled_time?: string | null
          estimated_duration?: number | null
          actual_duration?: number | null
          price?: number
          notes?: string | null
          completed_at?: string | null
          updated_at?: string
        }
      }
      ai_generations: {
        Row: {
          id: string
          business_id: string
          user_id: string | null
          lead_id: string | null
          type: "reply" | "follow_up" | "quote" | "sop" | "review_request"
          prompt: string
          content: string
          was_used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id?: string | null
          lead_id?: string | null
          type: "reply" | "follow_up" | "quote" | "sop" | "review_request"
          prompt: string
          content: string
          was_used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string | null
          lead_id?: string | null
          type?: "reply" | "follow_up" | "quote" | "sop" | "review_request"
          prompt?: string
          content?: string
          was_used?: boolean
        }
      }
      expense_categories: {
        Row: {
          id: string
          key: string
          label: string | null
          sort_order: number | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          label?: string | null
          sort_order?: number | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          label?: string | null
          sort_order?: number | null
          is_active?: boolean | null
        }
      }
      expenses: {
        Row: {
          id: string
          company_id: string
          created_by: string
          expense_category_id: string | null
          amount: number | null
          expense_date: string | null
          vendor: string | null
          description: string | null
          status: string | null
          payment_method: string | null
          notes: string | null
          receipt_url: string | null
          linked_lead_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          created_by?: string
          expense_category_id?: string | null
          amount?: number | null
          expense_date?: string | null
          vendor?: string | null
          description?: string | null
          status?: string | null
          payment_method?: string | null
          notes?: string | null
          receipt_url?: string | null
          linked_lead_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          created_by?: string
          expense_category_id?: string | null
          amount?: number | null
          expense_date?: string | null
          vendor?: string | null
          description?: string | null
          status?: string | null
          payment_method?: string | null
          notes?: string | null
          receipt_url?: string | null
          linked_lead_id?: string | null
          updated_at?: string | null
        }
      }
      integrations: {
        Row: {
          id: string
          business_id: string
          type: "google_business" | "quickbooks" | "housecall_pro" | "jobber" | "twilio" | "stripe"
          name: string
          enabled: boolean
          config: Json | null
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          type: "google_business" | "quickbooks" | "housecall_pro" | "jobber" | "twilio" | "stripe"
          name: string
          enabled?: boolean
          config?: Json | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          type?: "google_business" | "quickbooks" | "housecall_pro" | "jobber" | "twilio" | "stripe"
          name?: string
          enabled?: boolean
          config?: Json | null
          last_synced_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lead_status: LeadStatusDB
      automation_type: AutomationTypeDB
      activity_type: ActivityTypeDB
      user_role: "owner" | "admin" | "crew_lead" | "viewer"
      message_channel: "sms" | "email" | "phone" | "web_form" | "chat"
      job_status: "scheduled" | "in_progress" | "completed" | "cancelled"
    }
  }
}

// Enum types matching Supabase
// Standardized lead statuses: new → contacted → quoted → scheduled → completed
// Also supports: cancelled, lost
// Legacy: "booked" is treated as "scheduled", "complete" is treated as "completed"
export type LeadStatusDB =
  | "new"
  | "contacted"
  | "quoted"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "lost"
  // Legacy values that may exist in DB (will be normalized in code)
  | "booked"
  | "complete"

export type AutomationTypeDB =
  | "missed_call"
  | "new_lead"
  | "quote_follow_up"
  | "review_request"
  | "reactivation"

export type ActivityTypeDB =
  | "lead_created"
  | "lead_updated"
  | "message_sent"
  | "message_received"
  | "quote_sent"
  | "job_booked"
  | "job_completed"
  | "automation_triggered"
  | "follow_up_scheduled"
  | "review_received"
  | "note_added"

// Table row types for convenience
export type Business = Database["public"]["Tables"]["businesses"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type Lead = Database["public"]["Tables"]["leads"]["Row"]
export type Message = Database["public"]["Tables"]["messages"]["Row"]
export type Automation = Database["public"]["Tables"]["automations"]["Row"]
export type Activity = Database["public"]["Tables"]["activities"]["Row"]
export type Job = Database["public"]["Tables"]["jobs"]["Row"]
export type AIGeneration = Database["public"]["Tables"]["ai_generations"]["Row"]
export type Integration = Database["public"]["Tables"]["integrations"]["Row"]
export type ExpenseCategory = Database["public"]["Tables"]["expense_categories"]["Row"]
export type Expense = Database["public"]["Tables"]["expenses"]["Row"]

// Insert types
export type BusinessInsert = Database["public"]["Tables"]["businesses"]["Insert"]
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"]
export type AutomationInsert = Database["public"]["Tables"]["automations"]["Insert"]
export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"]
export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"]
export type AIGenerationInsert = Database["public"]["Tables"]["ai_generations"]["Insert"]
export type IntegrationInsert = Database["public"]["Tables"]["integrations"]["Insert"]
export type ExpenseCategoryInsert = Database["public"]["Tables"]["expense_categories"]["Insert"]
export type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"]

// Update types
export type BusinessUpdate = Database["public"]["Tables"]["businesses"]["Update"]
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"]
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"]
export type MessageUpdate = Database["public"]["Tables"]["messages"]["Update"]
export type AutomationUpdate = Database["public"]["Tables"]["automations"]["Update"]
export type ActivityUpdate = Database["public"]["Tables"]["activities"]["Update"]
export type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"]
export type AIGenerationUpdate = Database["public"]["Tables"]["ai_generations"]["Update"]
export type IntegrationUpdate = Database["public"]["Tables"]["integrations"]["Update"]
export type ExpenseCategoryUpdate = Database["public"]["Tables"]["expense_categories"]["Update"]
export type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"]
