import Link from 'next/link';

export const metadata = {
  title: 'Privacy',
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
        <p className="legal-updated">Last updated: April 20, 2026</p>

        <section>
          <h2>Overview</h2>
          <p>
            Mihira collects only the information required to deliver the product, operate billing, improve the
            service, and support users. We do not sell personal data.
          </p>
        </section>

        <section>
          <h2>Information we collect</h2>
          <p>
            This may include account information, profile details you choose to save, questions you submit for
            guidance, sacred timing requests, usage events, subscription status, and technical diagnostics.
          </p>
        </section>

        <section>
          <h2>How we use information</h2>
          <p>
            We use your data to authenticate you, sync your account across devices, generate guidance and timing
            responses, manage subscriptions, prevent abuse, and improve product quality.
          </p>
        </section>

        <section>
          <h2>Third-party services</h2>
          <p>
            Mihira may use service providers such as Clerk for authentication, Supabase for data storage,
            RevenueCat for subscription management, analytics providers, and AI inference providers for response
            generation.
          </p>
        </section>

        <section>
          <h2>Data retention</h2>
          <p>
            We retain data for as long as needed to operate the service, comply with legal obligations, resolve
            disputes, and enforce agreements. You can request account deletion by contacting us.
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            You may request access, correction, or deletion of your data, subject to legal and operational
            constraints. You may also stop using the service at any time.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For privacy requests, email{' '}
            <a href="mailto:privacy@getmihira.com">privacy@getmihira.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
