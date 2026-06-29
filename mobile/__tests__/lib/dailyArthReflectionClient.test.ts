jest.mock('@/lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

import { apiFetch } from '@/lib/apiFetch';
import { getDailyArthReflection } from '@/lib/dailyArthReflectionClient';

const mockApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

const reflection = {
  summary: 'Act without clinging.',
  explanation: 'The quote asks for steady action without grasping at outcomes.',
  dailyPractice: ['Do one clear task.', 'Pause before reacting.', 'Release the result.'],
  reflectionPrompts: ['Where am I forcing an outcome?', 'What is mine to do?', 'What can I release?'],
  mantra: 'I act clearly and release the result.',
};

describe('getDailyArthReflection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches through the API so the server can check and update the database', async () => {
    mockApiFetch.mockResolvedValueOnce(new Response(JSON.stringify({ reflection }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));

    const result = await getDailyArthReflection({
      quoteId: 42,
      quote: 'You have a right to your actions.',
      source: 'Bhagavad Gita',
    });

    expect(result).toEqual(reflection);
    expect(mockApiFetch).toHaveBeenCalledWith('/api/wisdom/daily-arth-reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteId: 42,
        quote: 'You have a right to your actions.',
        source: 'Bhagavad Gita',
      }),
    });
  });
});
