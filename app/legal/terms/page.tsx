import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicNav } from '@/components/public/public-nav'
import { PublicFooter } from '@/components/public/public-footer'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Automax',
  description: 'Terms governing your use of the Automax platform.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-[17px] font-semibold text-white/90">{title}</h2>
      <div className="space-y-3 text-[14px] leading-relaxed text-white/50">{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080f1e] text-white">
      <PublicNav />

      <main className="mx-auto max-w-3xl px-5 sm:px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-blue-400/70">
            Legal
          </p>
          <h1 className="text-[32px] font-bold tracking-tight text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-[13px] text-white/30">Last updated: April 14, 2026</p>
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the Automax platform available at autocrm.pro (the
            &ldquo;Service&rdquo;), you agree to be bound by these Terms &amp; Conditions
            (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Service.
          </p>
          <p>
            These Terms apply to all users, including businesses that register for an account
            (&ldquo;Users&rdquo;) and any individuals whose data is processed through the
            Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            Automax provides software tools for service businesses, including lead management,
            automated follow-up, SMS and email communications, quoting, and reputation
            management. Features are subject to change. We reserve the right to modify,
            suspend, or discontinue any aspect of the Service at any time.
          </p>
        </Section>

        <Section title="3. Account Registration">
          <p>
            You must create an account to access the Service. You agree to provide accurate,
            complete, and current information and to keep it updated. You are responsible for
            maintaining the confidentiality of your credentials and for all activity that
            occurs under your account.
          </p>
          <p>
            You must be at least 18 years old and legally authorized to enter into contracts
            on behalf of your business to use the Service.
          </p>
        </Section>

        <Section title="4. SMS and Messaging">
          <p>
            Automax enables you to send SMS messages to your customers and leads. By using
            the messaging features, you agree to:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Obtain proper consent from each recipient before sending them messages, in
              compliance with the Telephone Consumer Protection Act (TCPA), CTIA guidelines,
              and all applicable federal, state, and local laws.
            </li>
            <li>
              Provide recipients a clear and easy way to opt out. Recipients may reply{' '}
              <strong className="font-semibold text-white/70">STOP</strong> at any time to
              unsubscribe from further messages. You must honor all opt-out requests
              immediately.
            </li>
            <li>
              Include accurate sender identification and, where required, disclosure that
              message and data rates may apply. Message frequency varies.
            </li>
            <li>
              Not send messages that are illegal, harassing, deceptive, or in violation of
              carrier guidelines or CTIA standards.
            </li>
            <li>
              Not use the Service to send spam or unsolicited bulk messages.
            </li>
          </ul>
          <p>
            We provide SMS delivery through Twilio and are subject to Twilio&rsquo;s Acceptable
            Use Policy and carrier requirements, including A2P 10DLC registration. We reserve
            the right to suspend your messaging access if your usage violates these requirements
            or applicable law.
          </p>
          <p>
            You are solely responsible for the content of messages sent through your account
            and for ensuring compliance with all applicable messaging laws and regulations.
            Automax is not liable for fines, penalties, or damages arising from your non-compliant
            messaging.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Violate any applicable law or regulation</li>
            <li>Infringe the intellectual property rights of others</li>
            <li>Transmit harmful, threatening, or abusive content</li>
            <li>Attempt to gain unauthorized access to any part of the Service or its systems</li>
            <li>Reverse-engineer, decompile, or copy any portion of the Service</li>
            <li>Use the Service for competitive intelligence or to build a competing product</li>
          </ul>
        </Section>

        <Section title="6. Fees and Payment">
          <p>
            Certain features of the Service may require payment of fees. All fees are stated
            in U.S. dollars and are non-refundable unless otherwise specified. We reserve the
            right to change pricing with reasonable advance notice. Continued use of the Service
            after a price change constitutes acceptance of the new fees.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            The Service, including all software, designs, text, and graphics, is owned by
            Automax and protected by applicable intellectual property laws. You retain ownership
            of the data you upload or create through the Service. By using the Service, you
            grant us a limited license to process your data solely to operate and improve the
            Service.
          </p>
        </Section>

        <Section title="8. Privacy">
          <p>
            Your use of the Service is also governed by our{' '}
            <Link
              href="/legal/privacy"
              className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO
            NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
            COMPONENTS.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUTOMAX AND ITS OFFICERS, DIRECTORS,
            EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE
            SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY
            TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS SHALL NOT EXCEED THE GREATER OF (A)
            THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM OR (B) $100.
          </p>
        </Section>

        <Section title="11. Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless Automax and its affiliates from
            any claims, damages, losses, or expenses (including reasonable attorneys&rsquo;
            fees) arising out of your use of the Service, your violation of these Terms, or
            your violation of any third-party rights, including any claims arising from your
            SMS messaging practices.
          </p>
        </Section>

        <Section title="12. Termination">
          <p>
            We may suspend or terminate your access to the Service at any time for any reason,
            including violation of these Terms. You may terminate your account by contacting us.
            Upon termination, your right to use the Service ceases immediately.
          </p>
        </Section>

        <Section title="13. Governing Law">
          <p>
            These Terms are governed by the laws of the United States and the State of
            Delaware, without regard to conflict of law principles. Any disputes arising under
            these Terms shall be resolved in the courts located in Delaware.
          </p>
        </Section>

        <Section title="14. Changes to These Terms">
          <p>
            We may revise these Terms from time to time. We will provide notice of material
            changes by posting the updated Terms on this page with a revised &ldquo;Last
            updated&rdquo; date. Your continued use of the Service after changes are posted
            constitutes acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="15. Contact">
          <p>
            Questions about these Terms? Contact us at{' '}
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
          <Link href="/legal/privacy" className="hover:text-white/50 transition-colors underline underline-offset-2">
            Privacy Policy
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
