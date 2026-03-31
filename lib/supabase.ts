import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient(getToken: () => Promise<string | null>) {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createClient(url, key, {
    global: {
      fetch: async (input, init = {}) => {
        const token = await getToken();
        const headers = new Headers((init.headers as HeadersInit) ?? {});
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionFromUrl: false,
    },
  });
}
