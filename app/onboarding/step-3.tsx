// Screen 3: The Identity Chapter — Persona Selection
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, setOnboardingData } from '@/lib/onboardingStore';
import { analytics } from '@/lib/analytics';
import { scaleFont } from '@/lib/typography';

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
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.headline}>How would you describe{'\n'}your current chapter?</Text>
        </Animated.View>

        <View style={styles.cards}>
          {PERSONAS.map((p, i) => {
            const active = selected === p.id;
            return (
              <Animated.View key={p.id} entering={FadeInDown.delay(i * 100 + 200).duration(450)}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelected(p.id);
                  }}
                  style={[styles.card, active && styles.cardActive]}
                >
                  <View style={styles.cardLeft}>
                    <Image source={{ uri: p.image }} style={styles.cardIcon} />
                    <View style={styles.cardText}>
                      <Text style={[styles.cardName, active && styles.cardNameActive]}>{p.name}</Text>
                      <Text style={styles.cardTagline}>{p.tagline}</Text>
                      {active && (
                        <Animated.Text
                          entering={FadeInDown.duration(300)}
                          style={styles.cardDesc}
                        >
                          {p.desc}
                        </Animated.Text>
                      )}
                    </View>
                  </View>
                  {active && <Text style={styles.check}>✦</Text>}
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
          style={({ pressed }) => [
            styles.btn,
            !selected && styles.btnDisabled,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.btnText}>This is my chapter →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: OB.bg },
  scroll:   { flex: 1 },
  body:     { padding: 32, paddingTop: 32, gap: 32 },
  header:   { gap: 10 },
  headline: {
    fontFamily: 'GoogleSans_700Bold',
    fontSize: scaleFont(34),
    color: OB.text,
    letterSpacing: -0.8,
    lineHeight: scaleFont(40),
  },
  cards:    { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OB.cardBorder,
    backgroundColor: OB.card,
    gap: 12,
  },
  cardActive: {
    borderColor: OB.saffronBorder,
    backgroundColor: OB.saffronDim,
  },
  cardLeft:  { flexDirection: 'row', alignItems: 'flex-start', gap: 16, flex: 1 },
  cardIcon:  { width: 56, height: 56, borderRadius: 12, marginTop: 2 },
  cardText:  { flex: 1, gap: 4 },
  cardName: {
    fontFamily: 'GoogleSans_700Bold',
    fontSize: scaleFont(17),
    color: OB.muted,
  },
  cardNameActive: { color: OB.text },
  cardTagline: {
    fontFamily: 'GoogleSans_400Regular',
    fontSize: scaleFont(12),
    color: OB.muted,
  },
  cardDesc: {
    fontFamily: 'GoogleSans_400Regular',
    fontSize: scaleFont(12),
    color: OB.gold,
    marginTop: 6,
    lineHeight: scaleFont(18),
  },
  check: {
    fontSize: scaleFont(14),
    color: OB.saffron,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 32,
    paddingBottom: 44,
    backgroundColor: 'rgba(7,9,12,0.95)',
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
  btnDisabled: { opacity: 0.35 },
  btnPressed:  { opacity: 0.82, transform: [{ scale: 0.98 }] },
  btnText: {
    fontFamily: 'GoogleSans_600SemiBold',
    fontSize: scaleFont(16),
    color: '#fff',
    textAlign: 'right',
    letterSpacing: 0.3,
  },
});
