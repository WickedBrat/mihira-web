import type {
  AskContextV2,
  AskHistoryTurn,
  AskResponseMode,
  AskTopic,
  ScriptureGuideResponse,
} from '@/features/ask/types';
import { parseModelJson } from '@/lib/ai/parseModelJson';
import { perplexityChat } from '@/lib/ai/perplexity';
import { buildAskComparePrompt, buildAskSynthesisPrompt, ASK_GUIDANCE_SYSTEM } from '@/lib/ai/prompts';
import type { ModelScriptureGuidePayload } from '@/lib/ai/askValidators';
import { validateModelScriptureGuidePayload } from '@/lib/ai/askValidators';
import { rankScriptureCandidates } from '@/lib/ai/scriptureRanking';
import { classifyAskQuestion, retrieveScriptureCandidates } from '@/lib/ai/scriptureRetrieval';
import { buildSafetyResponse, detectAskSafetyBoundary } from '@/lib/ai/scriptureSafety';
import { toScriptureSource } from '@/lib/ai/scriptureCorpus';

export interface AskRequestPayload {
  message: string;
  mode: AskResponseMode;
  userContext?: AskContextV2;
  history?: AskHistoryTurn[];
}

function normalizeMode(mode: string | undefined): AskResponseMode {
  return mode === 'deep' || mode === 'compare' ? mode : 'quick';
}

function defaultContext(mode: AskResponseMode): AskContextV2 {
  return {
    userName: 'Seeker',
    interactionCount: 0,
    lastMode: mode,
    lastTopic: null,
    lastQuestion: null,
  };
}

function buildEmptyRetrievalResponse(mode: AskResponseMode, topic: AskTopic): ScriptureGuideResponse {
  return {
    mode,
    topic,
    answer: {
      title: 'Try A More Specific Question',
      summary: 'The current text set does not have a strong enough match for this exact phrasing yet.',
      practical_guidance: 'Try naming the real tension more directly: duty, grief, fear, family, money, anger, or purpose.',
    },
    sources: [],
    interpretation: {
      synthesis: 'Mihira is intentionally avoiding a weak or theatrical answer here. A tighter question will produce a more grounded response.',
    },
    action_steps: [
      'Rewrite your question around one concrete dilemma.',
      'Name the emotion under the dilemma in one word.',
      'Ask again with one real decision you are facing this week.',
    ],
    follow_up_prompts: [
      'Help me phrase this as a clearer question.',
      'What do the texts say about fear and duty?',
      'Which text should I start with for this problem?',
    ],
    safety: {
      has_boundary: false,
    },
  };
}

export async function generateScriptureGuide(
  payload: AskRequestPayload,
): Promise<ScriptureGuideResponse> {
  const mode = normalizeMode(payload.mode);
  const userContext = payload.userContext ?? defaultContext(mode);
  const history = Array.isArray(payload.history) ? payload.history.slice(-4) : [];
  const classification = classifyAskQuestion(payload.message);
  const safety = detectAskSafetyBoundary(payload.message);

  if (safety.has_boundary) {
    return buildSafetyResponse(mode, payload.message, safety);
  }

  const retrieved = retrieveScriptureCandidates(payload.message, mode, classification);
  const ranked = rankScriptureCandidates(retrieved, mode);

  if (ranked.length === 0) {
    return buildEmptyRetrievalResponse(mode, classification.primary_topic);
  }

  const prompt = mode === 'compare'
    ? buildAskComparePrompt({
        question: payload.message,
        topic: classification.primary_topic,
        userContext,
        history,
        sources: ranked,
      })
    : buildAskSynthesisPrompt({
        question: payload.message,
        mode,
        topic: classification.primary_topic,
        userContext,
        history,
        sources: ranked,
      });

  const raw = await perplexityChat('sonar-pro', [
    { role: 'system', content: ASK_GUIDANCE_SYSTEM },
    { role: 'user', content: prompt },
  ]);

  const modelPayload = parseModelJson<ModelScriptureGuidePayload>(raw, [
    'answer',
    'source_reasons',
    'interpretation',
    'action_steps',
    'follow_up_prompts',
  ]);

  validateModelScriptureGuidePayload(modelPayload, ranked, mode);

  const reasonsById = new Map(
    modelPayload.source_reasons.map((entry) => [entry.source_id, entry.relevance_reason]),
  );

  const sources = ranked
    .filter((source) => reasonsById.has(source.id))
    .map((source) => toScriptureSource(
      source,
      reasonsById.get(source.id) ?? 'Selected for thematic relevance.',
      source.confidence,
    ));

  return {
    mode,
    topic: classification.primary_topic,
    answer: {
      title: modelPayload.answer.title,
      summary: modelPayload.answer.summary,
      practical_guidance: modelPayload.answer.practical_guidance,
    },
    sources,
    interpretation: modelPayload.interpretation,
    action_steps: modelPayload.action_steps,
    follow_up_prompts: modelPayload.follow_up_prompts,
    safety,
  };
}
