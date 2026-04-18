import React, { useState } from 'react';
import { Platform, Pressable, Switch, View } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { BirthDataScaffold } from '@/features/onboarding/BirthDataScaffold';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';

export default function Screen5Tob() {
  const stored = getOnboardingData();
  const [birthTime, setBirthTime] = useState(stored.birthTime);
  const [unknownTime, setUnknownTime] = useState(stored.unknownBirthTime);
  const [showTimePicker, setShowTimePicker] = useState(true);
  const smoothLayout = LinearTransition.duration(220);

  function proceed() {
    setOnboardingData({ birthTime, unknownBirthTime: unknownTime });
    router.push('/onboarding/step-5-place');
  }

  const fmtTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <BirthDataScaffold
      title={`What time were${'\n'}you born?`}
      description="Your birth time sharpens the rising sign and house placements. If you don’t know it, we’ll build a reliable solar chart instead."
      ctaLabel="Continue"
      onProceed={proceed}
    >
      <View className="w-full items-center gap-4">
        <Text className="text-center font-label text-[12px] uppercase tracking-[2.4px] text-ob-muted">
          TIME OF BIRTH
        </Text>
        <Pressable
          onPress={() => {
            if (unknownTime) return;
            setShowTimePicker((current) => !current);
          }}
          className={`w-full items-center rounded-2xl border px-6 py-5 ${
            showTimePicker
              ? 'border-ob-gold-border bg-ob-gold-dim'
              : 'border-ob-card-border bg-ob-card'
          } ${unknownTime ? 'opacity-50' : ''}`}
        >
          <Text className={`text-center font-body-medium ${unknownTime ? 'text-[16px] leading-7 text-ob-muted' : 'text-[21px] text-ob-text'}`}>
            {unknownTime
              ? 'No problem. Aksha will use a midday reference to build a reliable solar chart for you.'
              : fmtTime(birthTime)}
          </Text>
        </Pressable>

        {showTimePicker && !unknownTime ? (
          <Animated.View
            entering={FadeInDown.duration(260)}
            exiting={FadeOutUp.duration(220)}
            layout={smoothLayout}
            className="w-full overflow-hidden rounded-[28px] border border-ob-card-border bg-ob-card px-2 py-2"
          >
            <DateTimePicker
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={birthTime}
              locale="en-US"
              onChange={(_, value) => {
                if (value) setBirthTime(value);
                if (Platform.OS === 'android') setShowTimePicker(false);
              }}
              style={{ alignSelf: 'stretch' }}
            />
          </Animated.View>
        ) : null}

        <Animated.View
          layout={smoothLayout}
          className="w-full items-center rounded-2xl border border-ob-card-border bg-ob-card p-5"
        >
          <View className="w-full items-center gap-3">
            <View className="w-full flex-row items-center justify-center gap-3">
              <Text className="text-center font-body-medium text-[14px] text-ob-text">
                I don’t know my exact birth time
              </Text>
              <Switch
                value={unknownTime}
                onValueChange={(value) => {
                  setUnknownTime(value);
                  if (value) setShowTimePicker(false);
                  if (!value) setShowTimePicker(true);
                }}
                trackColor={{ false: OB.cardBorder, true: OB.saffron }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </BirthDataScaffold>
  );
}
