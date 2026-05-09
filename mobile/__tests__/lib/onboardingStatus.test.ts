import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearOnboardingCompleted,
  getOnboardingCompleted,
  getOnboardingState,
  setOnboardingCompleted,
  setOnboardingStep,
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

    await expect(AsyncStorage.getItem('@mihira/onboarding-completed:v3')).resolves.toBe('true');
    await expect(AsyncStorage.getItem('@mihira/onboarding-step:v1')).resolves.toBe('completed');
    await expect(getOnboardingCompleted()).resolves.toBe(true);
  });

  it('stores and reads the current onboarding step', async () => {
    await setOnboardingStep('/onboarding/step-5');

    await expect(getOnboardingState()).resolves.toEqual({
      completed: false,
      step: '/onboarding/step-5',
    });
  });

  it('clears current and legacy completion keys', async () => {
    await AsyncStorage.multiSet([
      ['@mihira/onboarding-completed', 'true'],
      ['@mihira/onboarding-completed:v1', 'true'],
      ['@mihira/onboarding-completed:v2', 'true'],
      ['@mihira/onboarding-completed:v3', 'true'],
      ['@mihira/onboarding-step:v1', '/onboarding/step-7'],
    ]);

    await clearOnboardingCompleted();

    await expect(AsyncStorage.getItem('@mihira/onboarding-completed')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('@mihira/onboarding-completed:v1')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('@mihira/onboarding-completed:v2')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('@mihira/onboarding-completed:v3')).resolves.toBeNull();
    await expect(AsyncStorage.getItem('@mihira/onboarding-step:v1')).resolves.toBeNull();
  });
});
