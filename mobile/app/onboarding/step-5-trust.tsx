// Screen 5a: Birth Details Trust Primer
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LockKeyholeIcon, SparklesIcon, TimerIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { OB, getOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const ITEMS = [
  {
    icon: SparklesIcon,
    title: 'Personal alignment',
    body: 'Your chart helps Mihira make daily guidance feel specific, not generic.',
  },
  {
    icon: TimerIcon,
    title: 'Sacred timing',
    body: 'Birth details make timing windows more useful for decisions and rituals.',
  },
  {
    icon: LockKeyholeIcon,
    title: 'Private by design',
    body: 'Your details are used only to personalize your experience and profile.',
  },
];

export default function Screen5Trust() {
  const name = getOnboardingData().userName?.split(' ')[0] || 'you';

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <View className="flex-1 items-center justify-center gap-7 px-8 pt-8">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[360px] items-center gap-2.5">
          <Text className="text-center font-headline text-[37px] leading-[43px] tracking-[-1px] text-ob-text">
            Your chart is not{'\n'}a label, {name}.
          </Text>
          <Text className="text-center font-body text-[15px] leading-[24px] text-ob-muted">
            It is a starting point for timing, reflection, and a practice that meets real life.
          </Text>
        </Animated.View>

        <View className="w-full max-w-[360px] gap-3">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Animated.View
                key={item.title}
                entering={FadeInDown.delay(index * 110 + 180).duration(420)}
                className="rounded-[20px] border border-ob-card-border bg-ob-card p-4"
              >
                <View className="flex-row items-start gap-3.5">
                  <View className="h-10 w-10 items-center justify-center rounded-full border border-ob-saffron-border bg-ob-saffron-dim">
                    <Icon size={20} color={OB.saffron} strokeWidth={1.8} />
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="font-headline text-[19px] leading-6 text-ob-text">{item.title}</Text>
                    <Text className="font-body text-[13px] leading-5 text-ob-muted">{item.body}</Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(700).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-5');
          }}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Enter birth details →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
