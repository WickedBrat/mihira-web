// Screen 11: The Sankalpa — Commitment Tier
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, setOnboardingData } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';

const TIERS = [
  {
    id: 'seed',
    icon: '🌱',
    name: 'The Seed',
    duration: '3 min',
    desc: 'Daily Alignment check. A quiet moment of cosmic orientation each morning.',
    features: ['Daily muhurat window', 'Nakshatra energy briefing'],
  },
  {
    id: 'growth',
    icon: '🌿',
    name: 'The Growth',
    duration: '10 min',
    desc: 'Daily Wisdom + AI guidance. Deep alignment for the intentional practitioner.',
    features: ['Everything in Seed', 'Daily Wisdom lesson', 'Ask Krishna AI sessions'],
    recommended: true,
  },
  {
    id: 'mastery',
    icon: '🪷',
    name: 'The Mastery',
    duration: '20 min',
    desc: 'Full Gurukul practice. Complete immersion in the Vedic framework.',
    features: ['Everything in Growth', 'Full Gurukul curriculum', 'Deep muhurat analysis'],
  },
] as const;

type TierId = (typeof TIERS)[number]['id'];

export default function Screen11() {
  const [selected, setSelected] = useState<TierId>('growth');

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingData({ commitmentTier: selected });
    router.push('/onboarding/step-12');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.headline}>Choose your{'\n'}daily commitment.</Text>
          <Text style={styles.sub}>
            Meaningful change requires rhythm. You can always change this later.
          </Text>
        </Animated.View>

        <View style={styles.tiers}>
          {TIERS.map((tier, i) => {
            const active = selected === tier.id;
            return (
              <Animated.View
                key={tier.id}
                entering={FadeInDown.delay(i * 100 + 200).duration(450)}
              >
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelected(tier.id);
                  }}
                  style={[styles.card, active && styles.cardActive]}
                >
                  {'recommended' in tier && tier.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>MOST POPULAR</Text>
                    </View>
                  )}

                  <View style={styles.cardHeader}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.tierIcon}>{tier.icon}</Text>
                      <View>
                        <Text style={[styles.tierName, active && styles.tierNameActive]}>
                          {tier.name}
                        </Text>
                        <Text style={styles.tierDuration}>{tier.duration} / day</Text>
                      </View>
                    </View>
                    {active && (
                      <Animated.View entering={ZoomIn.duration(250)} style={styles.checkCircle}>
                        <Text style={styles.checkMark}>✦</Text>
                      </Animated.View>
                    )}
                  </View>

                  <Text style={[styles.tierDesc, active && styles.tierDescActive]}>
                    {tier.desc}
                  </Text>

                  {active && (
                    <Animated.View entering={FadeInDown.duration(300)} style={styles.features}>
                      {tier.features.map((f) => (
                        <View key={f} style={styles.featureRow}>
                          <Text style={styles.featureDot}>·</Text>
                          <Text style={styles.featureText}>{f}</Text>
                        </View>
                      ))}
                    </Animated.View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.footer}>
        <Pressable
          onPress={proceed}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnText}>Set My Sankalpa →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: OB.bg },
  scroll:   { flex: 1 },
  body:     { padding: 32, paddingTop: 32, gap: 28 },
  header:   { gap: 10 },
  headline: {
    fontFamily: 'Lexend_800ExtraBold', fontSize: scaleFont(34),
    color: OB.text, letterSpacing: -0.8, lineHeight: scaleFont(40),
  },
  sub: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(15),
    color: OB.muted, lineHeight: scaleFont(23),
  },
  tiers:    { gap: 14 },
  card: {
    padding: 22, borderRadius: 18,
    borderWidth: 1, borderColor: OB.cardBorder,
    backgroundColor: OB.card, gap: 14,
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: OB.saffronBorder,
    backgroundColor: OB.saffronDim,
  },
  recommendedBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: OB.saffron,
    paddingHorizontal: 12, paddingVertical: 5,
    borderBottomLeftRadius: 12,
  },
  recommendedText: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(9),
    color: '#fff', letterSpacing: 1.5,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  tierIcon: { fontSize: scaleFont(28) },
  tierName: {
    fontFamily: 'Lexend_700Bold', fontSize: scaleFont(17), color: OB.muted,
  },
  tierNameActive: { color: OB.text },
  tierDuration: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(12), color: OB.muted,
  },
  checkCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: OB.saffron,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: {
    fontSize: scaleFont(13), color: '#fff',
  },
  tierDesc: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(13),
    color: OB.muted, lineHeight: scaleFont(20),
  },
  tierDescActive: { color: OB.text },
  features: { gap: 6, paddingTop: 4 },
  featureRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  featureDot: {
    fontFamily: 'Lexend_700Bold', fontSize: scaleFont(16), color: OB.gold, lineHeight: scaleFont(20),
  },
  featureText: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(13),
    color: OB.gold, lineHeight: scaleFont(20),
  },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 32, paddingBottom: 44,
    backgroundColor: 'rgba(7,9,12,0.96)',
    alignItems: 'flex-end',
  },
  btn: {
    backgroundColor: OB.saffron,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 9999,
    alignItems: 'center',
    shadowColor: OB.saffron,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  btnPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(16),
    color: '#fff', letterSpacing: 0.3,
  },
});
