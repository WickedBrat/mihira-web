// S10: Time of Birth
import React, { useState } from 'react';
import { Platform, Pressable, Switch, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

export default function OnboardingNewS10() {
  const stored = getOnboardingNewData();
  const [birthTime, setBirthTime] = useState(stored.birthTime);
  const [unknownTime, setUnknownTime] = useState(stored.unknownBirthTime);
  const [showPicker, setShowPicker] = useState(true);

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ birthTime, unknownBirthTime: unknownTime });
    router.push('/onboarding-new/step-11');
  }

  const fmtTime = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-8 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[320px] items-center gap-2">
          <ScreenLabel>Time of birth</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[36px] text-obn-text">
            The minute sharpens the map.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[340px] items-center gap-4">
          <Pressable
            onPress={() => !unknownTime && setShowPicker((c) => !c)}
            className={`w-full items-center rounded-2xl border px-6 py-5 ${
              showPicker ? 'border-obn-gold-border bg-obn-gold-dim' : 'border-obn-card-border bg-obn-card'
            } ${unknownTime ? 'opacity-40' : ''}`}
          >
            <Text className="text-center font-serif-medium text-[21px] text-obn-text">{fmtTime(birthTime)}</Text>
          </Pressable>

          {showPicker && !unknownTime ? (
            <Animated.View entering={FadeInDown.duration(260)} exiting={FadeOutUp.duration(220)} className="w-full overflow-hidden rounded-[28px] border border-obn-card-border bg-obn-card px-2 py-2">
              <DateTimePicker
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={birthTime}
                locale="en-US"
                onChange={(_, v) => {
                  if (v) setBirthTime(v);
                  if (Platform.OS === 'android') setShowPicker(false);
                }}
                style={{ alignSelf: 'stretch' }}
              />
            </Animated.View>
          ) : null}

          <View className="w-full flex-row items-center justify-between gap-4 rounded-2xl border border-obn-card-border bg-obn-card px-5 py-4">
            <Text className="flex-1 font-manrope-semibold text-[14px] text-obn-text-soft">
              I don't know my exact birth time
            </Text>
            <Switch
              value={unknownTime}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setUnknownTime(v);
                setShowPicker(!v);
              }}
              trackColor={{ false: 'rgba(242,234,217,0.15)', true: '#E8A33D' }}
              thumbColor="#F2EAD9"
            />
          </View>

          {unknownTime ? (
            <Animated.View entering={FadeInDown.duration(400)} className="w-full rounded-[18px] border border-obn-gold-border bg-obn-gold-dim px-5 py-4">
              <Text className="font-manrope text-[14px] leading-[21px] text-obn-text-soft">
                Even the sun without the minute still tells us plenty. We'll read a reliable solar chart instead.
              </Text>
            </Animated.View>
          ) : null}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
