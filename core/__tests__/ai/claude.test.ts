const mockCreate = jest.fn();

jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    beta: { messages: { create: (...args: unknown[]) => mockCreate(...args) } },
  })),
}));

import { claudeChat } from '@core/ai/claude';

const schema = { type: 'object', properties: { a: { type: 'string' } }, required: ['a'], additionalProperties: false };

describe('claudeChat', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    process.env.ANTHROPIC_API_KEY = 'test-key';
  });

  it('sends system separately and passes the schema as output_config.format', async () => {
    mockCreate.mockResolvedValueOnce({ stop_reason: 'end_turn', content: [{ type: 'text', text: '{"a":"b"}' }] });

    const text = await claudeChat(
      [{ role: 'system', content: 'sys' }, { role: 'user', content: 'hi' }],
      { schema, effort: 'medium' },
    );

    expect(text).toBe('{"a":"b"}');
    const params = mockCreate.mock.calls[0][0];
    expect(params.system).toBe('sys');
    expect(params.messages).toEqual([{ role: 'user', content: 'hi' }]);
    expect(params.output_config).toEqual({ effort: 'medium', format: { type: 'json_schema', schema } });
  });

  it('defaults to low effort with no format for plain text', async () => {
    mockCreate.mockResolvedValueOnce({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'ok' }] });
    await claudeChat([{ role: 'user', content: 'hi' }]);
    expect(mockCreate.mock.calls[0][0].output_config).toEqual({ effort: 'low' });
  });

  it('fails loudly when a structured reply is truncated', async () => {
    mockCreate.mockResolvedValueOnce({ stop_reason: 'max_tokens', content: [{ type: 'text', text: '{"a":' }] });
    await expect(claudeChat([{ role: 'user', content: 'hi' }], { schema })).rejects.toThrow('max_tokens');
  });

  it('throws when the API key is missing', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    await expect(claudeChat([{ role: 'user', content: 'hi' }])).rejects.toThrow('ANTHROPIC_API_KEY');
  });
});
