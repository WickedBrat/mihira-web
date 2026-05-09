import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Platform } from 'react-native';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let hasRegisteredAutoRefresh = false;
let autoRefreshSubscription: { remove: () => void } | null = null;

function getSupabaseConfig() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key =
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing EXPO_PUBLIC_SUPABASE_URL and a public Supabase key (EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY)'
    );
  }

  return { url, key };
}

function registerAutoRefresh(client: SupabaseClient) {
  if (hasRegisteredAutoRefresh || Platform.OS === 'web') return;

  hasRegisteredAutoRefresh = true;
  if (AppState.currentState === 'active') {
    client.auth.startAutoRefresh();
  }

  autoRefreshSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      client.auth.startAutoRefresh();
    } else {
      client.auth.stopAutoRefresh();
    }
  });
}

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const { url, key } = getSupabaseConfig();
  supabaseClient = createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  registerAutoRefresh(supabaseClient);
  return supabaseClient;
}

export function resetSupabaseClientForTests() {
  supabaseClient = null;
  hasRegisteredAutoRefresh = false;
  autoRefreshSubscription?.remove();
  autoRefreshSubscription = null;
}
