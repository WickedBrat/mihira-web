import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { BirthDataScaffold } from '@/features/onboarding/BirthDataScaffold';

export default function Screen5() {
  const stored = getOnboardingData();
  const [birthDate, setBirthDate] = useState(stored.birthDate);
  const [showDatePicker, setShowDatePicker] = useState(true);
  const smoothLayout = LinearTransition.duration(220);

  const name = stored.userName || 'you';

  function proceed() {
    setOnboardingData({ birthDate });
    router.push('/onboarding/step-5-tob');
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <BirthDataScaffold
      title={`When were you born,${'\n'}${name.split(' ')[0]}?`}
      description="Your birth date anchors the planetary positions we use for your chart. We will refine it with your birth time next."
      ctaLabel="Continue"
      onProceed={proceed}
    >
      <View className="w-full items-center gap-4">
        <Text className="text-center font-label text-[12px] uppercase tracking-[2.4px] text-ob-muted">
          DATE OF BIRTH
        </Text>
        <Pressable
          onPress={() => setShowDatePicker((current) => !current)}
          className={`w-full items-center rounded-2xl border px-6 py-5 ${
            showDatePicker
              ? 'border-ob-gold-border bg-ob-gold-dim'
              : 'border-ob-card-border bg-ob-card'
          }`}
        >
          <Text className="text-center font-body-medium text-[21px] text-ob-text">{fmt(birthDate)}</Text>
        </Pressable>
        {showDatePicker ? (
          <Animated.View
            entering={FadeInDown.duration(260)}
            exiting={FadeOutUp.duration(220)}
            layout={smoothLayout}
            className="w-full overflow-hidden rounded-[28px] border border-ob-card-border bg-ob-card px-2 py-2"
          >
            <DateTimePicker
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={birthDate}
              maximumDate={new Date()}
              onChange={(_, v) => {
                if (v) setBirthDate(v);
                if (Platform.OS === 'android') setShowDatePicker(false);
              }}
              style={{ alignSelf: 'stretch' }}
            />
          </Animated.View>
        ) : null}
      </View>
    </BirthDataScaffold>
  );
}
