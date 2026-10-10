import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FAQList } from '@/components/faq-list';
import { WaitlistInlineForm } from '@/components/waitlist-inline-form';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { DIWALI_CITIES, DIWALI_DATE_LABEL, lakshmiPujaFor } from '@/lib/diwali';

const configuredAppStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
const configuredGooglePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL;
const waitlistHref = '#waitlist';
const hasAppStoreUrl = Boolean(configuredAppStoreUrl);
const hasGooglePlayUrl = Boolean(configuredGooglePlayUrl);
const appStoreUrl = configuredAppStoreUrl || waitlistHref;
const googlePlayUrl = configuredGooglePlayUrl || waitlistHref;
const siteUrl = 'https://www.getmihira.com';
const pageTitle = 'Mihira — Scripture-Grounded Vedic Guidance and Sacred Timing App';
const pageDescription =
  'Mihira brings the full breadth of Vedic wisdom to the real decisions of life: duty, relationships, ambition, and grief. Scripture-grounded answers, auspicious timing, and a daily practice — private, practical, and free to start.';

const shellClass = 'mx-auto w-full max-w-[1160px] px-6 lg:px-12';
const sectionClass = 'border-t border-[#F2EAD9]/[0.08] py-20 md:py-28';
const headingClass =
  'font-serif text-[clamp(2rem,3.6vw,2.75rem)] leading-[1.15] text-[#F7F1E3] text-balance';
const bodyMutedClass = 'text-[17px] leading-[1.65] text-[#F2EAD9]/65';
const primaryButtonClass =
  'inline-flex items-center rounded-md bg-[#E8A33D] px-6 py-3.5 text-[16px] font-semibold text-[#1A130A] transition-colors hover:bg-[#F0B454] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A33D]';

const structuredDataDescription = pageDescription;

// Spread east to west so the drift in the window is visible at a glance.
const timingCitySlugs = ['edison-nj', 'chicago-il', 'dallas-tx', 'denver-co', 'seattle-wa', 'san-jose-ca'];

const features = [
  {
    title: 'Sacred Timing',
    body: 'Tell it what you’re planning, a griha pravesh, a naming, a purchase, and it scans a date range for the best muhurat at your address, with the reasoning shown.',
    img: '/product-screenshots/sacred-timing.png',
    alt: 'Mihira Sacred Timing screen listing muhurat windows',
    href: '/muhurat-finder',
    linkLabel: 'How Sacred Timing works',
  },
  {
    title: 'Ask Mihira',
    body: 'Bring the questions that have no date: duty, grief, ambition, family. Answers cite the texts they draw on and end with one thing to do today.',
    img: '/product-screenshots/scripture-guidance.png',
    alt: 'Mihira answer to a life question, with scripture citations',
    href: '/ask-mihira',
    linkLabel: 'See an example answer',
  },
  {
    title: 'Daily Alignment',
    body: 'A two-minute morning reading, built from your birth details, on where to put your energy before the day decides for you.',
    img: '/product-screenshots/daily-alignment.png',
    alt: 'Mihira Daily Alignment morning reading',
    href: '/daily-alignment',
    linkLabel: 'Read about Daily Alignment',
  },
];

const pillars = [
  {
    title: 'More than the Gita',
    body: 'The Upanishads, Puranas, both epics and the saints’ commentary, cited so you can check the source yourself.',
  },
  {
    title: 'Practical, not mystical',
    body: 'No vague cosmic reassurance. Each answer ends in a clearer judgment, a better window, or a next step.',
  },
  {
    title: 'For life far from home',
    body: 'Written for families who don’t have a temple, a pandit, or an elder down the road to ask.',
  },
  {
    title: 'Private by default',
    body: 'Your questions and birth details are treated as sensitive data. No community feed, and we never sell data.',
  },
];

const quotes = [
  {
    text: 'I asked about leaving a job my parents were proud of. It didn’t tell me what to do. It gave me a steadier way to decide.',
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
  { feature: 'Sacred Timing (Muhurat Finder)', free: 'Limited scans', plus: 'Unlimited scans' },
  { feature: 'Ask Mihira', free: 'A few questions a week', plus: 'Unlimited' },
  { feature: 'Daily Alignment reading', free: 'Included', plus: 'Included' },
  { feature: 'Gurukul guided learning', free: 'Previews', plus: 'Full library' },
  { feature: 'Personalized from your birth details', free: 'Basic', plus: 'Deep' },
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
    question: 'Is Mihira available yet?',
    answer:
      'Yes — Mihira is live now on the App Store for iPhone. The Android app is coming soon; join the waitlist and we will email you when your invite is ready.',
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
      operatingSystem: [hasAppStoreUrl ? 'iOS' : null, hasGooglePlayUrl ? 'Android' : null]
        .filter(Boolean)
        .join(', ') || 'iOS, Android',
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
  const waitlistNote =
    waitlistCount !== null ? `${waitlistCount.toLocaleString('en-US')} people are on the Android waitlist.` : null;

  const timingRows = timingCitySlugs
    .map((slug) => DIWALI_CITIES.find((c) => c.slug === slug))
    .filter((c): c is (typeof DIWALI_CITIES)[number] => Boolean(c))
    .map((c) => ({ city: c, t: lakshmiPujaFor(c.lat, c.lng) }));

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
      <header className={`${shellClass} grid items-center gap-14 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-[1.2fr_0.8fr]`}>
        <div className="flex flex-col gap-8">
          <h1 className="max-w-[14ch] font-serif text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.04] tracking-[-0.01em] text-[#F7F1E3]">
            Guidance for the decisions you don’t want answered lightly.
          </h1>
          <p className="max-w-[34rem] text-[19px] leading-[1.6] text-[#F2EAD9]/75">
            Muhurat computed for your own city, not for India, and answers drawn from the scriptures for the
            questions that have no date. For duty, family, ambition and grief.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <a className={primaryButtonClass} href={hasAppStoreUrl ? appStoreUrl : waitlistHref}>
                {hasAppStoreUrl ? 'Download for iPhone' : 'Join the waitlist'}
              </a>
              <span className="text-[15px] text-[#F2EAD9]/55">Free to start</span>
            </div>
            <div className="flex max-w-[480px] flex-col gap-2.5 border-t border-[#F2EAD9]/[0.08] pt-5">
              <p className="text-[15px] text-[#F2EAD9]/60">On Android? We’ll email you when it’s ready.</p>
              <WaitlistInlineForm source="landing_page_hero" buttonLabel="Notify me" />
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-[280px] overflow-hidden rounded-[40px] border border-[#F2EAD9]/[0.14] bg-[#17120B] p-2">
            <Image
              alt="Mihira Sacred Timing screen listing muhurat windows"
              className="block h-auto w-full rounded-[32px]"
              src="/product-screenshots/sacred-timing.png"
              width={1179}
              height={2556}
              sizes="280px"
              priority
            />
          </div>
        </div>
      </header>

      {/* Timing is local */}
      <section className={`${sectionClass} bg-[#14100A]`}>
        <div className={`${shellClass} grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
          <div className="flex flex-col gap-6">
            <h2 className={headingClass}>One Diwali. A different window in every city.</h2>
            <p className={bodyMutedClass}>
              Lakshmi Puja begins after your local sunset, so the right window moves with you. A time printed for
              Delhi doesn’t hold in Dallas. These are computed for {DIWALI_DATE_LABEL}.
            </p>
            <dl className="border-l-2 border-[#E8A33D] pl-5">
              <dt className="font-serif text-[22px] text-[#F7F1E3]">
                Muhurat <span lang="sa" className="text-[#E8A33D]">मुहूर्त</span>
              </dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-[#F2EAD9]/60">
                A window of time suited to a particular act, worked out from the sun, the moon and where you stand.
              </dd>
            </dl>
            <Link
              className="self-start text-[16px] font-semibold text-[#E8A33D] underline decoration-[#E8A33D]/40 underline-offset-[6px] transition-colors hover:decoration-[#E8A33D]"
              href="/diwali"
            >
              Find the window for your city
            </Link>
          </div>

          <table className="w-full border-collapse self-start text-left">
            <caption className="sr-only">Lakshmi Puja window by US city, {DIWALI_DATE_LABEL}</caption>
            <thead>
              <tr className="text-[14px] text-[#F2EAD9]/45">
                <th scope="col" className="pb-3 font-medium">City</th>
                <th scope="col" className="pb-3 font-medium">Lakshmi Puja</th>
                <th scope="col" className="hidden pb-3 text-right font-medium sm:table-cell">Sunset</th>
              </tr>
            </thead>
            <tbody>
              {timingRows.map(({ city, t }) => (
                <tr key={city.slug} className="border-t border-[#F2EAD9]/[0.1]">
                  <th scope="row" className="py-4 pr-4 align-baseline text-[16px] font-medium text-[#F2EAD9]/85">
                    <Link className="transition-colors hover:text-[#E8A33D]" href={`/diwali/${city.slug}`}>
                      {city.name}
                    </Link>
                  </th>
                  <td className="py-4 pr-4 align-baseline font-serif text-[clamp(1.35rem,2.6vw,2rem)] tabular-nums leading-none text-[#F7F1E3]">
                    {t.pujaStart}
                    <span className="text-[#F2EAD9]/35"> to </span>
                    {t.pujaEnd}
                    <span className="ml-2 font-sans text-[13px] text-[#F2EAD9]/40">{t.tzAbbr}</span>
                  </td>
                  <td className="hidden py-4 text-right align-baseline text-[15px] tabular-nums text-[#F2EAD9]/50 sm:table-cell">
                    {t.sunset}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What's in the app */}
      <section id="practice" className={`${sectionClass} scroll-mt-20`}>
        <div className={`${shellClass} flex flex-col gap-16`}>
          <h2 className={`${headingClass} max-w-[22ch]`}>Three things you’ll open it for.</h2>

          <div className="grid gap-x-10 gap-y-16 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="flex flex-col gap-5">
                <div className="h-[340px] overflow-hidden rounded-t-[28px] border border-b-0 border-[#F2EAD9]/[0.12] bg-[#17120B] px-2 pt-2">
                  <Image
                    alt={feature.alt}
                    src={feature.img}
                    className="block w-full rounded-t-[22px]"
                    width={1179}
                    height={2556}
                    sizes="(min-width: 768px) 30vw, 90vw"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-serif text-[26px] leading-tight text-[#F7F1E3]">{feature.title}</h3>
                <p className="text-[16px] leading-[1.65] text-[#F2EAD9]/65">{feature.body}</p>
                <Link
                  className="mt-auto self-start text-[15px] font-semibold text-[#E8A33D] underline decoration-[#E8A33D]/40 underline-offset-[5px] transition-colors hover:decoration-[#E8A33D]"
                  href={feature.href}
                >
                  {feature.linkLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mihira */}
      <section id="why" className={`${sectionClass} scroll-mt-20`}>
        <div className={`${shellClass} grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
          <div className="flex flex-col gap-5">
            <h2 className={headingClass}>Not another “Ask Krishna” chatbot.</h2>
            <p className={bodyMutedClass}>
              Gita-only apps hand you a verse and leave. Mihira is meant to be used over years, with the depth and
              privacy real questions need.
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex flex-col gap-2 border-t border-[#F2EAD9]/[0.12] pt-5">
                <h3 className="text-[18px] font-semibold text-[#F7F1E3]">{pillar.title}</h3>
                <p className="text-[16px] leading-[1.65] text-[#F2EAD9]/60">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`${sectionClass} bg-[#14100A]`}>
        <div className={`${shellClass} grid gap-12 md:grid-cols-3`}>
          {quotes.map((quote) => (
            <figure key={quote.name} className="flex flex-col gap-5">
              <blockquote className="font-serif text-[22px] italic leading-[1.45] text-[#F2EAD9]">
                “{quote.text}”
              </blockquote>
              <figcaption className="mt-auto text-[15px] text-[#F2EAD9]/50">
                <span className="font-semibold text-[#F2EAD9]/85">{quote.name}</span>, {quote.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className={`${sectionClass} scroll-mt-20`}>
        <div className="mx-auto flex w-full max-w-[880px] flex-col gap-10 px-6">
          <div className="flex flex-col gap-4">
            <h2 className={headingClass}>Start free. Go deeper when you’re ready.</h2>
            <p className={bodyMutedClass}>Pricing is announced at launch. Waitlist members get early-bird terms.</p>
          </div>

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#F2EAD9]/[0.16]">
                <th scope="col" className="py-4 pr-4 text-[14px] font-medium text-[#F2EAD9]/45">
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className="w-[28%] py-4 pr-4 font-serif text-[24px] font-normal text-[#F2EAD9]">
                  Free
                </th>
                <th scope="col" className="w-[28%] py-4 font-serif text-[24px] font-normal text-[#E8A33D]">
                  Plus
                </th>
              </tr>
            </thead>
            <tbody>
              {planRows.map((row) => (
                <tr key={row.feature} className="border-b border-[#F2EAD9]/[0.08]">
                  <th scope="row" className="py-5 pr-4 text-[16px] font-medium text-[#F2EAD9]">
                    {row.feature}
                  </th>
                  <td className="py-5 pr-4 text-[15px] text-[#F2EAD9]/60">{row.free}</td>
                  <td className="py-5 text-[15px] font-semibold text-[#F0B454]">{row.plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={sectionClass}>
        <div className="mx-auto grid w-full max-w-[1160px] gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12">
          <h2 className={headingClass}>Before you trust it with a real question.</h2>
          <FAQList faqs={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section id="waitlist" className={`${sectionClass} scroll-mt-20 bg-[#14100A]`}>
        <div className={`${shellClass} grid grid-cols-1 items-end gap-10 lg:grid-cols-2`}>
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-[clamp(2.25rem,4.4vw,3.25rem)] leading-[1.08] text-[#F7F1E3]">
              Live on iPhone. Android is next.
            </h2>
            <p className={`${bodyMutedClass} max-w-[30rem]`}>
              Android opens to the waitlist in small batches.{waitlistNote ? ` ${waitlistNote}` : ''}
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {hasAppStoreUrl ? (
              <a className={`${primaryButtonClass} self-start`} href={appStoreUrl}>
                Download for iPhone
              </a>
            ) : null}
            <WaitlistInlineForm source="landing_page_footer" buttonLabel="Join the Android waitlist" />
            {hasGooglePlayUrl ? (
              <a className="self-start text-[15px] text-[#F2EAD9]/60 underline underline-offset-4" href={googlePlayUrl}>
                Get it on Google Play
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
