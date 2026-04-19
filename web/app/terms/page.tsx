import Link from 'next/link';

export const metadata = {
  title: 'Terms',
};

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <Link className="legal-back" href="/">
        Back to Mihira
      </Link>
      <article className="legal-card">
        <p className="eyebrow">Terms and Conditions</p>
        <h1>Rules for using Mihira</h1>
        <p className="legal-updated">Last updated: April 20, 2026</p>

        <section>
          <h2>Acceptance</h2>
          <p>
            By using Mihira, you agree to these terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2>Nature of the service</h2>
          <p>
            Mihira provides reflective, scripture-grounded guidance and timing suggestions for personal use. It is
            not a substitute for medical, legal, financial, or mental health advice from qualified professionals.
          </p>
        </section>

        <section>
          <h2>Accounts and subscriptions</h2>
          <p>
            Some features require an account or paid subscription. You are responsible for maintaining access to
            your account credentials and for charges incurred through your subscription.
          </p>
        </section>

        <section>
          <h2>Acceptable use</h2>
          <p>
            You may not use Mihira to violate the law, abuse the service, interfere with other users, reverse
            engineer protected systems, or exploit the product for spam, fraud, or harmful automation.
          </p>
        </section>

        <section>
          <h2>Content and availability</h2>
          <p>
            We may change, suspend, or discontinue parts of Mihira at any time. We do not guarantee uninterrupted
            availability or error-free outputs.
          </p>
        </section>

        <section>
          <h2>Disclaimer</h2>
          <p>
            Mihira is provided on an “as is” and “as available” basis to the maximum extent permitted by law.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For legal questions, email <a href="mailto:legal@getmihira.com">legal@getmihira.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
