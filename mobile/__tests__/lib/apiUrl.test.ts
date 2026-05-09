const originalApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

function loadApiUrl({
  hostUri,
  apiBaseUrl,
  platform = 'ios',
}: {
  hostUri?: string;
  apiBaseUrl?: string;
  platform?: 'ios' | 'android' | 'web';
} = {}) {
  jest.resetModules();
  jest.doMock('expo-constants', () => ({
    __esModule: true,
    default: {
      expoConfig: {
        ...(hostUri ? { hostUri } : {}),
        ...(apiBaseUrl ? { extra: { apiBaseUrl } } : {}),
      },
    },
  }));
  jest.doMock('react-native', () => ({
    Platform: { OS: platform },
  }));

  return require('@/lib/apiUrl') as typeof import('@/lib/apiUrl');
}

describe('apiUrl', () => {
  afterEach(() => {
    jest.dontMock('expo-constants');
    jest.dontMock('react-native');
    jest.resetModules();
    if (originalApiBaseUrl === undefined) {
      delete process.env.EXPO_PUBLIC_API_BASE_URL;
    } else {
      process.env.EXPO_PUBLIC_API_BASE_URL = originalApiBaseUrl;
    }
  });

  it('uses configured API base before Expo hostUri', () => {
    process.env.EXPO_PUBLIC_API_BASE_URL = 'https://www.getmihira.com';
    const { apiUrl } = loadApiUrl({ hostUri: 'localhost:8081' });

    expect(apiUrl('/api/wisdom/daily-arth-reflection')).toBe(
      'https://www.getmihira.com/v1/api/wisdom/daily-arth-reflection'
    );
  });

  it('uses Expo extra API base when public env is unavailable', () => {
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
    const { apiUrl } = loadApiUrl({ apiBaseUrl: 'https://api.getmihira.com/' });

    expect(apiUrl('/api/ask')).toBe('https://api.getmihira.com/v1/api/ask');
  });

  it('ignores unresolved app.json env placeholders', () => {
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
    const { apiUrl } = loadApiUrl({ apiBaseUrl: '${EXPO_PUBLIC_API_BASE_URL}' });

    expect(apiUrl('/api/ask')).toBe('https://www.getmihira.com/v1/api/ask');
  });

  it('keeps Expo hostUri for web local API routes when no base URL is configured', () => {
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
    const { apiUrl } = loadApiUrl({ hostUri: 'localhost:8081', platform: 'web' });

    expect(apiUrl('/api/wisdom/daily-arth-reflection')).toBe(
      'http://localhost:8081/api/wisdom/daily-arth-reflection'
    );
  });

  it('normalizes production API paths with the v1 prefix', () => {
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
    const { apiUrl } = loadApiUrl();

    expect(apiUrl('/api/wisdom/daily-arth-reflection')).toBe(
      'https://www.getmihira.com/v1/api/wisdom/daily-arth-reflection'
    );
  });

  it('does not send native builds to the Expo hostUri backend fallback', () => {
    delete process.env.EXPO_PUBLIC_API_BASE_URL;
    const { apiUrl } = loadApiUrl({ hostUri: 'localhost:8081', platform: 'ios' });

    expect(apiUrl('/api/wisdom/daily-arth-reflection')).toBe(
      'https://www.getmihira.com/v1/api/wisdom/daily-arth-reflection'
    );
  });
});
