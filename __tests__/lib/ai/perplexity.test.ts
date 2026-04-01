const mockFetch = jest.fn();
global.fetch = mockFetch;

import { perplexityChat } from '@/lib/ai/perplexity';

describe('perplexityChat', () => {
  beforeEach(() => mockFetch.mockReset());

  it('calls Perplexity API with correct headers', async () => {
    process.env.PERPLEXITY_API_KEY = 'test-key';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Hello' } }] }),
    });
    const result = await perplexityChat('sonar', [{ role: 'user', content: 'hi' }]);
    expect(result).toBe('Hello');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.perplexity.ai/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
      })
    );
  });

  it('throws when API key missing', async () => {
    delete process.env.PERPLEXITY_API_KEY;
    await expect(perplexityChat('sonar', [])).rejects.toThrow('PERPLEXITY_API_KEY');
  });
});
