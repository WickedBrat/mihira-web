import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { getSupabaseClient } from '@/lib/supabase';

export interface ProfileData {
  name: string;
  birth_dt: string;
  birth_place: string;
  language: 'English' | 'Hindi';
  region: string;
  focus_area: string;
}

const INITIAL_PROFILE: ProfileData = {
  name: '',
  birth_dt: '',
  birth_place: '',
  language: 'English',
  region: 'India',
  focus_area: '',
};

export function useProfile() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const isLoadedFromDB = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getClient = useCallback(
    () => getSupabaseClient(() => getToken({ template: 'supabase' })),
    [getToken]
  );

  // Fetch on sign-in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      setProfile(INITIAL_PROFILE);
      isLoadedFromDB.current = false;
      return;
    }

    const client = getClient();
    client
      .from('profiles')
      .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true })
      .then(() => client.from('profiles').select('*').eq('id', userId).single())
      .then(({ data }: { data: Record<string, string> | null }) => {
        if (data) {
          setProfile({
            name: data.name ?? '',
            birth_dt: data.birth_dt ?? '',
            birth_place: data.birth_place ?? '',
            language: (data.language as ProfileData['language']) ?? 'English',
            region: data.region ?? 'India',
            focus_area: data.focus_area ?? '',
          });
        }
        isLoadedFromDB.current = true;
      })
      .catch((err: unknown) => console.error('[useProfile] fetch error', err));
  }, [isLoaded, isSignedIn, userId, getClient]);

  const updateField = useCallback(
    <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
      setProfile((current) => ({ ...current, [key]: value }));
    },
    []
  );

  // Debounced auto-save
  useEffect(() => {
    if (!isSignedIn || !userId || !isLoadedFromDB.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        const client = getClient();
        await client
          .from('profiles')
          .update({ ...profile, updated_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (err) {
        console.error('[useProfile] save error', err);
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [profile, isSignedIn, userId, getClient]);

  return { profile, updateField, isSaving };
}
