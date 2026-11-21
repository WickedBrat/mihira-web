const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

import { claudeChat, claudeStream } from '@core/ai/claude';

const schema = { type: 'object', properties: { a: { type: 'string' } }, required: ['a'], additionalProperties: false };
const jsonResponse = (body: unknown) => ({ ok: true, json: async () => body });

describe('claudeChat', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    process.env.ANTHROPIC_API_KEY = 'test-key';
  });

  it('posts to the Messages API with system separate and the schema as output_config.format', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ stop_reason: 'end_turn', content: [{ type: 'text', text: '{"a":"b"}' }] }));

    const text = await claudeChat(
      [{ role: 'system', content: 'sys' }, { role: 'user', content: 'hi' }],
      { schema, effort: 'medium' },
    );

    expect(text).toBe('{"a":"b"}');
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(init.headers).toMatchObject({ 'x-api-key': 'test-key', 'anthropic-version': '2023-06-01' });
    const body = JSON.parse(init.body);
    expect(body.system).toBe('sys');
    expect(body.messages).toEqual([{ role: 'user', content: 'hi' }]);
    expect(body.output_config).toEqual({ effort: 'medium', format: { type: 'json_schema', schema } });
  });

  it('defaults to low effort with no format for plain text', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] }));
    await claudeChat([{ role: 'user', content: 'hi' }]);
    expect(JSON.parse(mockFetch.mock.calls[0][1].body).output_config).toEqual({ effort: 'low' });
  });

  it('fails loudly when a structured reply is truncated', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"a":' }] }));
    await expect(claudeChat([{ role: 'user', content: 'hi' }], { schema })).rejects.toThrow('max_tokens');
  });

  it('surfaces API errors with the status', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401, text: async () => 'invalid x-api-key' });
    await expect(claudeChat([{ role: 'user', content: 'hi' }])).rejects.toThrow('Claude API error 401');
  });

  it('throws when the API key is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    await expect(claudeChat([{ role: 'user', content: 'hi' }])).rejects.toThrow('ANTHROPIC_API_KEY');
  });
});

describe('claudeStream', () => {
  it('emits text deltas from server-sent events', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    const sse = [
      'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hel"}}\n\n',
      'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"lo"}}\n\n',
      'event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"}}\n\n',
    ];
    const encoder = new TextEncoder();
    let i = 0;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => ({ read: async () => (i < sse.length ? { done: false, value: encoder.encode(sse[i++]) } : { done: true, value: undefined }) }) },
    });

    const tokens: string[] = [];
    await claudeStream([{ role: 'user', content: 'hi' }], (t) => tokens.push(t));
    expect(tokens.join('')).toBe('Hello');
    expect(JSON.parse(mockFetch.mock.calls[0][1].body).stream).toBe(true);
  });
});
