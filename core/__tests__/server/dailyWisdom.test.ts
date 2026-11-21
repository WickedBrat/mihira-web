jest.mock('@core/ai/claude', () => ({ claudeChat: jest.fn() }));
jest.mock('@core/vedic/geocode', () => ({ geocode: jest.fn() }));

import { claudeChat } from '@core/ai/claude';
import { geocode } from '@core/vedic/geocode';
import { DAILY_SCHEMA } from '@core/ai/prompts';
import { buildTodayContext, handleDailyWisdomRequest, toFocusAreas } from '@core/server/routes/daily';
import type { BirthChart } from '@core/vedic/types';

const mockClaudeChat = claudeChat as jest.MockedFunction<typeof claudeChat>;
const mockGeocode = geocode as jest.MockedFunction<typeof geocode>;

const edison = { lat: 40.52, lng: -74.41, timeZone: 'America/New_York', label: 'Edison, NJ', source: 'client' as const };
const chart = { lagna: 'Leo', lagnaLongitude: 130, planets: [], nakshatra: 'Rohini', currentDasha: 'Jupiter-Mars' } as unknown as BirthChart;
const TIME_LABEL = /^\d{1,2}:\d{2}\s?[AP]M – \d{1,2}:\d{2}\s?[AP]M$/;

describe('buildTodayContext', () => {
  it('lists only computed windows still ahead today at the user\'s location', () => {
    const now = new Date('2026-11-21T12:00:00Z'); // 7:00 AM in New Jersey
    const today = buildTodayContext(chart, edison, now);

    expect(today.windows.length).toBeGreaterThan(0);
    today.windows.forEach((w) => expect(w.label).toMatch(TIME_LABEL));
    expect(today.dateLabel).toBe('Saturday, November 21, 2026');
    expect(today.transits.planets.find((p) => p.name === 'Moon')).toBeDefined();
  });

  it('has no windows when the location is unknown', () => {
    expect(buildTodayContext(chart, null, new Date('2026-11-21T12:00:00Z')).windows).toEqual([]);
  });
});

describe('toFocusAreas', () => {
  const windows = [
    { id: 0, label: '7:00 AM – 8:20 AM', quality: 'Labh' },
    { id: 1, label: '11:24 AM – 12:12 PM', quality: 'Abhijit' },
  ];
  const area = { area: 'Work', action: 'Draft the report.', suggestion: 's', jyotishBasis: 'b' };

  it('uses the computed label for the chosen window and maps jyotishBasis to reasoning', () => {
    const [first] = toFocusAreas([{ ...area, windowId: 1 }], windows);
    expect(first).toMatchObject({ timeRange: '11:24 AM – 12:12 PM', reasoning: 'b' });
  });

  it('falls back to an unused computed window for an unknown id, then to a neutral label', () => {
    const result = toFocusAreas(
      [{ ...area, windowId: 0 }, { ...area, windowId: 99 }, { ...area, windowId: null }],
      windows,
    );
    expect(result.map((f) => f.timeRange)).toEqual(['7:00 AM – 8:20 AM', '11:24 AM – 12:12 PM', 'Any time today']);
  });
});

describe('handleDailyWisdomRequest', () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: new Date('2026-11-21T12:00:00Z'), doNotFake: ['nextTick', 'setImmediate', 'setTimeout', 'setInterval', 'queueMicrotask'] });
    mockGeocode.mockResolvedValue({ lat: 28.61, lng: 77.21 });
  });
  afterEach(() => jest.useRealTimers());

  it('sends the schema and returns only computed times', async () => {
    mockClaudeChat.mockResolvedValueOnce(JSON.stringify({
      focusAreas: [
        { area: 'Work', action: 'Draft the report.', windowId: 0, suggestion: 's1', jyotishBasis: 'b1' },
        { area: 'Home', action: 'Cook dinner.', windowId: 1, suggestion: 's2', jyotishBasis: 'b2' },
        { area: 'Rest', action: 'Walk after lunch.', windowId: 2, suggestion: 's3', jyotishBasis: 'b3' },
      ],
    }));

    const response = await handleDailyWisdomRequest(new Request('http://localhost/api/wisdom/daily', {
      method: 'POST',
      headers: {
        'x-vercel-ip-latitude': '40.52', 'x-vercel-ip-longitude': '-74.41',
        'x-vercel-ip-timezone': 'America/New_York', 'x-vercel-ip-city': 'Edison', 'x-vercel-ip-country-region': 'NJ',
      },
      body: JSON.stringify({ birthDt: '15/05/1990, 2:30 PM', birthPlace: 'New Delhi, India' }),
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(mockClaudeChat.mock.calls[0][1]).toMatchObject({ schema: DAILY_SCHEMA });
    expect(mockClaudeChat.mock.calls[0][0][1].content).toContain('Edison, NJ');
    expect(payload.focusAreas).toHaveLength(3);
    payload.focusAreas.forEach((f: { timeRange: string }) => expect(f.timeRange).toMatch(TIME_LABEL));
    expect(payload.focusAreas[0].reasoning).toBe('b1');
  });
});
