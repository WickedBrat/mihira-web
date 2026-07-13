jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedSupabaseClient } from '@/lib/server/auth';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

function requestWithAuth(header?: string) {
  return new Request('http://localhost/api/ask', {
    method: 'POST',
    headers: header ? { authorization: header } : {},
  });
}

describe('getAuthenticatedSupabaseClient', () => {
  const originalEnv = { ...process.env };
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'secret-key';
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    errorSpy.mockRestore();
  });

  it('returns null when there is no Authorization header', async () => {
    const result = await getAuthenticatedSupabaseClient(requestWithAuth());
    expect(result).toBeNull();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it('returns null when the header is not a Bearer token', async () => {
    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Basic abc123'));
    expect(result).toBeNull();
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it('returns null and logs when the Supabase secret key is missing', async () => {
    delete process.env.SUPABASE_SECRET_KEY;
    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Bearer valid-token'));
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('returns null when Supabase rejects the token', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({ data: { user: null }, error: { message: 'invalid token' } });
    mockCreateClient.mockReturnValueOnce({ auth: { getUser: mockGetUser } } as never);

    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Bearer bad-token'));

    expect(result).toBeNull();
    expect(mockGetUser).toHaveBeenCalledWith('bad-token');
  });

  it('returns the verified userId and client when the token is valid', async () => {
    const mockGetUser = jest.fn().mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });
    const mockClient = { auth: { getUser: mockGetUser } };
    mockCreateClient.mockReturnValueOnce(mockClient as never);

    const result = await getAuthenticatedSupabaseClient(requestWithAuth('Bearer good-token'));

    expect(result).toEqual({ userId: 'user_123', supabase: mockClient });
  });
});
