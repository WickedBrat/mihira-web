import type { AskResponseMode, AskTopic } from '@/features/ask/types';
import type { ScripturePassage } from '@/lib/scriptures/schema';
import { getScriptureCorpus, editorialConfidenceToResponseConfidence, withCitation } from '@/lib/ai/scriptureCorpus';

export interface AskClassification {
  primary_topic: AskTopic;
  secondary_topics: AskTopic[];
  emotional_tone: 'steady' | 'anxious' | 'grieving' | 'angry' | 'searching';
}

export interface RetrievalCandidate extends ScripturePassage {
  citation_label: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
}

const TOPIC_KEYWORDS: Record<AskTopic, string[]> = {
  career_dharma: ['job', 'career', 'work', 'promotion', 'boss', 'duty', 'calling', 'office', 'profession'],
  relationships: ['relationship', 'partner', 'marriage', 'dating', 'love', 'breakup', 'friend'],
  family: ['family', 'parents', 'mother', 'father', 'sibling', 'child', 'home'],
  grief: ['grief', 'loss', 'death', 'mourning', 'missing', 'bereavement'],
  anger: ['angry', 'anger', 'resentment', 'rage', 'furious', 'bitter'],
  fear: ['fear', 'afraid', 'anxious', 'panic', 'worry', 'uncertain', 'scared'],
  discipline: ['discipline', 'habit', 'routine', 'focus', 'restless', 'mind', 'practice', 'consistency'],
  self_worth: ['comparison', 'worthy', 'worthless', 'not enough', 'envy', 'validation', 'confidence'],
  purpose: ['purpose', 'meaning', 'empty', 'lost', 'direction', 'calling', 'why'],
  wealth: ['money', 'wealth', 'abundance', 'salary', 'success', 'greed', 'prosperity'],
  devotion: ['devotion', 'faith', 'god', 'prayer', 'surrender', 'bhakti'],
  general: [],
};

const EMOTIONAL_TONE_RULES = [
  { tone: 'grieving' as const, pattern: /\b(grief|loss|mourning|death|bereaved|heartbroken)\b/i },
  { tone: 'angry' as const, pattern: /\b(angry|rage|resentment|furious|bitter)\b/i },
  { tone: 'anxious' as const, pattern: /\b(anxious|panic|worried|fear|afraid|scared|uncertain)\b/i },
  { tone: 'searching' as const, pattern: /\b(purpose|meaning|lost|direction|calling|empty)\b/i },
];

function normalizeText(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(input: string): string[] {
  return normalizeText(input).split(' ').filter(Boolean);
}

function includesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function classifyAskQuestion(question: string): AskClassification {
  const normalized = normalizeText(question);
  const scoredTopics = (Object.keys(TOPIC_KEYWORDS) as AskTopic[])
    .filter((topic) => topic !== 'general')
    .map((topic) => ({
      topic,
      score: TOPIC_KEYWORDS[topic].reduce((acc, keyword) => acc + (normalized.includes(keyword) ? 1 : 0), 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const primary_topic = scoredTopics[0]?.topic ?? 'general';
  const secondary_topics = scoredTopics.slice(1, 3).map((entry) => entry.topic);
  const emotional_tone = EMOTIONAL_TONE_RULES.find((rule) => rule.pattern.test(question))?.tone ?? 'steady';

  return {
    primary_topic,
    secondary_topics,
    emotional_tone,
  };
}

function computePassageScore(
  passage: ScripturePassage,
  tokens: string[],
  topic: AskTopic,
  secondaryTopics: AskTopic[],
): number {
  const searchable = normalizeText([
    passage.scripture_name,
    passage.book,
    passage.chapter,
    passage.verse,
    passage.section_title,
    passage.translation,
    passage.commentary_summary,
    passage.themes.join(' '),
    passage.life_topics.join(' '),
  ].filter(Boolean).join(' '));

  let score = 0;
  for (const token of tokens) {
    if (token.length < 3) continue;
    if (searchable.includes(token)) score += 2;
  }

  if (topic !== 'general' && includesAny(searchable, TOPIC_KEYWORDS[topic])) {
    score += 5;
  }

  for (const secondary of secondaryTopics) {
    if (includesAny(searchable, TOPIC_KEYWORDS[secondary])) {
      score += 2;
    }
  }

  if (passage.life_topics.some((entry) => tokens.some((token) => entry.toLowerCase().includes(token)))) {
    score += 1;
  }

  if (passage.editorial_confidence === 'high') score += 1;
  return score;
}

export function retrieveScriptureCandidates(
  question: string,
  mode: AskResponseMode,
  classification: AskClassification,
): RetrievalCandidate[] {
  const tokens = tokenize(question);
  const retrievalCount = mode === 'quick' ? 6 : mode === 'deep' ? 8 : 10;

  return getScriptureCorpus()
    .map((passage) => {
      const scored = computePassageScore(
        passage,
        tokens,
        classification.primary_topic,
        classification.secondary_topics,
      );

      return {
        ...withCitation(passage),
        score: scored,
        confidence: editorialConfidenceToResponseConfidence(passage.editorial_confidence),
      };
    })
    .filter((passage) => passage.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, retrievalCount);
}
