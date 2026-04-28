// Screen 10: Personal Plan Reveal
import React from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BookOpenTextIcon, CalendarDaysIcon, CompassIcon, MessageCircleQuestionIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { OB, getOnboardingData } from '@/lib/onboardingStore';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const PLAN_ITEMS = [
  {
    icon: CompassIcon,
    title: 'Morning alignment',
    body: 'A daily read on where to place your energy first.',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Sacred timing',
    body: 'Auspicious windows for decisions, rituals, and important actions.',
  },
  {
    icon: MessageCircleQuestionIcon,
    title: 'Sarathi guidance',
    body: 'A private place to ask what is weighing on your heart.',
  },
  {
    icon: BookOpenTextIcon,
    title: 'Scripture in context',
    body: 'Wisdom translated into next steps you can actually use.',
  },
];

function getPrimaryThread() {
  const data = getOnboardingData();
  return data.supportTypes[0] ?? data.painPoints[0] ?? 'Daily grounding';
}

export default function Screen10() {
  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || 'you';
  const primaryThread = getPrimaryThread();

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <View className="flex-1 justify-center gap-6 px-8 pt-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2.5">
          <Text className="text-center font-label text-xs uppercase tracking-[3px] text-ob-saffron">
            Your first seven days
          </Text>
          <Text className="text-center font-headline text-[35px] leading-[41px] tracking-[-0.9px] text-ob-text">
            A rhythm is ready{'\n'}for {name}.
          </Text>
          <Text className="text-center font-body text-sm leading-[22px] text-ob-muted">
            Mihira will begin with {primaryThread.toLowerCase()} and adjust as you keep using it.
          </Text>
        </Animated.View>

        <View className="gap-3">
          {PLAN_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <Animated.View
                key={item.title}
                entering={FadeInDown.delay(180 + index * 100).duration(420)}
                className="overflow-hidden rounded-[22px] border border-ob-card-border bg-ob-card p-4"
              >
                <View className="flex-row items-start gap-3.5">
                  <View className="h-11 w-11 items-center justify-center rounded-full border border-ob-gold-border bg-ob-gold-dim">
                    <Icon size={21} color={OB.gold} strokeWidth={1.8} />
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="font-headline text-[20px] leading-6 text-ob-text">
                      {item.title}
                    </Text>
                    <Text className="font-body text-[13px] leading-5 text-ob-muted">
                      {item.body}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          entering={FadeInDown.delay(620).duration(420)}
          className="rounded-[20px] border border-ob-saffron-border bg-ob-saffron-dim p-4"
        >
          <Text className="text-center font-body text-[13px] leading-[21px] text-ob-text">
            Next, Mihira will show the kind of daily guidance that appears on your home screen.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(760).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-9');
          }}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Preview my day →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
