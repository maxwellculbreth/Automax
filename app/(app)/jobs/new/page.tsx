import { JobForm } from '@/components/jobs/job-form'

interface Props {
  searchParams: {
    lead_id?: string
    quote_id?: string
    customer_name?: string
    customer_phone?: string
    customer_email?: string
    service_type?: string
    address?: string
    price?: string
  }
}

export default function NewJobPage({ searchParams }: Props) {
  return (
    <JobForm
      initialData={{
        lead_id: searchParams.lead_id,
        quote_id: searchParams.quote_id,
        customer_name: searchParams.customer_name,
        customer_phone: searchParams.customer_phone,
        customer_email: searchParams.customer_email,
        service_type: searchParams.service_type,
        address: searchParams.address,
        price: searchParams.price ? Number(searchParams.price) : undefined,
      }}
    />
  )
}
