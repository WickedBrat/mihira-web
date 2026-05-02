import { buildSafetyResponse, detectAskSafetyBoundary } from '@/lib/ai/scriptureSafety';

describe('scriptureSafety', () => {
  it('detects self-harm language', () => {
    const result = detectAskSafetyBoundary('I want to kill myself tonight.');
    expect(result.has_boundary).toBe(true);
    expect(result.escalation_type).toBe('self_harm');
  });

  it('builds a bounded safety response', () => {
    const response = buildSafetyResponse('quick', 'I want to hurt myself', {
      has_boundary: true,
      escalation_type: 'self_harm',
      note: 'This needs immediate human support.',
    });

    expect(response.sources).toEqual([]);
    expect(response.answer.title).toBe('Human Help First');
  });
});
