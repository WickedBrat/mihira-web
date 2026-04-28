import { createClient } from '@supabase/supabase-js';
import { parseModelJson } from '../../ai/parseModelJson';
import { perplexityChat } from '../../ai/perplexity';
import type { DailyArthReflection } from '../../dailyArthReflectionTypes';
import { isDailyArthReflection } from '../../dailyArthReflectionTypes';

const REFLECTION_SYSTEM = `You are Mihira's Daily Arth reflection writer. Explain Hindu and Indic wisdom quotes with warmth, practical clarity, and no fortune-telling. Respond ONLY in valid JSON. No markdown fences, no commentary, no text outside the JSON object.`;

function createServerSupabaseClient() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase URL or key for Daily Arth reflection');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function buildReflectionPrompt(quote: string, source: string) {
  return `Quote: "${quote}"
Source: ${source}

Create a practical reflection for someone using this quote in daily life.

Return ONLY this JSON shape:
{
  "summary": "<one short sentence that captures the core teaching>",
  "explanation": "<one detailed paragraph, 4-6 sentences, explaining the quote in plain language and connecting it to daily choices>",
  "dailyPractice": [
    "<specific action for today>",
    "<specific action for today>",
    "<specific action for today>"
  ],
  "reflectionPrompts": [
    "<journaling or contemplation question>",
    "<journaling or contemplation question>",
    "<journaling or contemplation question>"
  ],
  "mantra": "<short first-person sentence the user can carry through the day>"
}`;
}

function normalizeReflection(value: DailyArthReflection): DailyArthReflection {
  return {
    summary: value.summary.trim(),
    explanation: value.explanation.trim(),
    dailyPractice: value.dailyPractice.map((item) => item.trim()).filter(Boolean).slice(0, 3),
    reflectionPrompts: value.reflectionPrompts.map((item) => item.trim()).filter(Boolean).slice(0, 3),
    mantra: value.mantra.trim(),
  };
}

export async function handleDailyArthReflectionRequest(request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      quoteId?: number;
      quote?: string;
      source?: string;
    };

    if (!body.quoteId || !Number.isFinite(Number(body.quoteId))) {
      return Response.json({ error: 'quoteId is required' }, { status: 400 });
    }

    const quoteId = Number(body.quoteId);
    const client = createServerSupabaseClient();

    const { data: row, error: selectError } = await client
      .from('spiritual_quotes')
      .select('id, quote, source, daily_reflection')
      .eq('id', quoteId)
      .single();

    if (selectError || !row) {
      return Response.json({ error: selectError?.message ?? 'Quote not found' }, { status: 404 });
    }

    if (isDailyArthReflection(row.daily_reflection)) {
      return Response.json({ reflection: row.daily_reflection, source: 'database' });
    }

    const quote = typeof row.quote === 'string' ? row.quote : body.quote;
    const source = typeof row.source === 'string' ? row.source : body.source;

    if (!quote || !source) {
      return Response.json({ error: 'quote and source are required' }, { status: 400 });
    }

    const raw = await perplexityChat('sonar-pro', [
      { role: 'system', content: REFLECTION_SYSTEM },
      { role: 'user', content: buildReflectionPrompt(quote, source) },
    ]);

    let reflection: DailyArthReflection;
    try {
      const parsed = parseModelJson<Record<string, unknown>>(raw, [
        'summary',
        'explanation',
        'dailyPractice',
        'reflectionPrompts',
        'mantra',
      ]);
      if (!isDailyArthReflection(parsed)) throw new Error('Invalid reflection shape');
      reflection = normalizeReflection(parsed);
    } catch {
      return Response.json({ error: 'AI response parse error', raw }, { status: 502 });
    }

    const { error: updateError } = await client
      .from('spiritual_quotes')
      .update({ daily_reflection: reflection })
      .eq('id', quoteId);

    if (updateError) {
      console.error('[daily-arth-reflection] DB update error', updateError.message);
    }

    return Response.json({
      reflection,
      source: updateError ? 'llm' : 'llm_and_database',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Daily Arth reflection error';
    console.error('[daily-arth-reflection]', message);
    return Response.json({ error: message }, { status: 502 });
  }
}
