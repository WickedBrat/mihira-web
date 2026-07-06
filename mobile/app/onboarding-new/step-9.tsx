// S9: Date of Birth
import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

const MIN_BIRTH_DATE = new Date(1900, 0, 1);

export default function OnboardingNewS9() {
  const stored = getOnboardingNewData();
  const [birthDate, setBirthDate] = useState(stored.birthDate);
  const [showPicker, setShowPicker] = useState(true);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ birthDate });
    router.push('/onboarding-new/step-10');
  }

  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-8 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[320px] items-center gap-2">
          <ScreenLabel>Date of birth</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[36px] text-obn-text">
            The day you arrived matters more than most calendars admit.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(450)} className="w-full max-w-[340px] items-center gap-4">
          <Text className="text-center font-manrope-bold text-[11px] uppercase tracking-[2.5px] text-obn-muted">
            Date of birth
          </Text>
          <Pressable
            onPress={() => setShowPicker((c) => !c)}
            className={`w-full items-center rounded-2xl border px-6 py-5 ${showPicker ? 'border-obn-gold-border bg-obn-gold-dim' : 'border-obn-card-border bg-obn-card'}`}
          >
            <Text className="text-center font-serif-medium text-[21px] text-obn-text">{fmt(birthDate)}</Text>
          </Pressable>
          {showPicker ? (
            <Animated.View entering={FadeInDown.duration(260)} exiting={FadeOutUp.duration(220)} className="w-full overflow-hidden rounded-[28px] border border-obn-card-border bg-obn-card px-2 py-2">
              <DateTimePicker
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={birthDate}
                minimumDate={MIN_BIRTH_DATE}
                maximumDate={new Date()}
                onChange={(_, v) => {
                  if (v) setBirthDate(v);
                  if (Platform.OS === 'android') setShowPicker(false);
                }}
                style={{ alignSelf: 'stretch' }}
              />
            </Animated.View>
          ) : null}
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
