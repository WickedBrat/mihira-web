const mockFetch = jest.fn();
global.fetch = mockFetch;

import { geocode } from '@/lib/vedic/geocode';

describe('geocode', () => {
  beforeEach(() => mockFetch.mockReset());

  it('returns lat/lng from Nominatim response', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [{ lat: '19.0760', lon: '72.8777' }],
    });
    const result = await geocode('Mumbai, India');
    expect(result).toEqual({ lat: 19.076, lng: 72.8777 });
  });

  it('throws when no results returned', async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => [] });
    await expect(geocode('xyznonexistentplace')).rejects.toThrow('Could not geocode');
  });
});
