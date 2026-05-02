import { getSupabaseClient } from '@/lib/supabase';

describe('getSupabaseClient', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key-test';
    delete process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  it('returns a client with a from() method', () => {
    const client = getSupabaseClient(async () => 'test-token');
    expect(typeof client.from).toBe('function');
  });

  it('throws if EXPO_PUBLIC_SUPABASE_URL is missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    expect(() => getSupabaseClient(async () => null)).toThrow(
      'Missing EXPO_PUBLIC_SUPABASE_URL and a public Supabase key (EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY)'
    );
  });

  it('throws if EXPO_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    expect(() => getSupabaseClient(async () => null)).toThrow(
      'Missing EXPO_PUBLIC_SUPABASE_URL and a public Supabase key (EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY or EXPO_PUBLIC_SUPABASE_ANON_KEY)'
    );
  });

  it('falls back to EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'publishable-key-test';

    const client = getSupabaseClient(async () => 'test-token');

    expect(typeof client.from).toBe('function');
  });
});
