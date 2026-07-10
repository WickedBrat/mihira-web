export type BlogContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] };

export type RelatedFeature = { href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  kicker: string;
  publishedAt: string;
  readTime: string;
  excerpt: string;
  content: BlogContentBlock[];
  relatedFeatures: RelatedFeature[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'what-is-a-muhurat',
    title: 'What Is a Muhurat, and Why Timing Still Matters',
    seoTitle: 'What Is a Muhurat? Vedic Timing Explained',
    description:
      'A muhurat is a Vedic auspicious-timing window for starting something important. Here is what it actually means, how it is chosen, and why timing still matters today.',
    kicker: 'Sacred Timing',
    publishedAt: '2026-06-02',
    readTime: '7 min read',
    excerpt:
      'A muhurat is not superstition — it is a structured way of asking "is this a good moment to begin?" Here is what the tradition actually says, and how to use it without an astrologer on call.',
    relatedFeatures: [
      { href: '/muhurat-finder', label: 'Try the Muhurat Finder' },
      { href: '/ask-mihira', label: 'Ask Mihira a related question' },
      { href: '/daily-alignment', label: 'Start a Daily Alignment reading' },
    ],
    content: [
      {
        type: 'p',
        text: "If you grew up around Indian weddings, you have probably heard someone say the ceremony has to start at a specific, oddly precise time — 10:47 in the morning, not 11:00. That instruction almost always traces back to a muhurat: a window of time considered favorable for beginning something significant. Weddings are the most visible example, but the same logic has traditionally been applied to housewarmings, launching a business, signing a contract, starting a journey, or even having a difficult conversation.",
      },
      {
        type: 'p',
        text: 'For a lot of people outside that tradition — and for a lot of people raised inside it but now living away from the family members who used to handle this — the whole idea can feel like an opaque ritual performed by someone else on your behalf. You get a date and a time. Nobody tells you why. This piece is about the "why," and about what it actually takes to find a good window yourself.',
      },
      { type: 'h2', text: 'The idea underneath the ritual' },
      {
        type: 'p',
        text: "Vedic timekeeping treats time as textured, not uniform. A minute at dawn is not treated as functionally identical to a minute at midnight, and a day influenced by a particular lunar phase is not treated as identical to a day a few weeks later. Muhurat calculation looks at several layers at once: the tithi (lunar day), the nakshatra (the lunar mansion the moon is transiting), the yoga and karana (combined solar-lunar factors), and the vara (weekday), along with planetary positions relevant to the specific undertaking. A 'good' muhurat is a window where enough of these layers align in a supportive direction for what you are about to do.",
      },
      {
        type: 'p',
        text: "This is a different claim than 'the stars control your fate.' The traditional framing is closer to: some conditions make an undertaking easier to sustain, and some make it harder, and paying attention to timing is one input among several — alongside preparation, intention, and effort — not a replacement for any of them.",
      },
      { type: 'h2', text: 'Why timing advice used to be easy to get, and now is not' },
      {
        type: 'p',
        text: "For most of this tradition's history, you did not calculate a muhurat yourself. A family priest or a trusted local astrologer did it, using a printed panchang (a Vedic almanac) and their own training. That worked well when the person doing the calculation lived down the street, knew your family, and could be asked a follow-up question over tea.",
      },
      {
        type: 'p',
        text: "That arrangement breaks down for a lot of people today — not because the tradition stopped mattering to them, but because the infrastructure around it did not travel. If you moved from Chennai to Toronto, or from Delhi to the Bay Area, the priest who used to handle this for your family is not a phone call away, and the panchang itself is dense enough that reading one cold is genuinely difficult without training.",
      },
      {
        type: 'quote',
        text: 'The tradition did not get less relevant when people moved. The support system around it just did not come with them.',
      },
      { type: 'h2', text: 'What actually goes into a good muhurat check' },
      {
        type: 'p',
        text: 'A useful timing check for a real decision — not a wedding requiring a priest and a full ceremony calendar, but something like "should I sign this lease Thursday or Friday," or "is this a good week to have this conversation" — generally wants to look at a few things in combination rather than any single factor in isolation:',
      },
      {
        type: 'list',
        items: [
          'The category of the undertaking (travel, contracts, relationships, and health each have somewhat different traditional emphases)',
          'The lunar day and whether it favors beginnings or completions',
          'Whether any widely avoided periods fall in the window (certain inauspicious intervals are avoided by convention across most regional traditions)',
          'The broader astrological picture for the days under consideration, not just the single moment',
        ],
      },
      {
        type: 'p',
        text: "This is precisely the kind of layered lookup that is easy for a trained astrologer and difficult for almost everyone else — which is the gap Mihira's Sacred Timing tool is built to close. You describe what you are planning and the date range you are working with, and it scans for the most supportive windows and shows the reasoning behind the recommendation, rather than handing you a time with no explanation.",
      },
      { type: 'h2', text: 'Timing is an input, not a substitute for judgment' },
      {
        type: 'p',
        text: 'It is worth being direct about what this is not. A supportive muhurat does not guarantee a good outcome, and an inconvenient one does not doom an undertaking. The traditional view has always paired timing with effort, preparation, and right conduct — it was never meant to stand in for any of those. Treat it the way you would treat any other input to a decision: useful context, not an oracle.',
      },
      {
        type: 'p',
        text: "If this is the first time you have looked closely at how muhurat calculation actually works, the practical next step is simple: pick something you are already planning — a move, a launch, a hard conversation — and run it through Mihira's Muhurat Finder to see the reasoning for yourself, alongside a daily reading in Daily Alignment and scripture-grounded guidance in Ask Mihira for the decision itself, not just its timing.",
      },
    ],
  },
  {
    slug: 'decisions-without-an-astrologer',
    title: "How to Make a Big Decision When There's No Astrologer to Call",
    seoTitle: 'Big Decisions Without an Astrologer On Call',
    description:
      'For the diaspora, the family astrologer or priest who used to help with big decisions is rarely nearby. Here is how to rebuild that kind of steadier decision-making on your own.',
    kicker: 'Diaspora Life',
    publishedAt: '2026-06-16',
    readTime: '8 min read',
    excerpt:
      'When you move away from the people who used to help you think through big decisions, you do not just lose convenience — you lose a whole decision-making structure. Here is how to rebuild it.',
    relatedFeatures: [
      { href: '/ask-mihira', label: 'Bring your question to Ask Mihira' },
      { href: '/muhurat-finder', label: 'Check timing with the Muhurat Finder' },
      { href: '/daily-alignment', label: 'Build a Daily Alignment habit' },
    ],
    content: [
      {
        type: 'p',
        text: "There is a specific kind of loneliness that shows up around big decisions — not the everyday kind, but the ones that actually reroute a life. Whether to take the job that would disappoint your parents. Whether to leave the relationship. Whether to move again, or finally stop moving. Growing up, a lot of people had somewhere to take questions like that: an astrologer the family trusted, a priest at the local temple, an elder who had seen enough of life to offer perspective. Move to a new country, and that entire support structure usually does not come with you.",
      },
      {
        type: 'p',
        text: 'This is not really about missing a service. It is about missing a way of thinking something through that is slower and steadier than a group chat, and more grounded than a generic productivity framework built for optimizing a calendar rather than sitting with a hard question.',
      },
      { type: 'h2', text: 'What the old structure was actually doing for you' },
      {
        type: 'p',
        text: 'It is worth naming what that support system actually provided, because most replacements miss the point entirely. It was rarely about getting a definitive answer. A good astrologer or elder was not handing down a verdict — they were offering a frame: relevant scripture or precedent, a sense of timing, and permission to sit with ambiguity instead of forcing a premature resolution. The value was in the process of being walked through the question, not in outsourcing the decision itself.',
      },
      {
        type: 'p',
        text: "That is a meaningfully different thing from what most people substitute in its place — a friend who means well but has no grounding in the tradition you grew up with, or a search engine that returns either dry academic summaries of scripture or, at the other extreme, horoscope-column content with no substance behind it.",
      },
      { type: 'h2', text: 'Three things worth rebuilding deliberately' },
      {
        type: 'list',
        items: [
          "A source of grounded perspective — something that can bring the Gita, the Upanishads, or relevant teaching to a specific question, with a citation you can actually check, not a vague paraphrase",
          'A daily rhythm — a short, consistent practice that keeps you oriented day to day, so big decisions are not the only moments you engage with any of this',
          'A sense of timing — a way to ask "is this a good window to act," even when there is no local priest to consult a panchang for you',
        ],
      },
      {
        type: 'p',
        text: "These three map fairly directly onto Ask Mihira, Daily Alignment, and Sacred Timing. That is not a coincidence — the product was built around the actual shape of what was missing, not around a generic wellness-app feature list. Ask Mihira exists for the first one: bring a real question — duty, a relationship, ambition, grief — and get guidance grounded in the wider canon (Upanishads, Puranas, the epics, and the saints' commentary, not just the Gita), with sources cited and one clear practice to try, rather than a mystical-sounding non-answer.",
      },
      { type: 'h2', text: 'A framework for the decision itself' },
      {
        type: 'p',
        text: 'When there is no elder to walk you through it, a simple structure helps more than it sounds like it would. Before consulting anything else, try answering three questions in writing:',
      },
      {
        type: 'list',
        items: [
          'What is actually at stake, separated from what you are afraid other people will think',
          'Which of your obligations (to yourself, to family, to work) are genuinely in tension here, versus just feeling that way',
          'What you would tell a friend in your exact position, with none of your attachment to the outcome',
        ],
      },
      {
        type: 'quote',
        text: 'A famous line from the Gita puts it plainly: you have a right to your actions, never to their fruits. That reframing alone — focus on right action, release the grip on the outcome — is often more useful than any single piece of advice.',
        attribution: 'Bhagavad Gita 2.47 (paraphrased)',
      },
      {
        type: 'p',
        text: 'Once you have that written down, that is the right moment to bring the question to something like Ask Mihira — not as a replacement for your own thinking, but as the equivalent of the conversation you would have had with someone who had both distance from your situation and depth in the tradition.',
      },
      { type: 'h2', text: 'Timing still matters, even for practical decisions' },
      {
        type: 'p',
        text: "It is easy to assume timing only matters for weddings. In practice, plenty of people quietly wonder whether this week or next is the better one to hand in notice, sign a lease, or have a difficult conversation with a parent. There is no obligation to treat that as make-or-break, but there is also no reason to ignore it just because there is no family astrologer around to ask. That is exactly what Sacred Timing is for — describe what you are planning, scan a date range, and see the reasoning behind the recommended window.",
      },
      {
        type: 'p',
        text: "None of this replaces the value of a real elder, a real priest, or a real conversation with someone who knows you well, if you have access to one. What it does is close the gap for the days when you do not — which, for a lot of the diaspora, is most days.",
      },
    ],
  },
  {
    slug: 'dharma-vs-ambition',
    title: 'Duty or Ambition? What the Gita Actually Says About the Tension',
    seoTitle: 'Dharma vs. Ambition: What the Gita Says',
    description:
      "Torn between what you're supposed to do and what you want to do? The Bhagavad Gita's teaching on dharma is more useful here than the usual \"follow your passion\" advice.",
    kicker: 'Guidance',
    publishedAt: '2026-06-30',
    readTime: '7 min read',
    excerpt:
      'Career advice tells you to follow your ambition. Family expectation tells you to honor your duty. The Gita frames the question itself differently — and that reframing is the useful part.',
    relatedFeatures: [
      { href: '/ask-mihira', label: 'Ask Mihira about your situation' },
      { href: '/daily-alignment', label: 'Start a Daily Alignment reading' },
    ],
    content: [
      {
        type: 'p',
        text: 'Take the job that pays more but pulls you away from your family, or stay close and take the safer path. Pursue the thing you actually want, or the thing that is expected of you. Most modern career advice resolves this in one direction — follow your ambition, your passion, your own path — while a lot of family pressure resolves it in the other: duty, responsibility, what is owed to the people who raised you.',
      },
      {
        type: 'p',
        text: 'The Bhagavad Gita is often summarized as being about duty over desire, which makes it sound like it simply sides with the family-expectation side of that argument. That summary misses the actual structure of the teaching, and the structure is the useful part.',
      },
      { type: 'h2', text: 'The setting the teaching is embedded in' },
      {
        type: 'p',
        text: "The Gita opens with Arjuna, a warrior, standing on a battlefield he is obligated to fight on, looking at relatives and teachers on the opposing side and losing the will to act at all. His crisis is not that he does not know his duty — he knows exactly what is expected of him. His crisis is that knowing his duty is not enough to make acting on it feel bearable. That is a very different starting point from 'should I follow my passion or my obligations,' and it is closer to a feeling a lot of people actually have: knowing the responsible thing to do and still feeling paralyzed about doing it.",
      },
      {
        type: 'p',
        text: "Krishna's response is not 'stop thinking and just do your duty.' It is a layered argument about the nature of action itself, and the most quoted piece of it reframes the entire question: you have a right to your actions, never to their fruits — so let go of attachment to outcomes, and act well anyway (Bhagavad Gita 2.47). That single reframe does more work than it looks like at first. It does not resolve duty versus ambition by picking a side. It changes what you are optimizing for.",
      },
      { type: 'h2', text: 'Dharma is not the same as obligation' },
      {
        type: 'p',
        text: "A common mistranslation treats dharma as simply meaning duty in the narrow sense of 'what people expect of you.' The concept is closer to 'the right action for who you actually are, in the situation you are actually in' — which includes your talents, your role, and your circumstances, not only external expectation. The Gita's own famous line on this point is blunt: it is better to do your own dharma imperfectly than another's dharma well (Bhagavad Gita 3.35). That is not an argument for obedience to family expectation over personal ambition. It is an argument against performing a life that is not actually yours, whichever direction the pressure to perform it is coming from.",
      },
      {
        type: 'quote',
        text: 'Better one’s own duty, though imperfectly performed, than the duty of another well performed.',
        attribution: 'Bhagavad Gita 3.35 (paraphrased)',
      },
      { type: 'h2', text: 'What this actually gives you when the choice is in front of you' },
      {
        type: 'p',
        text: "Applied to a real decision — the safer job near family versus the ambitious one far away, say — the teaching does not hand you an answer. It changes two things about how you approach the question. First, it asks you to separate the decision from your grip on how it turns out: choose based on what is actually right for you to do, not based on guaranteeing a particular result, because the result was never fully yours to control anyway. Second, it asks whether either option is actually dharma for you specifically, or whether both are someone else's script — the ambition script handed to you by career culture, or the duty script handed to you by family expectation — with your own read on the situation missing from both.",
      },
      {
        type: 'list',
        items: [
          'Notice which option you are drawn to out of fear of judgment, versus genuine fit',
          'Ask what you would choose if you were certain no one would find out either way',
          'Separate the decision itself from your attachment to how it is received',
        ],
      },
      {
        type: 'p',
        text: "This is exactly the kind of question Ask Mihira is built for — not a yes/no verdict, but scripture-grounded reasoning applied to the actual shape of your situation, with the sources cited so you can check them yourself rather than take a stranger's paraphrase on faith. Pair it with a Daily Alignment reading in the weeks you are actually deciding, so the question does not just get resolved once and then forgotten under the next wave of pressure.",
      },
    ],
  },
  {
    slug: 'grief-ritual-distance',
    title: 'Grief, Ritual, and Distance: Vedic Guidance for Life Far From Home',
    seoTitle: 'Grief and Vedic Ritual When Living Abroad',
    description:
      'Vedic tradition treats grief with specific rituals and timing. Here is what that framework offers when you are grieving far from the temple, priest, or family who would normally guide you through it.',
    kicker: 'Diaspora Life',
    publishedAt: '2026-07-08',
    readTime: '8 min read',
    excerpt:
      "Losing someone is hard enough. Losing them without the ritual structure your family would normally lean on adds a second, quieter loss. Here is what that structure was for, and how to hold onto its substance from a distance.",
    relatedFeatures: [
      { href: '/ask-mihira', label: 'Bring your grief question to Ask Mihira' },
      { href: '/muhurat-finder', label: 'Time an observance with the Muhurat Finder' },
      { href: '/daily-alignment', label: 'Ground each day with Daily Alignment' },
    ],
    content: [
      {
        type: 'p',
        text: "When someone dies in a family with Vedic roots, there is usually a structure waiting to receive the grief: specific rites at specific intervals, a priest who knows the sequence, relatives who show up because they know what is expected of them without being asked. Living away from that — in a city where none of it is close by, where you might be the only person in your building who even knows what a shraddha ceremony is — does not remove the grief. It removes the container the grief was supposed to sit inside.",
      },
      {
        type: 'p',
        text: 'That is a real, specific loss on top of the loss of the person, and it rarely gets named directly. This piece is about naming it, and about what is actually possible to preserve when the full traditional structure is not.',
      },
      { type: 'h2', text: 'What the traditional structure was doing' },
      {
        type: 'p',
        text: "Vedic mourning practice is built around timed rituals rather than a single funeral — most visibly the antyeshti (the last rites themselves) and the shraddha rites that follow at specified intervals, traditionally including one around the thirteenth day and annual observances afterward. The specifics vary by region and family tradition, but the underlying logic is consistent: grief is not treated as a single event to get through, but as a process that unfolds over a defined period, with the community showing up at defined points rather than only once, at the funeral, and then leaving the grieving person alone with it.",
      },
      {
        type: 'p',
        text: 'That staged structure does real psychological work, independent of anyone\'s specific beliefs about the rites themselves. It gives grief a shape and a known ending point, rather than leaving it open-ended and formless. It also gives other people a script for showing up — they know that the thirteenth day matters, so they call, or visit, or send something, at a moment when the person grieving might otherwise assume everyone has already moved on.',
      },
      { type: 'h2', text: 'What actually gets lost with distance, and what does not have to' },
      {
        type: 'p',
        text: 'Living far from a temple or a family priest usually means the literal rites are hard or impossible to perform in full. What does not have to be lost is the underlying logic: marking time deliberately, returning to the loss at intervals rather than pretending a single day resolves it, and having somewhere to bring the specific, unresolved questions grief tends to produce — not "how do I feel better," but the harder ones. What do I owe someone who is gone. Whether I said what needed saying. What happens to a relationship when one side of it ends.',
      },
      {
        type: 'quote',
        text: 'The Isha Upanishad opens by asking how to live fully while accepting impermanence — not by resolving the tension, but by holding both at once.',
      },
      {
        type: 'p',
        text: "These are the kinds of questions Ask Mihira is built to sit with — bringing the Upanishads, the epics, and the saints' commentary to a grief question specifically, rather than generic comfort language, with sources cited so the guidance can be checked rather than taken on faith. A Daily Alignment reading in the weeks after a loss can also stand in, in a small way, for the community check-ins the traditional structure used to guarantee — a reason to pause and orient once a day, rather than white-knuckling through it alone.",
      },
      { type: 'h2', text: 'On timing, for those who want it' },
      {
        type: 'p',
        text: "For families who do want to observe specific rites — a thirteenth-day observance, an annual shraddha — even from a distance, timing still matters in the traditional framework, and Sacred Timing can help identify the right dates based on the details of the loss, the same way it would for any other significant undertaking. It will not replace a priest who has performed the rite hundreds of times, but for anyone without access to one, it closes some of that gap rather than leaving the question unanswered entirely.",
      },
      {
        type: 'p',
        text: 'None of this makes the distance from home smaller. What it can do is keep the substance of a structure that was built, across a very long time, specifically to help people carry this — even when the exact form it used to take is no longer available to you.',
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
