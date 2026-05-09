import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSupabaseClient } from '@/lib/supabase';
import { USER_DETAILS_TABLE, USER_DETAILS_USER_ID_COLUMN } from '@/lib/userDetails';
import type { OnboardingData } from '@/lib/onboardingStore';

const ONBOARDING_COMPLETED_KEY = '@mihira/onboarding-completed:v3';
const LEGACY_ONBOARDING_COMPLETED_KEY = '@mihira/onboarding-completed';
const ONBOARDING_COMPLETED_V1_KEY = '@mihira/onboarding-completed:v1';
const ONBOARDING_COMPLETED_V2_KEY = '@mihira/onboarding-completed:v2';
const ONBOARDING_STEP_KEY = '@mihira/onboarding-step:v1';

type OnboardingStatusOptions = {
  userId?: string | null;
};

type OnboardingCompletionOptions = OnboardingStatusOptions & {
  onboardingData?: OnboardingData;
  onboardingStep?: string | null;
};

export type OnboardingFlowState = {
  completed: boolean;
  step: string | null;
};

function serializeOnboardingData(data: OnboardingData) {
  return {
    ...data,
    birthDate: data.birthDate.toISOString(),
    birthTime: data.birthTime.toISOString(),
  };
}

async function getLocalOnboardingState(): Promise<OnboardingFlowState> {
  const [completedValue, step] = await Promise.all([
    AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
    AsyncStorage.getItem(ONBOARDING_STEP_KEY),
  ]);

  return {
    completed: completedValue === 'true',
    step,
  };
}

async function upsertRemoteOnboardingState(
  userId: string,
  patch: {
    onboarding_completed?: boolean;
    onboarding_step?: string | null;
    onboarding_data?: ReturnType<typeof serializeOnboardingData>;
  }
) {
  const client = getSupabaseClient();
  const { error } = await client
    .from(USER_DETAILS_TABLE)
    .upsert(
      {
        user_id: userId,
        ...patch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: USER_DETAILS_USER_ID_COLUMN }
    );

  if (error) throw error;
}

export async function getOnboardingState(options: OnboardingStatusOptions = {}): Promise<OnboardingFlowState> {
  if (options.userId) {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from(USER_DETAILS_TABLE)
        .select('onboarding_completed, onboarding_step')
        .eq(USER_DETAILS_USER_ID_COLUMN, options.userId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        return {
          completed: Boolean(data.onboarding_completed),
          step: typeof data.onboarding_step === 'string' ? data.onboarding_step : null,
        };
      }
    } catch (error) {
      console.error('[onboardingStatus] remote read error', error);
    }
  }

  return getLocalOnboardingState();
}

export async function getOnboardingCompleted(options: OnboardingStatusOptions = {}): Promise<boolean> {
  return (await getOnboardingState(options)).completed;
}

export async function setOnboardingStep(
  step: string,
  options: OnboardingStatusOptions = {}
): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_STEP_KEY, step);

  if (!options.userId) return;

  try {
    await upsertRemoteOnboardingState(options.userId, {
      onboarding_completed: false,
      onboarding_step: step,
    });
  } catch (error) {
    console.error('[onboardingStatus] remote step save error', error);
  }
}

export async function setOnboardingCompleted(
  completed: boolean,
  options: OnboardingCompletionOptions = {}
): Promise<void> {
  if (completed) {
    await Promise.all([
      AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true'),
      AsyncStorage.setItem(ONBOARDING_STEP_KEY, options.onboardingStep ?? 'completed'),
      AsyncStorage.removeItem(LEGACY_ONBOARDING_COMPLETED_KEY),
      AsyncStorage.removeItem(ONBOARDING_COMPLETED_V1_KEY),
      AsyncStorage.removeItem(ONBOARDING_COMPLETED_V2_KEY),
    ]);

    if (options.userId) {
      try {
        await upsertRemoteOnboardingState(options.userId, {
          onboarding_completed: true,
          onboarding_step: options.onboardingStep ?? 'completed',
          ...(options.onboardingData
            ? { onboarding_data: serializeOnboardingData(options.onboardingData) }
            : {}),
        });
      } catch (error) {
        console.error('[onboardingStatus] remote completion save error', error);
      }
    }

    return;
  }

  await Promise.all([
    AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY),
    AsyncStorage.removeItem(ONBOARDING_STEP_KEY),
    AsyncStorage.removeItem(LEGACY_ONBOARDING_COMPLETED_KEY),
    AsyncStorage.removeItem(ONBOARDING_COMPLETED_V1_KEY),
    AsyncStorage.removeItem(ONBOARDING_COMPLETED_V2_KEY),
  ]);

  if (options.userId) {
    try {
      await upsertRemoteOnboardingState(options.userId, {
        onboarding_completed: false,
        onboarding_step: '/onboarding',
      });
    } catch (error) {
      console.error('[onboardingStatus] remote completion clear error', error);
    }
  }
}

export async function clearOnboardingCompleted(options: OnboardingStatusOptions = {}): Promise<void> {
  await setOnboardingCompleted(false, options);
}
