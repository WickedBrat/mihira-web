import type { Metadata } from 'next';
import { BlogContent } from '@/components/blog-layout';
import { FeaturePage } from '@/components/feature-page';
import type { BlogContentBlock } from '@/lib/blog-posts';

const configuredAppStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
const hasAppStoreUrl = Boolean(configuredAppStoreUrl);
const appStoreUrl = configuredAppStoreUrl || '#waitlist';

export const metadata: Metadata = {
  title: 'Daily Alignment — A Two-Minute Vedic Morning Practice',
  description:
    'Start the day with a short, personalized Vedic reading instead of thirty minutes of doomscrolling. Daily Alignment helps you decide where to place your energy before the day decides for you.',
  alternates: {
    canonical: '/daily-alignment',
  },
};

const content: BlogContentBlock[] = [
  { type: 'h2', text: 'A two-minute practice instead of a thirty-minute scroll' },
  {
    type: 'p',
    text: 'Daily Alignment is a short, personalized morning reading built around Vedic teaching — meant to take about as long as checking a notification, not as long as a meditation app session. The idea is not to add another obligation to a crowded morning; it is to replace the default first habit — reaching for a phone and scrolling — with something that actually orients the day instead of just filling the first few minutes of it.',
  },
  { type: 'h2', text: 'What makes a reading personalized' },
  {
    type: 'p',
    text: "Each reading draws on your birth details and stated preferences, along with the current day's relevant timing factors, to surface something specific rather than a generic affirmation. The goal is a reading that could plausibly only make sense for you, on that day — not a rotating quote that could apply to anyone.",
  },
  { type: 'h2', text: 'What it is not' },
  {
    type: 'list',
    items: [
      'Not a horoscope-style prediction about what will happen to you today',
      'Not a substitute for Ask Mihira when you have an actual question to bring',
      'Not designed to be read once and forgotten — the value compounds with consistency',
    ],
  },
  { type: 'h2', text: 'Why a daily rhythm matters more than any single reading' },
  {
    type: 'p',
    text: "Traditionally, this kind of orientation came from a morning ritual, a temple visit, or a family practice — something that happened often enough to shape how a day was approached, not just occasionally when things went wrong. Daily Alignment is built to restore that rhythm for people who no longer have easy access to the version of it their family used to practice, without requiring a physical ritual, a temple, or specific timing to perform correctly.",
  },
  {
    type: 'p',
    text: 'It is also the natural complement to the other two pieces of the practice: Ask Mihira, for the specific questions that come up, and Sacred Timing, for when a decision or undertaking needs a supportive window. Daily Alignment is the piece that runs in the background every day, so the other two are not the only moments this tradition shows up in your life.',
  },
];

export default function DailyAlignmentPage() {
  return (
    <FeaturePage
      kicker="Daily Alignment"
      h1="Start the day with direction, not a scroll."
      intro="A personalized two-minute morning reading, grounded in Vedic teaching, that helps you decide where to place your energy before the day decides for you."
      relatedPosts={[
        { href: '/blog/dharma-vs-ambition', label: 'Duty or Ambition? What the Gita Actually Says About the Tension' },
        { href: '/blog/grief-ritual-distance', label: 'Grief, Ritual, and Distance: Vedic Guidance for Life Far From Home' },
      ]}
      hasAppStoreUrl={hasAppStoreUrl}
      appStoreUrl={appStoreUrl}
    >
      <BlogContent blocks={content} />
    </FeaturePage>
  );
}
