import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@mihira/onboarding-completed';

export async function getOnboardingCompleted(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)) === 'true';
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  if (completed) {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    return;
  }

  await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
}

export async function clearOnboardingCompleted(): Promise<void> {
  await setOnboardingCompleted(false);
}
