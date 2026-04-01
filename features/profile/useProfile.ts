import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, useSession } from '@clerk/clerk-expo';
import { useToast } from '@/components/ui/ToastProvider';
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

function getErrorDetail(error: unknown) {
  if (error instanceof Error) return error.message;

  if (typeof error === 'object' && error) {
    const candidate = error as {
      code?: string;
      message?: string;
      shortMessage?: string;
      longMessage?: string;
      errors?: Array<{
        code?: string;
        message?: string;
        shortMessage?: string;
        longMessage?: string;
      }>;
    };

    const firstError = candidate.errors?.[0];

    return (
      firstError?.longMessage ??
      firstError?.shortMessage ??
      firstError?.message ??
      candidate.longMessage ??
      candidate.shortMessage ??
      candidate.message ??
      candidate.code ??
      ''
    );
  }

  return typeof error === 'string' ? error : '';
}

function getSyncUnavailableMessage(error: unknown) {
  const message = getErrorDetail(error);
  const lowerMessage = message.toLowerCase();

  if (message.includes('EXPO_PUBLIC_SUPABASE_URL')) {
    return 'Supabase env vars are missing at runtime. Restart Expo after updating your .env file.';
  }

  if (message.includes('session token') || message.includes('empty session token')) {
    return 'Clerk did not return a session token. Sign out, sign back in, then try again.';
  }

  if (lowerMessage.includes('native api disabled') || lowerMessage.includes('native_api_disabled')) {
    return 'Enable Native API in the Clerk Dashboard under Native Applications, then sign in again.';
  }

  if (lowerMessage.includes('network')) {
    return 'Clerk token request failed over the network. Check your internet connection and Clerk configuration.';
  }

  if (message) {
    return message;
  }

  return 'Changes will stay on this device until Clerk and Supabase auth are connected.';
}

export function useProfile() {
  const { isLoaded: isAuthLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: isSessionLoaded, session } = useSession();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const isLoadedFromDB = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextSave = useRef(false);
  const hasWarnedSyncUnavailable = useRef(false);
  const lastSuccessToastAt = useRef(0);

  useEffect(() => {
    hasWarnedSyncUnavailable.current = false;
  }, [isSignedIn, userId, session?.id]);

  const getClient = useCallback(async () => {
    if (!isSignedIn || !userId || !isSessionLoaded) return null;

    try {
      let token = await session?.getToken();
      if (!token) {
        token = await session?.getToken({ template: 'supabase' });
      }
      if (!token) throw new Error('Missing Clerk session token for Supabase');

      return getSupabaseClient(async () => token);
    } catch (error) {
      if (!hasWarnedSyncUnavailable.current) {
        console.warn(
          '[useProfile] Supabase sync unavailable.',
          error
        );
        showToast({
          type: 'error',
          title: 'Profile sync unavailable',
          message: getSyncUnavailableMessage(error),
          duration: 3600,
        });
        hasWarnedSyncUnavailable.current = true;
      }

      return null;
    }
  }, [isSessionLoaded, isSignedIn, session, showToast, userId]);

  const notifySaveSuccess = useCallback(() => {
    const now = Date.now();
    if (now - lastSuccessToastAt.current < 3200) return;

    lastSuccessToastAt.current = now;
    showToast({
      type: 'success',
      title: 'Profile updated',
      message: 'Your latest details have been saved.',
    });
  }, [showToast]);

  const persistFields = useCallback(
    async (fields: Partial<ProfileData>) => {
      if (!isSignedIn || !userId) return;

      try {
        const client = await getClient();
        if (!client) return;

        setIsSaving(true);
        const { error: saveError } = await client.from('profiles').upsert(
          {
            id: userId,
            ...fields,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
        if (saveError) {
          console.error('[useProfile] save error', saveError);
          showToast({
            type: 'error',
            title: 'Could not update profile',
            message: saveError.message,
          });
          return;
        }

        notifySaveSuccess();
      } catch (err) {
        console.error('[useProfile] save error', err);
        showToast({
          type: 'error',
          title: 'Could not update profile',
          message: 'Please try again in a moment.',
        });
      } finally {
        setIsSaving(false);
      }
    },
    [getClient, isSignedIn, notifySaveSuccess, showToast, userId]
  );

  // Fetch on sign-in
  useEffect(() => {
    if (!isAuthLoaded || !isSessionLoaded) {
      return;
    }

    if (!isSignedIn || !userId || !session) {
      setProfile(INITIAL_PROFILE);
      isLoadedFromDB.current = false;
      return;
    }

    const loadProfile = async () => {
      try {
        const client = await getClient();
        if (!client) {
          isLoadedFromDB.current = true;
          return;
        }

        const { error: upsertError } = await client
          .from('profiles')
          .upsert({ id: userId }, { onConflict: 'id', ignoreDuplicates: true });

        if (upsertError) throw new Error(upsertError.message);

        const { data } = await client.from('profiles').select('*').eq('id', userId).single();
        const nextProfile = data as Partial<ProfileData> | null;

        if (nextProfile) {
          skipNextSave.current = true;
          setProfile({
            name: nextProfile.name ?? '',
            birth_dt: nextProfile.birth_dt ?? '',
            birth_place: nextProfile.birth_place ?? '',
            language: nextProfile.language ?? 'English',
            region: nextProfile.region ?? 'India',
            focus_area: nextProfile.focus_area ?? '',
          });
        }
      } catch (err) {
        console.error('[useProfile] fetch error', err);
        showToast({
          type: 'error',
          title: 'Could not load profile',
          message: 'Showing your current local details instead.',
        });
      } finally {
        isLoadedFromDB.current = true;
      }
    };

    void loadProfile();
  }, [getClient, isAuthLoaded, isSessionLoaded, isSignedIn, session, showToast, userId]);

  const updateField = useCallback(
    <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
      setProfile((current) => ({ ...current, [key]: value }));
    },
    []
  );

  const saveField = useCallback(
    async <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      skipNextSave.current = true;
      setProfile((current) => ({ ...current, [key]: value }));
      await persistFields({ [key]: value } as Pick<ProfileData, K>);
    },
    [persistFields]
  );

  // Debounced auto-save
  useEffect(() => {
    if (!isSignedIn || !userId || !session || !isLoadedFromDB.current) return;

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await persistFields(profile);
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [profile, isSignedIn, session, userId, persistFields]);

  return { profile, updateField, saveField, isSaving };
}
