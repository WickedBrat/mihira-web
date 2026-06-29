import Link from 'next/link';
import type { Metadata } from 'next';
import { Charmonman } from 'next/font/google';
import { FAQList } from '@/components/faq-list';
import { WaitlistForm } from '@/components/waitlist-form';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { WebGLShader } from '@/components/ui/web-gl-shader';
import mihiraLogo from './logo.svg';

const charmonman = Charmonman({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const configuredAppStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
const configuredGooglePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL;
const foundersEmailUrl = 'mailto:founders@getmihira.com?subject=Mihira%20waitlist';
const waitlistHref = '#waitlist';
const hasAppStoreUrl = Boolean(configuredAppStoreUrl);
const hasGooglePlayUrl = Boolean(configuredGooglePlayUrl);
const hasStoreLinks = hasAppStoreUrl || hasGooglePlayUrl;
const appStoreUrl = configuredAppStoreUrl || waitlistHref;
const googlePlayUrl = configuredGooglePlayUrl || waitlistHref;
const primaryStoreUrl = configuredAppStoreUrl || configuredGooglePlayUrl || waitlistHref;
const siteUrl = 'https://getmihira.com';
const pageTitle = 'Mihira - Scripture-Grounded Guidance and Sacred Timing App';
const pageDescription =
  'Get Mihira, a private Vedic guidance app for Indians abroad seeking scripture-grounded guidance, sacred timing, daily alignment, and calmer decision-making.';
const primaryCtaLabel = hasStoreLinks ? 'Download App' : 'Join Waitlist';
const primaryCtaHref = hasStoreLinks ? '#download' : waitlistHref;
const availabilityCopy = hasStoreLinks
  ? 'Available for iPhone and Android'
  : 'Private beta waitlist for iPhone and Android';
const shellClass = 'mx-auto w-full max-w-[1280px] px-6 lg:px-10';
const bandClass = 'py-20 md:py-28';
const kickerClass =
  'mb-4 font-sans text-[0.58rem] uppercase tracking-[0.28em] text-[#ff9500]';
const headingClass =
  'm-0 text-balance font-[var(--font-display)] text-[clamp(2.45rem,4.8vw,4rem)] font-semibold leading-[1.04] tracking-normal text-white';
const bodyClass = 'text-base leading-[1.65] text-white/72';
const headerClass =
  'fixed left-0 top-2 z-50 w-full bg-transparent px-[18px] max-[760px]:sticky max-[760px]:top-0 max-[760px]:px-2 max-[760px]:py-2 md:max-lg:px-3';
const headerInnerClass =
  'mx-auto flex py-2 w-full max-w-5xl items-center justify-between gap-8 rounded-full border border-white/[0.05] bg-[radial-gradient(circle_at_60%_0%,rgba(255,149,0,0.08),transparent_30%),rgba(31,35,38,0.96)] px-2 pl-4 shadow-[0_22px_48px_rgba(0,0,0,0.22)] backdrop-blur-[22px] max-[760px]:min-h-16 max-[760px]:gap-3 max-[760px]:rounded-[2rem] md:max-lg:min-h-[4.75rem] md:max-lg:gap-5';
const headerLogoClass =
  'inline-flex min-w-48 items-center text-[clamp(1rem,1.5vw,1.5rem)] font-bold leading-none tracking-normal text-white max-[760px]:min-w-0 max-[760px]:text-lg md:max-lg:min-w-32 md:max-lg:text-[2rem]';
const navLinkClass =
  'font-sans text-xs font-bold uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-[#ff9500]';
const headerCtaClass =
  'inline-flex min-h-8 items-center justify-center rounded-full px-[clamp(18px,2vw,28px)] font-sans font-bold uppercase tracking-[0.14em] text-white/90 transition-transform hover:-translate-y-px max-[760px]:min-h-10 max-[760px]:bg-[#b564fc] max-[760px]:px-3 text-xs';
const headerStoreLinkClass =
  'inline-flex size-12 flex-none items-center justify-center rounded-full bg-white text-[#111214] shadow-[0_14px_26px_rgba(0,0,0,0.2)] transition hover:-translate-y-px hover:bg-[#fff8ed] hover:shadow-[0_18px_34px_rgba(0,0,0,0.26)]';
const storeBadgeLinkClass =
  'inline-flex min-h-12 min-w-[198px] items-center justify-center gap-3 rounded border border-[#b564fc]/40 bg-[#b564fc] px-[1.375rem] font-sans text-[0.58rem] font-bold uppercase leading-none tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition hover:-translate-y-px hover:border-[#ff9500]/55 hover:shadow-[0_16px_34px_rgba(181,100,252,0.28)] max-[760px]:w-full';
const ghostButtonClass =
  'inline-flex items-center justify-center rounded border border-white/20 font-sans font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-px max-[760px]:w-full';
const previewCardClass =
  'relative grid min-h-[620px] content-between overflow-hidden rounded-xl border border-[#e7e5e5]/15 bg-[radial-gradient(circle_at_50%_12%,rgba(255,149,0,0.12),transparent_32%),linear-gradient(180deg,rgba(37,38,38,0.96),rgba(17,18,18,0.98))] shadow-[0_24px_44px_rgba(0,0,0,0.2)] max-lg:min-h-0';
const pillarCardClass =
  'relative min-h-[212px] overflow-hidden rounded-lg border border-[#e7e5e5]/15 bg-[linear-gradient(180deg,rgba(37,38,38,0.94),rgba(25,26,26,0.98)),radial-gradient(circle_at_top,rgba(181,100,252,0.08),transparent_32%)] p-6 pt-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.02),0_18px_34px_rgba(0,0,0,0.16)]';
const trustCardClass =
  'rounded-lg border border-[#e7e5e5]/10 bg-[linear-gradient(180deg,rgba(31,32,32,0.94),rgba(20,20,20,0.98)),radial-gradient(circle_at_top_left,rgba(255,149,0,0.08),transparent_36%)] p-6';
const footerLinkClass =
  'font-sans text-[0.62rem] uppercase tracking-[0.14em] text-white transition-colors hover:text-[#ff9500]';

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
    'astrology guidance app',
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

const pillars = [
  {
    icon: 'guidance',
    title: 'Guidance',
    body:
      'Bring real questions about work, family, grief, purpose, or relationships and get scripture-grounded guidance in language you can actually use.',
  },
  {
    icon: 'muhurat',
    title: 'Sacred Timing',
    body:
      'Describe an event or decision and Mihira helps you find better windows for important conversations, travel, ceremonies, and major life moves.',
  },
  {
    icon: 'daily',
    title: 'Daily Practice',
    body:
      'Start the day with a calmer sense of where to place your energy, then return when you need perspective instead of more noise.',
  },
];

const inquiries = [
  'How do I carry ambition without becoming consumed by it?',
  'When is the right window to begin this move, launch, or commitment?',
  'What do the texts say when grief and duty pull in different directions?',
];

const productPreviews = [
  {
    eyebrow: 'Scripture Guidance',
    title: 'Ask what actually weighs on you',
    body: 'Bring questions about duty, grief, ambition, family, or relationships and get grounded guidance with usable next steps.',
    image: '/product-screenshots/scripture-guidance.png',
    alt: 'Mihira scripture guidance screen preview',
  },
  {
    eyebrow: 'Daily Alignment',
    title: 'Start the day with direction',
    body: 'A personalized reading helps you decide where to place energy before the day starts moving too fast.',
    image: '/product-screenshots/daily-alignment.png',
    alt: 'Mihira daily alignment screen preview',
  },
  {
    eyebrow: 'Sacred Timing',
    title: 'Choose better windows',
    body: 'Describe an event and review auspicious timing with reasoning for conversations, travel, ceremonies, and commitments.',
    image: '/product-screenshots/sacred-timing.png',
    alt: 'Mihira sacred timing screen preview',
  },
];

const flowSteps = [
  {
    number: '01',
    verb: 'Ask',
    title: 'the real question',
    body: 'Start with the question, pressure, or decision that actually needs guidance.',
  },
  {
    number: '02',
    verb: 'Read',
    title: 'grounded guidance',
    body: 'Mihira brings together scripture, chart context, and plain-language reasoning.',
  },
  {
    number: '03',
    verb: 'Check',
    title: 'the timing',
    body: 'When timing matters, the app surfaces auspicious windows with clear reasoning.',
  },
  {
    number: '04',
    verb: 'Take',
    title: 'the next step',
    body: 'You get something usable: clearer judgment, better timing, and a calmer way to act.',
  },
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

const downloadBadges = [
  {
    href: appStoreUrl,
    alt: hasAppStoreUrl ? 'Download on the App Store' : 'Request iPhone early access',
    store: hasAppStoreUrl ? 'App Store' : 'iPhone Waitlist',
    icon: 'apple',
  },
  {
    href: googlePlayUrl,
    alt: hasGooglePlayUrl ? 'Get it on Google Play' : 'Request Android early access',
    store: hasGooglePlayUrl ? 'Google Play' : 'Android Waitlist',
    icon: 'play',
  },
];

const structuredData = [
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
    description: pageDescription,
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
    description: pageDescription,
    offers: {
      '@type': 'Offer',
      availability: hasStoreLinks ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
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

function MihiraText() {
  return <span className={charmonman.className}>Mihira</span>;
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

function StoreIcon({ icon, className = 'h-[18px] w-[18px]' }: { icon: string; className?: string }) {
  if (icon === 'apple') {
    return (
      <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="black"
          d="M16.7 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.1-2.8.8-3.6.8s-2-.8-3.3-.8c-1.7 0-3.2 1-4.1 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.4-2.9 1.4-2.9-.1 0-3.5-1.3-3.5-4.5ZM14.4 5.8c.7-.9 1.2-2 1.1-3.2-1.1.1-2.3.7-3.1 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.4-.6 3.1-1.5Z"
        />
      </svg>
    );
  }

  return (
    <svg className={`pl-1 ${className}`} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="black" d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27"/>
    </svg>
  );
}

function PillarIcon({ icon, className = 'h-[25px] w-[25px]' }: { icon: string; className?: string }) {
  if (icon === 'guidance') {
    return (
      <svg className={className} viewBox="0 -960 960 960" aria-hidden="true">
        <path
          fill="currentColor"
          d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"
        />
      </svg>
    );
  }

  if (icon === 'daily') {
    return (
      <svg className={className} viewBox="0 -960 960 960" aria-hidden="true">
        <path
          fill="currentColor"
          d="M567-364.5Q630-328 702-308q-40 51-98 79.5T481-200q-117 0-198.5-81.5T201-480q0-65 28.5-123t79.5-98q20 72 56.5 135T453-452q51 51 114 87.5ZM743-380q-20-5-39.5-11T665-405q8-18 11.5-36.5T680-480q0-83-58.5-141.5T480-680q-20 0-38.5 3.5T405-665q-8-19-13.5-38T381-742q24-9 49-13.5t51-4.5q117 0 198.5 81.5T761-480q0 26-4.5 51T743-380ZM440-840v-120h80v120h-80Zm0 840v-120h80V0h-80Zm323-706-57-57 85-84 57 56-85 85ZM169-113l-57-56 85-85 57 57-85 84Zm671-327v-80h120v80H840ZM0-440v-80h120v80H0Zm791 328-85-85 57-57 84 85-56 57ZM197-706l-84-85 56-57 85 85-57 57Z"
        />
      </svg>
    );
  }

  return <img src="/icons/muhurat.svg" alt="" className={className} aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <main className="bg-[#0e0e0e] text-white">
      {structuredData.map((schema) => (
        <script
          key={schema['@type']}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <header className={headerClass}>
        <div className={headerInnerClass}>
          <Link className={headerLogoClass} href="/">
            <img src={mihiraLogo.src} className='mr-2' width={40} height={40} alt="Mihira logo" />
            <MihiraText />
          </Link>

          <nav className="flex flex-1 flex-wrap items-center justify-center gap-[clamp(28px,4vw,58px)] max-[760px]:hidden md:max-lg:gap-4" aria-label="Primary">
            <Link className={navLinkClass} href="#preview">
              Features
            </Link>
            <Link className={navLinkClass} href="#daily-practice">
              Method
            </Link>
            <Link className={navLinkClass} href="#waitlist">
              Waitlist
            </Link>
          </nav>

          <div className="flex items-center gap-6 border-l border-white/20 pl-[clamp(22px,3vw,42px)] max-[760px]:gap-2 max-[760px]:border-l-0 max-[760px]:pl-0 md:max-lg:gap-3.5 md:max-lg:pl-4" aria-label={primaryCtaLabel}>
            <a className={headerCtaClass} href={primaryCtaHref}>
              {primaryCtaLabel}
            </a>
            <div className="flex items-center gap-[18px] max-[760px]:gap-2 md:max-lg:gap-2.5">
              {downloadBadges.map((badge) => (
                <a
                  key={badge.store}
                  className={headerStoreLinkClass}
                  href={badge.href}
                  aria-label={badge.alt}
                >
                  <StoreIcon icon={badge.icon} className="size-[30px] max-[760px]:size-[21px] md:max-lg:size-[25px]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="relative isolate min-h-screen overflow-hidden px-0 pb-14 pt-24 max-[760px]:min-h-0 max-[760px]:pt-[5.75rem]">
        <img
          src="/meditation.webp"
          alt=""
          className="absolute inset-0 w-[96%] mx-auto mt-8 h-full rounded-[4rem] object-cover object-center -z-10"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(14,14,14,0.62),rgba(14,14,14,0.36)_42%,rgba(14,14,14,0.88)),radial-gradient(circle_at_center,rgba(181,100,252,0.22),transparent_46%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1080px] px-10 pt-[9vh] text-center max-[760px]:px-6 max-[760px]:pb-[10vh] max-[760px]:pt-[8vh]">
          <p className={`${kickerClass} text-center`}>Scripture-grounded guidance and sacred timing</p>
          <h1 className="mx-auto max-w-[15ch] text-balance text-[clamp(2.95rem,5.25vw,4.8rem)] font-semibold leading-[0.94] tracking-normal text-white max-[760px]:text-[clamp(2.7rem,13vw,4rem)]">
            Guidance for the decisions you do not want answered lightly.
          </h1>
          <p className="mx-auto mt-[18px] max-w-160 text-[1.05rem] leading-[1.7] text-white/72">
            <MihiraText /> is a private mobile app for daily alignment, scripture-grounded guidance, and sacred timing
            for Indians abroad who want tradition, timing, and steadier judgment to fit modern life.
          </p>

          <div
            className="mt-[1.625rem] flex flex-wrap justify-center gap-3 max-[760px]:flex-col"
            id="download"
            aria-label={hasStoreLinks ? 'Download Mihira' : 'Join the Mihira waitlist'}
          >
            <div className="flex flex-wrap items-center justify-center gap-3 max-[760px]:flex-col">
              {downloadBadges.map((badge) => (
                <a
                  key={badge.store}
                  className={storeBadgeLinkClass}
                  href={badge.href}
                  aria-label={badge.alt}
                >
                  <StoreIcon icon={badge.icon} className="size-[25px] flex-none" />
                  <span className="whitespace-nowrap">{badge.store}</span>
                </a>
              ))}
            </div>
            <a className={`${ghostButtonClass} min-h-12 min-w-[198px] px-[1.375rem] text-[0.58rem]`} href="#daily-practice">
              See How It Works
            </a>
          </div>

          <div className="mt-[2.625rem] text-[1.35rem] text-[#e7e5e5]/35" aria-hidden="true">
            <span>⌄</span>
          </div>
        </div>
      </section>

      <section
        id="preview"
        className={`${bandClass} relative overflow-hidden bg-[linear-gradient(180deg,rgba(14,14,14,1),rgba(19,19,19,1))] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] before:bg-[length:76px_76px] before:opacity-[0.22] before:[mask-image:linear-gradient(180deg,transparent,black_18%,black_78%,transparent)]`}
      >
        <div className={`${shellClass} relative z-10`}>
          <div className="mb-[3.375rem] grid grid-cols-[minmax(0,0.9fr)_minmax(280px,0.68fr)] items-end gap-11 max-lg:grid-cols-1">
            <div>
              <p className={kickerClass}>Inside The App</p>
              <h2 className={headingClass}>Daily practice, deep questions, and timing in one private rhythm.</h2>
            </div>
            <p className="mb-1 text-base leading-[1.7] text-white/72">
              Mihira is not a horoscope feed or a live-consult marketplace. It is built around three repeatable moments:
              begin the day, ask carefully, and choose timing with context.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-1">
            {productPreviews.map((preview, index) => (
              <article
                key={preview.title}
                className={`${previewCardClass}`}
              >
                <div className="flex justify-center px-6 pt-[2.125rem]">
                  <img
                    alt={preview.alt}
                    src={preview.image}
                    className="aspect-[9/19.5] w-[min(100%,260px)] rounded-[2rem] border border-white/10 object-cover object-top shadow-[0_30px_54px_rgba(0,0,0,0.36),0_0_0_8px_rgba(5,5,5,0.72)] max-lg:w-[min(100%,300px)]"
                  />
                </div>
                <div className="relative z-10 bg-[linear-gradient(180deg,transparent,rgba(10,10,10,0.88)_22%,rgba(10,10,10,0.96))] px-[1.625rem] pb-7 pt-8">
                  <p className="mb-2.5 font-sans text-[0.56rem] font-bold uppercase tracking-[0.2em] text-[#ff9500]">
                    {preview.eyebrow}
                  </p>
                  <h3 className="font-[var(--font-display)] text-[1.72rem] font-semibold leading-[1.05] text-white">
                    {preview.title}
                  </h3>
                  <span className="mt-3 block text-[0.98rem] leading-[1.62] text-white/72">{preview.body}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="methodology" className={`${bandClass} bg-[#131313]`}>
        <div className={shellClass}>
          <div className="mb-[3.375rem]">
            <p className={kickerClass}>The Pillars</p>
            <h2 className={headingClass}>Three reasons people keep returning after the first question.</h2>
          </div>

          <div className="grid grid-cols-3 gap-[18px] max-lg:grid-cols-2 max-[760px]:grid-cols-1">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className={pillarCardClass}
              >
                <span className="relative z-10 inline-flex size-11 items-center justify-center rounded-full border border-[#ff9500]/20 bg-[#ff9500]/10 text-[#ff9500]" aria-hidden="true">
                  <PillarIcon icon={pillar.icon} />
                </span>
                <h3 className="relative z-10 mt-[1.375rem] font-[var(--font-display)] text-[1.52rem] font-semibold leading-[1.05] text-white">
                  {pillar.title}
                </h3>
                <p className={`${bodyClass} relative z-10 mt-4`}>{renderMihiraText(pillar.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sacred-timing" className={`${bandClass} bg-[#0e0e0e]`}>
        <div className={`${shellClass} grid grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)] items-center gap-11 max-lg:grid-cols-1`}>
          <div>
            <p className={kickerClass}>What You Can Ask</p>
            <h2 className={headingClass}>Bring the questions you would not hand to a generic feed.</h2>
            <p className={`${bodyClass} mt-[1.375rem] max-w-[35rem]`}>
              <MihiraText /> is built for people carrying real uncertainty: difficult decisions, emotional weight, and
              moments when better timing or deeper perspective would change how they move.
            </p>

            <ul className="mt-[2.125rem] grid list-none gap-[1.125rem] p-0">
              {inquiries.map((inquiry) => (
                <li key={inquiry} className="flex items-start gap-3 text-base italic leading-[1.55] text-white/72">
                  <span className="translate-y-[0.4rem] flex-none text-[0.72rem] text-[#ff9500]" aria-hidden="true">
                    ●
                  </span>
                  <span>{renderMihiraText(inquiry)}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="relative overflow-hidden rounded-xl border border-white/10 bg-[#252626] shadow-[0_24px_40px_rgba(0,0,0,0.22)]">
            <img
              alt="A close-up handwritten journal page with soft focus and archival texture"
              className="aspect-[4/5] w-full object-cover opacity-[0.84]"
              src="https://images.unsplash.com/photo-1559455348-3245e7c10709?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <div className="absolute inset-x-3.5 bottom-3.5 border-l-2 border-[#ff9500] bg-[#0e0e0e]/90 p-[1.125rem]">
              <blockquote className="m-0 font-[var(--font-display)] text-[1.45rem] italic leading-[1.28] text-white max-[760px]:text-[1.2rem]">
                &quot;The point is not certainty. The point is steadier judgment.&quot;
              </blockquote>
              <p className="mt-3.5 font-sans text-[0.56rem] uppercase tracking-[0.18em] text-[#ff9500]">
                The {renderMihiraText('Mihira')} approach
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="daily-practice" className={`${bandClass} bg-[linear-gradient(180deg,rgba(181,100,252,0.08),rgba(255,149,0,0.05))]`}>
        <div className={shellClass}>
          <div className="mb-[3.375rem] text-center">
            <p className={kickerClass}>How It Works</p>
            <h2 className={headingClass}>A calm product flow that leads to something usable.</h2>
          </div>

          <div className="grid grid-cols-4 gap-[18px] max-lg:grid-cols-2 max-[760px]:grid-cols-1">
            {flowSteps.map((step) => (
              <article key={step.number}>
                <span className="inline-block font-sans text-[2.15rem] font-semibold leading-none tracking-[0.08em] text-[#ff9500]/35">
                  {step.number}
                </span>
                <h3 className="mt-4 flex flex-wrap items-baseline gap-[0.35em] font-[var(--font-display)] text-[1.22rem] font-semibold leading-[1.05] text-white">
                  <strong className="font-bold">{step.verb}</strong>
                  <span className="text-[0.98rem] font-medium text-white/80">{step.title}</span>
                </h3>
                <p className={`${bodyClass} mt-3`}>{renderMihiraText(step.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${bandClass} bg-[#131313]`}>
        <div className={`${shellClass} grid grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] items-start gap-12 max-lg:grid-cols-1`}>
          <div className="sticky top-28 max-lg:static">
            <p className={kickerClass}>Built For Trust</p>
            <h2 className={headingClass}>A private Vedic companion, not a noisy content feed.</h2>
          </div>
          <div className="grid gap-3.5">
            <article className={trustCardClass}>
              <h3 className="font-[var(--font-display)] text-[1.35rem] font-semibold leading-[1.05] text-white">
                Designed for life abroad
              </h3>
              <p className={`${bodyClass} mt-3`}>English-first, culturally rooted guidance for people who want continuity without needing an astrologer on call.</p>
            </article>
            <article className={trustCardClass}>
              <h3 className="font-[var(--font-display)] text-[1.35rem] font-semibold leading-[1.05] text-white">
                Grounded, not absolute
              </h3>
              <p className={`${bodyClass} mt-3`}>Guidance is framed to sharpen judgment and next steps, not replace professional advice or personal responsibility.</p>
            </article>
            <article className={trustCardClass}>
              <h3 className="font-[var(--font-display)] text-[1.35rem] font-semibold leading-[1.05] text-white">
                Sensitive by design
              </h3>
              <p className={`${bodyClass} mt-3`}>Birth details, preferences, and questions are treated as sensitive product data. Mihira does not sell personal data.</p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="waitlist"
        className={`${bandClass} scroll-mt-28 relative overflow-hidden bg-[linear-gradient(180deg,#10100f_0%,#151515_100%)]`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,149,0,0.12),transparent_30%),radial-gradient(circle_at_86%_24%,rgba(174,227,255,0.1),transparent_26%)]"
          aria-hidden="true"
        />
        <div className={`${shellClass} relative z-10 grid grid-cols-[minmax(0,0.9fr)_minmax(320px,0.62fr)] items-center gap-12 max-lg:grid-cols-1`}>
          <div>
            <p className={kickerClass}>Private Beta</p>
            <h2 className={headingClass}>
              Join the waitlist for <MihiraText />'s first invites.
            </h2>
            <p className={`${bodyClass} mt-[1.375rem] max-w-[39rem]`}>
              We are opening access in small batches for people who want scripture-grounded guidance, sacred timing,
              and daily alignment before the public release.
            </p>

            <div className="mt-8 grid max-w-[46rem] grid-cols-3 gap-3 max-[760px]:grid-cols-1">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <span className="font-sans text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[#ff9500]">
                  Batch Access
                </span>
                <p className="mt-2 text-sm leading-[1.55] text-white/[0.68]">Invites roll out as product capacity opens.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <span className="font-sans text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[#ff9500]">
                  Both Stores
                </span>
                <p className="mt-2 text-sm leading-[1.55] text-white/[0.68]">Choose iPhone, Android, or both.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <span className="font-sans text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[#ff9500]">
                  Quiet Updates
                </span>
                <p className="mt-2 text-sm leading-[1.55] text-white/[0.68]">Only beta access and launch notes.</p>
              </div>
            </div>
          </div>

          <WaitlistForm />
        </div>
      </section>

      <section id="faq" className={`${bandClass} bg-[#0e0e0e]`}>
        <div className="mx-auto w-full max-w-[920px] px-6 lg:px-10">
          <div className="mb-[3.375rem] text-center">
            <h2 className={headingClass}>
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

      <section className="relative overflow-hidden bg-[#131313] py-20 px-0 md:py-28">
        <div className="relative w-full text-center">
          <div className="relative w-full overflow-hidden border border-zinc-800/90 bg-black/80 p-2">
            <div className="absolute inset-px z-0 opacity-90" aria-hidden="true">
              <WebGLShader />
            </div>
            <div className="relative min-h-[29rem] overflow-hidden border border-zinc-800/90 bg-[#070707]/65 max-[760px]:min-h-96">
              <div className="relative z-10 flex min-h-[29rem] flex-col items-center justify-center bg-[radial-gradient(circle_at_center,rgba(181,100,252,0.1),transparent_40%),linear-gradient(180deg,rgba(5,5,5,0.36),rgba(5,5,5,0.74))] px-6 py-[4.25rem] pb-[5.25rem] max-[760px]:min-h-96">
                <p className={`${kickerClass} text-center`}>
                  {hasStoreLinks ? 'Start With Clearer Direction' : 'Private Beta Access'}
                </p>
                <h2 className={`${headingClass} mx-auto max-w-[14ch]`}>
                  {hasStoreLinks ? (
                    <>
                      Download <MihiraText /> and bring more clarity to what already matters.
                    </>
                  ) : (
                    <>
                      Join <MihiraText /> before the public release.
                    </>
                  )}
                </h2>
                <p className="mx-auto mt-5 max-w-[38rem] text-base leading-[1.7] text-white/72">
                  {hasStoreLinks ? (
                    <>
                      Use <MihiraText /> for daily alignment, deeper questions, and better timing when the next step carries
                      real weight.
                    </>
                  ) : (
                    <>
                      Leave your email for early iPhone and Android access as the private beta opens in careful batches.
                    </>
                  )}
                </p>
                <div className="mt-8 inline-flex items-center gap-2 font-sans text-xs tracking-[0.04em] text-green-500">
                  <span className="inline-flex size-3 rounded-full bg-green-500 shadow-[0_0_0_0_rgba(34,197,94,0.55)] animate-pulse" aria-hidden="true" />
                  <p>{availabilityCopy}</p>
                </div>
                <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3 max-[760px]:flex-col">
                  <LiquidButton asChild className="rounded-full border border-white/15 text-white" size="xl">
                    <a href={hasStoreLinks ? primaryStoreUrl : waitlistHref}>
                      {hasStoreLinks ? (
                        <>
                          Download <MihiraText />
                        </>
                      ) : (
                        'Join Waitlist'
                      )}
                    </a>
                  </LiquidButton>
                  <a
                    className="inline-flex min-h-[2.625rem] items-center justify-center rounded border border-white/20 px-[1.125rem] font-sans text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-px max-[760px]:w-full"
                    href={hasStoreLinks ? googlePlayUrl : foundersEmailUrl}
                  >
                    {hasGooglePlayUrl ? 'Google Play' : hasStoreLinks ? 'Android Waitlist' : 'Contact Founders'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#131313]">
        <div className={`${shellClass} flex items-center justify-between gap-6 py-7 max-[760px]:flex-col max-[760px]:items-start`}>
          <div>
            <span className="inline-flex items-center text-[1.15rem] font-bold leading-none tracking-normal text-white">
              <MihiraText />
            </span>
            <p className="mt-2.5 font-sans text-[0.52rem] uppercase tracking-[0.14em] text-[#ff9500]">
              © 2026 Mihira. Scripture-grounded guidance for modern life.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-[1.375rem]">
            <Link className={footerLinkClass} href="/privacy">
              Privacy Policy
            </Link>
            <Link className={footerLinkClass} href="/terms">
              Terms of Service
            </Link>
            <a className={footerLinkClass} href="mailto:founders@getmihira.com">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
