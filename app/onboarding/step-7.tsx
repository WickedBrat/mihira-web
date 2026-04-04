// Screen 7: The Revelation — Birth Card
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn, FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, getOnboardingData, setOnboardingData, NAKSHATRA_INSIGHTS } from '@/lib/onboardingStore';
import { scaleFont } from '@/lib/typography';
import { toJDE, toSidereal } from '@/lib/vedic/ayanamsha';
import { moonTropicalLongitude } from '@/lib/vedic/ephemeris';
import { NAKSHATRAS } from '@/lib/vedic/chart';
import { SIGNS } from '@/lib/vedic/types';

function deriveNakshatraRashi(birthDate: Date, birthTime: Date, unknownTime: boolean) {
  try {
    const d = new Date(birthDate);
    d.setHours(birthTime.getHours(), birthTime.getMinutes(), 0, 0);
    const hourUT = unknownTime ? 6 : d.getUTCHours() + d.getUTCMinutes() / 60;
    const jde = toJDE(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), hourUT);
    const moonSid = toSidereal(moonTropicalLongitude(jde), jde);
    const nakshatraIdx = Math.floor(moonSid / (360 / 27)) % 27;
    const rashiIdx     = Math.floor(moonSid / 30) % 12;
    return {
      nakshatra: NAKSHATRAS[nakshatraIdx] ?? 'Ashwini',
      rashi:     SIGNS[rashiIdx] ?? 'Aries',
    };
  } catch {
    return { nakshatra: 'Ashwini', rashi: 'Aries' };
  }
}

const RASHI_GLYPHS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export default function Screen7() {
  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || 'Friend';

  const { nakshatra, rashi } = deriveNakshatraRashi(
    data.birthDate,
    data.birthTime,
    data.unknownBirthTime
  );

  const insight = NAKSHATRA_INSIGHTS[nakshatra] ?? 'A rare alignment awaits your path.';

  // Persist for later screens
  useEffect(() => {
    setOnboardingData({ birthPlace: data.birthPlace }); // keep birthPlace normalised
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const cardScale  = useSharedValue(0.88);
  const cardOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    cardScale.value = withDelay(300, withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.1)) }));
    cardOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    glowOpacity.value = withDelay(900, withTiming(1, { duration: 900 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.headline}>Your cosmic{'\n'}signature</Text>
        </Animated.View>

        {/* Ambient glow behind card */}
        <Animated.View style={[styles.glow, glowStyle]} pointerEvents="none" />

        {/* Birth Card */}
        <Animated.View style={cardStyle}>
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(217,160,111,0.10)', 'rgba(224,122,95,0.07)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Gold border shimmer via nested view */}
            <View style={styles.cardBorderGlow} />

            <View style={styles.cardTop}>
              <Text style={styles.cardName}>{data.userName || 'Your'}</Text>
              <Text style={styles.cardSub}>Birth Alignment Card</Text>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.pillRow}>
              <View style={styles.pill}>
                <Text style={styles.pillLabel}>NAKSHATRA</Text>
                <Text style={styles.pillValue}>☽ {nakshatra}</Text>
              </View>
              <View style={[styles.pill, styles.pillRight]}>
                <Text style={styles.pillLabel}>RASHI</Text>
                <Text style={styles.pillValue}>
                  {RASHI_GLYPHS[rashi] ?? '♈'} {rashi}
                </Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.insightBlock}>
              <Text style={styles.insightLabel}>SOUL INSIGHT</Text>
              <Text style={styles.insightText}>
                <Text style={styles.insightName}>{name}, </Text>
                {insight}
              </Text>
            </View>

            {/* Corner ornaments */}
            <Text style={[styles.corner, styles.cornerTL]}>✦</Text>
            <Text style={[styles.corner, styles.cornerTR]}>✦</Text>
            <Text style={[styles.corner, styles.cornerBL]}>✦</Text>
            <Text style={[styles.corner, styles.cornerBR]}>✦</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(1100).duration(500)} style={styles.footer}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-8');
          }}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnText}>Meet Your Sarathi →</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: OB.bg },
  body:     { flex: 1, paddingHorizontal: 28, paddingTop: 24, gap: 20 },
  header:   { gap: 8 },
  headline: {
    fontFamily: 'Lexend_800ExtraBold', fontSize: scaleFont(34),
    color: OB.text, letterSpacing: -0.8, lineHeight: scaleFont(40),
  },
  glow: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(217,160,111,0.12)',
    shadowColor: OB.gold,
    shadowOpacity: 0.6,
    shadowRadius: 80,
    shadowOffset: { width: 0, height: 0 },
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: OB.goldBorder,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 28,
    gap: 20,
  },
  cardBorderGlow: {
    position: 'absolute', inset: 0, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(217,160,111,0.25)',
    margin: 2,
  },
  cardTop:   { gap: 4 },
  cardName: {
    fontFamily: 'Lexend_800ExtraBold', fontSize: scaleFont(26),
    color: OB.text, letterSpacing: -0.5,
  },
  cardSub: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(12),
    color: OB.muted, letterSpacing: 1,
  },
  cardDivider: { height: 1, backgroundColor: OB.divider },
  pillRow:  { flexDirection: 'row', gap: 12 },
  pill: {
    flex: 1, gap: 6,
    backgroundColor: OB.card, borderRadius: 12,
    borderWidth: 1, borderColor: OB.cardBorder, padding: 14,
  },
  pillRight: { borderColor: OB.goldBorder, backgroundColor: OB.goldDim },
  pillLabel: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(9),
    letterSpacing: 2, color: OB.muted, textTransform: 'uppercase',
  },
  pillValue: {
    fontFamily: 'Lexend_700Bold', fontSize: scaleFont(15), color: OB.text,
  },
  insightBlock: { gap: 8 },
  insightLabel: {
    fontFamily: 'Lexend_600SemiBold', fontSize: scaleFont(9),
    letterSpacing: 2, color: OB.saffron, textTransform: 'uppercase',
  },
  insightName: { color: OB.gold, fontFamily: 'Lexend_600SemiBold' },
  insightText: {
    fontFamily: 'Lexend_400Regular', fontSize: scaleFont(14),
    color: OB.text, lineHeight: scaleFont(22),
  },
  corner: {
    position: 'absolute', fontSize: scaleFont(10), color: OB.goldBorder,
  },
  cornerTL: { top: 10, left: 12 },
  cornerTR: { top: 10, right: 12 },
  cornerBL: { bottom: 10, left: 12 },
  cornerBR: { bottom: 10, right: 12 },
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
