import { classifyAskQuestion, retrieveScriptureCandidates } from '@/lib/ai/scriptureRetrieval';

describe('scriptureRetrieval', () => {
  it('classifies a career and fear question', () => {
    const result = classifyAskQuestion('I am afraid to leave a job that no longer feels right.');
    expect(result.primary_topic).toBe('career_dharma');
    expect(result.secondary_topics).toContain('fear');
  });

  it('retrieves duty-oriented passages for work dilemmas', () => {
    const classification = classifyAskQuestion('I feel trapped in my career and afraid to act.');
    const result = retrieveScriptureCandidates('I feel trapped in my career and afraid to act.', 'quick', classification);

    expect(result.length).toBeGreaterThan(0);
    expect(result.some((entry) => entry.id === 'gita-2-47')).toBe(true);
  });
});
