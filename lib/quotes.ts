// lib/quotes.ts
//
// Server-side service layer for the Quotes feature.
// Maps between frontend field names and real Supabase column names.
//
// Real DB column names (quotes table):
//   quote_title, salesperson, email, phone, expiration_date, tax,
//   internal_notes, deposit_required, deposit_amount
//
// Real DB column names (quote_items table):
//   sort_order (not position)
//
// Real DB column names (quote_deliveries table):
//   delivery_method, delivery_status, external_message_id

import type { Quote, QuoteRow, QuoteStatus, DiscountType } from './types/quotes'
import { sendSMS } from './sms'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any

// ── Auth helper ───────────────────────────────────────────────────────────────

export async function getCompanyId(supabase: SupabaseClient): Promise<string | null> {
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    console.error('[getCompanyId] auth.getUser failed:', authErr)
    return null
  }
  console.log('[getCompanyId] user.id =', user.id)

  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('user_id', user.id)
    .single()

  if (profileErr || !profile) {
    console.error('[getCompanyId] profile lookup failed:', profileErr, 'user_id =', user.id)
    return null
  }
  console.log('[getCompanyId] company_id =', profile.company_id)
  return profile.company_id ?? null
}

// ── DB row → QuoteRow (for list page) ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbRowToQuoteRow(row: any): QuoteRow {
  return {
    id: row.id,
    company_id: row.company_id,
    lead_id: row.lead_id ?? null,
    quote_number: row.quote_number,
    title: row.quote_title ?? '',          // DB: quote_title
    status: row.status,
    customer_name: row.customer_name ?? '',
    customer_email: row.email ?? null,     // DB: email
    customer_phone: row.phone ?? null,     // DB: phone
    property_address: row.property_address ?? null,
    salesperson_name: row.salesperson ?? null,  // DB: salesperson
    subtotal: Number(row.subtotal) || 0,
    discount_type: row.discount_type ?? null,
    discount_value: Number(row.discount_value) || 0,
    tax_amount: Number(row.tax) || 0,      // DB: tax
    total: Number(row.total) || 0,
    terms: row.terms ?? null,
    notes: row.internal_notes ?? null,     // DB: internal_notes
    deposit_required: row.deposit_required ?? false,
    deposit_amount: Number(row.deposit_amount) || 0,
    expires_at: row.expiration_date ?? null,  // DB: expiration_date
    sent_at: row.sent_at ?? null,
    accepted_at: row.accepted_at ?? null,
    public_token: row.public_token ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

// ── DB row + items → Quote (for edit/preview) ─────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbRowToQuote(row: any, items: any[]): Quote {
  return {
    id: row.id,
    company_id: row.company_id,
    lead_id: row.lead_id ?? null,
    quote_number: row.quote_number,
    title: row.quote_title ?? '',          // DB: quote_title
    status: row.status,
    customer_name: row.customer_name ?? '',
    customer_email: row.email ?? '',       // DB: email
    customer_phone: row.phone ?? '',       // DB: phone
    property_address: row.property_address ?? '',
    salesperson_name: row.salesperson ?? '',  // DB: salesperson
    subtotal: Number(row.subtotal) || 0,
    discount_type: (row.discount_type as DiscountType) ?? null,
    discount_value: Number(row.discount_value) || 0,
    tax_amount: Number(row.tax) || 0,      // DB: tax
    total: Number(row.total) || 0,
    terms: row.terms ?? '',
    notes: row.internal_notes ?? '',       // DB: internal_notes
    deposit_required: row.deposit_required ?? false,
    deposit_type: null,                    // not in DB
    deposit_amount: Number(row.deposit_amount) || 0,
    payment_status: 'none',
    expires_at: row.expiration_date ?? null,  // DB: expiration_date
    accepted_at: row.accepted_at ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items: [...items]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((i, idx) => ({
        id: i.id,
        name: i.name ?? '',
        description: i.description ?? '',
        quantity: Number(i.quantity) || 1,
        unit_price: Number(i.unit_price) || 0,
        line_total: Number(i.line_total) || 0,
        position: i.sort_order ?? idx,    // DB: sort_order → position
      })),
  }
}

// ── Frontend payload → DB insert shape ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDbQuotePayload(payload: Partial<Quote>, companyId: string, extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    company_id: companyId,
    quote_title: payload.title || 'Untitled Quote',        // frontend title → quote_title
    status: payload.status || 'draft',
    customer_name: payload.customer_name || '',
    email: payload.customer_email || null,                  // customer_email → email
    phone: payload.customer_phone || null,                  // customer_phone → phone
    property_address: payload.property_address || null,
    salesperson: payload.salesperson_name || null,          // salesperson_name → salesperson
    expiration_date: payload.expires_at || null,            // expires_at → expiration_date
    subtotal: Number(payload.subtotal) || 0,
    discount_type: payload.discount_type || null,
    discount_value: Number(payload.discount_value) || 0,
    tax: Number(payload.tax_amount) || 0,                   // tax_amount → tax
    total: Number(payload.total) || 0,
    terms: payload.terms || null,
    internal_notes: payload.notes || null,                  // notes → internal_notes
    deposit_required: payload.deposit_required ?? false,
    deposit_amount: Number(payload.deposit_amount) || 0,
    // deposit_type omitted — not a DB column
    // payment_status omitted — not a DB column
    ...extra,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDbItemPayload(item: any, quoteId: string, companyId: string, index: number): Record<string, unknown> {
  return {
    quote_id: quoteId,
    company_id: companyId,
    name: item.name ?? '',
    description: item.description || null,
    quantity: Number(item.quantity) || 1,
    unit_price: Number(item.unit_price) || 0,
    line_total: Number(item.line_total) || 0,
    sort_order: index,   // position → sort_order
  }
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function listQuotes(
  supabase: SupabaseClient,
  companyId: string,
): Promise<QuoteRow[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(dbRowToQuoteRow)
}

export async function getQuoteWithItems(
  supabase: SupabaseClient,
  id: string,
  companyId: string,
): Promise<Quote | null> {
  const [{ data: quote, error: qErr }, { data: items }] = await Promise.all([
    supabase.from('quotes').select('*').eq('id', id).eq('company_id', companyId).single(),
    supabase.from('quote_items').select('*').eq('quote_id', id).order('sort_order'),
  ])
  if (qErr || !quote) return null
  return dbRowToQuote(quote, items ?? [])
}

// ── Mutations ─────────────────────────────────────────────────────────────────

async function generateQuoteNumber(
  supabase: SupabaseClient,
  companyId: string,
): Promise<string> {
  const { count } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
  const year = new Date().getFullYear()
  return `Q-${year}-${String((count ?? 0) + 1).padStart(3, '0')}`
}

export async function createQuote(
  supabase: SupabaseClient,
  payload: Partial<Quote>,
  companyId: string,
): Promise<{ id: string; quote_number: string }> {
  const quoteNumber = await generateQuoteNumber(supabase, companyId)

  const dbPayload = toDbQuotePayload(payload, companyId, { quote_number: quoteNumber })

  console.log('[createQuote] insert payload:', JSON.stringify(dbPayload, null, 2))

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert(dbPayload)
    .select('id, quote_number')
    .single()

  if (error) {
    console.error('[createQuote] Supabase error:', JSON.stringify(error))
    throw error
  }

  const items: unknown[] = Array.isArray(payload.items) ? payload.items : []
  if (items.length > 0) {
    const itemPayloads = items.map((item, i) => toDbItemPayload(item, quote.id, companyId, i))
    console.log('[createQuote] item payloads:', JSON.stringify(itemPayloads, null, 2))
    const { error: itemErr } = await supabase.from('quote_items').insert(itemPayloads)
    if (itemErr) {
      console.error('[createQuote] quote_items error:', JSON.stringify(itemErr))
      throw itemErr
    }
  }

  return quote
}

export async function updateQuote(
  supabase: SupabaseClient,
  id: string,
  payload: Partial<Quote>,
  companyId: string,
): Promise<void> {
  const dbPayload = toDbQuotePayload(payload, companyId)

  console.log('[updateQuote] update payload:', JSON.stringify(dbPayload, null, 2))

  const { error } = await supabase
    .from('quotes')
    .update(dbPayload)
    .eq('id', id)
    .eq('company_id', companyId)

  if (error) {
    console.error('[updateQuote] Supabase error:', JSON.stringify(error))
    throw error
  }

  if (Array.isArray(payload.items)) {
    await supabase.from('quote_items').delete().eq('quote_id', id)
    if (payload.items.length > 0) {
      const itemPayloads = payload.items.map((item, i) => toDbItemPayload(item, id, companyId, i))
      const { error: itemErr } = await supabase.from('quote_items').insert(itemPayloads)
      if (itemErr) {
        console.error('[updateQuote] quote_items error:', JSON.stringify(itemErr))
        throw itemErr
      }
    }
  }
}

// ── Send ──────────────────────────────────────────────────────────────────────

export async function sendQuoteToCustomer(
  supabase: SupabaseClient,
  quoteId: string,
  channel: 'sms' | 'email',
  companyId: string,
): Promise<{ mock: boolean; channel: string; recipient: string }> {
  const { data: quote, error: qErr } = await supabase
    .from('quotes')
    .select('customer_name, phone, email')   // DB column names
    .eq('id', quoteId)
    .eq('company_id', companyId)
    .single()

  if (qErr || !quote) throw new Error('Quote not found')

  const recipient: string | null = channel === 'sms' ? quote.phone : quote.email
  if (!recipient) {
    throw new Error(
      channel === 'sms' ? 'No phone number on this quote' : 'No email address on this quote'
    )
  }

  const firstName = (quote.customer_name ?? '').split(' ')[0] || 'there'
  let externalMessageId: string
  let mock: boolean

  if (channel === 'sms') {
    const result = await sendSMS(supabase, {
      to: recipient,
      body: `Hi ${firstName}! Your quote is ready. Reply here with any questions or to get scheduled.`,
      businessId: companyId,
    })
    externalMessageId = result.sid
    mock = result.mock
  } else {
    console.log(`[Email mock] to=${recipient} quoteId=${quoteId}`)
    externalMessageId = `mock_email_${Date.now()}`
    mock = true
  }

  // Record delivery using real DB column names
  await supabase.from('quote_deliveries').insert({
    quote_id: quoteId,
    company_id: companyId,
    delivery_method: channel,                   // channel → delivery_method
    recipient,
    delivery_status: 'sent',                    // status → delivery_status
    external_message_id: externalMessageId,     // provider_sid → external_message_id
  })

  // Update quote status
  await supabase
    .from('quotes')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', quoteId)
    .eq('company_id', companyId)

  return { mock, channel, recipient }
}
