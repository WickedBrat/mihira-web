import Link from 'next/link';

const pillars = [
  {
    eyebrow: 'Guidance',
    title: 'Bring a real question. Leave with something usable.',
    body:
      'Mihira turns sacred texts into grounded guidance for duty, grief, family, purpose, money, and fear without theatrical mysticism or empty affirmations.',
  },
  {
    eyebrow: 'Sacred Timing',
    title: 'Time decisions with more care, not more noise.',
    body:
      'Describe an event, scan a date range, and receive clear windows with reasoning, warnings, and a sharper sense of what deserves patience.',
  },
  {
    eyebrow: 'Daily Practice',
    title: 'Make spiritual reflection part of ordinary life.',
    body:
      'Mihira is built to feel less like a content feed and more like a ritual: calm, deliberate, and anchored in meaning.',
  },
];

const steps = [
  'Ask a sincere question or describe a decision you need to time.',
  'Mihira retrieves relevant scripture and synthesizes it into plain language.',
  'You receive practical guidance, source citations, and a clear next step.',
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-noise" aria-hidden="true" />
      <section className="hero">
        <header className="topbar">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              ✦
            </span>
            <span className="brand-name">Mihira</span>
          </div>
          <nav className="topnav" aria-label="Primary">
            <Link href="#experience">Experience</Link>
            <Link href="#how-it-works">How it works</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Scripture-grounded guidance for modern life</p>
            <h1>Clarity for the questions that refuse to stay small.</h1>
            <p className="hero-body">
              Mihira blends sacred texts, reflective guidance, and auspicious timing into a mobile experience
              that feels intimate, calm, and useful when life gets noisy.
            </p>
            <div className="cta-row">
              <a className="primary-cta" href="mailto:founders@getmihira.com?subject=Mihira%20Waitlist">
                Join the waitlist
              </a>
              <a className="secondary-cta" href="mailto:founders@getmihira.com?subject=Mihira%20Demo">
                Request a demo
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Product preview">
            <div className="orbital-ring orbital-ring-a" />
            <div className="orbital-ring orbital-ring-b" />
            <div className="preview-panel">
              <div className="preview-meta">Live inside the Mihira app</div>
              <h2>“How do I hold ambition without becoming consumed by it?”</h2>
              <p>
                Mihira responds with cited passages, a clear synthesis, and one grounded next action instead of
                generic wellness advice.
              </p>
              <div className="preview-divider" />
              <div className="preview-foot">
                <span>Guidance</span>
                <span>Sacred Timing</span>
                <span>Daily Alignment</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="experience" className="pillars">
        <div className="section-head">
          <p className="eyebrow">What Mihira is</p>
          <h2>Not another horoscope toy. Not another chat wrapper.</h2>
          <p>
            Mihira is designed like a private, ceremonial layer over the questions people actually live with:
            relationships, vocation, fear, duty, grief, transitions, and timing.
          </p>
        </div>

        <div className="pillar-grid">
          {pillars.map((pillar) => (
            <article className="pillar-card" key={pillar.title}>
              <p className="pillar-eyebrow">{pillar.eyebrow}</p>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="process">
        <div className="process-card">
          <div className="section-head compact">
            <p className="eyebrow">How it works</p>
            <h2>A slower interface for better decisions.</h2>
          </div>
          <ol className="process-list">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="quote-card">
          <p className="quote-kicker">Design intent</p>
          <blockquote>
            Mihira is built to feel like quiet conviction: warm materials, deliberate pacing, and language that
            respects the weight of the question.
          </blockquote>
        </div>
      </section>

      <section className="closing-banner">
        <div>
          <p className="eyebrow">Launching on mobile first</p>
          <h2>Own the moment before you own the answer.</h2>
        </div>
        <div className="closing-links">
          <a href="mailto:founders@getmihira.com?subject=Mihira%20Access">Get early access</a>
          <Link href="/privacy">Read privacy</Link>
          <Link href="/terms">Read terms</Link>
        </div>
      </section>
    </main>
  );
}
