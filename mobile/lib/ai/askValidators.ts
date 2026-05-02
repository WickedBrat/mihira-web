import type { AskResponseMode, AskTopic } from '@/features/ask/types';
import type { RetrievalCandidate } from '@/lib/ai/scriptureRetrieval';
import { getScriptureModeConfig } from '@/lib/ai/scriptureModes';

export interface ModelScriptureGuidePayload extends Record<string, unknown> {
  answer: {
    title?: string;
    summary: string;
    practical_guidance: string;
  };
  source_reasons: Array<{
    source_id: string;
    relevance_reason: string;
  }>;
  interpretation: {
    synthesis: string;
    alternate_view?: string;
  };
  action_steps: string[];
  follow_up_prompts: string[];
}

export function validateModelScriptureGuidePayload(
  payload: ModelScriptureGuidePayload,
  retrievedSources: RetrievalCandidate[],
  mode: AskResponseMode,
): void {
  const config = getScriptureModeConfig(mode);
  const validIds = new Set(retrievedSources.map((source) => source.id));

  if (!payload.answer?.summary || !payload.answer?.practical_guidance) {
    throw new Error('Ask response missing answer content');
  }

  if (!payload.interpretation?.synthesis) {
    throw new Error('Ask response missing interpretation');
  }

  if (!Array.isArray(payload.source_reasons) || payload.source_reasons.length === 0) {
    throw new Error('Ask response missing source reasons');
  }

  for (const source of payload.source_reasons) {
    if (!validIds.has(source.source_id)) {
      throw new Error(`Ask response referenced unknown source: ${source.source_id}`);
    }
  }

  if (payload.source_reasons.length > config.finalSourceCount) {
    throw new Error('Ask response returned too many sources');
  }

  if (mode === 'compare' && !payload.interpretation.alternate_view) {
    throw new Error('Compare mode requires an alternate view');
  }
}

export function isAskTopic(value: string): value is AskTopic {
  return [
    'career_dharma',
    'relationships',
    'family',
    'grief',
    'anger',
    'fear',
    'discipline',
    'self_worth',
    'purpose',
    'wealth',
    'devotion',
    'general',
  ].includes(value);
}
