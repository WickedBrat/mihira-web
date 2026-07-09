import { LegalLayout, LegalLink, LegalSection } from '@/components/legal-layout';

export const metadata = {
  title: 'Terms and Conditions',
};

export default function TermsPage() {
  return (
    <LegalLayout eyebrow="Terms and Conditions" title="Rules for using Mihira" updated="July 10, 2026">
      <LegalSection number="01" heading="Acceptance">
        <p>
          These Terms govern access to and use of Mihira, including the Mihira mobile app, website, support
          channels, subscriptions, and related services. By creating an account, joining the waitlist, accessing
          Mihira, or using the service, you agree to these Terms. If you do not agree, do not use Mihira.
        </p>
      </LegalSection>

      <LegalSection number="02" heading="Eligibility">
        <p>
          You must be legally able to enter into a binding agreement under applicable law. Mihira is not intended
          for children under 13, or a higher minimum age where required by local law. You are responsible for
          making sure your use of Mihira is allowed where you live.
        </p>
      </LegalSection>

      <LegalSection number="03" heading="Waitlist and early access">
        <p>
          Mihira may operate an invite-only waitlist before the app is generally available. Joining the waitlist
          does not guarantee access, a specific timeline, particular pricing, or particular features. Invitations
          may be issued in batches at Mihira&apos;s discretion, and Mihira may change or discontinue the waitlist
          at any time.
        </p>
      </LegalSection>

      <LegalSection number="04" heading="Nature of the service">
        <p>
          Mihira provides scripture-grounded spiritual guidance through Ask Mihira (conversations with AI guide
          personas such as Krishna, Shiva, Ganesha, and Lakshmi), Daily Alignment readings, Sacred Timing
          (Muhurat Finder), Gurukul lessons, Sacred Day content, and related Vedic-lifestyle features. Mihira is
          for reflective, informational, spiritual, and lifestyle use.
        </p>
        <p>
          Mihira does not provide medical advice, legal advice, financial advice, mental health treatment,
          emergency services, or professional counseling. Seek qualified professionals for those matters and call
          local emergency services or crisis resources for urgent situations.
        </p>
      </LegalSection>

      <LegalSection number="05" heading="Accounts">
        <p>
          You are responsible for providing accurate account information, maintaining the security of your sign-in
          method and devices, all activity under your account, and promptly notifying Mihira of unauthorized
          access or suspected misuse. Mihira may suspend, restrict, or terminate accounts that violate these
          Terms or create legal, security, platform, business, or operational risk.
        </p>
      </LegalSection>

      <LegalSection number="06" heading="User content">
        <p>
          You may submit prompts, questions, profile data, birth details, guide selections, preferences,
          reflections, chat messages, feedback, and other content. You retain rights you have in your content,
          but grant Mihira a limited, worldwide, non-exclusive license to host, store, process, reproduce,
          display, transmit, and use that content as needed to operate, secure, provide, personalize, support,
          and improve the service.
        </p>
        <p>
          Do not submit content that is unlawful, fraudulent, deceptive, abusive, infringing, invasive of privacy,
          harmful to the service, harassing, exploitative, or highly sensitive information you are not comfortable
          storing in a digital service.
        </p>
      </LegalSection>

      <LegalSection number="07" heading="AI and generated content">
        <p>
          Mihira uses AI-assisted systems to generate guidance, interpretations, timing suggestions, and chat
          responses. Guide personas such as Krishna, Shiva, Ganesha, and Lakshmi are AI-generated creative
          interpretations of scripture and tradition — they are not literal religious channeling, ordained
          clergy, or a verified theological authority, and are not affiliated with any temple or institution.
        </p>
        <p>
          Generated content may be incomplete, inaccurate, outdated, inappropriate, or unsuitable for important
          decisions. You are responsible for how you interpret and act on generated content. Mihira may restrict,
          refuse, or redirect prompts and outputs involving self-harm, abuse, medical, legal, financial,
          emergency, or other high-risk topics.
        </p>
      </LegalSection>

      <LegalSection number="08" heading="Subscriptions and billing">
        <p>
          Mihira Plus is a paid subscription that unlocks unlimited use of features that are otherwise limited on
          the free tier, such as Ask Mihira sessions and Sacred Timing readings, along with other benefits shown
          in the app. Prices, billing intervals, trial terms, renewal terms, and included features will be shown
          before purchase. Subscriptions may automatically renew unless canceled before the renewal date.
          Refunds, cancellations, chargebacks, and billing disputes are governed by the applicable billing
          platform and applicable law.
        </p>
        <p>
          Purchases are processed through the Apple App Store or Google Play, using RevenueCat to manage
          entitlements, and are also subject to Apple or Google billing terms. You can manage app-store
          subscriptions through the relevant app-store account settings.
        </p>
      </LegalSection>

      <LegalSection number="09" heading="Acceptable use">
        <p>
          You may not violate laws or third-party rights, disrupt or bypass the service or security controls,
          scrape or automate the service at scale without permission, reverse engineer protected systems except
          where legally permitted, impersonate others, use Mihira for spam or fraud, generate harmful or illegal
          content, or commercially exploit Mihira without written permission.
        </p>
      </LegalSection>

      <LegalSection number="10" heading="Intellectual property">
        <p>
          Mihira and its software, design, branding, product experience, guide-persona content, text, graphics,
          interfaces, features, and related materials are owned by Mihira or its licensors and protected by
          applicable law. These Terms do not give you ownership of Mihira, its software, its branding, or its
          content.
        </p>
      </LegalSection>

      <LegalSection number="11" heading="Third-party services">
        <p>
          Mihira relies on third-party services including Supabase for authentication and data storage,
          RevenueCat, Apple App Store, and Google Play for subscriptions and payments, Google Gemini for
          AI-generated responses, PostHog for analytics, and other hosting, support, and infrastructure
          providers. Third-party services may have their own terms and privacy practices, and Mihira is not
          responsible for services it does not control.
        </p>
      </LegalSection>

      <LegalSection number="12" heading="Changes and termination">
        <p>
          Mihira may update, modify, suspend, restrict, or discontinue any part of the service at any time. Mihira
          may suspend or terminate access if you violate these Terms, create risk, appear to engage in fraudulent
          or abusive activity, or if the service is changed, discontinued, or restricted.
        </p>
      </LegalSection>

      <LegalSection number="13" heading="Disclaimers">
        <p>
          Mihira is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the fullest extent
          permitted by law. We do not guarantee uninterrupted availability, error-free operation, perfect
          accuracy of astrology calculations, sacred timing, AI-generated guide-persona responses, or suitability
          for any particular purpose.
        </p>
      </LegalSection>

      <LegalSection number="14" heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Mihira and its affiliates, owners, employees, contractors,
          service providers, and licensors will not be liable for indirect, incidental, special, consequential,
          exemplary, or punitive damages, or for loss of profits, revenue, data, goodwill, business opportunity,
          or other intangible losses arising from or related to use of the service.
        </p>
      </LegalSection>

      <LegalSection number="15" heading="Consumer rights">
        <p>
          These Terms apply to the fullest extent permitted by law. Nothing in these Terms limits mandatory rights
          you may have under consumer protection, privacy, app-store, or other applicable laws. If any part of
          these Terms is found unenforceable, the remaining parts will remain in effect.
        </p>
      </LegalSection>

      <LegalSection number="16" heading="Contact">
        <p>
          For legal notices or questions, email <LegalLink href="mailto:legal@getmihira.com">legal@getmihira.com</LegalLink>.
          For support, email <LegalLink href="mailto:help@getmihira.com">help@getmihira.com</LegalLink>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
