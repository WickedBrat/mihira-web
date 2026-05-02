import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@mihira/onboarding-completed:v1';
const LEGACY_ONBOARDING_COMPLETED_KEY = '@mihira/onboarding-completed';

export async function getOnboardingCompleted(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)) === 'true';
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  if (completed) {
    await Promise.all([
      AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true'),
      AsyncStorage.removeItem(LEGACY_ONBOARDING_COMPLETED_KEY),
    ]);
    return;
  }

  await Promise.all([
    AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY),
    AsyncStorage.removeItem(LEGACY_ONBOARDING_COMPLETED_KEY),
  ]);
}

export async function clearOnboardingCompleted(): Promise<void> {
  await setOnboardingCompleted(false);
}
