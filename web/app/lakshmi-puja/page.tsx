import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { PujaRequestForm } from '@/components/puja-request-form';
import { DIWALI_DATE_LABEL, getCity, lakshmiPujaFor } from '@/lib/diwali';

const depositUrl = process.env.NEXT_PUBLIC_STRIPE_PUJA_DEPOSIT_URL || null;
const videoUrl = process.env.NEXT_PUBLIC_STRIPE_PUJA_VIDEO_URL || null;

export const metadata: Metadata = {
  title: 'Pandit at Home for Lakshmi Puja, Diwali 2026 — New Jersey & NYC',
  description:
    'Book a pandit for Lakshmi Puja at your home on Sunday, November 8, 2026, inside the muhurat computed for your own address in New Jersey or New York. $251 all in, $51 deposit, refunded if we cannot confirm within 24 hours.',
  alternates: { canonical: '/lakshmi-puja' },
  openGraph: {
    title: 'A pandit at your home for Lakshmi Puja, inside your muhurat',
    description: 'Diwali 2026, New Jersey and NYC. Timing computed for your address. $251 all in.',
  },
};

const included = [
  ['Lakshmi–Ganesh puja with sankalpa in your family’s name', '60 to 75 minutes, the full vidhi: Ganesh, Kalash, Lakshmi, aarti.'],
  ['Timed to your address, not to India', 'The muhurat is computed for your own sunset and horizon. Most of New Jersey gets 5:04 to 6:53 PM ET.'],
  ['The samagri list a week ahead', 'A short list in English with what is optional. Nothing exotic; Patel Brothers and Amazon cover it.'],
  ['Explanation as it happens', 'In Hindi and English by default, so the kids and the in-laws both follow.'],
  ['Dakshina and travel included', '$251 all in. No envelope arithmetic at the door.'],
];

const steps = [
  ['Tell us where and when', 'Your town, the slot you want, and the language. Two minutes.'],
  ['We confirm within 24 hours', 'On WhatsApp or email, with the pandit’s name. The $51 deposit holds the slot; it is refunded in full if we cannot place someone.'],
  ['Sunday, November 8', 'The pandit arrives 20 minutes before your slot. The balance of $200 is paid after the puja, by card or cash.'],
];

const faq = [
  {
    q: 'Why does the window matter if we are in the US?',
    a: 'Lakshmi Puja is done in Pradosh Kaal, the first stretch of night after your sunset, while the fixed sign Vrishabha rises over your horizon. Both depend on where you stand. Convert a time from India and the puja lands in the morning. We compute it for your address.',
  },
  {
    q: 'We cannot do it inside the window. Is that a problem?',
    a: 'Pradosh Kaal as a whole is auspicious, so a slot up to about 7:30 PM ET is still right. Earlier in the evening is fine too when the family is travelling. Doing it with care counts for more than the minute.',
  },
  {
    q: 'Where do you cover?',
    a: 'At home: Middlesex, Somerset, Hudson, Bergen and Morris counties in New Jersey, plus Manhattan, Queens and Brooklyn. Outside that, choose the video option, which works anywhere in the US.',
  },
  {
    q: 'Which pandit comes?',
    a: 'A temple-trained pandit from the New Jersey or New York area. We confirm the name with you before you pay the balance. This is our first Diwali offering it, so we keep the number of homes small and the standard high.',
  },
  {
    q: 'What if you cannot find anyone for my slot?',
    a: 'You hear from us within 24 hours either way, and the deposit comes back in full. We would rather say no early than send someone at the wrong time.',
  },
];

export default function LakshmiPujaPage() {
  const edison = getCity('edison-nj')!;
  const jc = getCity('jersey-city-nj')!;
  const nyc = getCity('new-york-ny')!;
  const times = [edison, jc, nyc].map((c) => ({ name: c.name, ...lakshmiPujaFor(c.lat, c.lng) }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Pandit at home for Lakshmi Puja, Diwali 2026',
        provider: { '@type': 'Organization', name: 'Mihira', url: 'https://www.getmihira.com' },
        areaServed: ['New Jersey', 'New York City'],
        offers: [
          { '@type': 'Offer', name: 'Pandit at your home', price: '251', priceCurrency: 'USD' },
          { '@type': 'Offer', name: 'Guided on video', price: '71', priceCurrency: 'USD' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 md:px-12 md:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_10%,rgba(232,163,61,0.22),transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-[760px] flex-col gap-6">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8A33D]">Diwali · {DIWALI_DATE_LABEL} · New Jersey & NYC</span>
          <h1 className="max-w-[18ch] text-balance [font-family:var(--font-display)] text-[clamp(2.3rem,6vw,3.6rem)] font-medium leading-[1.08] text-[#F7F1E3]">
            A pandit at your home for Lakshmi Puja, inside your muhurat.
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.65] text-[#F2EAD9]/70">
            The family pandit is eight thousand miles away and the temple line is busy. We bring a pandit to your door on November 8, timed to your own sunset. You bring the family.
          </p>
          <dl className="grid gap-3 sm:grid-cols-3">
            {times.map((t) => (
              <div key={t.name} className="rounded-2xl border border-[#E8A33D]/20 bg-[#17120B] px-4 py-3">
                <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F2EAD9]/50">{t.name}</dt>
                <dd className="mt-1 text-[17px] font-semibold text-[#F7F1E3]">{t.pujaStart} – {t.pujaEnd} <span className="text-[13px] font-normal text-[#F2EAD9]/50">{t.tzAbbr}</span></dd>
              </div>
            ))}
          </dl>
          <p className="text-[14px] text-[#F2EAD9]/55">
            Somewhere else in the US? <Link href="/diwali" className="font-semibold text-[#E8A33D] underline underline-offset-4">Find your own window</Link>, then choose the video option below.
          </p>
        </div>
      </header>

      <section id="book" className="px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-[760px]">
          <PujaRequestForm depositUrl={depositUrl} videoUrl={videoUrl} />
        </div>
      </section>

      <section className="border-t border-[#E8A33D]/10 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.2rem)] font-medium text-[#F7F1E3]">What $251 covers</h2>
          <ul className="flex flex-col gap-4">
            {included.map(([t, d]) => (
              <li key={t} className="flex flex-col gap-1 border-l-2 border-[#E8A33D]/50 pl-4">
                <span className="text-[17px] font-semibold text-[#F7F1E3]">{t}</span>
                <span className="text-[15px] leading-[1.6] text-[#F2EAD9]/65">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#E8A33D]/10 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.2rem)] font-medium text-[#F7F1E3]">How it works</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex flex-col gap-2 rounded-2xl border border-[#F2EAD9]/[0.1] bg-[#17120B] p-5">
                <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#E8A33D]">Step {i + 1}</span>
                <span className="text-[16px] font-semibold text-[#F7F1E3]">{t}</span>
                <span className="text-[14px] leading-[1.6] text-[#F2EAD9]/65">{d}</span>
              </li>
            ))}
          </ol>
          <p className="text-[14px] leading-[1.6] text-[#F2EAD9]/50">
            Six in-window homes this year. We are keeping it small on purpose; the standard matters more than the count.
          </p>
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
            <a href="#book" className="font-semibold text-[#E8A33D] underline underline-offset-4">Request a pandit</a>
            {' · '}
            <Link href="/blog/diwali-2026-lakshmi-puja-muhurat-usa" className="underline underline-offset-4 hover:text-[#E8A33D]">Lakshmi Puja muhurat for 12 US cities</Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
