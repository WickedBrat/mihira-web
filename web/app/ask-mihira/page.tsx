import type { Metadata } from 'next';
import { BlogContent } from '@/components/blog-layout';
import { FeaturePage } from '@/components/feature-page';
import type { BlogContentBlock } from '@/lib/blog-posts';

const configuredAppStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
const hasAppStoreUrl = Boolean(configuredAppStoreUrl);
const appStoreUrl = configuredAppStoreUrl || '#waitlist';

export const metadata: Metadata = {
  title: 'Ask Mihira — Scripture-Grounded Guidance for Real Questions',
  description:
    'Bring a real question about duty, relationships, ambition, or grief and get guidance grounded in the Upanishads, Puranas, the epics, and the Gita — with sources cited and one clear practice.',
  alternates: {
    canonical: '/ask-mihira',
  },
};

const content: BlogContentBlock[] = [
  { type: 'h2', text: 'Bring a real question, not a trivia prompt' },
  {
    type: 'p',
    text: 'Ask Mihira is built for the questions that actually keep people up at night — whether to take a job that would disappoint family, how to think about a relationship that has run its course, what to do with ambition that conflicts with obligation, how to sit with a loss that has no clear resolution. It is not built for horoscope-style trivia, and it will not give you a vague, feel-good non-answer designed to apply to anyone.',
  },
  { type: 'h2', text: 'Grounded in more than the Gita' },
  {
    type: 'p',
    text: "Most apps in this space lean entirely on the Bhagavad Gita, because it's the most widely known text and the easiest to pull a single verse from. Ask Mihira draws on the wider canon — the Upanishads, the Puranas, the epics, broader Vedic teaching, and the commentary of later saints — because most real questions do not fit inside one text's frame, and a single Gita quote is often not enough to actually reason through a specific, personal situation.",
  },
  { type: 'h2', text: 'Sources cited, not just claimed' },
  {
    type: 'p',
    text: "Every answer is expected to point to what it's drawing on, so you can check it yourself rather than take a stranger's paraphrase — or a chatbot's confident-sounding but unsourced summary — on faith. That matters more here than in most categories: guidance about duty, grief, and major decisions is exactly the kind of content where unverifiable, unsourced answers can do real harm if taken at face value.",
  },
  { type: 'h2', text: 'One clear practice, not just reflection' },
  {
    type: 'p',
    text: "Every answer is built to end in something usable — a clearer way to frame the decision, a specific practice to try, a next step — rather than stopping at philosophical reflection. The tradition this draws on was never meant to be purely contemplative; dharma is about right action, and guidance that does not point toward action is only doing half the job.",
  },
  { type: 'h2', text: 'Private by default' },
  {
    type: 'list',
    items: [
      'No community feed — your questions are not shared or shown to other users',
      'Birth details, preferences, and questions are treated as sensitive product data',
      'No selling of personal data, and no judgment attached to what you ask',
    ],
  },
  {
    type: 'p',
    text: 'Pair Ask Mihira with a Daily Alignment reading to stay oriented between the moments you have an explicit question, and with Sacred Timing when the question is not just what to do, but when to do it.',
  },
];

export default function AskMihiraPage() {
  return (
    <FeaturePage
      kicker="Ask Mihira"
      h1="Guidance for the questions you don't ask lightly."
      intro="Bring a real question — duty, relationships, ambition, grief — and get scripture-grounded guidance with sources cited and one clear practice for today."
      relatedPosts={[
        { href: '/blog/dharma-vs-ambition', label: 'Duty or Ambition? What the Gita Actually Says About the Tension' },
        {
          href: '/blog/decisions-without-an-astrologer',
          label: "How to Make a Big Decision When There's No Astrologer to Call",
        },
        { href: '/blog/grief-ritual-distance', label: 'Grief, Ritual, and Distance: Vedic Guidance for Life Far From Home' },
      ]}
      hasAppStoreUrl={hasAppStoreUrl}
      appStoreUrl={appStoreUrl}
    >
      <BlogContent blocks={content} />
    </FeaturePage>
  );
}
