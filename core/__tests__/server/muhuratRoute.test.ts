jest.mock('@core/ai/claude', () => ({ claudeChat: jest.fn() }));

import { claudeChat } from '@core/ai/claude';
import { MUHURAT_RANK_SCHEMA, MUHURAT_SCHEMA, MUHURAT_ESTIMATE_WARNING } from '@core/ai/prompts';
import { handleMuhuratWisdomRequest } from '@core/server/routes/muhurat';

const mockClaudeChat = claudeChat as jest.MockedFunction<typeof claudeChat>;

function post(body: Record<string, unknown>) {
  return handleMuhuratWisdomRequest(new Request('http://localhost/api/wisdom/muhurat', {
    method: 'POST',
    body: JSON.stringify(body),
  }));
}

describe('handleMuhuratWisdomRequest', () => {
  beforeEach(() => {
    mockClaudeChat.mockReset();
    jest.useFakeTimers({ now: new Date('2026-11-21T12:00:00Z'), doNotFake: ['nextTick', 'setImmediate', 'setTimeout', 'setInterval', 'queueMicrotask'] });
  });
  afterEach(() => jest.useRealTimers());

  it('ranks locally computed windows with the schema and maps technicalBasis to reasoning', async () => {
    mockClaudeChat.mockResolvedValueOnce(JSON.stringify({
      recommendation: 'Yes', confidence: 'High', suggestion: 'Pick id 2.', technicalBasis: 'Shukla tithi, Amrit.',
      warnings: 'None', festivalNote: null, ranked: [{ id: 2, score: 9 }, { id: 0, score: 8 }],
    }));

    const response = await post({
      eventDescription: 'Griha pravesh', startDate: '2026-11-22T12:00:00Z', endDate: '2026-11-28T12:00:00Z',
      lat: 40.52, lng: -74.41, timeZone: 'America/New_York', locationLabel: 'Edison, NJ',
    });
    const payload = await response.json();

    expect(mockClaudeChat.mock.calls[0][1]).toMatchObject({ schema: MUHURAT_RANK_SCHEMA });
    expect(payload).toMatchObject({ computedLocally: true, recommendation: 'Yes', reasoning: 'Shukla tithi, Amrit.', warnings: 'None' });
    expect(payload.rankedWindows[0].score).toBe(9);
  });

  it('computes long ranges locally, capped per day, and says when the range was clamped', async () => {
    mockClaudeChat.mockResolvedValueOnce(JSON.stringify({
      recommendation: 'Yes', confidence: 'Medium', suggestion: 's', technicalBasis: 't',
      warnings: 'None', festivalNote: null, ranked: [{ id: 0, score: 8 }],
    }));

    const response = await post({
      eventDescription: 'Buy a house', startDate: '2026-11-22T12:00:00Z', endDate: '2027-06-30T12:00:00Z',
      lat: 40.52, lng: -74.41, timeZone: 'America/New_York',
    });
    const payload = await response.json();
    const prompt = mockClaudeChat.mock.calls[0][0][1].content as string;
    const candidateLines = prompt.split('CANDIDATE WINDOWS')[1].trim().split('\n').slice(1);

    expect(payload.computedLocally).toBe(true);
    expect(payload.warnings).toContain('first 120 days');
    expect(candidateLines.length).toBeLessThanOrEqual(2 * 122) // 121 days; night windows can start on a 122nd local date;
  });

  it('falls back to the IST estimate only without any location, and says so', async () => {
    mockClaudeChat.mockResolvedValueOnce(JSON.stringify({
      recommendation: 'Wait', confidence: 'Low', suggestion: 's', technicalBasis: 't', warnings: 'None', festivalNote: null,
      rankedWindows: [{ start: '2026-11-23T06:00:00+05:30', end: '2026-11-23T07:30:00+05:30', quality: 'Amrit', type: 'chaughadiya', score: 8 }],
    }));

    const response = await post({ eventDescription: 'Puja', startDate: '2026-11-22T12:00:00Z', endDate: '2026-11-28T12:00:00Z' });
    const payload = await response.json();

    expect(mockClaudeChat.mock.calls[0][1]).toMatchObject({ schema: MUHURAT_SCHEMA });
    expect(payload).toMatchObject({ computedLocally: false, warnings: MUHURAT_ESTIMATE_WARNING });
    expect(payload.rankedWindows[0].isAuspicious).toBe(true);
  });
});
