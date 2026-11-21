import type {
  AskContextV2,
  AskHistoryTurn,
  AskResponseMode,
  AskTopic,
  ScriptureGuideResponse,
} from '../../features/ask/types';
import { parseModelJson } from './parseModelJson';
import { claudeChat } from './claude';
import { ASK_GUIDANCE_SYSTEM, buildAskPrompt, buildAskSchema } from './prompts';
import { getScriptureModeConfig } from './scriptureModes';
import type { ModelScriptureGuidePayload } from './askValidators';
import { validateModelScriptureGuidePayload } from './askValidators';
import { rankScriptureCandidates } from './scriptureRanking';
import { classifyAskQuestion, retrieveScriptureCandidates } from './scriptureRetrieval';
import { buildSafetyResponse, detectAskSafetyBoundary } from './scriptureSafety';
import { toScriptureSource } from './scriptureCorpus';

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

const clean = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

/**
 * The schema returns null for optional fields; the app expects them absent.
 * Over-long lists are trimmed rather than failing the whole answer.
 */
function normalizeModelPayload(
  payload: ModelScriptureGuidePayload,
  maxSources: number,
  maxFollowUps: number,
): ModelScriptureGuidePayload {
  const seen = new Set<string>();
  const sourceReasons = (Array.isArray(payload.source_reasons) ? payload.source_reasons : [])
    .filter((entry) => entry && !seen.has(entry.source_id) && seen.add(entry.source_id))
    .slice(0, maxSources);
  const strings = (list: unknown) =>
    (Array.isArray(list) ? list : []).map(clean).filter((item): item is string => Boolean(item));

  return {
    ...payload,
    answer: {
      title: clean(payload.answer?.title),
      summary: clean(payload.answer?.summary) ?? '',
      practical_guidance: clean(payload.answer?.practical_guidance) ?? '',
    },
    source_reasons: sourceReasons,
    interpretation: {
      synthesis: clean(payload.interpretation?.synthesis) ?? '',
      alternate_view: clean(payload.interpretation?.alternate_view),
    },
    action_steps: strings(payload.action_steps),
    follow_up_prompts: strings(payload.follow_up_prompts).slice(0, maxFollowUps),
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

  const config = getScriptureModeConfig(mode);
  const prompt = buildAskPrompt({
    question: payload.message,
    mode,
    classification,
    userContext,
    history,
    sources: ranked,
    config,
  });

  const raw = await claudeChat([
    { role: 'system', content: ASK_GUIDANCE_SYSTEM },
    { role: 'user', content: prompt },
  ], {
    schema: buildAskSchema(ranked.map((source) => source.id), config.includeAlternateView),
    effort: mode === 'quick' ? 'low' : 'medium',
  });

  const modelPayload = normalizeModelPayload(
    parseModelJson<ModelScriptureGuidePayload>(raw, [
      'answer',
      'source_reasons',
      'interpretation',
      'action_steps',
      'follow_up_prompts',
    ]),
    config.finalSourceCount,
    config.followUpPromptCount,
  );

  validateModelScriptureGuidePayload(modelPayload, ranked, mode);

  // Keep the model's order: it lists the passages that matter most first.
  const rankedById = new Map(ranked.map((source) => [source.id, source]));
  const sources = modelPayload.source_reasons.flatMap((entry) => {
    const source = rankedById.get(entry.source_id);
    return source
      ? [toScriptureSource(source, clean(entry.relevance_reason) ?? 'Selected for thematic relevance.', source.confidence)]
      : [];
  });

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
