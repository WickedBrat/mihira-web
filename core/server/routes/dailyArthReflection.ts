import { createClient } from '@supabase/supabase-js';
import { parseModelJson } from '../../ai/parseModelJson';
import { claudeChat } from '../../ai/claude';
import { REFLECTION_SCHEMA, REFLECTION_SYSTEM, buildReflectionPrompt } from '../../ai/prompts';
import { serverErrorResponse } from '../errorResponse';
import type { DailyArthReflection } from '../../types/dailyArthReflection';
import { isDailyArthReflection } from '../../types/dailyArthReflection';

function createServerSupabaseClient() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase URL or secret key for Daily Arth reflection');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
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

    const raw = await claudeChat([
      { role: 'system', content: REFLECTION_SYSTEM },
      { role: 'user', content: buildReflectionPrompt(quote, source) },
    ], { schema: REFLECTION_SCHEMA, effort: 'medium' });

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

    const { data: updatedRow, error: updateError } = await client
      .from('spiritual_quotes')
      .update({ daily_reflection: reflection })
      .eq('id', quoteId)
      .select('daily_reflection')
      .single();

    if (updateError || !isDailyArthReflection(updatedRow?.daily_reflection)) {
      const message = updateError?.message ?? 'Daily Arth reflection was not persisted';
      console.error('[daily-arth-reflection] DB update error', message);
      return Response.json({ error: 'Failed to save Daily Arth reflection' }, { status: 500 });
    }

    return Response.json({
      reflection: updatedRow.daily_reflection,
      source: 'llm_and_database',
    });
  } catch (err: unknown) {
    return serverErrorResponse('daily-arth-reflection', err);
  }
}
