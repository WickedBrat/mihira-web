import { parseModelJson } from '@/lib/ai/parseModelJson';

describe('parseModelJson', () => {
  it('parses strict JSON', () => {
    const parsed = parseModelJson<{ guidance: string; reasoning: string }>(
      '{"guidance":"Stay steady.","reasoning":"Moon supports reflection."}',
      ['guidance', 'reasoning']
    );

    expect(parsed.guidance).toBe('Stay steady.');
    expect(parsed.reasoning).toBe('Moon supports reflection.');
  });

  it('parses fenced JSON', () => {
    const parsed = parseModelJson<{ guidance: string; reasoning: string }>(
      '```json\n{"guidance":"Act clearly.","reasoning":"Sun strengthens the first house."}\n```',
      ['guidance', 'reasoning']
    );

    expect(parsed.guidance).toBe('Act clearly.');
  });

  it('extracts JSON when prose wraps it', () => {
    const parsed = parseModelJson<{ recommendation: string; suggestion: string; reasoning: string }>(
      'Here is your result:\n{"recommendation":"Wait","suggestion":"Pause until the stronger window.","reasoning":"Saturn slows momentum."}\nUse this wisely.',
      ['recommendation', 'suggestion', 'reasoning']
    );

    expect(parsed.recommendation).toBe('Wait');
  });

  it('throws when required keys are missing', () => {
    expect(() =>
      parseModelJson('{"guidance":"One key only."}', ['guidance', 'reasoning'])
    ).toThrow('AI response parse error');
  });
});
