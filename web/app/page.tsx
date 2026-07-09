import type { Metadata } from 'next';
import { FAQList } from '@/components/faq-list';
import { WaitlistInlineForm } from '@/components/waitlist-inline-form';
import { MarkGlyph, MihiraText, SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

const configuredAppStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
const configuredGooglePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL;
const waitlistHref = '#waitlist';
const hasAppStoreUrl = Boolean(configuredAppStoreUrl);
const hasGooglePlayUrl = Boolean(configuredGooglePlayUrl);
const appStoreUrl = configuredAppStoreUrl || waitlistHref;
const googlePlayUrl = configuredGooglePlayUrl || waitlistHref;
const siteUrl = 'https://getmihira.com';
const pageTitle = 'Mihira — Scripture-Grounded Vedic Guidance and Sacred Timing App';
const pageDescription =
  'Mihira brings the full breadth of Vedic wisdom to the real decisions of life: duty, relationships, ambition, and grief. Scripture-grounded answers, auspicious timing, and a daily practice — private, practical, and free to start.';

const shellClass = 'mx-auto w-full max-w-[1160px] px-6 lg:px-12';
const bandClass = 'py-[72px] md:py-[104px]';
const kickerClass = 'font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8A33D]';
const headingClass =
  '[font-family:var(--font-display)] text-[clamp(2.2rem,4.4vw,2.75rem)] font-medium leading-[1.12] text-[#F7F1E3] text-balance';
const bodyMutedClass = 'text-[15px] leading-[1.7] text-[#F2EAD9]/60';

const structuredDataDescription = pageDescription;

const practiceCards = [
  {
    kicker: 'Ask Mihira',
    title: 'Bring a life question',
    body: 'Duty, grief, ambition, relationships. Get scripture-backed guidance with sources cited and one clear practice for today.',
    img: '/product-screenshots/scripture-guidance.png',
    alt: 'Mihira scripture guidance screen preview',
  },
  {
    kicker: 'Daily Alignment',
    title: 'Start the day with direction',
    body: 'A personalized morning reading that helps you decide where to place your energy before the day decides for you.',
    img: '/product-screenshots/daily-alignment.png',
    alt: 'Mihira daily alignment screen preview',
  },
  {
    kicker: 'Sacred Timing',
    title: 'Choose better windows',
    body: 'Describe what you’re planning and scan a date range for the most supportive muhurat windows — with the reasoning shown.',
    img: '/product-screenshots/sacred-timing.png',
    alt: 'Mihira sacred timing screen preview',
  },
];

const pillars = [
  {
    num: 'I',
    title: 'Grounded in more than the Gita',
    body: 'Upanishads, Puranas, the epics, Vedic teaching, and the saints’ commentary — the full canon, with citations you can check.',
  },
  {
    num: 'II',
    title: 'Practical, not mystical',
    body: 'No vague cosmic reassurance. Every answer ends in something usable: a clearer judgment, a better window, a next step.',
  },
  {
    num: 'III',
    title: 'Built for life far from home',
    body: 'For the diaspora navigating ambition and grief without family, temples, or elders nearby. Continuity without an astrologer on call.',
  },
  {
    num: 'IV',
    title: 'Private and judgment-free',
    body: 'Your questions, birth details, and preferences are treated as sensitive data. No community feed, no selling data, no judgment.',
  },
];

const quotes = [
  {
    text: 'I asked about leaving a job my parents were proud of. It didn’t tell me what to do — it gave me a steadier way to decide.',
    name: 'Ananya R.',
    role: 'Product manager, Toronto',
  },
  {
    text: 'The daily reading takes two minutes and replaces thirty minutes of doomscrolling. That trade alone is worth it.',
    name: 'Vikram S.',
    role: 'Physician, Bay Area',
  },
  {
    text: 'After my father passed, I had questions I couldn’t bring to anyone. Mihira met them with the texts, gently.',
    name: 'Priya K.',
    role: 'Founder, London',
  },
];

const planRows = [
  { feature: 'Ask Mihira — scripture-grounded guidance', free: 'A few questions / week', plus: 'Unlimited' },
  { feature: 'Daily Alignment reading', free: 'Included', plus: 'Included' },
  { feature: 'Sacred Timing (Muhurat Finder)', free: 'Limited scans', plus: 'Unlimited scans' },
  { feature: 'Gurukul — guided learning & practice', free: 'Previews', plus: 'Full library' },
  { feature: 'Personalization from your birth details', free: 'Basic', plus: 'Deep' },
];

const faqs = [
  {
    question: 'Is this just another astrology app?',
    answer:
      'No. Mihira is built around scripture-grounded guidance, sacred timing, and a quieter decision-making practice, not a stream of generic horoscope content.',
  },
  {
    question: 'How do you handle my private data?',
    answer:
      'Mihira stores only what is needed to operate the product, sync your account, generate guidance, and manage subscriptions. We do not sell personal data.',
  },
  {
    question: 'Do I need prior knowledge of Vedic texts or astrology?',
    answer:
      'No. Mihira translates the depth of the source traditions into clear modern language while preserving seriousness and nuance.',
  },
  {
    question: 'Can I use this for work, family, and major life decisions?',
    answer:
      'Yes. Mihira is designed for real decisions and emotionally charged moments, but it is meant to sharpen your judgment rather than act as a substitute for it.',
  },
  {
    question: 'What happens after I join the waitlist?',
    answer:
      'We invite people in small batches as the iPhone and Android builds open. You will get an email when your invite is ready.',
  },
];

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    'Mihira',
    'spiritual guidance app',
    'scripture guidance',
    'sacred timing',
    'Vedic lifestyle app',
    'daily alignment',
    'muhurat app',
    'decision guidance',
  ],
  alternates: {
    canonical: '/',
  },
  applicationName: 'Mihira',
  category: 'Lifestyle',
  creator: 'Mihira',
  publisher: 'Mihira',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: '/',
    siteName: 'Mihira',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Mihira scripture-grounded guidance and sacred timing app',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: pageTitle,
    description: pageDescription,
    images: ['/opengraph-image'],
  },
  appleWebApp: {
    title: 'Mihira',
    capable: true,
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  appLinks: {
    web: {
      url: siteUrl,
      should_fallback: true,
    },
  },
};

function structuredData() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Mihira',
      url: siteUrl,
      email: 'founders@getmihira.com',
      sameAs: [siteUrl],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Mihira',
      url: siteUrl,
      description: structuredDataDescription,
      inLanguage: 'en-US',
      publisher: {
        '@type': 'Organization',
        name: 'Mihira',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Mihira',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'iOS, Android',
      url: siteUrl,
      description: structuredDataDescription,
      offers: {
        '@type': 'Offer',
        availability: hasAppStoreUrl || hasGooglePlayUrl ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];
}

function renderMihiraText(text: string) {
  const parts = text.split('Mihira');

  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <MihiraText /> : null}
    </span>
  ));
}

async function getWaitlistCount() {
  const client = getSupabaseAdminClient();
  if (!client) return null;

  const { count, error } = await client
    .from('waitlist_signups')
    .select('*', { count: 'exact', head: true });

  if (error || count === null) return null;

  return count;
}

export default async function HomePage() {
  const waitlistCount = await getWaitlistCount();
  const waitlistCountLabel = waitlistCount !== null ? waitlistCount.toLocaleString('en-US') : null;
  const heroWaitlistCopy = waitlistCountLabel ? `${waitlistCountLabel} on the waitlist` : 'Growing waitlist';
  const finalCtaWaitlistCopy = waitlistCountLabel
    ? `${waitlistCountLabel} are already waiting.`
    : 'People are already on the list.';

  return (
    <main className="bg-[#0F0C08] text-[#F2EAD9]">
      {structuredData().map((schema) => (
        // eslint-disable-next-line react/no-danger -- static server-generated JSON-LD, not user input
        <script key={schema['@type']} type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(schema)}
        </script>
      ))}

      <SiteNav />

      {/* Hero */}
      <header className="relative overflow-hidden px-6 pb-16 pt-16 md:px-12 md:pb-24 md:pt-[88px]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(120,72,20,0.35),transparent_70%),radial-gradient(ellipse_50%_60%_at_20%_80%,rgba(70,42,14,0.3),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-[1160px] grid-cols-[1.15fr_0.85fr] items-center gap-12 lg:gap-[72px] max-lg:grid-cols-1">
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#E8A33D]" />
              <span className={kickerClass}>Scripture-grounded · Private · Practical</span>
            </div>

            <div className="flex flex-col gap-6">
              <h1 className="max-w-[15ch] text-balance [font-family:var(--font-display)] text-[clamp(2.6rem,5.6vw,4rem)] font-medium leading-[1.08] tracking-tight text-[#F7F1E3]">
                Guidance for the decisions{' '}
                <em className="not-italic text-[#E8A33D] italic">you don’t want answered lightly.</em>
              </h1>
              <p className="max-w-[520px] text-lg leading-[1.65] text-[#F2EAD9]/75">
                Scripture-grounded answers, auspicious timing, and a daily practice — a private{' '}
                <MihiraText /> companion for duty, relationships, ambition, and grief. Not astrology
                entertainment.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <WaitlistInlineForm source="landing_page_hero" />
              <div className="flex flex-wrap items-center gap-4 font-sans text-[13px] text-[#F2EAD9]/55">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8A33D]" />
                  {heroWaitlistCopy}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8A33D]" />
                  Free to start
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E8A33D]" />
                  Coming to iPhone &amp; Android
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div
              className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(232,163,61,0.14),transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative w-[300px] rotate-[1.5deg] overflow-hidden rounded-[44px] border border-[#E8A33D]/30 shadow-[0_40px_90px_rgba(0,0,0,0.6),0_0_0_8px_rgba(20,15,9,0.9)]">
              <img
                alt="Mihira Daily Alignment screen"
                className="block h-auto w-full"
                src="/product-screenshots/daily-alignment.png"
              />
            </div>
          </div>
        </div>
      </header>

      {/* The practice */}
      <section id="practice" className={`${bandClass} scroll-mt-28 border-t border-[#E8A33D]/10`}>
        <div className={`${shellClass} flex flex-col gap-16`}>
          <div className="flex flex-wrap items-end justify-between gap-10">
            <div className="flex max-w-[560px] flex-col gap-4">
              <span className={kickerClass}>The practice</span>
              <h2 className={headingClass}>One private rhythm: ask, align, and time what matters.</h2>
            </div>
            <p className={`${bodyMutedClass} max-w-[340px]`}>
              Not a horoscope feed. Not one-shot Q&amp;A. A daily practice built around three moments.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-7 max-lg:grid-cols-1">
            {practiceCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col overflow-hidden rounded-3xl border border-[#E8A33D]/[0.14] bg-[linear-gradient(180deg,rgba(38,28,16,0.6),rgba(24,18,11,0.6))]"
              >
                <div className="flex flex-col gap-2 px-[26px] pb-5 pt-[22px]">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8A33D]">
                    {card.kicker}
                  </span>
                  <h3 className="[font-family:var(--font-display)] text-[26px] font-semibold text-[#F7F1E3]">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-[1.65] text-[#F2EAD9]/65">{card.body}</p>
                </div>
                <div className="mt-auto px-[26px]">
                  <div className="overflow-hidden rounded-t-[22px] border border-b-0 border-[#E8A33D]/20 shadow-[0_-12px_40px_rgba(0,0,0,0.35)]">
                    <img alt={card.alt} src={card.img} className="-mb-[38%] block w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mihira */}
      <section
        id="why"
        className={`${bandClass} scroll-mt-28 border-t border-[#E8A33D]/10 bg-[linear-gradient(180deg,#14100A,#0F0C08)]`}
      >
        <div className={`${shellClass} grid grid-cols-[0.9fr_1.1fr] items-start gap-20 max-lg:grid-cols-1`}>
          <div className="sticky top-24 flex flex-col gap-4.5 max-lg:static">
            <span className={kickerClass}>Why Mihira</span>
            <h2 className={headingClass}>Not another &quot;Ask Krishna&quot; chatbot.</h2>
            <p className={bodyMutedClass}>
              Gita-only apps give you a verse and leave. <MihiraText /> is built as an ongoing practice, with
              the depth and privacy that real questions deserve.
            </p>
          </div>
          <div className="flex flex-col">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="grid grid-cols-[56px_1fr] items-start gap-6 border-b border-[#E8A33D]/[0.12] py-[30px]"
              >
                <span className="[font-family:var(--font-display)] text-3xl font-medium leading-none text-[#E8A33D]">
                  {pillar.num}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[19px] font-bold text-[#F7F1E3]">{pillar.title}</h3>
                  <p className="text-[15px] leading-[1.7] text-[#F2EAD9]/60">{pillar.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${bandClass} border-t border-[#E8A33D]/10`}>
        <div className={`${shellClass} flex flex-col gap-14`}>
          <div className="flex flex-col items-center gap-3.5 text-center">
            <span className={kickerClass}>From the private beta</span>
            <h2 className={`${headingClass} max-w-[640px]`}>
              What early users bring to <MihiraText /> — and what they take away.
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-7 max-lg:grid-cols-1">
            {quotes.map((quote) => (
              <figure
                key={quote.name}
                className="flex flex-col gap-5 rounded-3xl border border-[#E8A33D]/[0.14] bg-[#261C10]/40 px-[30px] py-8"
              >
                <span className="[font-family:var(--font-display)] text-4xl leading-[0.6] text-[#E8A33D]">&ldquo;</span>
                <blockquote className="[font-family:var(--font-display)] text-[21px] italic leading-[1.45] text-[#F2EAD9]">
                  {quote.text}
                </blockquote>
                <figcaption className="mt-auto flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-[#F7F1E3]">{quote.name}</span>
                  <span className="text-[13px] text-[#F2EAD9]/50">{quote.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section
        id="plans"
        className={`${bandClass} scroll-mt-28 border-t border-[#E8A33D]/10 bg-[linear-gradient(180deg,#14100A,#0F0C08)]`}
      >
        <div className={`${shellClass.replace('max-w-[1160px]', 'max-w-[880px]')} flex flex-col gap-14`}>
          <div className="flex flex-col items-center gap-3.5 text-center">
            <span className={kickerClass}>Plans</span>
            <h2 className={headingClass}>Start free. Deepen when you’re ready.</h2>
            <p className="text-[15px] text-[#F2EAD9]/60">
              Pricing announced at launch. Waitlist members get early-bird terms.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#E8A33D]/[0.16]">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-[#E8A33D]/[0.16] bg-[#261C10]/55">
              <div className="px-[30px] py-[22px] font-sans text-[13px] font-bold uppercase tracking-[0.14em] text-[#F2EAD9]/50">
                What you get
              </div>
              <div className="px-5 py-[22px] text-center [font-family:var(--font-display)] text-2xl font-semibold text-[#F2EAD9]">
                Free
              </div>
              <div className="bg-[#E8A33D]/[0.07] px-5 py-[22px] text-center [font-family:var(--font-display)] text-2xl font-semibold text-[#E8A33D]">
                Plus
              </div>
            </div>
            {planRows.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-b border-[#E8A33D]/[0.09] last:border-b-0"
              >
                <div className="px-[30px] py-5 text-[15px] font-semibold text-[#F2EAD9]">{row.feature}</div>
                <div className="px-5 py-5 text-center text-sm text-[#F2EAD9]/60">{row.free}</div>
                <div className="bg-[#E8A33D]/[0.07] px-5 py-5 text-center text-sm font-semibold text-[#F0B454]">
                  {row.plus}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${bandClass} border-t border-[#E8A33D]/10`}>
        <div className="mx-auto w-full max-w-[920px] px-6 lg:px-10">
          <div className="mb-14 text-center">
            <span className={kickerClass}>Questions</span>
            <h2 className={`${headingClass} mt-4`}>
              Questions people ask before they trust <MihiraText />.
            </h2>
          </div>

          <FAQList
            faqs={faqs.map((faq) => ({
              ...faq,
              questionContent: renderMihiraText(faq.question),
              answer: renderMihiraText(faq.answer),
            }))}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section
        id="waitlist"
        className="relative scroll-mt-28 overflow-hidden border-t border-[#E8A33D]/10 px-6 py-[100px] md:px-12 md:py-[120px]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_65%_at_50%_100%,rgba(120,72,20,0.4),transparent_75%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-[640px] flex-col items-center gap-7 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E8A33D]">
            <MarkGlyph size={26} />
          </span>
          <h2 className={`${headingClass} text-[clamp(2.4rem,5vw,3.25rem)]`}>
            Join <MihiraText /> before the public release.
          </h2>
          <p className="max-w-[460px] text-base leading-[1.7] text-[#F2EAD9]/65">
            Early access opens in small batches for iPhone and Android. {finalCtaWaitlistCopy}
          </p>

          <WaitlistInlineForm source="landing_page_footer" align="center" />

          <div className="flex gap-3">
            <a
              className="flex items-center gap-2 rounded-full border border-[#F2EAD9]/20 px-[18px] py-2 font-sans text-[13px] font-semibold text-[#F2EAD9]/70 transition hover:text-[#E8A33D]"
              href={hasAppStoreUrl ? appStoreUrl : waitlistHref}
            >
              App Store — {hasAppStoreUrl ? 'download' : 'coming soon'}
            </a>
            <a
              className="flex items-center gap-2 rounded-full border border-[#F2EAD9]/20 px-[18px] py-2 font-sans text-[13px] font-semibold text-[#F2EAD9]/70 transition hover:text-[#E8A33D]"
              href={hasGooglePlayUrl ? googlePlayUrl : waitlistHref}
            >
              ▶ Google Play — {hasGooglePlayUrl ? 'download' : 'coming soon'}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </main>
  );
}
