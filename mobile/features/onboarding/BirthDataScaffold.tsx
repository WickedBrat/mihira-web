import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
  LinearTransition,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import {
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

interface BirthDataScaffoldProps {
  title: string;
  description: string;
  ctaLabel: string;
  canProceed?: boolean;
  onProceed: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function BirthDataScaffold({
  title,
  description,
  ctaLabel,
  canProceed = true,
  onProceed,
  children,
  footer,
}: BirthDataScaffoldProps) {
  const smoothLayout = LinearTransition.duration(220);

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow items-center justify-center gap-8 px-8 py-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInDown.duration(500)}
          layout={smoothLayout}
          className="w-full items-center gap-8"
        >
          <View className="items-center">
            <Text className="text-center font-headline text-[42px] leading-[48px] tracking-[-1.2px] text-ob-text">
              {title}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(180).duration(450)}
          layout={smoothLayout}
          className="w-full items-center gap-6"
        >
          <View className="w-full max-w-[360px] items-center gap-6">
            {children}
            <Text className="text-center font-body text-[15px] leading-[24px] text-ob-muted">
              {description}
            </Text>
          </View>
        </Animated.View>

        {footer ? (
          <Animated.View
            entering={FadeInDown.delay(320).duration(450)}
            layout={smoothLayout}
            className="w-full items-center"
          >
            {footer}
          </Animated.View>
        ) : null}

        <View className="h-[120px]" />
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(520).duration(500)}
        className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.95)] p-8 pb-11"
      >
        <Pressable
          disabled={!canProceed}
          onPress={() => {
            if (!canProceed) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onProceed();
          }}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            !canProceed ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-lg tracking-[0.3px] text-white">
            {ctaLabel}
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
