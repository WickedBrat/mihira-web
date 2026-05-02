import type {
  AskResponseMode,
  AskSafetyBoundary,
  AskSafetyEscalationType,
  AskTopic,
  ScriptureGuideResponse,
} from '@/features/ask/types';

interface SafetyRule {
  escalationType: AskSafetyEscalationType;
  topic: AskTopic;
  pattern: RegExp;
  note: string;
  summary: string;
  guidance: string;
  actionSteps: string[];
}

const SAFETY_RULES: SafetyRule[] = [
  {
    escalationType: 'self_harm',
    topic: 'general',
    pattern: /\b(kill myself|suicide|end my life|self harm|hurt myself|die tonight|don't want to live)\b/i,
    note: 'This needs immediate human support. Mihira can offer spiritual steadiness, but it cannot safely handle a crisis like this alone.',
    summary: 'You deserve immediate human help right now, not solitary spiritual interpretation.',
    guidance: 'Please contact local emergency services or a crisis line now, and tell a trusted person nearby what is happening.',
    actionSteps: [
      'Reach a trusted person immediately and tell them you are not safe alone.',
      'Contact local emergency or crisis support now.',
      'Move away from anything you could use to hurt yourself while you wait for help.',
    ],
  },
  {
    escalationType: 'abuse',
    topic: 'family',
    pattern: /\b(abuse|violent partner|he hits me|she hits me|unsafe at home|domestic violence|being assaulted)\b/i,
    note: 'If you are in danger, seek immediate real-world safety and professional support first.',
    summary: 'Your safety takes priority over spiritual interpretation.',
    guidance: 'Move toward immediate safety and contact local emergency services, a shelter, or a trusted person who can help you leave the situation.',
    actionSteps: [
      'Go to a safer location if you can do so immediately.',
      'Contact emergency services or a trusted support person now.',
      'Avoid confronting the abuser alone if you are currently at risk.',
    ],
  },
  {
    escalationType: 'medical',
    topic: 'general',
    pattern: /\b(diagnose|diagnosis|medical advice|treatment|tumor|stroke|heart attack|pregnant|pregnancy complication|medicine dosage)\b/i,
    note: 'Mihira can offer spiritual grounding, but medical decisions need a licensed clinician.',
    summary: 'This question needs medical care, not scripture-based decision making alone.',
    guidance: 'Please speak with a licensed medical professional as soon as possible and use Mihira only for emotional or spiritual support around the situation.',
    actionSteps: [
      'Contact a licensed clinician or urgent care provider.',
      'Write down your symptoms and timeline before that conversation.',
      'Use spiritual practice only as support, not as a substitute for treatment.',
    ],
  },
  {
    escalationType: 'mental_health',
    topic: 'fear',
    pattern: /\b(panic attack|psychosis|hearing voices|manic|manic episode|severe depression|can't function)\b/i,
    note: 'Severe mental health symptoms need qualified care alongside any spiritual grounding.',
    summary: 'This sounds like a mental health situation that needs real clinical support.',
    guidance: 'Please reach out to a licensed mental health professional or urgent care support, and lean on Mihira only for gentle grounding while you seek that help.',
    actionSteps: [
      'Tell a trusted person what is happening today.',
      'Contact a mental health professional, urgent care line, or emergency service if the situation is acute.',
      'Reduce stimulation and stay with supportive people if possible.',
    ],
  },
  {
    escalationType: 'legal',
    topic: 'family',
    pattern: /\b(lawsuit|legal advice|custody|divorce settlement|crime|illegal|sue|court case|visa issue)\b/i,
    note: 'Mihira can help you reflect on values and steadiness, but legal decisions require qualified counsel.',
    summary: 'This question needs legal advice from a qualified professional.',
    guidance: 'Please speak to a licensed lawyer or legal aid service, and use Mihira only to reflect on ethics, steadiness, and inner clarity.',
    actionSteps: [
      'Gather your documents and timeline before speaking to counsel.',
      'Contact a qualified lawyer or legal aid service.',
      'Avoid taking irreversible action based only on spiritual advice.',
    ],
  },
  {
    escalationType: 'financial',
    topic: 'wealth',
    pattern: /\b(should i invest|stock pick|crypto|loan default|bankruptcy|trading advice|mortgage decision|financial advice)\b/i,
    note: 'Mihira can speak to fear, greed, restraint, and values, but not provide financial advice.',
    summary: 'This needs qualified financial guidance, not a scripture-based recommendation alone.',
    guidance: 'Please speak with a licensed financial professional and use Mihira only for clarity about your motives, restraint, and priorities.',
    actionSteps: [
      'Write down the decision, risks, and your time horizon.',
      'Speak with a qualified financial advisor before acting.',
      'Separate fear and urgency from the underlying numbers before you decide.',
    ],
  },
];

export function detectAskSafetyBoundary(question: string): AskSafetyBoundary {
  for (const rule of SAFETY_RULES) {
    if (rule.pattern.test(question)) {
      return {
        has_boundary: true,
        note: rule.note,
        escalation_type: rule.escalationType,
      };
    }
  }

  return { has_boundary: false };
}

export function buildSafetyResponse(
  mode: AskResponseMode,
  question: string,
  boundary: AskSafetyBoundary,
): ScriptureGuideResponse {
  const matchingRule = SAFETY_RULES.find((rule) => rule.escalationType === boundary.escalation_type);
  const fallbackSummary = 'This needs human support beyond what Mihira can safely provide.';
  const fallbackGuidance = 'Please seek qualified real-world help first, and use Mihira only for gentle reflection once you are supported.';

  return {
    mode,
    topic: matchingRule?.topic ?? 'general',
    answer: {
      title: 'Human Help First',
      summary: matchingRule?.summary ?? fallbackSummary,
      practical_guidance: matchingRule?.guidance ?? fallbackGuidance,
    },
    sources: [],
    interpretation: {
      synthesis: 'Mihira is intentionally withholding a scripture-grounded interpretation here because the safest next step is qualified human help.',
    },
    action_steps: matchingRule?.actionSteps ?? [],
    follow_up_prompts: question
      ? [
          'How can I steady myself while I get help?',
          'Give me a short grounding practice for tonight.',
          'What does dharma ask of me while I wait for support?',
        ]
      : [],
    safety: boundary,
  };
}
