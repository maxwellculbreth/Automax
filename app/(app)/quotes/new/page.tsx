import { QuoteForm } from '@/components/quotes/quote-form'

interface Props {
  searchParams: {
    lead_id?: string
    customer_name?: string
    customer_phone?: string
    customer_email?: string
    property_address?: string
  }
}

export default function NewQuotePage({ searchParams }: Props) {
  const hasParams = Object.values(searchParams).some(Boolean)

  const initialData = hasParams
    ? {
        lead_id: searchParams.lead_id ?? undefined,
        customer_name: searchParams.customer_name ?? '',
        customer_phone: searchParams.customer_phone ?? '',
        customer_email: searchParams.customer_email ?? '',
        property_address: searchParams.property_address ?? '',
      }
    : undefined

  return <QuoteForm mode="create" initialData={initialData} />
}
