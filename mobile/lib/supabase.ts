import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient(getToken: () => Promise<string | null>) {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key =
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing EXPO_PUBLIC_SUPABASE_URL and a public Supabase key (EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY)'
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    accessToken: getToken,
  });
}
