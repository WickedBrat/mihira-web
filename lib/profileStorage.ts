import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProfileData } from '@/features/profile/useProfile';

const KEY = 'aksha_profile_snapshot';

export interface ProfileSnapshot {
  userId: string;
  profile: ProfileData;
  savedAt: string;
}

export async function getCachedProfile(userId: string): Promise<ProfileSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ProfileSnapshot>;
    if (parsed.userId !== userId || !parsed.profile) return null;

    return {
      userId: parsed.userId,
      profile: parsed.profile,
      savedAt: parsed.savedAt ?? '',
    };
  } catch {
    return null;
  }
}

export async function saveCachedProfile(snapshot: ProfileSnapshot): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.error('[profileStorage] save error', error);
  }
}

export async function clearCachedProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    console.error('[profileStorage] clear error', error);
  }
}
