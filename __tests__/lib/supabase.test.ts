import { getSupabaseClient } from '@/lib/supabase';

describe('getSupabaseClient', () => {
  beforeEach(() => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'anon-key-test';
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('returns a client with a from() method', () => {
    const client = getSupabaseClient(async () => 'test-token');
    expect(typeof client.from).toBe('function');
  });

  it('throws if EXPO_PUBLIC_SUPABASE_URL is missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    expect(() => getSupabaseClient(async () => null)).toThrow(
      'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY'
    );
  });

  it('throws if EXPO_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    expect(() => getSupabaseClient(async () => null)).toThrow(
      'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY'
    );
  });
});
