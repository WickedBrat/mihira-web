const mockFetch = jest.fn();
global.fetch = mockFetch;

import { geminiChat } from '@/lib/ai/gemini';

describe('geminiChat', () => {
  beforeEach(() => mockFetch.mockReset());

  it('calls Gemini API with correct headers', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Hello' } }] }),
    });
    const result = await geminiChat('gemini-2.5-flash', [{ role: 'user', content: 'hi' }]);
    expect(result).toBe('Hello');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      })
    );
  });

  it('throws when API key missing', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(geminiChat('gemini-2.5-flash', [])).rejects.toThrow('GEMINI_API_KEY');
  });
});
