import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions',
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
        <p className="legal-updated">Last updated: April 28, 2026</p>

        <section>
          <h2>Acceptance</h2>
          <p>
            These Terms govern access to and use of Mihira, including the Mihira mobile app, website, support
            channels, subscriptions, and related services. By creating an account, accessing Mihira, or using the
            service, you agree to these Terms. If you do not agree, do not use Mihira.
          </p>
        </section>

        <section>
          <h2>Eligibility</h2>
          <p>
            You must be legally able to enter into a binding agreement under applicable law. Mihira is not intended
            for children under 13, or a higher minimum age where required by local law. You are responsible for
            making sure your use of Mihira is allowed where you live.
          </p>
        </section>

        <section>
          <h2>Nature of the service</h2>
          <p>
            Mihira provides spiritual guidance, Vedic lifestyle features, scripture-grounded reflections, sacred
            timing tools, daily alignment content, profile features, and related product experiences. Mihira is for
            reflective, informational, spiritual, and lifestyle use.
          </p>
          <p>
            Mihira does not provide medical advice, legal advice, financial advice, mental health treatment,
            emergency services, or professional counseling. Seek qualified professionals for those matters and call
            local emergency services or crisis resources for urgent situations.
          </p>
        </section>

        <section>
          <h2>Accounts</h2>
          <p>
            You are responsible for providing accurate account information, maintaining the security of your sign-in
            method and devices, all activity under your account, and promptly notifying Mihira of unauthorized
            access or suspected misuse. Mihira may suspend, restrict, or terminate accounts that violate these
            Terms or create legal, security, platform, business, or operational risk.
          </p>
        </section>

        <section>
          <h2>User content</h2>
          <p>
            You may submit prompts, questions, profile data, birth details, preferences, reflections, chat
            messages, feedback, and other content. You retain rights you have in your content, but grant Mihira a
            limited, worldwide, non-exclusive license to host, store, process, reproduce, display, transmit, and use
            that content as needed to operate, secure, provide, personalize, support, and improve the service.
          </p>
          <p>
            Do not submit content that is unlawful, fraudulent, deceptive, abusive, infringing, invasive of privacy,
            harmful to the service, harassing, exploitative, or highly sensitive information you are not comfortable
            storing in a digital service.
          </p>
        </section>

        <section>
          <h2>AI and generated content</h2>
          <p>
            Mihira uses AI-assisted systems to generate guidance, interpretations, timing suggestions, and chat
            responses. Generated content may be incomplete, inaccurate, outdated, inappropriate, or unsuitable for
            important decisions. You are responsible for how you interpret and act on generated content.
          </p>
          <p>
            Mihira may restrict, refuse, or redirect prompts and outputs involving self-harm, abuse, medical, legal,
            financial, emergency, or other high-risk topics.
          </p>
        </section>

        <section>
          <h2>Subscriptions and billing</h2>
          <p>
            Some features may require a paid subscription or purchase. Prices, billing intervals, trial terms,
            renewal terms, and included features will be shown before purchase. Subscriptions may automatically
            renew unless canceled before the renewal date. Refunds, cancellations, chargebacks, and billing disputes
            are governed by the applicable billing platform and applicable law.
          </p>
          <p>
            Purchases made through Apple App Store or Google Play are also subject to Apple or Google billing terms.
            You can manage app-store subscriptions through the relevant app-store account settings.
          </p>
        </section>

        <section>
          <h2>Acceptable use</h2>
          <p>
            You may not violate laws or third-party rights, disrupt or bypass the service or security controls,
            scrape or automate the service at scale without permission, reverse engineer protected systems except
            where legally permitted, impersonate others, use Mihira for spam or fraud, generate harmful or illegal
            content, or commercially exploit Mihira without written permission.
          </p>
        </section>

        <section>
          <h2>Intellectual property</h2>
          <p>
            Mihira and its software, design, branding, product experience, text, graphics, interfaces, features, and
            related materials are owned by Mihira or its licensors and protected by applicable law. These Terms do
            not give you ownership of Mihira, its software, its branding, or its content.
          </p>
        </section>

        <section>
          <h2>Third-party services</h2>
          <p>
            Mihira may rely on third-party services for authentication, hosting, analytics, database storage,
            subscriptions, payments, AI processing, support, and infrastructure. Third-party services may have their
            own terms and privacy practices, and Mihira is not responsible for services it does not control.
          </p>
        </section>

        <section>
          <h2>Changes and termination</h2>
          <p>
            Mihira may update, modify, suspend, restrict, or discontinue any part of the service at any time. Mihira
            may suspend or terminate access if you violate these Terms, create risk, appear to engage in fraudulent
            or abusive activity, or if the service is changed, discontinued, or restricted.
          </p>
        </section>

        <section>
          <h2>Disclaimers</h2>
          <p>
            Mihira is provided on an "as is" and "as available" basis to the fullest extent permitted by law. We do
            not guarantee uninterrupted availability, error-free operation, perfect accuracy of astrology
            calculations, sacred timing, generated guidance, or suitability for any particular purpose.
          </p>
        </section>

        <section>
          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Mihira and its affiliates, owners, employees, contractors,
            service providers, and licensors will not be liable for indirect, incidental, special, consequential,
            exemplary, or punitive damages, or for loss of profits, revenue, data, goodwill, business opportunity,
            or other intangible losses arising from or related to use of the service.
          </p>
        </section>

        <section>
          <h2>Consumer rights</h2>
          <p>
            These Terms apply to the fullest extent permitted by law. Nothing in these Terms limits mandatory rights
            you may have under consumer protection, privacy, app-store, or other applicable laws. If any part of
            these Terms is found unenforceable, the remaining parts will remain in effect.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For legal notices or questions, email <a href="mailto:legal@getmihira.com">legal@getmihira.com</a>.
            For support, email <a href="mailto:help@getmihira.com">help@getmihira.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
