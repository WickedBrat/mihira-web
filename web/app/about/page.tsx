import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogContent } from '@/components/blog-layout';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import type { BlogContentBlock } from '@/lib/blog-posts';

export const metadata: Metadata = {
  title: 'About Mihira',
  description:
    'Why Mihira exists, how its guidance is grounded in scripture rather than invented, and how it handles the sensitive data behind a question about duty, grief, or ambition.',
  alternates: {
    canonical: '/about',
  },
};

const content: BlogContentBlock[] = [
  { type: 'h2', text: 'Why Mihira exists' },
  {
    type: 'p',
    text: "Mihira started from a specific, unglamorous gap: a lot of people who grew up with easy access to a family astrologer, a neighborhood priest, or elders who could field a hard question no longer have any of that nearby. Moving for work or school does not remove the need for that kind of guidance — it just removes the infrastructure that used to provide it. Mihira is an attempt to rebuild the substance of that support, in a form that works for someone living far from where it originally came from.",
  },
  { type: 'h2', text: 'How guidance is grounded' },
  {
    type: 'p',
    text: 'Mihira draws on the Upanishads, the Puranas, the epics, broader Vedic teaching, and the commentary of later saints — not only the Bhagavad Gita, which is the most commonly cited but far from the only relevant source for most real questions. Answers are built to cite what they draw on, so a source can be checked rather than taken on faith. Mihira is a tool for bringing this tradition to a specific question, not a claim to any personal ordination, lineage, or scholarly authority beyond that.',
  },
  { type: 'h2', text: 'What Mihira is not' },
  {
    type: 'list',
    items: [
      'Not a substitute for a qualified priest, astrologer, therapist, physician, or financial advisor',
      'Not astrology entertainment, and not built around daily horoscope content',
      'Not a community platform — questions are private by default, not shared or shown to other users',
    ],
  },
  { type: 'h2', text: 'How your data is handled' },
  { type: 'h2', text: 'Reach the team' },
  {
    type: 'p',
    text: 'Mihira is a small, early-stage team. If you have feedback, a correction on a source, or a question about how something works, the fastest way to reach us is founders@getmihira.com.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0F0C08] text-[#F2EAD9]">
      <SiteNav />

      <div className="mx-auto w-full max-w-[720px] px-6 pb-24 pt-14 md:pt-20">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#E8A33D]">About</span>
        <h1 className="mt-3 [font-family:var(--font-display)] text-[clamp(2rem,4.4vw,2.75rem)] font-medium leading-[1.15] text-[#F7F1E3]">
          A steadier way to bring real questions to a tradition built to answer them.
        </h1>

        <div className="mt-10 flex flex-col gap-6">
          <BlogContent blocks={content.slice(0, 7)} />
          <p className="text-[16px] leading-[1.8] text-[#F2EAD9]/70">
            Birth details, spiritual preferences, and the questions you ask are treated as sensitive product data —
            used only to operate and improve Mihira, never sold. The full detail of what is collected and why is in
            the{' '}
            <Link className="text-[#E8A33D] underline underline-offset-2 hover:text-[#F0B454]" href="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
          <BlogContent blocks={content.slice(7)} />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
