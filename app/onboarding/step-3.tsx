// Screen 3: The Identity Chapter — Persona Selection
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { setOnboardingData } from '@/lib/onboardingStore';
import { analytics } from '@/lib/analytics';
import {
  absoluteFillStyle,
  onboardingButtonShadow,
  personaImageShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

const PERSONAS = [
  {
    id: 'builder',
    image: 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/aksha/builder.webp',
    name: 'The Builder',
    tagline: 'Focus on career and legacy.',
    desc: 'You are building something that outlasts you. Purpose lives in the work.',
  },
  {
    id: 'seeker',
    image: 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/aksha/seeker.webp',
    name: 'The Seeker',
    tagline: 'Focus on spiritual depth.',
    desc: 'The inner journey is your true expedition. You crave meaning over metrics.',
  },
  {
    id: 'healer',
    image: 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/aksha/healer.webp',
    name: 'The Healer',
    tagline: 'Focus on recovery and peace.',
    desc: 'You are mending something precious. Tenderness and truth are your tools.',
  },
  {
    id: 'protector',
    image: 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/aksha/protector.webp',
    name: 'The Protector',
    tagline: 'Focus on family and stability.',
    desc: 'You hold the world together for those you love. Strength in service.',
  },
] as const;

type PersonaId = (typeof PERSONAS)[number]['id'];

export default function Screen3() {
  const [selected, setSelected] = useState<PersonaId | null>(null);

  function proceed() {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ persona: selected });
    analytics.onboardingPersonaSelected({ persona: selected });
    router.push('/onboarding/step-4');
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 p-8 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} className="gap-2.5">
          <Text className="font-headline text-[34px] leading-10 tracking-[-0.8px] text-ob-text">
            How would you describe{'\n'}your current chapter?
          </Text>
        </Animated.View>

        <View className="gap-0.5">
          {PERSONAS.map((p, i) => {
            const active = selected === p.id;
            return (
              <Animated.View
                key={p.id}
                entering={FadeInDown.delay(i * 100 + 200).duration(450)}
                className="relative pt-12"
              >
                {/* Card */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelected(p.id);
                  }}
                  className={`min-h-20 overflow-hidden rounded-2xl border py-5 pl-[22px] pr-[104px] ${
                    active ? 'border-ob-saffron-border' : 'border-white/10'
                  }`}
                >
                  <LinearGradient
                    colors={['#253b7a', '#22214f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={absoluteFillStyle}
                  />
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 gap-1">
                      <View className="flex-row items-center justify-between gap-2">
                        <Text className={`font-headline text-lg ${active ? 'text-ob-text' : 'text-ob-text/[0.55]'}`}>
                          {p.name}
                        </Text>
                        {active && <Text className="text-sm text-ob-saffron">✦</Text>}
                      </View>
                      <Text className="font-body text-xs text-ob-text/[0.45]">{p.tagline}</Text>
                      {active && (
                        <Animated.Text
                          entering={FadeInDown.duration(300)}
                          className="mt-1.5 font-body text-xs leading-[18px] text-ob-gold"
                        >
                          {p.desc}
                        </Animated.Text>
                      )}
                    </View>
                  </View>
                </Pressable>

                {/* Image — 40% above card, 60% inside */}
                <Image
                  source={{ uri: p.image }}
                  className="absolute right-3.5 top-0 h-[120px] w-[88px] rounded-[14px]"
                  style={personaImageShadow}
                />
              </Animated.View>
            );
          })}
        </View>

        <View className="h-[120px]" />
      </ScrollView>

      <Animated.View
        entering={FadeInUp.delay(700).duration(500)}
        className="absolute bottom-0 left-0 right-0 items-end bg-[rgba(7,9,12,0.95)] p-8 pb-11"
      >
        <Pressable
          onPress={proceed}
          className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
            !selected ? 'opacity-[0.35]' : ''
          }`}
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="text-right font-label text-base tracking-[0.3px] text-white">
            This is my chapter →
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
