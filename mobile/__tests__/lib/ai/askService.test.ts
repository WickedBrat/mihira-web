jest.mock('@/lib/ai/claude', () => ({ claudeChat: jest.fn() }));

import { claudeChat } from '@/lib/ai/claude';
import { generateScriptureGuide } from '@/lib/ai/askService';

const mockClaudeChat = claudeChat as jest.MockedFunction<typeof claudeChat>;

describe('generateScriptureGuide', () => {
  beforeEach(() => mockClaudeChat.mockReset());

  it('constrains source ids to the retrieved set and trims over-long lists instead of failing', async () => {
    mockClaudeChat.mockImplementationOnce(async (_messages, options) => {
      const schema = options?.schema as any;
      const ids: string[] = schema.properties.source_reasons.items.properties.source_id.enum;
      return JSON.stringify({
        answer: { title: null, summary: 'Act.', practical_guidance: 'Do the next task.' },
        source_reasons: [...ids, ids[0]].map((id) => ({ source_id: id, relevance_reason: 'r' })),
        interpretation: { synthesis: 'syn', alternate_view: null },
        action_steps: ['a', ' ', 'b'],
        follow_up_prompts: ['1', '2', '3', '4', '5'],
      });
    });

    const result = await generateScriptureGuide({ message: 'I am afraid to leave a job that feels wrong.', mode: 'quick' });

    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.sources.length).toBeLessThanOrEqual(3);
    expect(new Set(result.sources.map((s) => s.id)).size).toBe(result.sources.length);
    expect(result.answer.title).toBeUndefined();
    expect(result.interpretation.alternate_view).toBeUndefined();
    expect(result.action_steps).toEqual(['a', 'b']);
    expect(result.follow_up_prompts).toHaveLength(3);
    expect(mockClaudeChat.mock.calls[0][1]).toMatchObject({ effort: 'low' });
  });
});
