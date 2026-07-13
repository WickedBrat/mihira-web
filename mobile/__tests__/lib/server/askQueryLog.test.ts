import { logAskQuery } from '@/lib/server/askQueryLog';
import type { AskQueryLogEntry } from '@/features/ask/types';

function buildSupabaseMock() {
  const mockMaybeSingle = jest.fn();
  const mockEq = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelect = jest.fn(() => ({ eq: mockEq }));
  const mockUpsert = jest.fn();
  const mockFrom = jest.fn(() => ({ select: mockSelect, upsert: mockUpsert }));
  const supabase = { from: mockFrom } as never;
  return { supabase, mockFrom, mockSelect, mockEq, mockMaybeSingle, mockUpsert };
}

describe('logAskQuery', () => {
  const entry: AskQueryLogEntry = {
    question: 'What is dharma?',
    topic: 'career_dharma',
    mode: 'quick',
    timestamp: '2026-07-13T10:00:00.000Z',
  };

  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('appends the new entry to an existing queries array and upserts it', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({
      data: { queries: [{ question: 'Old question', topic: 'general', mode: 'quick', timestamp: '2026-07-01T00:00:00.000Z' }] },
      error: null,
    });
    mock.mockUpsert.mockResolvedValueOnce({ error: null });

    await logAskQuery(mock.supabase, 'user_123', entry);

    expect(mock.mockFrom).toHaveBeenCalledWith('user_ask_queries');
    expect(mock.mockSelect).toHaveBeenCalledWith('queries');
    expect(mock.mockEq).toHaveBeenCalledWith('user_id', 'user_123');
    expect(mock.mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user_123',
        queries: [
          { question: 'Old question', topic: 'general', mode: 'quick', timestamp: '2026-07-01T00:00:00.000Z' },
          entry,
        ],
      }),
      { onConflict: 'user_id' },
    );
  });

  it('starts a new array when the user has no existing row', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mock.mockUpsert.mockResolvedValueOnce({ error: null });

    await logAskQuery(mock.supabase, 'user_123', entry);

    expect(mock.mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'user_123', queries: [entry] }),
      { onConflict: 'user_id' },
    );
  });

  it('logs and does not throw when the select fails', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: { message: 'select failed' } });

    await expect(logAskQuery(mock.supabase, 'user_123', entry)).resolves.toBeUndefined();
    expect(mock.mockUpsert).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('logs and does not throw when the upsert fails', async () => {
    const mock = buildSupabaseMock();
    mock.mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mock.mockUpsert.mockResolvedValueOnce({ error: { message: 'upsert failed' } });

    await expect(logAskQuery(mock.supabase, 'user_123', entry)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });
});
