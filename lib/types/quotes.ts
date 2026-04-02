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
  payment_status: PaymentStatus
  payment_request_status?: PaymentRequestStatus | null
  approved_at?: string | null
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
