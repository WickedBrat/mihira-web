// S13: Cosmic Signature — Star Ledger
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton } from '@/features/onboarding-new/PrimaryButton';
import { getFallbackChart, getOnboardingNewData } from '@/lib/onboardingNewStore';

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function shortSeasonLabel(insight: string): string {
  return insight.split('.')[0].trim();
}

export default function OnboardingNewS13() {
  const stored = getOnboardingNewData();
  const name = stored.name || 'Friend';
  const chart = stored.chart ?? getFallbackChart();

  const nakshatraWords = chart.nakshatra.split(' ');
  const nakshatraLead = nakshatraWords.slice(0, -1).join(' ');
  const nakshatraLast = nakshatraWords[nakshatraWords.length - 1];

  const ledger = [
    { label: 'Rashi', value: chart.rashiSanskrit },
    { label: 'Moon', value: chart.moonHouse ? `${ordinal(chart.moonHouse)} house` : 'Being mapped' },
    { label: 'This season', value: shortSeasonLabel(chart.insight) },
  ];

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-14');
  }

  return (
    <OnboardingNewScreen glow="top" glowIntensity={0.16}>
      <View className="flex-1 items-center justify-center gap-8 px-8">
        <Animated.View entering={FadeIn.delay(150).duration(600)} className="items-center gap-3.5">
          <Text className="font-manrope-bold text-[10px] uppercase tracking-[4px] text-obn-gold">
            {name} · recorded at birth
          </Text>
          <Text className="text-center font-serif-medium text-[46px] leading-[50px] text-obn-text">
            {nakshatraLead ? `${nakshatraLead}\n` : ''}
            <Text className="font-serif-medium-italic text-obn-gold">{nakshatraLast}</Text>
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(500).duration(600)} className="w-full max-w-[300px]">
          {ledger.map((row, i) => (
            <View key={row.label} className={`flex-row items-baseline justify-between border-t border-obn-gold-border-soft py-[11px] ${i === ledger.length - 1 ? 'border-b' : ''}`}>
              <Text className="font-manrope-bold text-[10px] uppercase tracking-[2px] text-obn-muted-dim">{row.label}</Text>
              <Text className="font-serif-medium text-[18px] text-obn-text">{row.value}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.Text entering={FadeIn.delay(750).duration(600)} className="text-center font-serif-regular-italic text-[17px] leading-[24px] text-obn-gold">
          This is the first page of your book.{'\n'}There will be more.
        </Animated.Text>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} />
      </Animated.View>
    </OnboardingNewScreen>
  );
}
