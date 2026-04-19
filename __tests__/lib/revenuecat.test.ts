type ReactNativeMockOptions = {
  nativeModules?: Record<string, unknown>;
  platform?: 'ios' | 'android' | 'web';
  expoGo?: boolean;
};

function loadRevenueCatModule({
  nativeModules = {},
  platform = 'ios',
  expoGo = false,
}: ReactNativeMockOptions = {}) {
  jest.resetModules();
  jest.doMock('react-native', () => ({
    NativeModules: nativeModules,
    Platform: { OS: platform },
  }));

  if (expoGo) {
    (globalThis as { expo?: { modules?: { ExpoGo?: boolean } } }).expo = {
      modules: { ExpoGo: true },
    };
  } else {
    delete (globalThis as { expo?: unknown }).expo;
  }

  return require('@/lib/revenuecat') as typeof import('@/lib/revenuecat');
}

describe('revenuecat native UI availability', () => {
  afterEach(() => {
    jest.dontMock('react-native');
    jest.resetModules();
    delete (globalThis as { expo?: unknown }).expo;
  });

  it('reports native UI support when both RevenueCat UI modules are available', () => {
    const revenuecat = loadRevenueCatModule({
      nativeModules: {
        RNCustomerCenter: {},
        RNPaywalls: {},
      },
      platform: 'ios',
    });

    expect(revenuecat.hasRevenueCatNativeUiModules()).toBe(true);
  });

  it('reports no native UI support on web', () => {
    const revenuecat = loadRevenueCatModule({ platform: 'web' });

    expect(revenuecat.hasRevenueCatNativeUiModules()).toBe(false);
    expect(revenuecat.getRevenueCatUiUnavailableMessage()).toBe(
      'Subscriptions are currently handled inside the iPhone and Android apps.'
    );
  });

  it('returns an Expo Go specific guidance message when native UI is unavailable there', () => {
    const revenuecat = loadRevenueCatModule({
      expoGo: true,
      platform: 'ios',
    });

    expect(revenuecat.hasRevenueCatNativeUiModules()).toBe(false);
    expect(revenuecat.getRevenueCatUiUnavailableMessage()).toContain(
      'RevenueCat paywalls require a development build or production app'
    );
  });

  it('returns a rebuild guidance message when native UI modules are missing outside Expo Go', () => {
    const revenuecat = loadRevenueCatModule({ platform: 'android' });

    expect(revenuecat.hasRevenueCatNativeUiModules()).toBe(false);
    expect(revenuecat.getRevenueCatUiUnavailableMessage()).toContain(
      'Rebuild the app after linking the RevenueCat native modules.'
    );
  });
});
