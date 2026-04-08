// lib/quotes.ts
//
// Server-side service layer for the Quotes feature.
// All functions accept a Supabase client (server or service-role) and operate
// within the scope of a single company_id — never cross-tenant.
//
// Used only in API route handlers (server-side). Never import in client components.

import type { Quote, QuoteRow, QuoteItemRow } from './types/quotes'
import { sendSMS } from './sms'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any

// ── Auth helper ───────────────────────────────────────────────────────────────

export async function getCompanyId(supabase: SupabaseClient): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('user_id', user.id)
    .single()
  return data?.company_id ?? null
}

// ── Row → Quote shape (joins DB row + items array) ────────────────────────────

function rowToQuote(row: QuoteRow, items: QuoteItemRow[]): Quote {
  return {
    id: row.id,
    company_id: row.company_id,
    lead_id: row.lead_id,
    quote_number: row.quote_number,
    title: row.title,
    status: row.status,
    customer_name: row.customer_name,
    customer_email: row.customer_email ?? '',
    customer_phone: row.customer_phone ?? '',
    property_address: row.property_address ?? '',
    salesperson_name: row.salesperson_name ?? '',
    subtotal: row.subtotal,
    discount_type: row.discount_type,
    discount_value: row.discount_value,
    tax_amount: row.tax_amount,
    total: row.total,
    terms: row.terms ?? '',
    notes: row.notes ?? '',
    deposit_required: row.deposit_required,
    deposit_type: row.deposit_type,
    deposit_amount: row.deposit_amount,
    payment_status: row.payment_status,
    expires_at: row.expires_at,
    approved_at: row.approved_at,
    accepted_at: row.accepted_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items: [...items]
      .sort((a, b) => a.position - b.position)
      .map(i => ({
        id: i.id,
        name: i.name,
        description: i.description ?? '',
        quantity: i.quantity,
        unit_price: i.unit_price,
        line_total: i.line_total,
        position: i.position,
      })),
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
  return data ?? []
}

export async function getQuoteWithItems(
  supabase: SupabaseClient,
  id: string,
  companyId: string,
): Promise<Quote | null> {
  const [{ data: quote, error: qErr }, { data: items }] = await Promise.all([
    supabase.from('quotes').select('*').eq('id', id).eq('company_id', companyId).single(),
    supabase.from('quote_items').select('*').eq('quote_id', id).order('position'),
  ])
  if (qErr || !quote) return null
  return rowToQuote(quote, items ?? [])
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
  payload: Omit<Quote, 'id' | 'created_at' | 'updated_at' | 'quote_number'>,
  companyId: string,
): Promise<QuoteRow> {
  const { items, ...quoteData } = payload
  const [quoteNumber, publicToken] = [
    await generateQuoteNumber(supabase, companyId),
    crypto.randomUUID(),
  ]
  const now = new Date().toISOString()

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({
      ...quoteData,
      company_id: companyId,
      quote_number: quoteNumber,
      public_token: publicToken,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single()

  if (error) throw error

  if (items.length > 0) {
    const { error: itemErr } = await supabase.from('quote_items').insert(
      items.map((item, i) => ({
        quote_id: quote.id,
        company_id: companyId,
        name: item.name,
        description: item.description || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        position: i,
      }))
    )
    if (itemErr) throw itemErr
  }

  return quote
}

export async function updateQuote(
  supabase: SupabaseClient,
  id: string,
  payload: Partial<Quote>,
  companyId: string,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { items, id: _id, created_at: _c, ...quoteData } = payload

  const { error } = await supabase
    .from('quotes')
    .update({ ...quoteData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('company_id', companyId)

  if (error) throw error

  if (items !== undefined) {
    await supabase.from('quote_items').delete().eq('quote_id', id)
    if (items.length > 0) {
      const { error: itemErr } = await supabase.from('quote_items').insert(
        items.map((item, i) => ({
          quote_id: id,
          company_id: companyId,
          name: item.name,
          description: item.description || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
          position: i,
        }))
      )
      if (itemErr) throw itemErr
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
    .select('customer_name, customer_phone, customer_email')
    .eq('id', quoteId)
    .eq('company_id', companyId)
    .single()

  if (qErr || !quote) throw new Error('Quote not found')

  const recipient: string | null =
    channel === 'sms' ? quote.customer_phone : quote.customer_email
  if (!recipient) {
    throw new Error(
      channel === 'sms'
        ? 'No phone number on this quote'
        : 'No email address on this quote'
    )
  }

  const firstName = (quote.customer_name ?? '').split(' ')[0] || 'there'
  let providerSid: string
  let mock: boolean

  if (channel === 'sms') {
    const result = await sendSMS(supabase, {
      to: recipient,
      body: `Hi ${firstName}! Your quote is ready. Reply here with any questions or to get scheduled.`,
      businessId: companyId,
    })
    providerSid = result.sid
    mock = result.mock
  } else {
    // Email: mock until email provider is wired
    console.log(`[Email mock] to=${recipient} quoteId=${quoteId}`)
    providerSid = `mock_email_${Date.now()}`
    mock = true
  }

  // Record delivery
  await supabase.from('quote_deliveries').insert({
    quote_id: quoteId,
    company_id: companyId,
    channel,
    recipient,
    status: 'sent',
    provider_sid: providerSid,
    mock,
  })

  // Update quote status to sent
  await supabase
    .from('quotes')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', quoteId)
    .eq('company_id', companyId)

  return { mock, channel, recipient }
}
