import { validateModelScriptureGuidePayload } from '@/lib/ai/askValidators';
import type { RetrievalCandidate } from '@/lib/ai/scriptureRetrieval';

const retrievedSources: RetrievalCandidate[] = [
  {
    id: 'gita-2-47',
    scripture_name: 'Bhagavad Gita',
    citation_label: 'Bhagavad Gita 2.47',
    score: 10,
    confidence: 'high',
    translation: 'You have a claim on action alone.',
    themes: ['duty'],
    life_topics: ['career'],
    original_language: 'sanskrit',
    editorial_confidence: 'high',
    source_edition: 'test',
  },
] as RetrievalCandidate[];

describe('askValidators', () => {
  it('accepts a valid payload', () => {
    expect(() => validateModelScriptureGuidePayload({
      answer: {
        summary: 'Act without clinging to outcome.',
        practical_guidance: 'Do the next right task.',
      },
      source_reasons: [
        { source_id: 'gita-2-47', relevance_reason: 'It addresses action without attachment.' },
      ],
      interpretation: {
        synthesis: 'The source calls for disciplined action.',
      },
      action_steps: ['Finish one concrete task today.'],
      follow_up_prompts: ['What does the Gita say about fear?'],
    }, retrievedSources, 'quick')).not.toThrow();
  });

  it('rejects unknown source ids', () => {
    expect(() => validateModelScriptureGuidePayload({
      answer: {
        summary: 'Act without clinging to outcome.',
        practical_guidance: 'Do the next right task.',
      },
      source_reasons: [
        { source_id: 'unknown-source', relevance_reason: 'Bad id.' },
      ],
      interpretation: {
        synthesis: 'The source calls for disciplined action.',
      },
      action_steps: ['Finish one concrete task today.'],
      follow_up_prompts: ['What does the Gita say about fear?'],
    }, retrievedSources, 'quick')).toThrow('Ask response referenced unknown source');
  });
});
