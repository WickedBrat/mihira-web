import { apiUrl } from '@/lib/apiUrl';
import {
  getCachedDailyArthReflection,
  saveCachedDailyArthReflection,
} from '@/lib/dailyArthReflectionStorage';
import type { DailyArthReflection } from '@/features/daily/reflectionTypes';
import { isDailyArthReflection } from '@/features/daily/reflectionTypes';

interface FetchReflectionInput {
  quoteId: number;
  quote: string;
  source: string;
}

export async function getDailyArthReflection({
  quoteId,
  quote,
  source,
}: FetchReflectionInput): Promise<DailyArthReflection> {
  const cached = await getCachedDailyArthReflection(quoteId);
  if (cached) return cached;

  const response = await fetch(apiUrl('/api/wisdom/daily-arth-reflection'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quoteId, quote, source }),
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const raw = await response.text();
    throw new Error(
      `Reflection API returned ${contentType || 'non-JSON content'} (${response.status}). ` +
      `Response started with: ${raw.slice(0, 80)}`
    );
  }

  const data = await response.json() as { reflection?: unknown; error?: string };
  if (!response.ok) throw new Error(data.error ?? `Reflection API failed with status ${response.status}`);
  if (!isDailyArthReflection(data.reflection)) throw new Error('Reflection API returned an invalid shape');

  await saveCachedDailyArthReflection(quoteId, data.reflection);
  return data.reflection;
}
