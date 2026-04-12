'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  full_name:     z.string().min(2, 'Please enter your name'),
  email:         z.string().email('Enter a valid email address'),
  phone:         z.string().optional(),
  business_type: z.string().optional(),
  company_name:  z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const BUSINESS_TYPES = [
  'Pressure Washing',
  'Landscaping',
  'House Cleaning',
  'Mobile Detailing',
  'Pest Control',
  'Pool Service',
  'Window Cleaning',
  'Junk Removal',
  'HVAC',
  'Painting',
  'Roofing',
  'Lawn Care',
  'General Contracting',
  'Other',
]

const INPUT_CLASS =
  'h-11 text-[13px] rounded-xl border-white/10 bg-white/[0.05] text-white placeholder:text-white/20 focus:bg-white/[0.07] focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15 transition-all'
const LABEL_CLASS = 'text-[12px] font-medium text-white/55'

export function WaitlistForm({ source = 'waitlist-page' }: { source?: string }) {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, source }),
      })

      if (res.status === 409) {
        // Already signed up — redirect with returning flag so success page can acknowledge
        router.push('/waitlist/success?returning=true')
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setServerError(data.error || 'Something went wrong. Please try again.')
        return
      }

      router.push('/waitlist/success')
    } catch {
      setServerError('Network error — please check your connection and try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      {/* Row 1: name + email */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className={LABEL_CLASS}>
            Your name <span className="text-blue-400/80">*</span>
          </Label>
          <Input
            id="full_name"
            placeholder="Jordan Miller"
            autoComplete="name"
            {...register('full_name')}
            className={INPUT_CLASS}
          />
          {errors.full_name && (
            <p className="text-[11px] text-red-400 mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className={LABEL_CLASS}>
            Email address <span className="text-blue-400/80">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
            className={INPUT_CLASS}
          />
          {errors.email && (
            <p className="text-[11px] text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: phone + business type */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="phone" className={LABEL_CLASS}>
            Phone
            <span className="ml-1.5 text-[11px] text-white/25 font-normal">
              optional · recommended for SMS updates
            </span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 000-0000"
            autoComplete="tel"
            {...register('phone')}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="business_type" className={LABEL_CLASS}>
            Industry
          </Label>
          <select
            id="business_type"
            {...register('business_type')}
            className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[13px] text-white/75 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15 focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#0d1831] text-white/50">Select your industry</option>
            {BUSINESS_TYPES.map(t => (
              <option key={t} value={t} className="bg-[#0d1831] text-white">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: business name */}
      <div className="space-y-1.5">
        <Label htmlFor="company_name" className={LABEL_CLASS}>
          Business name
          <span className="ml-1.5 text-[11px] text-white/25 font-normal">optional</span>
        </Label>
        <Input
          id="company_name"
          placeholder="Miller Pressure Washing"
          autoComplete="organization"
          {...register('company_name')}
          className={INPUT_CLASS}
        />
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3">
          <p className="text-[13px] text-red-400">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-[13px] text-[14px] font-semibold text-white shadow-[0_2px_14px_rgba(59,130,246,0.40)] hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_4px_24px_rgba(59,130,246,0.55)] hover:-translate-y-px active:translate-y-0 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isSubmitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Joining the list…</>
        ) : (
          <>Request early access <ArrowRight className="h-4 w-4" /></>
        )}
      </button>

      <p className="text-center text-[11px] text-white/20">
        No spam. No commitment. First access when we launch.
      </p>
    </form>
  )
}
