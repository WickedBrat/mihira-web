// Screen 10: The Evidence — Social Proof Carousel
import React, { useState, useRef } from 'react';
import {
  View, Text, Pressable,
  ScrollView, useWindowDimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { onboardingButtonShadow, pressedButtonStyle } from '@/features/onboarding/onboardingStyles';

const TESTIMONIALS = [
  {
    quote: 'Mihira gave me a calmer way to make decisions in the middle of New York chaos. I stopped leading from fear.',
    name: 'Ananya M.',
    title: 'VP, Product · New York',
    initial: 'A',
    nakshatra: 'Rohini',
  },
  {
    quote: 'I finally understood my Sade Sati and stopped resisting every hard season. That shift changed how I work.',
    name: 'Rohan K.',
    title: 'Founder · Bangalore',
    initial: 'R',
    nakshatra: 'Ashwini',
  },
  {
    quote: 'For the first time, my calendar felt aligned with my energy instead of fighting it. The fog lifted fast.',
    name: 'Priya S.',
    title: 'Creative Director · London',
    initial: 'P',
    nakshatra: 'Pushya',
  },
  {
    quote: 'I was sceptical, but my chart felt uncannily specific. This went far beyond generic horoscope advice.',
    name: 'Arjun V.',
    title: 'Surgeon · Mumbai',
    initial: 'A',
    nakshatra: 'Hasta',
  },
];

export default function Screen10() {
  const { width } = useWindowDimensions();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const CARD_W = width - 64;

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setActiveIdx(idx);
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />

      <View className="flex-1 items-center justify-center gap-7 px-8 pt-6">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2">
          <Text className="text-center font-headline text-[34px] leading-10 tracking-[-0.8px] text-ob-text">
            People use Mihira{'\n'}to move with clarity.
          </Text>
          <Text className="text-center font-body text-[15px] text-ob-muted">Real people. Real shifts.</Text>
        </Animated.View>

        {/* Carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          decelerationRate="fast"
          snapToInterval={CARD_W}
          className="mx-[-32px]"
        >
          {TESTIMONIALS.map((t, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(i * 60 + 200).duration(400)}
              className="gap-[18px] rounded-[20px] border border-ob-card-border bg-ob-card p-6"
              style={{ width: CARD_W, marginHorizontal: 16 }}
            >
              {/* Stars */}
              <Text className="text-center text-base tracking-[3px] text-ob-gold">★★★★★</Text>

              <Text className="text-center font-body text-[15px] italic leading-6 text-ob-text">"{t.quote}"</Text>

              <View className="flex-row items-center gap-3">
                <View className="h-[42px] w-[42px] items-center justify-center rounded-full border border-ob-saffron-border bg-ob-saffron-dim">
                  <Text className="font-headline text-lg text-ob-saffron">{t.initial}</Text>
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="font-label text-sm text-ob-text">{t.name}</Text>
                  <Text className="font-body text-[11px] text-ob-muted">{t.title}</Text>
                </View>
                <View className="rounded-[20px] border border-ob-gold-border bg-ob-gold-dim px-2.5 py-1">
                  <Text className="font-body-medium text-[10px] text-ob-gold">{t.nakshatra}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Page dots */}
        <View className="flex-row justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                scrollRef.current?.scrollTo({ x: i * CARD_W, animated: true });
                setActiveIdx(i);
              }}
              className={`h-1.5 rounded-full ${
                i === activeIdx ? 'w-[18px] bg-ob-saffron' : 'w-1.5 bg-ob-card-border'
              }`}
            />
          ))}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} className="items-center p-8 pb-11">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-11');
          }}
          className="items-center rounded-full bg-ob-saffron px-8 py-4"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <Text className="font-label text-base tracking-[0.3px] text-white">Choose my rhythm →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
