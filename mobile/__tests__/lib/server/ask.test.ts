jest.mock('@/lib/ai/askService', () => ({
  generateScriptureGuide: jest.fn(),
}));

jest.mock('@/lib/server/auth', () => ({
  getAuthenticatedSupabaseClient: jest.fn(),
}));

jest.mock('@/lib/server/askQueryLog', () => ({
  logAskQuery: jest.fn(),
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

import { generateScriptureGuide } from '@/lib/ai/askService';
import { getAuthenticatedSupabaseClient } from '@/lib/server/auth';
import { logAskQuery } from '@/lib/server/askQueryLog';
import { handleAskRequest } from '@/lib/server/routes/ask';
import { createClient } from '@supabase/supabase-js';
import type { ScriptureGuideResponse } from '@/features/ask/types';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

const mockResponse: ScriptureGuideResponse = {
  mode: 'quick',
  topic: 'career_dharma',
  answer: { title: 'Test', summary: 'summary', practical_guidance: 'guidance' },
  sources: [],
  interpretation: { synthesis: 'synthesis' },
  action_steps: [],
  follow_up_prompts: [],
  safety: { has_boundary: false },
};

function requestFor(message: string, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({ message, mode: 'quick' }),
  });
}

// Flush the microtask queue so fire-and-forget promises resolve before assertions.
// Promise-based (not setImmediate) so it works under both node and jsdom test environments.
async function flush() {
  for (let i = 0; i < 5; i += 1) {
    await Promise.resolve();
  }
}

describe('handleAskRequest query logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (generateScriptureGuide as jest.Mock).mockResolvedValue(mockResponse);
  });

  it('logs the query when the caller is authenticated', async () => {
    const mockSupabase = {};
    (getAuthenticatedSupabaseClient as jest.Mock).mockResolvedValue({
      userId: 'user_123',
      supabase: mockSupabase,
    });
    (logAskQuery as jest.Mock).mockResolvedValue(undefined);

    const response = await handleAskRequest(requestFor('What is dharma?', { authorization: 'Bearer good-token' }));
    await flush();

    expect(response.status).toBe(200);
    expect(logAskQuery).toHaveBeenCalledWith(
      mockSupabase,
      'user_123',
      expect.objectContaining({ question: 'What is dharma?', topic: 'career_dharma', mode: 'quick' }),
    );
  });

  it('does not log when the caller is not authenticated', async () => {
    (getAuthenticatedSupabaseClient as jest.Mock).mockResolvedValue(null);

    const response = await handleAskRequest(requestFor('What is dharma?'));
    await flush();

    expect(response.status).toBe(200);
    expect(logAskQuery).not.toHaveBeenCalled();
  });

  it('still returns the AI response even if logging rejects', async () => {
    (getAuthenticatedSupabaseClient as jest.Mock).mockResolvedValue({
      userId: 'user_123',
      supabase: {},
    });
    (logAskQuery as jest.Mock).mockRejectedValue(new Error('boom'));

    const response = await handleAskRequest(requestFor('What is dharma?', { authorization: 'Bearer good-token' }));
    const payload = await response.json();
    await flush();

    expect(response.status).toBe(200);
    expect(payload).toEqual(mockResponse);
  });
});

// Everything above mocks '@/lib/server/auth' and '@/lib/server/askQueryLog' at the
// module boundary, so the real wiring between getAuthenticatedSupabaseClient and
// logAskQuery is never exercised together. This block runs the REAL auth module and
// the REAL logger, with only the underlying SupabaseClient (via '@supabase/supabase-js'
// createClient) mocked out — the same pattern used in auth.test.ts and
// dailyArthReflection.test.ts.
describe('handleAskRequest end-to-end auth -> log wiring (integration)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    (generateScriptureGuide as jest.Mock).mockResolvedValue(mockResponse);
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'secret-key';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('flows the real auth verification result into the real logger write', async () => {
    const actualAuth = jest.requireActual('@/lib/server/auth') as typeof import('@/lib/server/auth');
    const actualLog = jest.requireActual('@/lib/server/askQueryLog') as typeof import('@/lib/server/askQueryLog');
    (getAuthenticatedSupabaseClient as jest.Mock).mockImplementation(actualAuth.getAuthenticatedSupabaseClient);
    (logAskQuery as jest.Mock).mockImplementation(actualLog.logAskQuery);

    const mockGetUser = jest.fn().mockResolvedValue({ data: { user: { id: 'user_123' } }, error: null });
    const maybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));
    const upsert = jest.fn().mockResolvedValue({ data: null, error: null });
    const from = jest.fn(() => ({ select, upsert }));
    const mockSupabaseClient = { auth: { getUser: mockGetUser }, from };
    mockCreateClient.mockReturnValueOnce(mockSupabaseClient as never);

    const response = await handleAskRequest(requestFor('What is dharma?', { authorization: 'Bearer good-token' }));
    await flush();

    expect(response.status).toBe(200);
    expect(mockGetUser).toHaveBeenCalledWith('good-token');
    expect(from).toHaveBeenCalledWith('user_ask_queries');
    expect(select).toHaveBeenCalledWith('queries');
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user_123',
        queries: expect.arrayContaining([
          expect.objectContaining({
            question: 'What is dharma?',
            topic: 'career_dharma',
            mode: 'quick',
          }),
        ]),
        updated_at: expect.any(String),
      }),
      { onConflict: 'user_id' },
    );
  });
});
