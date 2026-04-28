import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <Link className="legal-back" href="/">
        Back to Mihira
      </Link>
      <article className="legal-card">
        <p className="eyebrow">Privacy Policy</p>
        <h1>How Mihira handles your data</h1>
        <p className="legal-updated">Last updated: April 28, 2026</p>

        <section>
          <h2>Overview</h2>
          <p>
            Mihira is a spiritual guidance and Vedic lifestyle app. We use account data, birth details,
            preferences, questions, astrology calculations, scripture-grounded guidance, sacred timing tools,
            analytics, and subscription services to deliver the product.
          </p>
          <p>
            We do not sell personal information. Birth details, spiritual preferences, and user-submitted
            questions are treated as sensitive product data and are used to provide and improve Mihira.
          </p>
        </section>

        <section>
          <h2>Information we collect</h2>
          <p>
            Mihira may collect information you provide directly, including your name, email address, sign-in
            profile, birth date, birth time, birth place, language, region, guide, focus area, prompts, questions,
            chat messages, reflections, feedback, support requests, and subscription status.
          </p>
          <p>
            We may also collect device type, operating system, app version, technical identifiers, usage events,
            feature interactions, screen views, diagnostics, crash data, and performance data where enabled.
          </p>
        </section>

        <section>
          <h2>How we use information</h2>
          <p>
            We use information to create and authenticate accounts, provide daily alignment, sacred timing,
            scripture guidance, onboarding, profile, and subscription features, personalize the app, generate
            AI-assisted responses, save preferences and history, respond to support requests, improve reliability,
            understand aggregate usage, prevent abuse, and comply with legal obligations.
          </p>
        </section>

        <section>
          <h2>Service providers</h2>
          <p>
            Mihira may use service providers such as Clerk for authentication, Supabase for database and account
            data, RevenueCat, Apple App Store, and Google Play for subscriptions, PostHog or similar tools for
            analytics, Perplexity or other AI providers for response generation, and hosting, monitoring,
            communications, and support providers.
          </p>
        </section>

        <section>
          <h2>AI and guidance</h2>
          <p>
            User prompts, relevant profile context, and app-generated context may be processed by Mihira systems
            and AI providers to generate spiritual guidance, interpretations, timing suggestions, and chat
            responses. Mihira is for spiritual, reflective, informational, and lifestyle use. It is not a
            substitute for medical, legal, financial, mental health, emergency, or professional services.
          </p>
        </section>

        <section>
          <h2>Sharing</h2>
          <p>
            We may share information with providers that help operate authentication, hosting, databases,
            analytics, billing, AI processing, support, security, and monitoring. We may also disclose information
            when required by law, to protect rights or safety, to investigate misuse, in connection with a business
            transaction, or with your consent.
          </p>
        </section>

        <section>
          <h2>Subscriptions and payments</h2>
          <p>
            If you purchase a subscription, Apple App Store, Google Play, RevenueCat, or another billing provider
            may process the purchase. Mihira may receive subscription status, entitlement state, renewal state,
            cancellation state, product identifiers, and limited transaction metadata. Mihira does not directly
            collect or store full payment card numbers for app-store purchases.
          </p>
        </section>

        <section>
          <h2>Data retention</h2>
          <p>
            We retain information for as long as reasonably necessary to provide the service, maintain account
            functionality, preserve preferences and product state, manage subscriptions, comply with legal
            obligations, resolve disputes, prevent fraud or abuse, and enforce agreements.
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            Depending on location, you may have rights to access, correct, delete, object to, restrict, withdraw
            consent for, or request a portable copy of certain personal information. We may need to verify a
            request before acting on it.
          </p>
        </section>

        <section>
          <h2>Account deletion</h2>
          <p>
            You may request account deletion through the app where available or by contacting support. We will make
            commercially reasonable efforts to delete or de-identify account-linked personal data, subject to legal,
            tax, accounting, payment, security, fraud-prevention, backup, logging, and technical requirements.
          </p>
        </section>

        <section>
          <h2>Security and children</h2>
          <p>
            Mihira uses reasonable safeguards designed to protect personal information, but no digital service is
            perfectly secure. Mihira is not intended for children under 13, or a higher minimum age where required
            by local law.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. If material changes are made, we will post the
            updated version with a new effective date.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For privacy requests, email{' '}
            <a href="mailto:privacy@getmihira.com">privacy@getmihira.com</a>. For support, email{' '}
            <a href="mailto:help@getmihira.com">help@getmihira.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
