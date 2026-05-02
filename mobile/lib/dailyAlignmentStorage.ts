import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyAlignmentPayload } from '@/lib/dailyAlignmentTypes';

interface CachedDailyAlignment extends DailyAlignmentPayload {
  dateKey: string;
  profileKey: string;
}

const KEY = 'aksha_daily_alignment_v4';

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyAlignmentProfileKey(birthDt: string, birthPlace: string) {
  return `${birthDt.trim()}::${birthPlace.trim().toLowerCase()}`;
}

export async function getCachedDailyAlignment(
  profileKey: string
): Promise<DailyAlignmentPayload | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedDailyAlignment;
    if (parsed.dateKey !== getDateKey()) return null;
    if (parsed.profileKey !== profileKey) return null;

    // Invalidate cache if it's missing the new focusAreas shape
    if (!Array.isArray(parsed.focusAreas) || parsed.focusAreas.length === 0) return null;

    return {
      chart: parsed.chart ?? null,
      focusAreas: parsed.focusAreas,
    };
  } catch {
    return null;
  }
}

export async function clearCachedDailyAlignment(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error('[dailyAlignmentStorage] clear error', error);
  }
}

export async function saveCachedDailyAlignment(
  profileKey: string,
  payload: DailyAlignmentPayload
): Promise<void> {
  try {
    const nextValue: CachedDailyAlignment = {
      ...payload,
      dateKey: getDateKey(),
      profileKey,
    };
    await AsyncStorage.setItem(KEY, JSON.stringify(nextValue));
  } catch (error) {
    console.error('[dailyAlignmentStorage] save error', error);
  }
}
