jest.mock('@/lib/ai/perplexity', () => ({
  perplexityChat: jest.fn(),
}));

import { POST } from '@/app/api/ask+api';
import { perplexityChat } from '@/lib/ai/perplexity';

const mockPerplexityChat = perplexityChat as jest.MockedFunction<typeof perplexityChat>;

describe('/api/ask', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('returns a scripture-grounded response for quick mode', async () => {
    mockPerplexityChat.mockResolvedValueOnce(JSON.stringify({
      answer: {
        title: 'Act Without Clinging',
        summary: 'You do not need to wait for certainty before doing what is right.',
        practical_guidance: 'Do the next honest task and release the fantasy of total control.',
      },
      source_reasons: [
        {
          source_id: 'gita-2-47',
          relevance_reason: 'It addresses action without attachment to results.',
        },
      ],
      interpretation: {
        synthesis: 'The Gita reframes this moment as duty with less grasping.',
      },
      action_steps: ['Finish one necessary task before seeking reassurance.'],
      follow_up_prompts: ['What does the Gita say about fear?'],
    }));

    const response = await POST(new Request('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        message: 'I am afraid to leave a job that feels wrong.',
        mode: 'quick',
      }),
    }));

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.answer.title).toBe('Act Without Clinging');
    expect(payload.sources[0].id).toBe('gita-2-47');
  });

  it('returns a safe boundary response without calling the model', async () => {
    const response = await POST(new Request('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        message: 'I want to kill myself tonight.',
        mode: 'quick',
      }),
    }));

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.safety.has_boundary).toBe(true);
    expect(mockPerplexityChat).not.toHaveBeenCalled();
  });

  it('returns a fallback response when retrieval is empty', async () => {
    const response = await POST(new Request('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        message: 'zzzz qqqq xxxx unheard phrase',
        mode: 'quick',
      }),
    }));

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.sources).toEqual([]);
    expect(payload.answer.title).toBe('Try A More Specific Question');
  });

  it('returns 502 on malformed model output', async () => {
    mockPerplexityChat.mockResolvedValueOnce('not json');

    const response = await POST(new Request('http://localhost/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        message: 'I am afraid to leave a job that feels wrong.',
        mode: 'quick',
      }),
    }));

    expect(response.status).toBe(502);
  });
});
