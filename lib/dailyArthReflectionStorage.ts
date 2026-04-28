import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyArthReflection } from '@/lib/dailyArthReflectionTypes';
import { isDailyArthReflection } from '@/lib/dailyArthReflectionTypes';

const KEY_PREFIX = 'daily_arth_reflection_v1';

function keyForQuote(quoteId: number | string) {
  return `${KEY_PREFIX}:${quoteId}`;
}

export async function getCachedDailyArthReflection(
  quoteId: number | string
): Promise<DailyArthReflection | null> {
  try {
    const raw = await AsyncStorage.getItem(keyForQuote(quoteId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    return isDailyArthReflection(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveCachedDailyArthReflection(
  quoteId: number | string,
  reflection: DailyArthReflection
): Promise<void> {
  try {
    await AsyncStorage.setItem(keyForQuote(quoteId), JSON.stringify(reflection));
  } catch (error) {
    console.error('[dailyArthReflectionStorage] save error', error);
  }
}
