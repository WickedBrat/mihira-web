import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearOnboardingCompleted,
  getOnboardingCompleted,
  setOnboardingCompleted,
} from '@/lib/onboardingStatus';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('onboardingStatus', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('does not treat the legacy completion key as completed', async () => {
    await AsyncStorage.setItem('@mihira/onboarding-completed', 'true');

    await expect(getOnboardingCompleted()).resolves.toBe(false);
  });

  it('stores completion under the current versioned key', async () => {
    await setOnboardingCompleted(true);

    await expect(AsyncStorage.getItem('@mihira/onboarding-completed:v1')).resolves.toBe('true');
    await expect(getOnboardingCompleted()).resolves.toBe(true);
  });

  it('clears current and legacy completion keys', async () => {
    await AsyncStorage.multiSet([
      ['@mihira/onboarding-completed', 'true'],
      ['@mihira/onboarding-completed:v1', 'true'],
    ]);

    await clearOnboardingCompleted();

    await expect(AsyncStorage.getItem('@mihira/onboarding-completed')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('@mihira/onboarding-completed:v1')).resolves.toBeNull();
  });
});
