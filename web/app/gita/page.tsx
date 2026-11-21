import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { GitaPreorder } from '@/components/gita-preorder';

const preorderUrl = process.env.NEXT_PUBLIC_STRIPE_GITA_PREORDER_URL || null;
const PRICE = '$29';

export const metadata: Metadata = {
  title: 'The Gita in 18 Days — one chapter a day, ending on Gita Jayanti',
  description:
    'An 18-day Bhagavad Gita course for Indian professionals in the US. One chapter, one verse and one real situation a day, 10 minutes, December 3 to Gita Jayanti on December 20, 2026. Pre-order $29.',
  alternates: { canonical: '/gita' },
  openGraph: {
    title: 'The Gita in 18 days',
    description: 'One chapter a day, 10 minutes, written for the decisions you actually face. Ends on Gita Jayanti, December 20, 2026.',
  },
};

const days: [string, string, string][] = [
  ['1', 'The day you freeze', 'Arjuna puts the bow down (1.28–47). Admitting you are stuck is where the Gita starts, not where it ends.'],
  ['2', 'What does not change when the title does', '2.47 and 2.14. Identity that survives a layoff, a visa letter, a bad quarter.'],
  ['3', 'Do the work in front of you', '3.21 and 3.35. Why the people you lead copy what you do, not what you say.'],
  ['4', 'Learn from those who have done it', '4.34. Finding a teacher when the elders are eight thousand miles away.'],
  ['5', 'Work hard, carry nothing', '5.10, the lotus leaf. Effort without the residue that keeps you up at 2 am.'],
  ['6', 'A mind you can rely on', '6.5 and 6.16–17. Lift yourself by yourself; moderation as a practice, not a mood.'],
  ['7', 'Seeing the whole', '7.3 and 7.19. What is actually in your control, and what you keep pretending is.'],
  ['8', 'What you would think of at the end', '8.5–7. Priorities, tested by the only deadline nobody negotiates.'],
  ['9', 'Small offerings, ordinary days', '9.26. A leaf, a flower, water. Devotion that fits a weekday.'],
  ['10', 'Where excellence shows up', '10.41. Recognising greatness in others without shrinking.'],
  ['11', 'The bigger picture', '11.32–33. Be the instrument. Scale, time, and your place in it.'],
  ['12', 'How to love without clinging', '12.13–19. The qualities of a steady partner, parent and friend.'],
  ['13', 'The field and the knower', '13.1–2. Separating what happens to you from who you are.'],
  ['14', 'Your three moods', '14.5–9. Sattva, rajas, tamas as a map of your week.'],
  ['15', 'Roots up', '15.1. The inverted tree: where you draw strength from when nothing around you is familiar.'],
  ['16', 'Two kinds of ambition', '16.1–3 and 16.21. Success that builds and success that eats you.'],
  ['17', 'What you eat, give and practise', '17.20. Faith shows up as habits. Three kinds of giving.'],
  ['18', 'Your call', '18.63. "Reflect on this fully, then do as you choose." Gita Jayanti.'],
];

const faq = [
  {
    q: 'Do I need the app?',
    a: 'No. Every day arrives by email at 6 AM your time, with the audio. The Mihira app on iPhone adds the audio player, saved reflections and a place to ask follow-up questions, and is included for the 18 days.',
  },
  {
    q: 'Whose translation is it?',
    a: 'The Sanskrit verse, with the public-domain English of Telang (1882) and Arnold (1885), checked line by line. The commentary is written by Mihira, in plain English, and reviewed by a person. Nothing in it claims to speak for Krishna.',
  },
  {
    q: 'What does "written for where you are" mean?',
    a: 'The four questions above choose which situation each verse is applied to: a performance review, a parent’s diagnosis, a marriage going quiet, a move. The verse and its meaning do not change. Where software helps shape an example, it says so.',
  },
  {
    q: 'I grew up with the Gita. Is this too basic?',
    a: 'It is a reading, not a lecture. If you studied it, you know eighteen chapters in eighteen days is a brisk pace, and that the fourth reading of 2.47 is not the same as the first.',
  },
  {
    q: 'What if I miss a day?',
    a: 'The emails stay in your inbox and the app keeps your place. Finishing on December 20 is the shape of the course, not a rule.',
  },
  {
    q: 'Refunds?',
    a: 'Full refund for any reason until the course starts on December 3. After that, write to help@getmihira.com and we will sort it out.',
  },
];

export default function GitaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Course',
        name: 'The Gita in 18 Days',
        description: 'An 18-day reading of the Bhagavad Gita, one chapter a day, for Indian professionals in the US. Ends on Gita Jayanti, December 20, 2026.',
        provider: { '@type': 'Organization', name: 'Mihira', url: 'https://www.getmihira.com' },
        offers: { '@type': 'Offer', price: '29', priceCurrency: 'USD', availability: 'https://schema.org/PreOrder' },
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', startDate: '2026-12-03', endDate: '2026-12-20' },
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
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8A33D]">December 3 → Gita Jayanti, Sunday, December 20, 2026</span>
          <h1 className="max-w-[16ch] text-balance [font-family:var(--font-display)] text-[clamp(2.3rem,6vw,3.6rem)] font-medium leading-[1.08] text-[#F7F1E3]">
            The Gita in 18 days. One chapter a day, for the life you are actually living.
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.65] text-[#F2EAD9]/70">
            Ten minutes every morning: one chapter, one verse to carry, the situation it meets this week, one question to sit with. Written for Indian professionals in the US who know the Gita matters and have never had the time, or the teacher, to read it through.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-[#F2EAD9]/65">
            <li>18 mornings, 10 minutes each</li>
            <li>Text and audio, by email and in the app</li>
            <li>Examples chosen for your stage of life</li>
            <li>Ends on Gita Jayanti</li>
          </ul>
        </div>
      </header>

      <section id="reserve" className="px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-[760px]">
          <GitaPreorder preorderUrl={preorderUrl} price={PRICE} />
        </div>
      </section>

      <section className="border-t border-[#E8A33D]/10 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.2rem)] font-medium text-[#F7F1E3]">Eighteen mornings</h2>
          <p className="text-[15px] leading-[1.6] text-[#F2EAD9]/65">
            Each day is one chapter. The verse is the anchor; the second line is the door it opens for a working adult in 2026.
          </p>
          <ol className="grid gap-3 sm:grid-cols-2">
            {days.map(([n, title, line]) => (
              <li key={n} className="flex gap-4 rounded-2xl border border-[#F2EAD9]/[0.1] bg-[#17120B] p-4">
                <span className="[font-family:var(--font-display)] text-[28px] leading-none text-[#E8A33D]">{n}</span>
                <span className="flex flex-col gap-1">
                  <span className="text-[16px] font-semibold text-[#F7F1E3]">{title}</span>
                  <span className="text-[14px] leading-[1.55] text-[#F2EAD9]/60">{line}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[#E8A33D]/10 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.2rem)] font-medium text-[#F7F1E3]">What a morning looks like</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['6:00 AM, your time', 'The email lands. The verse in Sanskrit and English, read aloud in eight minutes if you would rather listen.'],
              ['The situation', 'A page on what the verse says, then where it meets your week: the review you are dreading, the call to Lucknow, the house that is not yet a home.'],
              ['One question', 'Something to carry into the day. In the app you can write a line back and keep it; the Book of You fills in over the 18 days.'],
            ].map(([t, d]) => (
              <div key={t} className="flex flex-col gap-2 rounded-2xl border border-[#F2EAD9]/[0.1] bg-[#17120B] p-5">
                <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#E8A33D]">{t}</span>
                <span className="text-[14px] leading-[1.6] text-[#F2EAD9]/70">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E8A33D]/10 px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-[760px] flex-col gap-6">
          <h2 className="[font-family:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.2rem)] font-medium text-[#F7F1E3]">Questions people ask</h2>
          {faq.map((f) => (
            <div key={f.q} className="flex flex-col gap-2">
              <h3 className="text-[17px] font-semibold text-[#F7F1E3]">{f.q}</h3>
              <p className="text-[15px] leading-[1.65] text-[#F2EAD9]/70">{f.a}</p>
            </div>
          ))}
          <p className="text-[15px] text-[#F2EAD9]/70">
            <a href="#reserve" className="font-semibold text-[#E8A33D] underline underline-offset-4">Reserve your seat</a>
            {' · '}
            <Link href="/ask-mihira" className="underline underline-offset-4 hover:text-[#E8A33D]">Ask Mihira a question from the Gita today</Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
