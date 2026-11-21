import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function createServerSupabaseClient(): SupabaseClient {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase URL or secret key');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export interface AuthenticatedSupabase {
  userId: string;
  supabase: SupabaseClient;
}

export async function getAuthenticatedSupabaseClient(
  request: Request,
): Promise<AuthenticatedSupabase | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return null;

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;

    return { userId: data.user.id, supabase };
  } catch (err) {
    console.error('[server/auth] getAuthenticatedSupabaseClient error', err);
    return null;
  }
}
