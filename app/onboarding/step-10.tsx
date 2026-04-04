// Screen 10: The Evidence — Social Proof Carousel
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  ScrollView, useWindowDimensions,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';

const TESTIMONIALS = [
  {
    quote: 'Aksha gave me the stability I lacked in the NYC hustle. I finally stopped making decisions from fear.',
    name: 'Ananya M.',
    title: 'VP, Product · New York',
    initial: 'A',
    nakshatra: 'Rohini',
  },
  {
    quote: 'I finally understood my Sade Sati and stopped fighting the current. The surrender itself became the strategy.',
    name: 'Rohan K.',
    title: 'Founder · Bangalore',
    initial: 'R',
    nakshatra: 'Ashwini',
  },
  {
    quote: 'For the first time, my calendar and my cosmic rhythm were aligned. The fog lifted immediately.',
    name: 'Priya S.',
    title: 'Creative Director · London',
    initial: 'P',
    nakshatra: 'Pushya',
  },
  {
    quote: 'I was sceptical, but the accuracy of my birth chart reading was startling. This is not horoscope fluff.',
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.headline}>Thousands have{'\n'}found their axis.</Text>
          <Text style={styles.sub}>Real people. Real shifts.</Text>
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
          contentContainerStyle={{ paddingLeft: 0 }}
          style={{ marginHorizontal: -32 }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(i * 60 + 200).duration(400)}
              style={[styles.card, { width: CARD_W, marginHorizontal: 32 / 2 }]}
            >
              {/* Stars */}
              <Text style={styles.stars}>★★★★★</Text>

              <Text style={styles.cardQuote}>"{t.quote}"</Text>

              <View style={styles.cardAuthor}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitial}>{t.initial}</Text>
                </View>
                <View style={styles.authorText}>
                  <Text style={styles.authorName}>{t.name}</Text>
                  <Text style={styles.authorTitle}>{t.title}</Text>
                </View>
                <View style={styles.nakshatraPill}>
                  <Text style={styles.nakshatraText}>{t.nakshatra}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Page dots */}
        <View style={styles.pageDots}>
          {TESTIMONIALS.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                scrollRef.current?.scrollTo({ x: i * CARD_W, animated: true });
                setActiveIdx(i);
              }}
              style={[styles.pageDot, i === activeIdx && styles.pageDotActive]}
            />
          ))}
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.footer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-11');
          }}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnText}>I'm Ready →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: OB.bg },
  body:     { flex: 1, paddingHorizontal: 32, paddingTop: 24, gap: 28 },
  header:   { gap: 8 },
  headline: {
    fontFamily: 'Lexend_800ExtraBold', fontSize: scaleFont(34),
    color: OB.text, letterSpacing: -0.8, lineHeight: scaleFont(40),
  },
  sub: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(15), color: OB.muted,
  },
  card: {
    backgroundColor: OB.card,
    borderRadius: 20, borderWidth: 1, borderColor: OB.cardBorder,
    padding: 24, gap: 18,
  },
  stars: { fontSize: scaleFont(16), color: OB.gold, letterSpacing: 3 },
  cardQuote: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(15),
    color: OB.text, lineHeight: scaleFont(24), fontStyle: 'italic',
  },
  cardAuthor: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: OB.saffronDim,
    borderWidth: 1, borderColor: OB.saffronBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: 'Lexend_700Bold', fontSize: scaleFont(17), color: OB.saffron,
  },
  authorText: { flex: 1, gap: 2 },
  authorName: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(13), color: OB.text,
  },
  authorTitle: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(11), color: OB.muted,
  },
  nakshatraPill: {
    backgroundColor: OB.goldDim, borderRadius: 20, borderWidth: 1,
    borderColor: OB.goldBorder, paddingHorizontal: 10, paddingVertical: 4,
  },
  nakshatraText: {
    fontFamily: 'Lexend_500Medium', fontSize: scaleFont(10), color: OB.gold,
  },
  pageDots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  pageDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: OB.cardBorder,
  },
  pageDotActive: { backgroundColor: OB.saffron, width: 18 },
  footer: { padding: 32, paddingBottom: 44, alignItems: 'flex-end' },
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
