import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNav } from '@/components/public/public-nav'
import { PublicFooter } from '@/components/public/public-footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — Automax',
  description: 'How Automax collects, uses, and protects your information.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-[17px] font-semibold text-white/90">{title}</h2>
      <div className="space-y-3 text-[14px] leading-relaxed text-white/50">{children}</div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      <PublicNav />

      <main className="mx-auto max-w-3xl px-5 sm:px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-blue-400/70">
            Legal
          </p>
          <h1 className="text-[32px] font-bold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-2 text-[13px] text-white/30">Last updated: April 14, 2026</p>
        </div>

        <Section title="1. Introduction">
          <p>
            Automax (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the
            platform available at autocrm.pro (the &ldquo;Service&rdquo;). This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use
            our Service.
          </p>
          <p>
            By accessing or using the Service you agree to the collection and use of information
            as described in this Policy. If you do not agree, please do not use the Service.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information you provide directly, including:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Account registration data (name, email, company name, password)</li>
            <li>Business profile information</li>
            <li>Lead and customer records you import or create</li>
            <li>Messages and communications sent through the platform</li>
            <li>Payment and billing details (processed by a third-party provider)</li>
          </ul>
          <p>We also collect information automatically, such as:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Log data (IP address, browser type, pages visited, timestamps)</li>
            <li>Device information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </Section>

        <Section title="3. SMS / Text Messaging">
          <p>
            When you or your customers opt in to receive SMS messages through Automax, we collect
            and process mobile phone numbers solely to deliver those messages on your behalf.
          </p>
          <p>
            <strong className="font-semibold text-white/70">Opt-out:</strong> Recipients may
            opt out of SMS communications at any time by replying <strong className="font-semibold text-white/70">STOP</strong> to
            any message. Standard message and data rates may apply. Message frequency varies.
            For help, reply <strong className="font-semibold text-white/70">HELP</strong> or
            contact us at{' '}
            <a
              href="mailto:support@autocrm.pro"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@autocrm.pro
            </a>
            .
          </p>
          <p>
            <strong className="font-semibold text-white/70">No sharing:</strong> We do not sell,
            rent, or share mobile phone numbers or SMS opt-in consent data with third parties for
            their own marketing purposes. Phone numbers collected for SMS are used exclusively to
            deliver the messages you initiate through the Service.
          </p>
          <p>
            SMS messaging is provided through Twilio in compliance with CTIA guidelines and
            carrier requirements, including A2P 10DLC registration where applicable.
          </p>
        </Section>

        <Section title="4. How We Use Your Information">
          <p>We use collected information to:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Provide, operate, and improve the Service</li>
            <li>Send transactional and account-related communications</li>
            <li>Deliver SMS messages on your behalf to your customers</li>
            <li>Process payments and prevent fraud</li>
            <li>Respond to support requests</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="5. How We Share Your Information">
          <p>
            We do not sell your personal information. We may share information with trusted
            third-party service providers who assist us in operating the Service (e.g., cloud
            hosting, payment processing, SMS delivery). These providers are contractually
            obligated to keep your data confidential and use it only as directed by us.
          </p>
          <p>
            We may also disclose information if required by law, court order, or governmental
            authority, or to protect the rights and safety of Automax, our users, or others.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your information for as long as your account is active or as needed to
            provide the Service and comply with legal obligations. You may request deletion of
            your account and associated data by contacting us.
          </p>
        </Section>

        <Section title="7. Security">
          <p>
            We implement industry-standard technical and organizational measures to protect your
            information from unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </Section>

        <Section title="8. Children&rsquo;s Privacy">
          <p>
            The Service is not directed to individuals under the age of 18. We do not knowingly
            collect personal information from children. If you believe we have inadvertently
            collected such information, please contact us and we will promptly delete it.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by posting the new Policy on this page and updating the &ldquo;Last
            updated&rdquo; date. Continued use of the Service after changes constitutes
            acceptance of the updated Policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have questions about this Privacy Policy or our data practices, please
            contact us at{' '}
            <a
              href="mailto:support@autocrm.pro"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@autocrm.pro
            </a>
            .
          </p>
        </Section>

        <div className="mt-12 border-t border-white/[0.06] pt-8 text-[13px] text-white/25">
          <Link href="/legal/terms" className="hover:text-white/50 transition-colors underline underline-offset-2">
            Terms &amp; Conditions
          </Link>
          <span className="mx-3">·</span>
          <Link href="/early-access" className="hover:text-white/50 transition-colors underline underline-offset-2">
            Back to Home
          </Link>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
