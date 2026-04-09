export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'expired' | 'converted'
export type DiscountType = 'fixed' | 'percent'
export type DepositType = 'fixed' | 'percent'
export type PaymentStatus = 'none' | 'pending' | 'partial' | 'paid'
export type PaymentRequestStatus = 'not_sent' | 'sent' | 'completed' | 'failed'

export interface QuoteItem {
  id: string
  name: string
  description: string
  quantity: number
  unit_price: number
  line_total: number
  position: number
}

// Frontend-facing Quote shape (used by forms and preview)
export interface Quote {
  id: string
  company_id?: string
  lead_id?: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  property_address: string
  quote_number: string
  title: string
  status: QuoteStatus
  salesperson_name: string
  created_at: string
  updated_at: string
  expires_at?: string | null
  subtotal: number
  discount_type?: DiscountType | null
  discount_value: number
  tax_amount: number
  total: number
  terms: string
  notes: string
  deposit_required: boolean
  deposit_type?: DepositType | null
  deposit_amount: number
  payment_status?: PaymentStatus
  payment_request_status?: PaymentRequestStatus | null
  accepted_at?: string | null
  payment_link?: string | null
  external_payment_reference?: string | null
  items: QuoteItem[]
}

export interface QuoteTemplate {
  id: string
  name: string
  description: string
  items: Omit<QuoteItem, 'id'>[]
}

// QuoteRow — what the list page uses (mapped from real DB columns)
export interface QuoteRow {
  id: string
  company_id: string
  lead_id: string | null
  quote_number: string
  title: string           // mapped from DB quote_title
  status: QuoteStatus
  customer_name: string
  customer_email: string | null  // mapped from DB email
  customer_phone: string | null  // mapped from DB phone
  property_address: string | null
  salesperson_name: string | null  // mapped from DB salesperson
  subtotal: number
  discount_type: DiscountType | null
  discount_value: number
  tax_amount: number      // mapped from DB tax
  total: number
  terms: string | null
  notes: string | null    // mapped from DB internal_notes
  deposit_required: boolean
  deposit_amount: number
  expires_at: string | null  // mapped from DB expiration_date
  sent_at: string | null
  accepted_at: string | null
  public_token: string | null
  created_at: string
  updated_at: string
}
