import { LegalLayout, LegalLink, LegalSection } from '@/components/legal-layout';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <LegalLayout eyebrow="Privacy Policy" title="How Mihira handles your data" updated="July 10, 2026">
      <LegalSection number="01" heading="Overview">
        <p>
          Mihira is a scripture-grounded Vedic guidance and sacred-timing app. It includes Daily Alignment
          readings, Ask Mihira (guidance conversations with AI guide personas such as Krishna, Shiva, Ganesha,
          and Lakshmi), Sacred Timing (Muhurat Finder), Gurukul lessons, and Sacred Day content. We use account
          data, birth details, preferences, questions, astrology calculations, scripture-grounded guidance,
          sacred timing tools, analytics, and subscription services to deliver the product.
        </p>
        <p>
          We do not sell personal information. Birth details, spiritual preferences, and user-submitted
          questions are treated as sensitive product data and are used to provide and improve Mihira.
        </p>
      </LegalSection>

      <LegalSection number="02" heading="Information we collect">
        <p>
          Mihira may collect information you provide directly, including your name, email address, sign-in
          profile, birth date, birth time, birth place, language, region, selected guide persona, focus area,
          prompts, questions, chat messages, Gurukul lesson progress, reflections, feedback, support requests,
          and subscription status.
        </p>
        <p>
          We may also collect device type, operating system, app version, technical identifiers, usage events,
          feature interactions, screen views, diagnostics, crash data, and performance data where enabled.
        </p>
        <p>
          If you join the pre-launch waitlist on getmihira.com, we collect your email address, name (if
          provided), platform preference (iPhone, Android, or both), anything you tell us about your intent,
          the page that referred you, and basic browser information.
        </p>
      </LegalSection>

      <LegalSection number="03" heading="How we use information">
        <p>
          We use information to create and authenticate accounts, provide Daily Alignment, Sacred Timing, Ask
          Mihira, Gurukul, onboarding, profile, and subscription features, personalize guidance using your birth
          details and preferences, generate AI-assisted responses, save preferences and history, send waitlist
          and launch-invite communications, respond to support requests, improve reliability, understand
          aggregate usage, prevent abuse, and comply with legal obligations.
        </p>
      </LegalSection>

      <LegalSection number="04" heading="Service providers">
        <p>
          Mihira uses Supabase for authentication, database, and account storage, RevenueCat together with the
          Apple App Store and Google Play for subscription billing and entitlement management, PostHog for
          product analytics, Google Gemini for AI-generated responses, and hosting, monitoring, communications,
          and support providers.
        </p>
      </LegalSection>

      <LegalSection number="05" heading="AI and guidance">
        <p>
          User prompts, relevant profile context, and app-generated context may be processed by Mihira systems
          and AI providers such as Google Gemini to generate spiritual guidance, interpretations, timing
          suggestions, and chat responses. Guide personas such as Krishna, Shiva, Ganesha, and Lakshmi are
          AI-generated, scripture-informed creative interpretations — they are not literal religious channeling
          and are not affiliated with any temple, clergy, or institution.
        </p>
        <p>
          Mihira is for spiritual, reflective, informational, and lifestyle use. It is not a substitute for
          medical, legal, financial, mental health, emergency, or professional services.
        </p>
      </LegalSection>

      <LegalSection number="06" heading="Sharing">
        <p>
          We may share information with providers that help operate authentication, hosting, databases,
          analytics, billing, AI processing, waitlist communications, support, security, and monitoring. We may
          also disclose information when required by law, to protect rights or safety, to investigate misuse, in
          connection with a business transaction, or with your consent.
        </p>
      </LegalSection>

      <LegalSection number="07" heading="Subscriptions and payments">
        <p>
          Mihira Plus is a paid subscription that removes the monthly limits on free-tier features such as Ask
          Mihira sessions and Sacred Timing readings. If you purchase a subscription, Apple App Store, Google
          Play, or RevenueCat processes the purchase. Mihira may receive subscription status, entitlement state,
          renewal state, cancellation state, product identifiers, and limited transaction metadata. Mihira does
          not directly collect or store full payment card numbers for app-store purchases.
        </p>
      </LegalSection>

      <LegalSection number="08" heading="Waitlist and pre-launch signups">
        <p>
          Before Mihira is generally available, you may join a waitlist on our website. We use the information
          you submit to notify you when access opens, understand demand, and prioritize invitations, which are
          issued in small batches. Waitlist data is stored in our database and may be forwarded to an
          email or communications tool we use to manage invitations.
        </p>
      </LegalSection>

      <LegalSection number="09" heading="Data retention">
        <p>
          We retain information for as long as reasonably necessary to provide the service, maintain account
          functionality, preserve preferences and product state, manage subscriptions and waitlist invitations,
          comply with legal obligations, resolve disputes, prevent fraud or abuse, and enforce agreements.
        </p>
      </LegalSection>

      <LegalSection number="10" heading="Your choices">
        <p>
          Depending on location, you may have rights to access, correct, delete, object to, restrict, withdraw
          consent for, or request a portable copy of certain personal information. We may need to verify a
          request before acting on it.
        </p>
      </LegalSection>

      <LegalSection number="11" heading="Account deletion">
        <p>
          You may request account deletion through the app where available or by contacting support. We will make
          commercially reasonable efforts to delete or de-identify account-linked personal data, subject to legal,
          tax, accounting, payment, security, fraud-prevention, backup, logging, and technical requirements.
        </p>
      </LegalSection>

      <LegalSection number="12" heading="Security and children">
        <p>
          Mihira uses reasonable safeguards designed to protect personal information, but no digital service is
          perfectly secure. Mihira is not intended for children under 13, or a higher minimum age where required
          by local law.
        </p>
      </LegalSection>

      <LegalSection number="13" heading="Changes">
        <p>
          We may update this Privacy Policy from time to time. If material changes are made, we will post the
          updated version with a new effective date.
        </p>
      </LegalSection>

      <LegalSection number="14" heading="Contact">
        <p>
          For privacy requests, email <LegalLink href="mailto:privacy@getmihira.com">privacy@getmihira.com</LegalLink>.
          For support, email <LegalLink href="mailto:help@getmihira.com">help@getmihira.com</LegalLink>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
