jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/ai/perplexity', () => ({
  perplexityChat: jest.fn(),
}));

import { createClient } from '@supabase/supabase-js';
import { perplexityChat } from '@/lib/ai/perplexity';
import { handleDailyArthReflectionRequest } from '@/lib/server/routes/dailyArthReflection';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockPerplexityChat = perplexityChat as jest.MockedFunction<typeof perplexityChat>;

const reflection = {
  summary: 'Act without clinging.',
  explanation: 'The quote asks for steady action without grasping at outcomes.',
  dailyPractice: ['Do one clear task.', 'Pause before reacting.', 'Release the result.'],
  reflectionPrompts: ['Where am I forcing an outcome?', 'What is mine to do?', 'What can I release?'],
  mantra: 'I act clearly and release the result.',
};

function requestForQuote() {
  return new Request('http://localhost/api/wisdom/daily-arth-reflection', {
    method: 'POST',
    body: JSON.stringify({
      quoteId: 42,
      quote: 'You have a right to your actions.',
      source: 'Bhagavad Gita',
    }),
  });
}

function selectBuilder(result: unknown) {
  const single = jest.fn().mockResolvedValue(result);
  const eq = jest.fn(() => ({ single }));
  const select = jest.fn(() => ({ eq }));
  return { select, eq, single };
}

function updateBuilder(result: unknown) {
  const single = jest.fn().mockResolvedValue(result);
  const select = jest.fn(() => ({ single }));
  const eq = jest.fn(() => ({ select }));
  const update = jest.fn(() => ({ eq }));
  return { update, eq, select, single };
}

describe('handleDailyArthReflectionRequest', () => {
  const originalEnv = { ...process.env };
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'secret-key';
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    consoleErrorSpy.mockRestore();
  });

  it('returns the stored database reflection without calling AI', async () => {
    const select = selectBuilder({
      data: {
        id: 42,
        quote: 'You have a right to your actions.',
        source: 'Bhagavad Gita',
        daily_reflection: reflection,
      },
      error: null,
    });
    const from = jest.fn(() => select);
    mockCreateClient.mockReturnValueOnce({ from } as never);

    const response = await handleDailyArthReflectionRequest(requestForQuote());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ reflection, source: 'database' });
    expect(mockPerplexityChat).not.toHaveBeenCalled();
  });

  it('fails before calling Supabase when the secret key is missing', async () => {
    delete process.env.SUPABASE_SECRET_KEY;

    const response = await handleDailyArthReflectionRequest(requestForQuote());
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe('Missing Supabase URL or secret key for Daily Arth reflection');
    expect(mockCreateClient).not.toHaveBeenCalled();
    expect(mockPerplexityChat).not.toHaveBeenCalled();
  });

  it('generates and persists the reflection before returning it', async () => {
    const select = selectBuilder({
      data: {
        id: 42,
        quote: 'You have a right to your actions.',
        source: 'Bhagavad Gita',
        daily_reflection: null,
      },
      error: null,
    });
    const update = updateBuilder({
      data: { daily_reflection: reflection },
      error: null,
    });
    const from = jest.fn()
      .mockReturnValueOnce(select)
      .mockReturnValueOnce(update);
    mockCreateClient.mockReturnValueOnce({ from } as never);
    mockPerplexityChat.mockResolvedValueOnce(JSON.stringify(reflection));

    const response = await handleDailyArthReflectionRequest(requestForQuote());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ reflection, source: 'llm_and_database' });
    expect(update.update).toHaveBeenCalledWith({ daily_reflection: reflection });
  });

  it('fails when the generated reflection cannot be persisted', async () => {
    const select = selectBuilder({
      data: {
        id: 42,
        quote: 'You have a right to your actions.',
        source: 'Bhagavad Gita',
        daily_reflection: null,
      },
      error: null,
    });
    const update = updateBuilder({
      data: null,
      error: { message: 'permission denied' },
    });
    const from = jest.fn()
      .mockReturnValueOnce(select)
      .mockReturnValueOnce(update);
    mockCreateClient.mockReturnValueOnce({ from } as never);
    mockPerplexityChat.mockResolvedValueOnce(JSON.stringify(reflection));

    const response = await handleDailyArthReflectionRequest(requestForQuote());
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBe('Failed to save Daily Arth reflection');
  });
});
