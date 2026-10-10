import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { DiwaliLookup } from '@/components/diwali-lookup';
import { DiwaliTable } from '@/components/diwali-table';
import { DIWALI_DATE_LABEL } from '@/lib/diwali';

const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/us/app/mihira/id6785519525';

export const metadata: Metadata = {
  title: 'Diwali 2026 Lakshmi Puja Time for Your US City',
  description:
    'Type your city and get the Lakshmi Puja muhurat for Sunday, November 8, 2026, worked out for your own sunset. It is not converted from India time. Covers every US city.',
  alternates: { canonical: '/diwali' },
  openGraph: {
    title: 'What time is Lakshmi Puja in your city?',
    description: 'Diwali 2026 puja windows computed for your local sunset, for every US city.',
  },
};

const faq = [
  {
    q: 'When is Lakshmi Puja in the US in 2026?',
    a: 'Sunday, November 8, 2026. Amavasya covers that evening across the continental US, so the puja is on the 8th everywhere from New Jersey to California.',
  },
  {
    q: 'Why can’t I just convert the time from India?',
    a: 'The muhurat is built from your local sunset and from when the fixed sign Vrishabha (Taurus) rises over your horizon. Both depend on where you are. A converted IST time lands at the wrong part of the day, often the morning.',
  },
  {
    q: 'How is the window calculated?',
    a: 'It is the overlap of Pradosh Kaal (the first fifth of the night after your sunset) and Vrishabha lagna, on Amavasya, using the Lahiri ayanamsha. Most US cities get a window of about 1 hour 45 minutes, starting roughly 20 minutes after sunset.',
  },
  {
    q: 'What if I can’t do the puja inside the window?',
    a: 'Pradosh Kaal as a whole is still considered auspicious for Lakshmi Puja. If work or travel gets in the way, do it calmly within Pradosh. Doing it with care counts for more than hitting the minute.',
  },
];

export default function DiwaliPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 md:px-12 md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_10%,rgba(232,163,61,0.22),transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[760px] flex-col gap-6">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8A33D]">Diwali · {DIWALI_DATE_LABEL}</span>
          <h1 className="max-w-[18ch] text-balance [font-family:var(--font-display)] text-[clamp(2.3rem,6vw,3.6rem)] font-medium leading-[1.08] text-[#F7F1E3]">
            What time is Lakshmi Puja where you live?
          </h1>
          <p className="max-w-[580px] text-lg leading-[1.65] text-[#F2EAD9]/70">
            Every year someone in the family group converts the muhurat from IST, and the puja ends up planned for the morning. Type your city and we&rsquo;ll work out the window from your own sunset.
          </p>
          <DiwaliLookup appStoreUrl={appStoreUrl} />
        </div>
      </header>

      <section className="border-t border-[#E8A33D]/10 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-5">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.2rem)] font-medium text-[#F7F1E3]">Lakshmi Puja muhurat by city</h2>
          <p className="text-[15px] leading-[1.6] text-[#F2EAD9]/65">All times are local standard time (daylight saving ends November 1). Boston and Atlanta are both on Eastern time, but their windows start more than an hour apart.</p>
          <DiwaliTable />
        </div>
      </section>

      <section className="border-t border-[#E8A33D]/10 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.2rem)] font-medium text-[#F7F1E3]">Questions families ask</h2>
          {faq.map((f) => (
            <div key={f.q} className="flex flex-col gap-2">
              <h3 className="text-[17px] font-semibold text-[#F7F1E3]">{f.q}</h3>
              <p className="text-[15px] leading-[1.65] text-[#F2EAD9]/70">{f.a}</p>
            </div>
          ))}
          <p className="text-[15px] text-[#F2EAD9]/70">
            Want all five days on US dates? Read{' '}
            <Link href="/blog/diwali-2026-dates-usa" className="font-semibold text-[#E8A33D] underline underline-offset-4">Diwali 2026 on US dates</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
