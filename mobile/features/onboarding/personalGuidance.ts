import type { OnboardingData } from '@/lib/onboardingStore';

type GuidanceTheme = 'decision' | 'pressure' | 'restless' | 'roots' | 'purpose' | 'burnout' | 'default';

export interface ScriptureGuidance {
  theme: GuidanceTheme;
  hearing: string;
  reference: string;
  anchor: string;
  action: string;
}

export interface DailyGuidancePreview {
  area: string;
  time: string;
  action: string;
  suggestion: string;
  reference: string;
  accent: 'gold' | 'saffron' | 'muted';
}

function haystack(data: OnboardingData, question = '') {
  return [
    ...data.painPoints,
    ...data.guidanceContext,
    ...data.supportTypes,
    data.firstQuestion,
    question,
  ].join(' ').toLowerCase();
}

export function getGuidanceTheme(data: OnboardingData, question = ''): GuidanceTheme {
  const text = haystack(data, question);

  if (/(decision|overthink|timing|uncertain|what should|next)/.test(text)) return 'decision';
  if (/(pressure|stress|urgent|heavy|handle)/.test(text)) return 'pressure';
  if (/(restless|mind|settle|anxious|noise|calm)/.test(text)) return 'restless';
  if (/(root|home|tradition|practice|disconnected|far from)/.test(text)) return 'roots';
  if (/(purpose|path|direction|own way|meaning)/.test(text)) return 'purpose';
  if (/(burnout|burned|career|work|tired|drained)/.test(text)) return 'burnout';

  return 'default';
}

export function getScriptureGuidance(data: OnboardingData, question = ''): ScriptureGuidance {
  const theme = getGuidanceTheme(data, question);

  switch (theme) {
    case 'decision':
      return {
        theme,
        hearing: 'You are not only asking for an answer. You are asking for steadiness before you act.',
        reference: 'Bhagavad Gita 2.47-2.48',
        anchor: 'The Gita keeps your attention on the action that is yours, and on the evenness needed before the result is known.',
        action: 'Choose one next action that does not require anyone else to approve it. Let the final outcome stay outside today\'s grip.',
      };
    case 'pressure':
      return {
        theme,
        hearing: 'The pressure is making everything feel urgent. Mihira will help you separate urgency from true timing.',
        reference: 'Bhagavad Gita 2.48',
        anchor: 'Krishna points Arjuna toward evenness in success and failure before action, not after life becomes easy.',
        action: 'Delay the most reactive choice. Take the step that would still feel clean if no one praised it.',
      };
    case 'restless':
      return {
        theme,
        hearing: 'Your mind wants relief, but it may be asking for a repeatable return rather than one perfect answer.',
        reference: 'Bhagavad Gita 6.26; Yoga Sutras 1.12',
        anchor: 'Both texts treat steadiness as practice: the mind wanders, and you return it without making the wandering a failure.',
        action: 'Give yourself one quiet window today. When the mind runs ahead, bring it back to the next breath and the next task.',
      };
    case 'roots':
      return {
        theme,
        hearing: 'You are looking for guidance that respects where you come from without trapping you in old expectations.',
        reference: 'Yoga Sutras 2.1; Bhagavad Gita 12.13-14',
        anchor: 'The texts turn practice into discipline, self-study, devotion, compassion, and steadiness in real relationships.',
        action: 'Choose one small ritual you can keep privately. Let it reconnect you without needing to perform your faith for anyone.',
      };
    case 'purpose':
      return {
        theme,
        hearing: 'You are searching for direction, but the path may clarify through honest action before it clarifies as certainty.',
        reference: 'Bhagavad Gita 2.47; Yoga Sutras 2.1',
        anchor: 'The work begins with action, self-study, discipline, and surrender rather than waiting for total confidence.',
        action: 'Name the duty that is already obvious. Do that first, then revisit the bigger question with a quieter mind.',
      };
    case 'burnout':
      return {
        theme,
        hearing: 'You may not need more intensity. You may need a rhythm that helps you recover agency without self-pressure.',
        reference: 'Bhagavad Gita 6.5; Yoga Sutras 1.12',
        anchor: 'The texts pair self-lifting with practice and release, so discipline does not become another form of exhaustion.',
        action: 'Protect one low-friction practice today. Keep it small enough that it restores trust in yourself.',
      };
    default:
      return {
        theme,
        hearing: 'You are asking Mihira to listen before it advises. That is a good starting point.',
        reference: 'Bhagavad Gita 2.48',
        anchor: 'The Gita frames steadiness as the inner condition that makes action cleaner.',
        action: 'Begin with one honest action and one unnecessary reaction you can leave alone today.',
      };
  }
}

export function getQuestionPrompts(data: OnboardingData): string[] {
  const theme = getGuidanceTheme(data);

  const base = [
    'What should I do next?',
    'How do I stop overthinking?',
    'Am I on the right path?',
    'How do I handle this pressure?',
    'Why do I feel disconnected?',
    'I do not know what I need yet',
  ];

  if (theme === 'burnout') {
    return ['How do I recover without falling behind?', 'What should I stop carrying?', ...base.slice(0, 4)];
  }

  if (theme === 'roots') {
    return ['How do I return to practice?', 'How do I honor my roots without feeling trapped?', ...base.slice(0, 4)];
  }

  return base;
}

export function getPrimaryThread(data: OnboardingData): string {
  const guidance = getScriptureGuidance(data);

  switch (guidance.theme) {
    case 'decision':
      return 'steadier decisions';
    case 'pressure':
      return 'pressure-aware timing';
    case 'restless':
      return 'a calmer mind';
    case 'roots':
      return 'rooted practice';
    case 'purpose':
      return 'clearer direction';
    case 'burnout':
      return 'sustainable recovery';
    default:
      return 'daily grounding';
  }
}

export function getDailyGuidancePreview(data: OnboardingData): DailyGuidancePreview[] {
  const guidance = getScriptureGuidance(data);

  switch (guidance.theme) {
    case 'roots':
      return [
        {
          area: 'Rooting',
          time: 'Morning',
          action: 'Begin with one practice you can keep privately.',
          suggestion: 'Let the ritual reconnect you without becoming another performance.',
          reference: 'Yoga Sutras 2.1',
          accent: 'gold',
        },
        {
          area: 'Belonging',
          time: 'Midday',
          action: 'Choose the conversation that keeps you honest and gentle.',
          suggestion: 'Compassion can hold boundaries without cutting off your roots.',
          reference: 'Gita 12.13-14',
          accent: 'saffron',
        },
        {
          area: 'Rest',
          time: 'Evening',
          action: 'Close the day with one line of self-study.',
          suggestion: 'Ask what felt true today, not what looked impressive.',
          reference: 'Yoga Sutras 2.1',
          accent: 'muted',
        },
      ];
    case 'restless':
      return [
        {
          area: 'Focus',
          time: 'Morning',
          action: 'Do the task that needs your full mind before the noise begins.',
          suggestion: 'When attention runs ahead, return it without making the wandering a failure.',
          reference: 'Gita 6.26',
          accent: 'gold',
        },
        {
          area: 'Stillness',
          time: 'Midday',
          action: 'Take one short pause before replying or deciding.',
          suggestion: 'Practice and release work together; do not argue with every thought.',
          reference: 'Yoga Sutras 1.12',
          accent: 'saffron',
        },
        {
          area: 'Rest',
          time: 'Evening',
          action: 'Close loops instead of opening new ones.',
          suggestion: 'Let the day settle before choosing what comes next.',
          reference: 'Yoga Sutras 1.2',
          accent: 'muted',
        },
      ];
    case 'burnout':
      return [
        {
          area: 'Energy',
          time: 'Morning',
          action: 'Choose the smallest useful practice, not the most impressive one.',
          suggestion: 'Recover agency by keeping a promise that does not drain you.',
          reference: 'Gita 6.5',
          accent: 'gold',
        },
        {
          area: 'Work',
          time: 'Midday',
          action: 'Protect one boundary before taking on more.',
          suggestion: 'Practice needs release, otherwise discipline becomes another weight.',
          reference: 'Yoga Sutras 1.12',
          accent: 'saffron',
        },
        {
          area: 'Rest',
          time: 'Evening',
          action: 'Stop at enough.',
          suggestion: 'Let recovery be part of the rhythm, not a reward after collapse.',
          reference: 'Yoga Sutras 1.12',
          accent: 'muted',
        },
      ];
    default:
      return [
        {
          area: 'Focus',
          time: 'Morning',
          action: 'Do the one thing that needs your full mind.',
          suggestion: 'Start before messages and noise shape the day.',
          reference: 'Gita 6.26',
          accent: 'gold',
        },
        {
          area: 'Decision',
          time: 'Midday',
          action: 'Separate what is yours to do from what you cannot control.',
          suggestion: 'A steadier window for judgment and follow-through.',
          reference: 'Gita 2.47',
          accent: 'saffron',
        },
        {
          area: 'Rest',
          time: 'Evening',
          action: 'Close loops instead of opening new ones.',
          suggestion: 'Let the day settle before choosing what comes next.',
          reference: 'Gita 2.48',
          accent: 'muted',
        },
      ];
  }
}
