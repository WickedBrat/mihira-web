import Link from 'next/link';
import { FAQList } from '@/components/faq-list';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { WebGLShader } from '@/components/ui/web-gl-shader';

const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || '#download';
const googlePlayUrl = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#download';

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
];

const downloadBadges = [
  {
    href: appStoreUrl,
    alt: 'Download on the App Store',
    store: 'App Store',
    icon: 'apple',
  },
  {
    href: googlePlayUrl,
    alt: 'Get it on Google Play',
    store: 'Google Play',
    icon: 'play',
  },
];

function StoreIcon({ icon }: { icon: string }) {
  if (icon === 'apple') {
    return (
      <svg className="store-badge__icon store-badge__icon--apple" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.7 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.5-.1-2.8.8-3.6.8s-2-.8-3.3-.8c-1.7 0-3.2 1-4.1 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.4-2.9 1.4-2.9-.1 0-3.5-1.3-3.5-4.5ZM14.4 5.8c.7-.9 1.2-2 1.1-3.2-1.1.1-2.3.7-3.1 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.4-.6 3.1-1.5Z"
        />
      </svg>
    );
  }

  return (
    <svg className="store-badge__icon store-badge__icon--play" viewBox="0 0 24 24" aria-hidden="true">
      <path className="store-badge__play-blue" d="M4.5 3.3v17.4l9-8.7-9-8.7Z" />
      <path className="store-badge__play-green" d="m13.5 12 2.8-2.7L6.4 3.6c-.6-.4-1.2-.5-1.9-.3l9 8.7Z" />
      <path className="store-badge__play-yellow" d="m13.5 12-9 8.7c.6.2 1.3.1 1.9-.3l9.9-5.7-2.8-2.7Z" />
      <path className="store-badge__play-red" d="m16.3 9.3-2.8 2.7 2.8 2.7 2.3-1.3c1.2-.7 1.2-2.1 0-2.8l-2.3-1.3Z" />
    </svg>
  );
}

function PillarIcon({ icon }: { icon: string }) {
  if (icon === 'guidance') {
    return (
      <svg viewBox="0 -960 960 960" aria-hidden="true">
        <path
          fill="currentColor"
          d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"
        />
      </svg>
    );
  }

  if (icon === 'daily') {
    return (
      <svg viewBox="0 -960 960 960" aria-hidden="true">
        <path
          fill="currentColor"
          d="M567-364.5Q630-328 702-308q-40 51-98 79.5T481-200q-117 0-198.5-81.5T201-480q0-65 28.5-123t79.5-98q20 72 56.5 135T453-452q51 51 114 87.5ZM743-380q-20-5-39.5-11T665-405q8-18 11.5-36.5T680-480q0-83-58.5-141.5T480-680q-20 0-38.5 3.5T405-665q-8-19-13.5-38T381-742q24-9 49-13.5t51-4.5q117 0 198.5 81.5T761-480q0 26-4.5 51T743-380ZM440-840v-120h80v120h-80Zm0 840v-120h80V0h-80Zm323-706-57-57 85-84 57 56-85 85ZM169-113l-57-56 85-85 57 57-85 84Zm671-327v-80h120v80H840ZM0-440v-80h120v80H0Zm791 328-85-85 57-57 84 85-56 57ZM197-706l-84-85 56-57 85 85-57 57Z"
        />
      </svg>
    );
  }

  return <span className="pillar-card__icon-mask" aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-logo" href="/">
            Mihira
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <Link href="#methodology">Why Mihira</Link>
            <Link href="#sacred-timing">What You Can Ask</Link>
            <Link href="#daily-practice">How It Works</Link>
            <Link href="#faq">FAQ</Link>
          </nav>

          <a className="header-cta" href="#download">
            Download App
          </a>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-section__inner">
          <p className="section-kicker section-kicker--center">Scripture-grounded guidance and sacred timing</p>
          <h1>Guidance for the decisions you do not want answered lightly.</h1>
          <p className="hero-copy">
            Mihira is a private mobile app for daily alignment, scripture-grounded guidance, and sacred timing
            when work, family, grief, or major decisions need more than a generic feed.
          </p>

          <div className="hero-actions">
            <a className="button button--solid button--hero" href={appStoreUrl}>
              Download Mihira
            </a>
            <a className="button button--ghost button--hero" href="#daily-practice">
              See How It Works
            </a>
          </div>

          <div id="download" className="store-badges" aria-label="Download Mihira">
            {downloadBadges.map((badge) => (
              <a key={badge.store} className="store-badge" href={badge.href} aria-label={badge.alt}>
                <StoreIcon icon={badge.icon} />
                <span>{badge.store}</span>
              </a>
            ))}
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>⌄</span>
          </div>
        </div>
      </section>

      <section id="methodology" className="landing-band landing-band--muted">
        <div className="content-shell">
          <div className="section-heading">
            <p className="section-kicker">The Pillars</p>
            <h2>Three reasons people keep returning after the first question.</h2>
          </div>

          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className={`pillar-card${pillar.title === 'Sacred Timing' ? ' pillar-card--timing' : ''}${
                  pillar.title === 'Daily Practice' ? ' pillar-card--practice' : ''
                }`}
              >
                <span className="pillar-card__icon" aria-hidden="true">
                  <PillarIcon icon={pillar.icon} />
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sacred-timing" className="landing-band">
        <div className="content-shell inquiry-layout">
          <div className="inquiry-copy">
            <p className="section-kicker">What You Can Ask</p>
            <h2>Bring the questions you would not hand to a generic feed.</h2>
            <p className="lead-copy">
              Mihira is built for people carrying real uncertainty: difficult decisions, emotional weight, and
              moments when better timing or deeper perspective would change how they move.
            </p>

            <ul className="inquiry-list">
              {inquiries.map((inquiry) => (
                <li key={inquiry}>
                  <span className="inquiry-list__bullet" aria-hidden="true">
                    ●
                  </span>
                  <span>{inquiry}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="quote-panel">
            <img
              alt="A close-up handwritten journal page with soft focus and archival texture"
              className="quote-panel__image"
              src="https://images.unsplash.com/photo-1559455348-3245e7c10709?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
            <div className="quote-panel__overlay">
              <blockquote>&quot;The point is not certainty. The point is steadier judgment.&quot;</blockquote>
              <p>The Mihira approach</p>
            </div>
          </aside>
        </div>
      </section>

      <section id="daily-practice" className="landing-band landing-band--accent">
        <div className="content-shell">
          <div className="section-heading section-heading--center">
            <p className="section-kicker">How It Works</p>
            <h2>A calm product flow that leads to something usable.</h2>
          </div>

          <div className="flow-grid">
            {flowSteps.map((step) => (
              <article key={step.number} className="flow-step">
                <span className="flow-step__number">{step.number}</span>
                <h3>
                  <strong>{step.verb}</strong>
                  <span>{step.title}</span>
                </h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="landing-band">
        <div className="content-shell content-shell--narrow">
          <div className="section-heading section-heading--center">
            <h2>Questions people ask before they trust Mihira.</h2>
          </div>

          <FAQList faqs={faqs} />
        </div>
      </section>

      <section className="landing-band landing-band--cta">
        <div className="final-cta final-cta--full">
          <div className="final-cta__frame">
            <div className="final-cta__shader" aria-hidden="true">
              <WebGLShader />
            </div>
            <div className="final-cta__panel">
              <div className="final-cta__content">
                <p className="section-kicker section-kicker--center">Start With Clearer Direction</p>
                <h2>Download Mihira and bring more clarity to what already matters.</h2>
                <p className="final-cta__copy">
                  Use Mihira for daily alignment, deeper questions, and better timing when the next step carries
                  real weight.
                </p>
                <div className="final-cta__availability">
                  <span className="final-cta__status" aria-hidden="true" />
                  <p>Available for iPhone and Android</p>
                </div>
                <div className="final-cta__actions">
                  <LiquidButton asChild className="rounded-full border border-white/15 text-white" size="xl">
                    <a href={appStoreUrl}>Download Mihira</a>
                  </LiquidButton>
                  <a className="button button--ghost" href="#daily-practice">
                    See How It Works
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <span className="site-logo">Mihira</span>
            <p>© 2026 Mihira. Scripture-grounded guidance for modern life.</p>
          </div>

          <div className="site-footer__links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <a href="mailto:founders@getmihira.com">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
