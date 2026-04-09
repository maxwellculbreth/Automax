// Data service abstraction layer
// This module provides a unified interface for data operations
// Now connected to Supabase for leads data

import { createClient } from "@/lib/supabase/client"
import type {
  Lead,
  Message,
  Automation,
  Activity,
  User,
  Business,
  Job,
  AIGeneration,
  Integration,
  ScheduledMessage,
  AutomationLog,
  LeadInsert,
  LeadUpdate,
  MessageInsert,
  AutomationUpdate,
  ScheduledMessageInsert,
  AutomationLogInsert,
  LeadStatusDB,
  ExpenseCategory,
  Expense,
  ExpenseInsert,
} from "./database.types"

// Re-export types for component usage
export type { Lead, Message, Automation, Activity, User, Business, Job, AIGeneration }
export type { Integration, ScheduledMessage, AutomationLog }
export type { ScheduledMessageInsert, AutomationLogInsert }
export type { LeadStatusDB as LeadStatus }
export type { ExpenseCategory, Expense, ExpenseInsert }

// ============================================================================
// MOCK DATA - Replace with Supabase queries when ready
// ============================================================================

const BUSINESS_ID = "biz_crystalclear_001"

// Mock business profile
const mockBusiness: Business = {
  id: BUSINESS_ID,
  name: "Crystal Clear Pressure Washing",
  industry: "Pressure Washing",
  phone: "(512) 555-0100",
  email: "hello@crystalclearpw.com",
  address: "4200 S Congress Ave, Austin, TX 78745",
  website: "www.crystalclearpw.com",
  timezone: "America/Chicago",
  ai_voice_tone: "friendly",
  ai_instructions: "Always be helpful and professional. Mention same-day quotes when possible.",
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
  updated_at: new Date().toISOString(),
}

// Mock users/team members
const mockUsers: User[] = [
  {
    id: "user_001",
    business_id: BUSINESS_ID,
    email: "mike@crystalclearpw.com",
    name: "Mike Torres",
    role: "owner",
    phone: "(512) 555-0100",
    avatar_url: null,
    notification_email: true,
    notification_sms: true,
    notification_push: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "user_002",
    business_id: BUSINESS_ID,
    email: "carlos@crystalclearpw.com",
    name: "Carlos Ramirez",
    role: "crew_lead",
    phone: "(512) 555-0101",
    avatar_url: null,
    notification_email: true,
    notification_sms: true,
    notification_push: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "user_003",
    business_id: BUSINESS_ID,
    email: "jake@crystalclearpw.com",
    name: "Jake Williams",
    role: "crew_lead",
    phone: "(512) 555-0102",
    avatar_url: null,
    notification_email: true,
    notification_sms: false,
    notification_push: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Mock leads
const mockLeads: Lead[] = [
  {
    id: "lead_001",
    business_id: BUSINESS_ID,
    name: "Sarah Mitchell",
    phone: "(512) 555-0147",
    email: "sarah.m@gmail.com",
    address: "4521 Barton Creek Dr, Austin, TX",
    service: "Driveway + Patio",
    source: "Google Ads",
    status: "new",
    estimated_value: 325,
    property_type: "residential",
    sqft: 850,
    notes: "",
    assigned_to: null,
    last_contact_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "lead_002",
    business_id: BUSINESS_ID,
    name: "Robert Chen",
    phone: "(512) 555-0293",
    email: "rchen@techstartup.io",
    address: "8900 Research Blvd, Austin, TX",
    service: "Commercial Storefront",
    source: "Referral - Tom's BBQ",
    status: "quote_sent",
    estimated_value: 1450,
    property_type: "commercial",
    sqft: 2400,
    notes: "Potential quarterly contract. Decision maker. Referred by Tom's BBQ.",
    assigned_to: "user_001",
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    next_follow_up_at: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "lead_003",
    business_id: BUSINESS_ID,
    name: "Maria Santos",
    phone: "(512) 555-0184",
    email: "maria.santos@yahoo.com",
    address: "2847 Slaughter Lane, Austin, TX",
    service: "Full House Wash",
    source: "Nextdoor",
    status: "booked",
    estimated_value: 475,
    property_type: "residential",
    sqft: 2200,
    notes: "Booked Thursday 8am. Single story, north side has algae. Gate code: 4521",
    assigned_to: "user_002",
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "lead_004",
    business_id: BUSINESS_ID,
    name: "James Crawford",
    phone: "(512) 555-0376",
    email: "jcrawford@email.com",
    address: "1205 Congress Ave, Austin, TX",
    service: "Restaurant Exterior",
    source: "Google Search",
    status: "contacted",
    estimated_value: 875,
    property_type: "commercial",
    sqft: null,
    notes: "URGENT - Health inspector Friday. Restaurant downtown. Need early morning slot.",
    assigned_to: "user_001",
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    next_follow_up_at: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "lead_005",
    business_id: BUSINESS_ID,
    name: "Linda Patterson",
    phone: "(512) 555-0421",
    email: "lindap@gmail.com",
    address: "9834 Circle C Ranch, Austin, TX",
    service: "Driveway + Pool Deck",
    source: "Facebook Ad",
    status: "follow_up",
    estimated_value: 550,
    property_type: "residential",
    sqft: 1200,
    notes: "Large property in Circle C. Follow up - she's checking schedule.",
    assigned_to: "user_001",
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    next_follow_up_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "lead_006",
    business_id: BUSINESS_ID,
    name: "Kevin Brooks",
    phone: "(512) 555-0562",
    email: "kbrooks@propertymanage.com",
    address: "Multiple - South Austin Portfolio",
    service: "Property Management (6 units)",
    source: "LinkedIn",
    status: "quote_scheduled",
    estimated_value: 2800,
    property_type: "commercial",
    sqft: null,
    notes: "Property manager - 6 rentals. Meeting tomorrow 2pm at Riverside property. Big opportunity.",
    assigned_to: "user_001",
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    next_follow_up_at: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "lead_007",
    business_id: BUSINESS_ID,
    name: "David Kim",
    phone: "(512) 555-0698",
    email: "dkim@email.com",
    address: "5543 Manor Road, Austin, TX",
    service: "Driveway",
    source: "Yelp",
    status: "completed",
    estimated_value: 225,
    property_type: "residential",
    sqft: 500,
    notes: "Completed. Sent review request. Very happy - said he'd refer neighbors.",
    assigned_to: "user_002",
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "lead_008",
    business_id: BUSINESS_ID,
    name: "Amanda Foster",
    phone: "(512) 555-0734",
    email: "amanda.f@email.com",
    address: "3321 Riverside Dr, Austin, TX",
    service: "Fence + Deck",
    source: "Repeat Customer",
    status: "new",
    estimated_value: 425,
    property_type: "residential",
    sqft: null,
    notes: "Repeat customer from April. Did driveway - $275.",
    assigned_to: null,
    last_contact_at: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: "lead_009",
    business_id: BUSINESS_ID,
    name: "Tom Henderson",
    phone: "(512) 555-0891",
    email: "thenderson@hoa.org",
    address: "Sunset Valley HOA - Common Areas",
    service: "HOA Common Areas",
    source: "Referral - Board Member",
    status: "quote_sent",
    estimated_value: 3200,
    property_type: "commercial",
    sqft: null,
    notes: "HOA account - quarterly potential. Board meets next Tuesday. Tom is facilities chair.",
    assigned_to: "user_001",
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    next_follow_up_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "lead_010",
    business_id: BUSINESS_ID,
    name: "Rachel Green",
    phone: "(512) 555-0923",
    email: "rachel.green@gmail.com",
    address: "7789 Lost Creek Blvd, Austin, TX",
    service: "Full Property",
    source: "Google Ads",
    status: "lost",
    estimated_value: 750,
    property_type: "residential",
    sqft: null,
    notes: "Lost on price. Competitor was $150 cheaper. Keep for reactivation.",
    assigned_to: null,
    last_contact_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    next_follow_up_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
]

// Mock messages
const mockMessages: Message[] = [
  // Sarah Mitchell messages
  {
    id: "msg_001",
    lead_id: "lead_001",
    company_id: BUSINESS_ID,
    content: "Hi, I need my driveway and back patio pressure washed before a graduation party next Saturday. Driveway is about 600 sq ft and patio is around 250 sq ft. Can you fit me in?",
    sender_type: "lead",
    sender_id: null,
    channel: "sms",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  // Robert Chen messages
  {
    id: "msg_002",
    lead_id: "lead_002",
    company_id: BUSINESS_ID,
    content: "Tom from Tom's BBQ recommended you guys. We have a tech office with a large parking area and building exterior that needs cleaning. Around 2,400 sq ft total. Looking for a quarterly contract.",
    sender_type: "lead",
    sender_id: null,
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "msg_003",
    lead_id: "lead_002",
    company_id: BUSINESS_ID,
    content: "Hi Robert! Thanks for reaching out - Tom's a great guy. I'd love to swing by tomorrow to take a look at the property and put together a detailed quote. Does 10am work?",
    sender_type: "business",
    sender_id: "user_001",
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
  },
  {
    id: "msg_004",
    lead_id: "lead_002",
    company_id: BUSINESS_ID,
    content: "10am works great. See you then.",
    sender_type: "lead",
    sender_id: null,
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 69).toISOString(),
  },
  {
    id: "msg_005",
    lead_id: "lead_002",
    company_id: BUSINESS_ID,
    content: "Robert, great meeting you today. Here's the quote as promised:\n\n• Initial deep clean: $1,450\n• Quarterly maintenance: $850/visit\n• Includes parking lot, sidewalks, building exterior\n\nLet me know if you have any questions!",
    sender_type: "business",
    sender_id: "user_001",
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  // Maria Santos messages
  {
    id: "msg_006",
    lead_id: "lead_003",
    company_id: BUSINESS_ID,
    content: "Saw your post on Nextdoor. Need full house soft wash - we have algae and mildew on the north side. 2,200 sq ft single story.",
    sender_type: "lead",
    sender_id: null,
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "msg_007",
    lead_id: "lead_003",
    company_id: BUSINESS_ID,
    content: "Hi Maria! Full house soft wash for a 2,200 sq ft home would be $475. That includes all siding, eaves, and a rinse of the walkways. I have Thursday or Friday open this week - which works better?",
    sender_type: "business",
    sender_id: "user_001",
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
  },
  {
    id: "msg_008",
    lead_id: "lead_003",
    company_id: BUSINESS_ID,
    content: "Thursday morning would be perfect.",
    sender_type: "lead",
    sender_id: null,
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(),
  },
  {
    id: "msg_009",
    lead_id: "lead_003",
    company_id: BUSINESS_ID,
    content: "You're all set for Thursday at 8am. I'll text when we're on the way. Thanks Maria!",
    sender_type: "business",
    sender_id: "user_001",
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  // James Crawford messages
  {
    id: "msg_010",
    lead_id: "lead_004",
    company_id: BUSINESS_ID,
    content: "I manage Crawfish Shack downtown. Our patio and sidewalk area needs cleaning urgently - health inspector coming Friday. Can you do tomorrow?",
    sender_type: "lead",
    sender_id: null,
    channel: "phone",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "msg_011",
    lead_id: "lead_004",
    company_id: BUSINESS_ID,
    content: "James, I can absolutely help. I have a slot tomorrow at 6am before you open. For a restaurant patio and sidewalk, we're looking at around $875 including grease treatment. I'll bring the hot water unit. Can I get the address?",
    sender_type: "business",
    sender_id: "user_001",
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  // Linda Patterson messages
  {
    id: "msg_012",
    lead_id: "lead_005",
    company_id: BUSINESS_ID,
    content: "Interested in getting my driveway and pool deck cleaned. Large circular driveway plus 400 sq ft pool deck.",
    sender_type: "lead",
    sender_id: null,
    channel: "web_form",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "msg_013",
    lead_id: "lead_005",
    company_id: BUSINESS_ID,
    content: "Hi Linda! Thanks for reaching out. For a large circular driveway plus pool deck, I'd estimate around $550. Want me to come by for a quick look to give you an exact number?",
    sender_type: "business",
    sender_id: "user_001",
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "msg_014",
    lead_id: "lead_005",
    company_id: BUSINESS_ID,
    content: "That sounds reasonable. Let me check my schedule and get back to you.",
    sender_type: "lead",
    sender_id: null,
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  // Kevin Brooks messages
  {
    id: "msg_015",
    lead_id: "lead_006",
    company_id: BUSINESS_ID,
    content: "I manage 6 rental properties in South Austin. Looking for a reliable pressure washing company to handle all of them on a rotating schedule. Each property needs service every 6 months.",
    sender_type: "lead",
    sender_id: null,
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "msg_016",
    lead_id: "lead_006",
    company_id: BUSINESS_ID,
    content: "Kevin, this sounds like a great fit. I'd love to put together a package deal for all 6 properties. Can we meet tomorrow to discuss the scope? I can swing by your office or meet at one of the properties.",
    sender_type: "business",
    sender_id: "user_001",
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  // David Kim messages
  {
    id: "msg_017",
    lead_id: "lead_007",
    company_id: BUSINESS_ID,
    content: "Job complete! Your driveway looks brand new. Thanks for choosing Crystal Clear - here's a before/after photo. Would really appreciate a review if you have a moment: [review link]",
    sender_type: "business",
    sender_id: "user_002",
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  // Amanda Foster messages
  {
    id: "msg_018",
    lead_id: "lead_008",
    company_id: BUSINESS_ID,
    content: "Hey! You did our driveway last spring and it still looks great. Now we need the back fence and deck done before summer. Same deal?",
    sender_type: "lead",
    sender_id: null,
    channel: "sms",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  // Tom Henderson messages
  {
    id: "msg_019",
    lead_id: "lead_009",
    company_id: BUSINESS_ID,
    content: "Board member recommended you for our HOA. We need the community pool area, 4 pavilions, and main entrance sidewalks cleaned quarterly.",
    sender_type: "lead",
    sender_id: null,
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "msg_020",
    lead_id: "lead_009",
    company_id: BUSINESS_ID,
    content: "Tom, I walked the property yesterday and put together a comprehensive quote:\n\n• Pool deck & surrounding area: $1,200\n• 4 Pavilions: $800 ($200 each)\n• Main entrance & sidewalks: $1,200\n• Total: $3,200 per service\n• Quarterly rate: $2,900/visit (10% discount)\n\nThis includes full cleanup and all chemicals. Board approval needed?",
    sender_type: "business",
    sender_id: "user_001",
    channel: "email",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  // Rachel Green messages
  {
    id: "msg_021",
    lead_id: "lead_010",
    company_id: BUSINESS_ID,
    content: "Thanks for the quote but we went with someone else. Your price was a bit higher than what we were looking for.",
    sender_type: "lead",
    sender_id: null,
    channel: "sms",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
]

// Mock automations
const mockAutomations: Automation[] = [
  {
    id: "auto_001",
    business_id: BUSINESS_ID,
    name: "Missed Call Text-Back",
    description: "Sends an instant text when you miss a call: \"Hey, sorry I missed your call! I'm on a job right now. What can I help you with?\"",
    type: "missed_call",
    enabled: true,
    config: { delay_seconds: 30, message_template: "Hey, sorry I missed your call! I'm on a job right now. What can I help you with?" },
    trigger_count: 156,
    success_count: 106,
    last_triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "auto_002",
    business_id: BUSINESS_ID,
    name: "New Lead Speed-to-Lead",
    description: "Sends response within 60 seconds of new inquiry to beat competitors to the punch.",
    type: "new_lead",
    enabled: true,
    config: { delay_seconds: 60, message_template: "Hi {{name}}! Thanks for reaching out to Crystal Clear. I'll get you a quote shortly. What's the best time to call?" },
    trigger_count: 89,
    success_count: 66,
    last_triggered_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "auto_003",
    business_id: BUSINESS_ID,
    name: "Quote Follow-Up Sequence",
    description: "Follows up on sent quotes at Day 2, Day 5, and Day 10 if no response received.",
    type: "quote_follow_up",
    enabled: true,
    config: { follow_up_days: [2, 5, 10] },
    trigger_count: 67,
    success_count: 28,
    last_triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "auto_004",
    business_id: BUSINESS_ID,
    name: "Review Request",
    description: "Requests Google review 24 hours after job marked complete. Includes direct review link.",
    type: "review_request",
    enabled: true,
    config: { delay_hours: 24, review_link: "https://g.page/r/crystalclearpw/review" },
    trigger_count: 34,
    success_count: 11,
    last_triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "auto_005",
    business_id: BUSINESS_ID,
    name: "Seasonal Reactivation",
    description: "Reaches out to past customers when it's time for their annual service.",
    type: "reactivation",
    enabled: false,
    config: { months_since_service: 11 },
    trigger_count: 45,
    success_count: 13,
    last_triggered_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Mock activities
const mockActivities: Activity[] = [
  {
    id: "act_001",
    business_id: BUSINESS_ID,
    lead_id: "lead_001",
    user_id: null,
    type: "lead_created",
    description: "New lead from Google Ads",
    metadata: { lead_name: "Sarah Mitchell", estimated_value: 325 },
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "act_002",
    business_id: BUSINESS_ID,
    lead_id: "lead_008",
    user_id: null,
    type: "lead_created",
    description: "Repeat customer inquiry",
    metadata: { lead_name: "Amanda Foster", estimated_value: 425 },
    created_at: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: "act_003",
    business_id: BUSINESS_ID,
    lead_id: "lead_003",
    user_id: "user_001",
    type: "job_booked",
    description: "Full house soft wash confirmed",
    metadata: { lead_name: "Maria Santos", value: 475 },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "act_004",
    business_id: BUSINESS_ID,
    lead_id: "lead_002",
    user_id: "user_001",
    type: "quote_sent",
    description: "Commercial quarterly contract quote",
    metadata: { lead_name: "Robert Chen", value: 1450 },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "act_005",
    business_id: BUSINESS_ID,
    lead_id: "lead_007",
    user_id: "user_002",
    type: "job_completed",
    description: "Driveway cleaning finished",
    metadata: { lead_name: "David Kim", value: 225 },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "act_006",
    business_id: BUSINESS_ID,
    lead_id: "lead_005",
    user_id: null,
    type: "automation_triggered",
    description: "Quote follow-up sent",
    metadata: { lead_name: "Linda Patterson", automation: "Quote Follow-Up Sequence" },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "act_007",
    business_id: BUSINESS_ID,
    lead_id: "lead_007",
    user_id: null,
    type: "review_received",
    description: "5-star review received",
    metadata: { lead_name: "David Kim", rating: 5 },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "act_008",
    business_id: BUSINESS_ID,
    lead_id: "lead_004",
    user_id: "user_001",
    type: "message_sent",
    description: "Response sent to urgent request",
    metadata: { lead_name: "James Crawford" },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
]

// Mock jobs
const mockJobs: Job[] = [
  {
    id: "job_001",
    business_id: BUSINESS_ID,
    lead_id: "lead_003",
    assigned_to: "user_002",
    title: "Full House Soft Wash",
    description: "2,200 sq ft single story. Algae on north side. Gate code: 4521",
    status: "scheduled",
    scheduled_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split("T")[0],
    scheduled_time: "08:00",
    estimated_duration: 180,
    actual_duration: null,
    price: 475,
    notes: null,
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "job_002",
    business_id: BUSINESS_ID,
    lead_id: "lead_004",
    assigned_to: "user_001",
    title: "Restaurant Exterior - Crawfish Shack",
    description: "Patio and sidewalk. Hot water unit needed for grease. URGENT - inspector Friday.",
    status: "scheduled",
    scheduled_date: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString().split("T")[0],
    scheduled_time: "06:00",
    estimated_duration: 240,
    actual_duration: null,
    price: 875,
    notes: "Early morning before they open",
    completed_at: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "job_003",
    business_id: BUSINESS_ID,
    lead_id: "lead_007",
    assigned_to: "user_002",
    title: "Driveway Cleaning",
    description: "500 sq ft driveway",
    status: "completed",
    scheduled_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split("T")[0],
    scheduled_time: "10:00",
    estimated_duration: 90,
    actual_duration: 75,
    price: 225,
    notes: "Customer very happy",
    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// Mock AI generations
const mockAIGenerations: AIGeneration[] = [
  {
    id: "gen_001",
    business_id: BUSINESS_ID,
    user_id: "user_001",
    lead_id: "lead_001",
    type: "reply",
    prompt: "Draft a response to Sarah about driveway + patio quote",
    content: "Hi Sarah! Thanks for reaching out. I can definitely fit you in before your graduation party - that's exciting! For 850 sq ft (driveway + patio), the price would be $325. I have Thursday or Friday afternoon available this week. Which works better for you?",
    was_used: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "gen_002",
    business_id: BUSINESS_ID,
    user_id: "user_001",
    lead_id: "lead_005",
    type: "follow_up",
    prompt: "Follow up with Linda on driveway + pool deck quote",
    content: "Hi Linda! Just circling back on your driveway and pool deck cleaning. I know you mentioned checking your schedule - I have some availability this Thursday and Friday if either works. The pool deck will look amazing just in time for summer! Let me know.",
    was_used: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "gen_003",
    business_id: BUSINESS_ID,
    user_id: "user_001",
    lead_id: "lead_007",
    type: "review_request",
    prompt: "Request review from David after driveway job",
    content: "Hi David! Hope you're enjoying that clean driveway. If you have a minute, I'd really appreciate a quick Google review - it helps other folks in Austin find quality service. Here's the link: [review link]. Thanks again for choosing Crystal Clear!",
    was_used: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// ============================================================================
// DATA SERVICE API
// When connecting to Supabase, replace the implementation of each function
// ============================================================================

// ----- Business -----
export async function getBusiness(): Promise<Business> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('businesses').select().single()
  return mockBusiness
}

export async function updateBusiness(updates: Partial<Business>): Promise<Business> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('businesses').update(updates).eq('id', BUSINESS_ID).select().single()
  Object.assign(mockBusiness, updates, { updated_at: new Date().toISOString() })
  return mockBusiness
}

// ----- Users -----
export async function getUsers(): Promise<User[]> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('users').select().eq('business_id', BUSINESS_ID)
  return mockUsers
}

export async function getCurrentUser(): Promise<User> {
  // TODO: Replace with Supabase auth
  // const { data: { user } } = await supabase.auth.getUser()
  return mockUsers[0]
}

// ----- Leads -----

// Type for Supabase leads table (matches actual schema)
// Schema: id, company_id, customer_name, phone, email, service_type, address, message, source, status, quote_amount, completed_at, next_follow_up_at, created_at, updated_at
interface SupabaseLead {
  id: string
  company_id: string
  customer_name: string
  phone: string
  email: string | null
  service_type: string
  address: string | null
  message: string | null
  source: string | null
  status: LeadStatusDB
  quote_amount: number | null
  completed_at: string | null
  lost_at: string | null
  next_follow_up_at: string | null
  scheduled_at: string | null
  created_at: string
  updated_at: string
}

// Map Supabase lead to app Lead type
function mapSupabaseLeadToLead(supabaseLead: SupabaseLead): Lead {
  return {
    id: supabaseLead.id,
    business_id: supabaseLead.company_id || BUSINESS_ID,
    name: supabaseLead.customer_name,
    phone: supabaseLead.phone,
    email: supabaseLead.email,
    address: supabaseLead.address,
    service: supabaseLead.service_type,
    source: supabaseLead.source,
    status: supabaseLead.status,
    estimated_value: supabaseLead.quote_amount,
    property_type: null, // Column doesn't exist in schema
    sqft: null, // Column doesn't exist in schema
    notes: supabaseLead.message,
    assigned_to: null, // Column doesn't exist in schema
    last_contact_at: null, // Column doesn't exist in schema
    next_follow_up_at: supabaseLead.next_follow_up_at ?? null,
    scheduled_at: supabaseLead.scheduled_at ?? null,
    completed_at: supabaseLead.completed_at,
    lost_at: supabaseLead.lost_at ?? null,
    created_at: supabaseLead.created_at,
    updated_at: supabaseLead.updated_at,
  }
}

// ----- Company ID Helper -----
// Get the current user's company_id from the profiles table
export async function getCurrentUserCompanyId(): Promise<string | null> {
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("user_id", user.id)
    .single()

  if (profileError || !profile?.company_id) {
    return null
  }

  return profile.company_id
}

// ----- Company Functions -----

export interface Company {
  id: string
  name: string
  location: string | null
  phone: string | null
  email: string | null
  address: string | null
  website: string | null
  industry: string | null
  timezone: string | null
  created_at: string
}

export async function createCompanyForUser(userId: string, companyName = "My Business"): Promise<Company | null> {
  const supabase = createClient()
  
  // Check if profile already exists for this user
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, company_id")
    .eq("user_id", userId)
    .single()

  if (existingProfile?.company_id) {
    // Profile exists, fetch and return the existing company
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("*")
      .eq("id", existingProfile.company_id)
      .single()
    
    if (existingCompany) {
      return {
        id: existingCompany.id,
        name: existingCompany.name || "My Business",
        location: existingCompany.location || null,
        phone: existingCompany.phone || null,
        email: existingCompany.email || null,
        address: existingCompany.address || null,
        website: existingCompany.website || null,
        industry: existingCompany.industry || null,
        timezone: existingCompany.timezone || null,
        created_at: existingCompany.created_at,
      }
    }
  }
  
  // Create the company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: companyName,
      location: "",
    })
    .select()
    .single()

  if (companyError || !company) {
    console.error("Error creating company:", companyError)
    return null
  }

  // Create profile row linking user to company
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      user_id: userId,
      company_id: company.id,
    })

  if (profileError) {
    console.error("Error creating profile:", profileError)
    // Try to clean up the company we just created
    await supabase.from("companies").delete().eq("id", company.id)
    return null
  }

  return {
    id: company.id,
    name: company.name || "My Business",
    location: company.location || null,
    phone: company.phone || null,
    email: company.email || null,
    address: company.address || null,
    website: company.website || null,
    industry: company.industry || null,
    timezone: company.timezone || null,
    created_at: company.created_at,
  }
}

export async function getCurrentCompany(): Promise<Company | null> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null
  }

  // Get company_id from profiles table (source of truth for user-to-company mapping)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("user_id", user.id)
    .single()

  if (profileError || !profile?.company_id) {
    return null
  }

  const companyId = profile.company_id

  // Fetch company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single()

  if (companyError || !company) {
    console.error("Error fetching company:", companyError)
    return null
  }

  return {
    id: company.id,
    name: company.name || "My Business",
    location: company.location || null,
    phone: company.phone || null,
    email: company.email || null,
    address: company.address || null,
    website: company.website || null,
    industry: company.industry || null,
    timezone: company.timezone || null,
    created_at: company.created_at,
  }
}

export interface CompanyUpdate {
  name?: string
  location?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  industry?: string
  timezone?: string
}

export async function updateCompany(companyId: string, updates: CompanyUpdate): Promise<Company | null> {
  const supabase = createClient()
  
  const updatePayload = {
    name: updates.name,
    location: updates.location,
    phone: updates.phone,
    email: updates.email,
    address: updates.address,
    website: updates.website,
    industry: updates.industry,
    timezone: updates.timezone,
  }
  
  const { data, error } = await supabase
    .from("companies")
    .update(updatePayload)
    .eq("id", companyId)
    .select()
    .single()

  if (error || !data) {
    console.error("Error updating company:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name || "My Business",
    location: data.location || null,
    phone: data.phone || null,
    email: data.email || null,
    address: data.address || null,
    website: data.website || null,
    industry: data.industry || null,
    timezone: data.timezone || null,
    created_at: data.created_at,
  }
}

// ----- Activity Logging Helper -----
async function logActivity(params: {
  lead_id?: string | null
  company_id?: string
  activity_type: string
  title: string
  description?: string
}): Promise<void> {
  const supabase = createClient()
  
  const activityInsert = {
    lead_id: params.lead_id || null,
    company_id: params.company_id,
    activity_type: params.activity_type,
    title: params.title,
    description: params.description || null,
  }

  const { error } = await supabase
    .from("activity_log")
    .insert(activityInsert)

  if (error) {
    console.error("Error logging activity:", error)
  }
}

export async function getLeads(): Promise<Lead[]> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  
  if (!companyId) {
    return [] // No company, return empty
  }
  
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return data.map((lead: SupabaseLead) => mapSupabaseLeadToLead(lead))
}

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  
  if (!companyId) {
    return null
  }
  
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .eq("company_id", companyId)
    .single()

  if (error || !data) {
    return null
  }

  return mapSupabaseLeadToLead(data as SupabaseLead)
}

// Map app LeadInsert fields to Supabase column names
// Schema: id, company_id, customer_name, phone, email, service_type, address, message, source, status, quote_amount, created_at, updated_at
function mapLeadInsertToSupabase(lead: LeadInsert, companyId: string): Record<string, unknown> {
return {
    company_id: companyId,
    customer_name: lead.name || "Unknown",
    phone: lead.phone || "",
    email: lead.email || null,
    service_type: lead.service || "Other",
    address: lead.address || null,
    message: lead.notes || null,
    source: lead.source || null,
    status: lead.status || "new",
    quote_amount: lead.estimated_value || null,
  }
}

export async function createLead(lead: LeadInsert): Promise<Lead | null> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  
  if (!companyId) {
    console.error("Error creating lead: No company_id found")
    return null
  }
  
  const supabaseInsert = mapLeadInsertToSupabase(lead, companyId)
  
  const { data, error } = await supabase
    .from("leads")
    .insert(supabaseInsert)
    .select()
    .single()

  if (error) {
    console.error("Error creating lead:", error)
    return null
  }

  // Log activity for new lead creation
  const createdLead = data as SupabaseLead
  await logActivity({
    lead_id: createdLead.id,
    company_id: companyId,
    activity_type: "lead_created",
    title: "New lead created",
    description: `${createdLead.customer_name || "New lead"} - ${createdLead.service_type || "Service"}`,
  })

  return mapSupabaseLeadToLead(createdLead)
}

// Map app LeadUpdate fields to Supabase column names
// Schema: id, company_id, customer_name, phone, email, service_type, address, message, source, status, quote_amount, completed_at, created_at, updated_at
// IMPORTANT: Always use canonical status values ("scheduled", "completed") - never "booked" or "complete"
function mapLeadUpdateToSupabase(updates: LeadUpdate & { completed_at?: string }): Record<string, unknown> {
  const supabaseUpdates: Record<string, unknown> = {}

  if (updates.name !== undefined) supabaseUpdates.customer_name = updates.name
  if (updates.phone !== undefined) supabaseUpdates.phone = updates.phone
  if (updates.email !== undefined) supabaseUpdates.email = updates.email
  if (updates.address !== undefined) supabaseUpdates.address = updates.address
  if (updates.service !== undefined) supabaseUpdates.service_type = updates.service
  if (updates.source !== undefined) supabaseUpdates.source = updates.source
  if (updates.status !== undefined) supabaseUpdates.status = normalizeStatus(updates.status)
  if (updates.estimated_value !== undefined) supabaseUpdates.quote_amount = updates.estimated_value
  if (updates.notes !== undefined) supabaseUpdates.message = updates.notes
  if (updates.next_follow_up_at !== undefined) supabaseUpdates.next_follow_up_at = updates.next_follow_up_at
  if (updates.scheduled_at !== undefined) supabaseUpdates.scheduled_at = updates.scheduled_at
  if (updates.completed_at !== undefined) supabaseUpdates.completed_at = updates.completed_at
  if (updates.lost_at !== undefined) supabaseUpdates.lost_at = updates.lost_at

  supabaseUpdates.updated_at = new Date().toISOString()

  return supabaseUpdates
}

// Create a job from a lead when it's marked as scheduled
// Jobs table schema: id, company_id, lead_id, title, service_type, scheduled_at, price, address, notes, status, created_at, updated_at
async function createJobFromLead(lead: SupabaseLead, companyId: string): Promise<void> {
  const supabase = createClient()
  
  const jobInsert = {
    lead_id: lead.id,
    company_id: companyId,
    title: `${lead.service_type || "Service"} - ${lead.customer_name || "Customer"}`,
    service_type: lead.service_type || null,
    scheduled_at: null, // Will be set when scheduling
    price: lead.quote_amount || 0,
    address: lead.address || null,
    notes: lead.message || null,
    status: "scheduled" as const,
  }

  const { error } = await supabase
    .from("jobs")
    .insert(jobInsert)

  if (error) {
    console.error("Error creating job from lead:", error)
  }
}

export async function updateLead(id: string, updates: LeadUpdate & { completed_at?: string }): Promise<Lead | null> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  
  if (!companyId) {
    console.error("Error updating lead: No company_id found")
    return null
  }
  
  const supabaseUpdates = mapLeadUpdateToSupabase(updates)
  
  const { data, error } = await supabase
    .from("leads")
    .update(supabaseUpdates)
    .eq("id", id)
    .eq("company_id", companyId)
    .select()
    .single()

  if (error) {
    console.error("Error updating lead:", error)
    return null
  }

  const updatedLead = data as SupabaseLead
  const leadName = updatedLead.customer_name || "Lead"

  // Log activity for status change
  if (updates.status) {
    await logActivity({
      lead_id: updatedLead.id,
      company_id: companyId,
      activity_type: "status_changed",
      title: `Status changed to ${updates.status}`,
      description: `${leadName} - Status updated to ${updates.status}`,
    })
  }

  // Log activity for quote amount update
  if (updates.estimated_value !== undefined) {
    await logActivity({
      lead_id: updatedLead.id,
      company_id: companyId,
      activity_type: "quote_updated",
      title: "Quote amount updated",
      description: `${leadName} - Quote set to $${updates.estimated_value || 0}`,
    })
  }

  // If status changed to "scheduled" (or legacy "booked"), create a job and log it
  const normalizedStatus = normalizeStatus(updates.status)
  if (normalizedStatus === "scheduled") {
    await createJobFromLead(updatedLead, companyId)
    await logActivity({
      lead_id: updatedLead.id,
      company_id: companyId,
      activity_type: "job_booked",
      title: "Job scheduled",
      description: `${leadName} - ${updatedLead.service_type || "Service"} scheduled for $${updatedLead.quote_amount || 0}`,
    })
  }

  // If status changed to "completed", log job completion
  if (normalizedStatus === "completed") {
    await logActivity({
      lead_id: updatedLead.id,
      company_id: companyId,
      activity_type: "job_completed",
      title: "Job completed",
      description: `${leadName} - ${updatedLead.service_type || "Service"} completed for $${updatedLead.quote_amount || 0}`,
    })
  }

  return mapSupabaseLeadToLead(updatedLead)
}

export async function deleteLead(id: string): Promise<boolean> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  if (!companyId) return false

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("company_id", companyId)

  if (error) {
    console.error("Error deleting lead:", error)
    return false
  }
  return true
}

// ----- Messages (uses Supabase "messages" table — matches 001_create_schema.sql) -----

export async function getMessages(leadId: string): Promise<Message[]> {
  const supabase = createClient()
  const businessId = await getCurrentUserCompanyId()

  if (!businessId) return []

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("lead_id", leadId)
    .eq("company_id", businessId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return data ?? []
}

export async function createMessage(message: MessageInsert): Promise<Message | null> {
  const supabase = createClient()
  const businessId = await getCurrentUserCompanyId()

  if (!businessId) {
    console.error("createMessage: no business_id found")
    return null
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({ ...message, company_id: businessId })
    .select()
    .single()

  if (error) {
    console.error("Error creating message:", error)
    return null
  }

  return data as Message
}

export async function markMessagesRead(leadId: string): Promise<void> {
  const supabase = createClient()
  const businessId = await getCurrentUserCompanyId()

  if (!businessId) return

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("lead_id", leadId)
    .eq("company_id", businessId)
    .eq("is_read", false)

  if (error) {
    console.error("Error marking messages read:", error)
  }
}

// ----- Scheduled Messages -----

export async function getScheduledMessages(leadId?: string): Promise<ScheduledMessage[]> {
  const supabase = createClient()
  const businessId = await getCurrentUserCompanyId()

  if (!businessId) return []

  let query = supabase
    .from("scheduled_messages")
    .select("*")
    .eq("company_id", businessId)
    .order("send_at", { ascending: true })

  if (leadId) {
    query = query.eq("lead_id", leadId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching scheduled messages:", error)
    return []
  }

  return data ?? []
}

export async function createScheduledMessage(
  msg: Omit<ScheduledMessageInsert, "company_id">
): Promise<ScheduledMessage | null> {
  const supabase = createClient()
  const businessId = await getCurrentUserCompanyId()

  if (!businessId) {
    console.error("createScheduledMessage: no company_id found")
    return null
  }

  const { data, error } = await supabase
    .from("scheduled_messages")
    .insert({ ...msg, company_id: businessId })
    .select()
    .single()

  if (error) {
    console.error("Error creating scheduled message:", error)
    return null
  }

  return data as ScheduledMessage
}

export async function cancelScheduledMessage(id: string): Promise<boolean> {
  const supabase = createClient()
  const businessId = await getCurrentUserCompanyId()

  if (!businessId) return false

  const { error } = await supabase
    .from("scheduled_messages")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("company_id", businessId)
    .eq("status", "pending") // only cancel if still pending

  if (error) {
    console.error("Error cancelling scheduled message:", error)
    return false
  }

  return true
}

// ----- Automations -----
export async function getAutomations(): Promise<Automation[]> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('automations').select().eq('business_id', BUSINESS_ID)
  return mockAutomations
}

export async function updateAutomation(id: string, updates: AutomationUpdate): Promise<Automation | null> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('automations').update(updates).eq('id', id).select().single()
  const automation = mockAutomations.find((a) => a.id === id)
  if (automation) {
    Object.assign(automation, updates, { updated_at: new Date().toISOString() })
    return automation
  }
  return null
}

// ----- Activities (uses Supabase "activity_log" table) -----

// Type for Supabase activity_log table (matches actual schema)
// Schema: id, company_id, lead_id, job_id, activity_type, title, description, created_at
interface SupabaseActivity {
  id: string
  company_id: string
  lead_id?: string | null
  job_id?: string | null
  activity_type?: string
  title?: string
  description?: string
  created_at: string
}

// Map Supabase activity to app Activity type
function mapSupabaseActivityToActivity(activity: SupabaseActivity): Activity {
  return {
    id: activity.id,
    business_id: activity.company_id || BUSINESS_ID,
    lead_id: activity.lead_id || null,
    user_id: null, // Column doesn't exist in schema
    type: (activity.activity_type as Activity["type"]) || "lead_updated",
    description: activity.description || activity.title || "Activity",
    metadata: null, // Column doesn't exist in schema
    created_at: activity.created_at,
  }
}

// Metadata shape stored on Activity for the dashboard feed.
// All values come from live Supabase joins — never from stale description text.
export interface ActivityFeedMeta {
  lead_name?: string       // current customer_name from leads table
  service_type?: string    // current service_type from leads table
  quote_amount?: number    // current quote_amount from leads table
  job_title?: string       // current title from jobs table
  job_price?: number       // current price from jobs table
  raw_title?: string       // activity_log.title (event label, generally clean)
}

export async function getActivities(limit = 20): Promise<Activity[]> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()

  if (!companyId) return []

  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching activities:", error)
    return []
  }

  if (!data || data.length === 0) return []

  // ── Collect unique IDs for batch joins ──────────────────────────────────
  const leadIds = [
    ...new Set(
      data
        .filter((a: SupabaseActivity) => a.lead_id)
        .map((a: SupabaseActivity) => a.lead_id as string)
    ),
  ]
  const jobIds = [
    ...new Set(
      data
        .filter((a: SupabaseActivity) => a.job_id)
        .map((a: SupabaseActivity) => a.job_id as string)
    ),
  ]

  // ── Fetch current lead data (names/service/amount are the live truth) ───
  type LeadRow = { id: string; customer_name: string | null; service_type: string | null; quote_amount: number | null }
  const leadMap: Record<string, LeadRow> = {}
  if (leadIds.length > 0) {
    const { data: leadsData } = await supabase
      .from("leads")
      .select("id, customer_name, service_type, quote_amount")
      .in("id", leadIds)
    if (leadsData) {
      for (const l of leadsData as LeadRow[]) {
        if (l.id) leadMap[l.id] = l
      }
    }
  }

  // ── Fetch current job data ───────────────────────────────────────────────
  type JobRow = { id: string; title: string | null; price: number | null }
  const jobMap: Record<string, JobRow> = {}
  if (jobIds.length > 0) {
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("id, title, price")
      .in("id", jobIds)
    if (jobsData) {
      for (const j of jobsData as JobRow[]) {
        if (j.id) jobMap[j.id] = j
      }
    }
  }

  // ── Build activities with rich live metadata ─────────────────────────────
  return data.map((activity: SupabaseActivity) => {
    const mapped = mapSupabaseActivityToActivity(activity)
    const lead = activity.lead_id ? leadMap[activity.lead_id] : null
    const job  = activity.job_id  ? jobMap[activity.job_id]   : null

    const meta: ActivityFeedMeta = {
      lead_name:    lead?.customer_name  ?? undefined,
      service_type: lead?.service_type   ?? undefined,
      quote_amount: lead?.quote_amount   ?? undefined,
      job_title:    job?.title           ?? undefined,
      job_price:    job?.price           ?? undefined,
      raw_title:    activity.title       ?? undefined,
    }
    mapped.metadata = meta as unknown as Activity["metadata"]
    return mapped
  })
}

// ----- Jobs (uses Supabase "jobs" table) -----

// Type for Supabase jobs table (matches actual schema)
// Schema: id, company_id, lead_id, title, service_type, scheduled_at, price, address, notes, status, created_at, updated_at
interface SupabaseJob {
  id: string
  company_id: string
  lead_id: string
  title: string
  service_type: string | null
  scheduled_at: string | null
  price: number
  address: string | null
  notes: string | null
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  created_at: string
  updated_at: string
}

// Map Supabase job to app Job type
function mapSupabaseJobToJob(job: SupabaseJob): Job {
  // Parse scheduled_at into date and time
  let scheduledDate = ""
  let scheduledTime: string | null = null
  
  if (job.scheduled_at) {
    const date = new Date(job.scheduled_at)
    scheduledDate = date.toISOString().split("T")[0]
    scheduledTime = date.toLocaleTimeString("en-US", { 
      hour: "numeric", 
      minute: "2-digit",
      hour12: true 
    })
  }

  return {
    id: job.id,
    business_id: job.company_id, // Map company_id to business_id for app compatibility
    lead_id: job.lead_id,
    assigned_to: null, // Column doesn't exist in schema
    title: job.title || job.service_type || "Job",
    description: job.notes, // Use notes as description
    status: job.status || "scheduled",
    scheduled_date: scheduledDate,
    scheduled_time: scheduledTime,
    estimated_duration: null, // Column doesn't exist in schema
    actual_duration: null, // Column doesn't exist in schema
    price: job.price || 0,
    notes: job.notes,
    completed_at: null, // Column doesn't exist in schema
    created_at: job.created_at,
    updated_at: job.updated_at,
  }
}

export async function getJobs(): Promise<Job[]> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  
  if (!companyId) {
    return []
  }
  
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .order("scheduled_at", { ascending: true })

  if (error) {
    console.error("Error fetching jobs:", error)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return data.map((job: SupabaseJob) => mapSupabaseJobToJob(job))
}

export async function getUpcomingJobs(limit = 5): Promise<Job[]> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  
  if (!companyId) {
    return []
  }
  
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .eq("status", "scheduled")
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching upcoming jobs:", error)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  return data.map((job: SupabaseJob) => mapSupabaseJobToJob(job))
}

// Jobs scheduled for today (any time, including past)
export async function getTodayJobs(): Promise<Job[]> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  if (!companyId) return []

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(tomorrowStart.getDate() + 1)

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .gte("scheduled_at", todayStart.toISOString())
    .lt("scheduled_at", tomorrowStart.toISOString())
    .neq("status", "cancelled")
    .order("scheduled_at", { ascending: true })

  if (error) {
    console.error("Error fetching today's jobs:", error)
    return []
  }
  return (data || []).map((job: SupabaseJob) => mapSupabaseJobToJob(job))
}

// Jobs scheduled for the current calendar week (Mon–Sun), excludes cancelled
export async function getWeekJobs(): Promise<Job[]> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  if (!companyId) return []

  const now = new Date()
  const day = now.getDay()
  const daysFromMonday = day === 0 ? 6 : day - 1
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday)
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
    .gte("scheduled_at", weekStart.toISOString())
    .lt("scheduled_at", weekEnd.toISOString())
    .neq("status", "cancelled")
    .order("scheduled_at", { ascending: true })

  if (error) {
    console.error("Error fetching week jobs:", error)
    return []
  }
  return (data || []).map((job: SupabaseJob) => mapSupabaseJobToJob(job))
}

// ----- AI Generations -----
export async function getAIGenerations(limit = 10): Promise<AIGeneration[]> {
  // TODO: Replace with Supabase query
  // const { data } = await supabase.from('ai_generations').select().eq('business_id', BUSINESS_ID).order('created_at', { ascending: false }).limit(limit)
  return mockAIGenerations.slice(0, limit)
}

// ----- Dashboard date range -----
export type DateRangeKey = "week" | "month" | "quarter" | "year"

export const dateRangeLabels: Record<DateRangeKey, string> = {
  week: "this week",
  month: "this month",
  quarter: "this quarter",
  year: "this year",
}

export const dateRangeButtonLabels: Record<DateRangeKey, string> = {
  week: "This Week",
  month: "This Month",
  quarter: "This Quarter",
  year: "This Year",
}

// Optional custom date range to override the preset DateRangeKey window
export interface CustomDateRange { from: Date; to: Date }

// Returns the start of the current calendar period for the given range key.
export function getDateRangeStart(range: DateRangeKey): Date {
  const now = new Date()
  switch (range) {
    case "week": {
      const day = now.getDay()
      const daysFromMonday = day === 0 ? 6 : day - 1
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday)
    }
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1)
    case "quarter": {
      const qMonth = Math.floor(now.getMonth() / 3) * 3
      return new Date(now.getFullYear(), qMonth, 1)
    }
    case "year":
      return new Date(now.getFullYear(), 0, 1)
  }
}

// Finance page uses its own range strings ("this-week", "this-month", "last-30",
// "this-quarter", "ytd"). Returns inclusive start and exclusive end as Date objects.
export function getFinanceDateBounds(range: string): { start: Date; end: Date } {
  const now = new Date()
  switch (range) {
    case "this-week": {
      const day = now.getDay()
      const daysFromMonday = day === 0 ? 6 : day - 1
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday)
      const end = new Date(start)
      end.setDate(end.getDate() + 7)
      return { start, end }
    }
    case "this-month":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      }
    case "last-30": {
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      const start = new Date(end)
      start.setDate(start.getDate() - 30)
      return { start, end }
    }
    case "this-quarter": {
      const qMonth = Math.floor(now.getMonth() / 3) * 3
      return {
        start: new Date(now.getFullYear(), qMonth, 1),
        end: new Date(now.getFullYear(), qMonth + 3, 1),
      }
    }
    case "ytd":
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear() + 1, 0, 1),
      }
    default:
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      }
  }
}

function getPrevRangeStart(range: DateRangeKey, rangeStart: Date): Date {
  const prev = new Date(rangeStart)
  switch (range) {
    case "week":   prev.setDate(prev.getDate() - 7);       break
    case "month":  prev.setMonth(prev.getMonth() - 1);     break
    case "quarter":prev.setMonth(prev.getMonth() - 3);     break
    case "year":   prev.setFullYear(prev.getFullYear() - 1); break
  }
  return prev
}

// Returns the exclusive end of the current calendar period (i.e. start of the NEXT period).
export function getRangeEnd(range: DateRangeKey, rangeStart: Date): Date {
  const end = new Date(rangeStart)
  switch (range) {
    case "week":    end.setDate(end.getDate() + 7);       break
    case "month":   end.setMonth(end.getMonth() + 1);     break
    case "quarter": end.setMonth(end.getMonth() + 3);     break
    case "year":    end.setFullYear(end.getFullYear() + 1); break
  }
  return end
}

// Returns a human-readable "MMM D – MMM D, YYYY" label for the current range.
export function formatDateRangeLabel(range: DateRangeKey): string {
  const start = getDateRangeStart(range)
  const end = new Date(getRangeEnd(range, start))
  end.setDate(end.getDate() - 1) // inclusive end day
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const year = end.getFullYear()
  return `${fmt(start)} – ${fmt(end)}, ${year}`
}

// ----- Dashboard KPIs -----
export interface DashboardKPIs {
  newLeadsToday: number
  leadsAwaitingResponse: number
  quotesOutstanding: number
  bookedThisWeek: number
  weeklyRevenue: number
  avgResponseTime: string
  conversionRate: number
  repeatCustomerRate: number
  weeklyGrowth: number
}

export async function getDashboardKPIs(
  range: DateRangeKey = "week",
  customRange?: CustomDateRange
): Promise<DashboardKPIs> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const rangeStart = customRange ? customRange.from : getDateRangeStart(range)
  const rangeEnd   = customRange ? customRange.to   : getRangeEnd(range, rangeStart)
  // For custom ranges, use an equally-long preceding window for growth comparison
  const prevRangeStart = customRange
    ? new Date(rangeStart.getTime() - (rangeEnd.getTime() - rangeStart.getTime()))
    : getPrevRangeStart(range, rangeStart)

  if (!companyId) {
    return {
      newLeadsToday: 0,
      leadsAwaitingResponse: 0,
      quotesOutstanding: 0,
      bookedThisWeek: 0,
      weeklyRevenue: 0,
      avgResponseTime: "-",
      conversionRate: 0,
      repeatCustomerRate: 0,
      weeklyGrowth: 0,
    }
  }

  // Fetch leads only — all KPIs are derived from the leads table
  const { data: leadsData, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("company_id", companyId)

  if (leadsError) {
    console.error("Error fetching leads for KPIs:", leadsError)
  }

  const leads = leadsData || []

  if (!leads.length) {
    return {
      newLeadsToday: 0,
      leadsAwaitingResponse: 0,
      quotesOutstanding: 0,
      bookedThisWeek: 0,
      weeklyRevenue: 0,
      avgResponseTime: "-",
      conversionRate: 0,
      repeatCustomerRate: 0,
      weeklyGrowth: 0,
    }
  }

  // For each lead, the effective date is scheduled_at (user-set job date) if present,
  // otherwise created_at. This matches the pipeline display logic.
  const effectiveDate = (lead: { scheduled_at?: string | null; created_at?: string | null }): Date =>
    lead.scheduled_at ? new Date(lead.scheduled_at) : new Date(lead.created_at || 0)

  // New Leads Today
  const newLeadsToday = leads.filter((lead) => {
    const createdAt = new Date(lead.created_at || 0)
    return createdAt >= todayStart && normalizeStatus(lead.status) === "new"
  }).length

  // Awaiting Response
  const leadsAwaitingResponse = leads.filter((lead) => {
    const s = normalizeStatus(lead.status)
    return s === "new" || s === "contacted"
  }).length

  // Quotes Out
  const quotesOutstanding = leads.filter(
    (lead) => normalizeStatus(lead.status) === "quoted"
  ).length

  // Booked Jobs — scheduled/completed leads whose effective date falls within [rangeStart, rangeEnd)
  // Uses scheduled_at (user-set job date) if present, otherwise created_at.
  const bookedThisWeek = leads.filter((lead) => {
    const s = normalizeStatus(lead.status)
    const d = effectiveDate(lead)
    return (s === "scheduled" || s === "completed") && d >= rangeStart && d < rangeEnd
  }).length

  // Revenue — quote_amount sum for the same set of booked/completed leads in range
  const weeklyRevenue = leads
    .filter((lead) => {
      const s = normalizeStatus(lead.status)
      const d = effectiveDate(lead)
      return (s === "scheduled" || s === "completed") && d >= rangeStart && d < rangeEnd
    })
    .reduce((sum, lead) => sum + (lead.quote_amount || 0), 0)

  // Close Rate — won / (won + lost) for leads resolved in the selected range.
  // "Won" = scheduled/completed, date = effectiveDate (scheduled_at ?? created_at).
  // "Lost" = lost status, date = lost_at ?? created_at (when they were marked lost).
  // Open leads (new/contacted/quoted) are excluded from both numerator and denominator.
  const wonInRange = leads.filter((lead) => {
    const s = normalizeStatus(lead.status)
    const d = effectiveDate(lead)
    return (s === "scheduled" || s === "completed") && d >= rangeStart && d < rangeEnd
  }).length
  const lostInRange = leads.filter((lead) => {
    const s = normalizeStatus(lead.status)
    const d = lead.lost_at ? new Date(lead.lost_at) : new Date(lead.created_at || 0)
    return s === "lost" && d >= rangeStart && d < rangeEnd
  }).length
  const resolvedInRange = wonInRange + lostInRange
  const conversionRate = resolvedInRange > 0
    ? Math.round((wonInRange / resolvedInRange) * 100)
    : 0

  // Growth — current range vs prior same-length period
  const prevRangeRevenue = leads
    .filter((lead) => {
      const s = normalizeStatus(lead.status)
      const d = effectiveDate(lead)
      return (s === "scheduled" || s === "completed") && d >= prevRangeStart && d < rangeStart
    })
    .reduce((sum, lead) => sum + (lead.quote_amount || 0), 0)

  const weeklyGrowth = prevRangeRevenue > 0
    ? Math.round(((weeklyRevenue - prevRangeRevenue) / prevRangeRevenue) * 100)
    : weeklyRevenue > 0 ? 100 : 0

  return {
    newLeadsToday,
    leadsAwaitingResponse,
    quotesOutstanding,
    bookedThisWeek,
    weeklyRevenue,
    avgResponseTime: "< 5 min",
    conversionRate,
    repeatCustomerRate: 0,
    weeklyGrowth,
  }
}

// ----- Urgent Items -----
export interface UrgentItem {
  id: string
  type: "new_lead" | "follow_up_due" | "quote_stale"
  title: string
  subtitle: string
  leadId: string
  priority: "high" | "medium" | "low"
}

export async function getUrgentItems(): Promise<UrgentItem[]> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  const now = new Date()
  
  if (!companyId) {
    return []
  }
  
  // Fetch all leads to calculate urgent items
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })

  if (error || !leads) {
    console.error("Error fetching leads for urgent items:", error)
    return []
  }

  const items: UrgentItem[] = []

  // Filter leads needing action with null-safe access
  const newLeads = leads.filter((l) => (l.status || "new") === "new")
  const overdueFollowUps = leads.filter((l) => {
    if (!l.next_follow_up_at) return false
    return new Date(l.next_follow_up_at) < now
  })
  const quotedLeadsNeedingFollowUp = leads.filter((l) => {
    if ((l.status || "new") !== "quoted") return false
    // Include quoted leads with past follow-up date OR quoted for more than 24 hours
    if (l.next_follow_up_at && new Date(l.next_follow_up_at) < now) return true
    const updatedAt = l.updated_at ? new Date(l.updated_at) : new Date(l.created_at || now)
    return now.getTime() - updatedAt.getTime() > 1000 * 60 * 60 * 24 // 24 hours
  })

  // Add new leads (highest priority)
  newLeads.forEach((lead) => {
    const createdAt = lead.created_at ? new Date(lead.created_at) : now
    const timeLabel = formatElapsed(Math.max(0, now.getTime() - createdAt.getTime()))
    
    items.push({
      id: `urgent_${lead.id}`,
      type: "new_lead",
      title: `New lead - ${timeLabel}`,
      subtitle: `${lead.customer_name || "Unknown"} • ${lead.service_type || "Service"} • $${lead.quote_amount || 0}`,
      leadId: lead.id,
      priority: "high",
    })
  })

  // Add overdue follow-ups (medium priority)
  overdueFollowUps.forEach((lead) => {
    // Skip if already added as new lead
    if ((lead.status || "new") === "new") return
    
    items.push({
      id: `urgent_followup_${lead.id}`,
      type: "follow_up_due",
      title: "Follow-up overdue",
      subtitle: `${lead.customer_name || "Unknown"} • ${lead.service_type || "Service"} • $${lead.quote_amount || 0}`,
      leadId: lead.id,
      priority: "medium",
    })
  })

  // Add quoted leads needing attention (medium priority)
  quotedLeadsNeedingFollowUp.forEach((lead) => {
    // Skip if already added as overdue follow-up
    if (lead.next_follow_up_at && new Date(lead.next_follow_up_at) < now) return
    
    const updatedAt = lead.updated_at ? new Date(lead.updated_at) : new Date(lead.created_at || now)
    const elapsed = Math.max(0, now.getTime() - updatedAt.getTime())

    items.push({
      id: `urgent_quote_${lead.id}`,
      type: "quote_stale",
      title: `Quote sent ${formatElapsed(elapsed)}`,
      subtitle: `${lead.customer_name || "Unknown"} • ${lead.service_type || "Service"} • $${lead.quote_amount || 0}`,
      leadId: lead.id,
      priority: "medium",
    })
  })

  // Sort by priority (high first) then by recency
  return items.sort((a, b) => {
    if (a.priority === "high" && b.priority !== "high") return -1
    if (a.priority !== "high" && b.priority === "high") return 1
    return 0
  })
}

// ----- Status Constants and Helpers -----

// Canonical lead statuses used throughout the app
export const LEAD_STATUSES = ["new", "contacted", "quoted", "scheduled", "completed", "cancelled", "lost"] as const
export type CanonicalLeadStatus = typeof LEAD_STATUSES[number]

// Normalize legacy status values to canonical statuses
// "booked" → "scheduled", "complete" → "completed"
export function normalizeStatus(status: LeadStatusDB | string | null | undefined): CanonicalLeadStatus {
  if (!status) return "new"
  const s = status.toLowerCase()
  if (s === "booked") return "scheduled"
  if (s === "complete") return "completed"
  if (LEAD_STATUSES.includes(s as CanonicalLeadStatus)) return s as CanonicalLeadStatus
  return "new"
}

// Check if a status represents a completed lead (for finance calculations)
export function isCompletedStatus(status: LeadStatusDB | string | null | undefined): boolean {
  const normalized = normalizeStatus(status)
  return normalized === "completed"
}

// Check if a status represents a scheduled/booked lead
export function isScheduledStatus(status: LeadStatusDB | string | null | undefined): boolean {
  const normalized = normalizeStatus(status)
  return normalized === "scheduled"
}

export function getStatusLabel(status: LeadStatusDB | null | undefined): string {
  const normalized = normalizeStatus(status)
  const labels: Record<CanonicalLeadStatus, string> = {
    new: "New",
    contacted: "Contacted",
    quoted: "Quoted",
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    lost: "Lost",
  }
  return labels[normalized] || "New"
}

export function getStatusColor(status: LeadStatusDB | null | undefined): string {
  const normalized = normalizeStatus(status)
  const colors: Record<CanonicalLeadStatus, string> = {
    new: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    contacted: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
    quoted: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400 dark:border-violet-500/30",
    scheduled: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
    completed: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400 dark:border-teal-500/30",
    cancelled: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400 dark:border-slate-500/30",
    lost: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400 dark:border-red-500/30",
  }
  return colors[normalized] || colors.new
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Returns a compact elapsed-time label that never produces values like "162h ago".
// Under 24 hours → hours only; 24+ hours → days + remainder hours.
export function formatElapsed(ms: number): string {
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(ms / 3600000)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(ms / 86400000)
  const remHours = hours - days * 24
  return remHours > 0 ? `${days}d ${remHours}h ago` : `${days}d ago`
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ============================================================================
// FINANCE DATA
// ============================================================================

export interface FinanceTransaction {
  id: string
  date: string              // ISO string
  type: "income" | "expense"
  category: string          // service_type or expense category key
  description: string       // label for display
  client: string            // customer_name or vendor
  amount: number
  status: "collected" | "scheduled" | "pending" | "cleared"
}

export interface FinanceChartBar {
  label: string
  revenue: number
  expenses: number          // 0 until expenses table is added
}

export interface FinanceData {
  totalRevenue: number
  scheduledRevenue: number
  collectedRevenue: number
  avgJobSize: number
  outstandingAmount: number
  outstandingCount: number
  jobCount: number
  totalExpenses: number
  grossProfit: number
  profitMargin: number
  leadsByStatus: Record<CanonicalLeadStatus, number>
  revenueByService: { service: string; revenue: number; jobs: number; avgJob: number }[]
  expensesByCategory: { category: string; label: string; amount: number; count: number }[]
  recentActivity: Activity[]
  periodTransactions: FinanceTransaction[]
  chartData: FinanceChartBar[]
}

interface SupabaseExpense {
  id: string
  company_id: string
  created_by: string
  expense_category_id: string | null
  amount: number | null
  expense_date: string | null  // "YYYY-MM-DD"
  vendor: string | null
  description: string | null
  status: string | null
  payment_method: string | null
  notes: string | null
  receipt_url: string | null
  linked_lead_id: string | null
  created_at: string
  updated_at: string | null
  expense_categories?: { key: string; label: string | null } | null
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]

function buildFinanceChartData(
  leads: SupabaseLead[],
  expenses: SupabaseExpense[],
  range: string,
  start: Date,
  end: Date
): FinanceChartBar[] {
  const edFn = (l: SupabaseLead) =>
    l.scheduled_at ? new Date(l.scheduled_at) : new Date(l.created_at || 0)
  const revenueLeads = leads.filter(
    l => isScheduledStatus(l.status) || isCompletedStatus(l.status)
  )

  // Build time buckets based on range
  const buckets: { label: string; start: Date; end: Date }[] = []

  if (range === "this-week") {
    for (let i = 0; i < 7; i++) {
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
      const e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 1)
      buckets.push({ label: DAY_NAMES[i], start: s, end: e })
    }
  } else if (range === "this-month" || range === "last-30") {
    const cur = new Date(start)
    let wk = 1
    while (cur < end) {
      const s = new Date(cur)
      const e = new Date(cur)
      e.setDate(e.getDate() + 7)
      buckets.push({ label: `Wk ${wk}`, start: s, end: e > end ? new Date(end) : e })
      cur.setDate(cur.getDate() + 7)
      wk++
    }
  } else {
    // Monthly buckets for this-quarter / ytd
    const cur = new Date(start.getFullYear(), start.getMonth(), 1)
    while (cur < end) {
      const s = new Date(cur)
      const e = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
      buckets.push({ label: MONTH_NAMES[cur.getMonth()], start: s, end: e })
      cur.setMonth(cur.getMonth() + 1)
    }
  }

  return buckets.map(bucket => {
    // expense_date is "YYYY-MM-DD" — parse as local date for comparison
    const bucketExpenses = expenses.filter(exp => {
      if (!exp.expense_date) return false
      const [y, m, d] = exp.expense_date.split("-").map(Number)
      const expDate = new Date(y, m - 1, d)
      return expDate >= bucket.start && expDate < bucket.end
    })
    return {
      label: bucket.label,
      revenue: revenueLeads
        .filter(l => { const d = edFn(l); return d >= bucket.start && d < bucket.end })
        .reduce((sum, l) => sum + (l.quote_amount || 0), 0),
      expenses: bucketExpenses.reduce((sum, e) => sum + (e.amount || 0), 0),
    }
  })
}

export async function getFinanceData(range = "this-month"): Promise<FinanceData | null> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  
  if (!companyId) {
    console.error("Error getting finance data: No company_id found")
    return null
  }
  
  // Fetch leads for revenue calculations
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("company_id", companyId)
  
  if (leadsError) {
    console.error("Error fetching leads for finance:", leadsError)
    return null
  }
  
  // Fetch jobs for job-based calculations
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("*")
    .eq("company_id", companyId)
  
  if (jobsError) {
    console.error("Error fetching jobs for finance:", jobsError)
  }
  
  // Date bounds for the selected range
  const { start: rangeStart, end: rangeEnd } = getFinanceDateBounds(range)

  // Format dates as YYYY-MM-DD for expense_date comparison
  const pad = (n: number) => String(n).padStart(2, "0")
  const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const startDateStr = toDateStr(rangeStart)
  const endDateStr = toDateStr(rangeEnd)

  // Fetch expenses for selected date range — no FK join, categories resolved separately
  const { data: expensesRaw, error: expensesError } = await supabase
    .from("expenses")
    .select("*")
    .eq("company_id", companyId)
    .gte("expense_date", startDateStr)
    .lt("expense_date", endDateStr)

  if (expensesError) {
    console.error("Error fetching expenses for finance:", expensesError)
  }

  // Fetch expense categories separately to avoid PostgREST FK join dependency
  const { data: expenseCategoriesRaw } = await supabase
    .from("expense_categories")
    .select("id, key, label")

  const categoryById = new Map(
    (expenseCategoriesRaw || []).map(c => [
      c.id as string,
      { key: c.key as string, label: c.label as string | null },
    ])
  )

  // Fetch recent activity
  const { data: activities, error: activitiesError } = await supabase
    .from("activity_log")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(10)

  if (activitiesError) {
    console.error("Error fetching activities for finance:", activitiesError)
  }

  const allLeads = (leads || []) as SupabaseLead[]
  // Attach category data from the separate lookup so downstream transforms are unchanged
  const rangeExpenses: SupabaseExpense[] = (expensesRaw || []).map(e => ({
    ...e,
    expense_categories: e.expense_category_id
      ? (categoryById.get(e.expense_category_id) ?? null)
      : null,
  }))

  // Effective date for each lead: scheduled_at if set, otherwise created_at
  const edFn = (l: SupabaseLead) =>
    l.scheduled_at ? new Date(l.scheduled_at) : new Date(l.created_at || 0)

  // Leads whose effective date falls within [rangeStart, rangeEnd)
  const rangeLeads = allLeads.filter(l => {
    const d = edFn(l)
    return d >= rangeStart && d < rangeEnd
  })

  // Revenue-bearing leads in range (scheduled + completed)
  const scheduledLeads = rangeLeads.filter(l => isScheduledStatus(l.status))
  const completedLeads = rangeLeads.filter(l => isCompletedStatus(l.status))
  const scheduledRevenue = scheduledLeads.reduce((sum, l) => sum + (l.quote_amount || 0), 0)
  const collectedRevenue = completedLeads.reduce((sum, l) => sum + (l.quote_amount || 0), 0)
  const totalRevenue = scheduledRevenue + collectedRevenue
  const outstandingAmount = scheduledRevenue
  const outstandingCount = scheduledLeads.length
  const jobCount = scheduledLeads.length + completedLeads.length
  const avgJobSize = jobCount > 0 ? Math.round(totalRevenue / jobCount) : 0

  // Real expenses from DB
  const totalExpenses = rangeExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const grossProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0

  // Expenses grouped by category
  const categoryMap = new Map<string, { label: string; amount: number; count: number }>()
  rangeExpenses.forEach(e => {
    const key = e.expense_categories?.key || "uncategorized"
    const label = e.expense_categories?.label || e.expense_categories?.key || "Uncategorized"
    const existing = categoryMap.get(key) || { label, amount: 0, count: 0 }
    categoryMap.set(key, {
      label,
      amount: existing.amount + (e.amount || 0),
      count: existing.count + 1,
    })
  })
  const expensesByCategory = Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.amount - a.amount)

  // Leads by status (all leads, not range-filtered — pipeline overview)
  const leadsByStatus: Record<CanonicalLeadStatus, number> = {
    new: 0, contacted: 0, quoted: 0, scheduled: 0, completed: 0, cancelled: 0, lost: 0,
  }
  allLeads.forEach(l => {
    const status = normalizeStatus(l.status)
    leadsByStatus[status] = (leadsByStatus[status] || 0) + 1
  })

  // Revenue by service type — uses range-filtered revenue leads
  const serviceMap = new Map<string, { revenue: number; jobs: number }>()
  rangeLeads
    .filter(l => (isScheduledStatus(l.status) || isCompletedStatus(l.status)) && l.service_type)
    .forEach(l => {
      const service = l.service_type || "Other"
      const existing = serviceMap.get(service) || { revenue: 0, jobs: 0 }
      serviceMap.set(service, {
        revenue: existing.revenue + (l.quote_amount || 0),
        jobs: existing.jobs + 1,
      })
    })
  const revenueByService = Array.from(serviceMap.entries())
    .map(([service, data]) => ({
      service,
      revenue: data.revenue,
      jobs: data.jobs,
      avgJob: data.jobs > 0 ? Math.round(data.revenue / data.jobs) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  // Income transactions — scheduled + completed leads in range
  const incomeTransactions: FinanceTransaction[] = rangeLeads
    .filter(l => isScheduledStatus(l.status) || isCompletedStatus(l.status))
    .map(l => ({
      id: l.id,
      date: edFn(l).toISOString(),
      type: "income" as const,
      category: l.service_type || "Service",
      description: l.service_type || "Job",
      client: l.customer_name || "Client",
      amount: l.quote_amount || 0,
      status: isCompletedStatus(l.status) ? "collected" as const : "scheduled" as const,
    }))

  // Expense transactions from real DB rows
  const expenseTransactions: FinanceTransaction[] = rangeExpenses.map(e => ({
    id: e.id,
    date: e.expense_date
      ? new Date(e.expense_date + "T00:00:00").toISOString()
      : e.created_at,
    type: "expense" as const,
    category: e.expense_categories?.key || "uncategorized",
    description: e.description || e.expense_categories?.label || "Expense",
    client: e.vendor || "—",
    amount: e.amount || 0,
    status: (e.status as "pending" | "cleared") || "pending",
  }))

  // All transactions sorted newest first
  const periodTransactions: FinanceTransaction[] = [...incomeTransactions, ...expenseTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Chart data bucketed by period
  const chartData = buildFinanceChartData(allLeads, rangeExpenses, range, rangeStart, rangeEnd)

  // Recent activity
  const recentActivity = (activities || []).map((a: SupabaseActivity) => mapSupabaseActivityToActivity(a))

  return {
    totalRevenue,
    scheduledRevenue,
    collectedRevenue,
    avgJobSize,
    outstandingAmount,
    outstandingCount,
    jobCount,
    totalExpenses,
    grossProfit,
    profitMargin,
    leadsByStatus,
    revenueByService,
    expensesByCategory,
    recentActivity,
    periodTransactions,
    chartData,
  }
}

export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("expense_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
  if (error) {
    console.error("Error fetching expense categories:", error)
    return []
  }
  return (data || []) as ExpenseCategory[]
}

export async function createExpense(expense: ExpenseInsert): Promise<boolean> {
  const supabase = createClient()
  const companyId = await getCurrentUserCompanyId()
  if (!companyId) return false
  const { error } = await supabase
    .from("expenses")
    .insert({ ...expense, company_id: companyId })
  if (error) {
    console.error("Error creating expense:", error)
    return false
  }
  return true
}
