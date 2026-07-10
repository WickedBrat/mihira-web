import type { Metadata } from 'next';
import { BlogContent } from '@/components/blog-layout';
import { FeaturePage } from '@/components/feature-page';
import type { BlogContentBlock } from '@/lib/blog-posts';

const configuredAppStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;
const hasAppStoreUrl = Boolean(configuredAppStoreUrl);
const appStoreUrl = configuredAppStoreUrl || '#waitlist';

export const metadata: Metadata = {
  title: 'Muhurat Finder — Sacred Timing App',
  description:
    'Find auspicious Vedic timing windows for weddings, launches, moves, and hard conversations. Describe your plan, scan a date range, and see the reasoning behind each muhurat.',
  alternates: {
    canonical: '/muhurat-finder',
  },
};

const content: BlogContentBlock[] = [
  { type: 'h2', text: 'What the Muhurat Finder does' },
  {
    type: 'p',
    text: "Sacred Timing — the Muhurat Finder inside Mihira — scans a date range you give it and surfaces the windows that are most supportive for what you're planning, based on the traditional layers Vedic timing looks at: the tithi (lunar day), nakshatra (lunar mansion), yoga and karana, weekday, and relevant planetary positions for the category of undertaking. Instead of returning a single time with no explanation, it shows the reasoning behind the recommendation, so you understand why a window was chosen and not just that it was.",
  },
  {
    type: 'p',
    text: "This is built for the situations where a family astrologer would traditionally be consulted, but where one is not available — moving to a new home, launching a business, signing a lease, starting a course of treatment, planning a proposal, or setting a date for a difficult but important conversation. Weddings remain the most elaborate use case and typically still benefit from a full consultation for the ceremony itself, but for the smaller, real decisions that come up constantly, a fast, reasoned timing check is often exactly what's missing.",
  },
  { type: 'h2', text: 'How it differs from a generic panchang app' },
  {
    type: 'p',
    text: 'A printed or digital panchang gives you the raw astronomical and astrological data for a given day — tithi, nakshatra, rahu kalam, and so on — but reading one well requires training most people do not have. Muhurat Finder does not just surface the raw data; it interprets it against the specific thing you are planning, weighs the relevant factors for that category of undertaking, and ranks the candidate windows in your date range accordingly, with the underlying reasoning shown rather than hidden behind a black-box score.',
  },
  { type: 'h2', text: 'What to expect when you describe a plan' },
  {
    type: 'list',
    items: [
      'A short description of what you are planning and the category it falls into',
      'A date range to scan — anywhere from a few days to a few months out',
      'A ranked set of supportive windows within that range, each with the specific factors that make it favorable',
      'The reasoning shown alongside the recommendation, not just a bare time',
    ],
  },
  { type: 'h2', text: 'Timing is context, not a verdict' },
  {
    type: 'p',
    text: 'Consistent with the traditional view this tool is built on, a supportive muhurat is one input among several, not a guarantee and not a substitute for preparation or judgment. It pairs naturally with Ask Mihira for the substance of a decision and Daily Alignment for staying oriented day to day — Sacred Timing answers "when," not "whether" or "why," and it is most useful used alongside both.',
  },
];

export default function MuhuratFinderPage() {
  return (
    <FeaturePage
      kicker="Sacred Timing"
      h1="Find the right window, not just a date."
      intro="Describe what you're planning and scan a date range for the most supportive muhurat — with the Vedic reasoning behind it shown, not hidden."
      relatedPosts={[
        { href: '/blog/what-is-a-muhurat', label: 'What Is a Muhurat, and Why Timing Still Matters' },
        {
          href: '/blog/decisions-without-an-astrologer',
          label: "How to Make a Big Decision When There's No Astrologer to Call",
        },
      ]}
      hasAppStoreUrl={hasAppStoreUrl}
      appStoreUrl={appStoreUrl}
    >
      <BlogContent blocks={content} />
    </FeaturePage>
  );
}
