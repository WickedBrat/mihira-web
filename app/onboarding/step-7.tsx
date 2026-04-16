// Screen 7: The Revelation — Birth Card
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  type LucideIcon,
  ZodiacAries,
  ZodiacAquarius,
  ZodiacCancer,
  ZodiacCapricorn,
  ZodiacGemini,
  ZodiacLeo,
  ZodiacLibra,
  ZodiacPisces,
  ZodiacSagittarius,
  ZodiacScorpio,
  ZodiacTaurus,
  ZodiacVirgo,
} from 'lucide-react-native';
import Svg, { Circle, Defs, G, Line, Path, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  FadeIn, FadeInDown, FadeInUp,
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { OB, getOnboardingData, setOnboardingData, NAKSHATRA_INSIGHTS } from '@/lib/onboardingStore';
import { toJDE, toSidereal } from '@/lib/vedic/ayanamsha';
import { moonTropicalLongitude } from '@/lib/vedic/ephemeris';
import { getNakshatra } from '@/lib/vedic/chart';
import { SIGNS } from '@/lib/vedic/types';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  absoluteFillStyle,
  goldGlowShadow,
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

function deriveNakshatraRashi(birthDate: Date, birthTime: Date, unknownTime: boolean) {
  try {
    const d = new Date(birthDate);
    d.setHours(birthTime.getHours(), birthTime.getMinutes(), 0, 0);
    const hourUT = unknownTime ? 6 : d.getUTCHours() + d.getUTCMinutes() / 60;
    const jde = toJDE(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), hourUT);
    const moonSid = toSidereal(moonTropicalLongitude(jde), jde);
    const rashiIdx     = Math.floor(moonSid / 30) % 12;
    return {
      nakshatra: getNakshatra(moonSid),
      rashi:     SIGNS[rashiIdx] ?? 'Aries',
    };
  } catch {
    return { nakshatra: 'Ashwini', rashi: 'Aries' };
  }
}

const RASHI_ICONS: Record<string, LucideIcon> = {
  Aries: ZodiacAries,
  Taurus: ZodiacTaurus,
  Gemini: ZodiacGemini,
  Cancer: ZodiacCancer,
  Leo: ZodiacLeo,
  Virgo: ZodiacVirgo,
  Libra: ZodiacLibra,
  Scorpio: ZodiacScorpio,
  Sagittarius: ZodiacSagittarius,
  Capricorn: ZodiacCapricorn,
  Aquarius: ZodiacAquarius,
  Pisces: ZodiacPisces,
};

const BRONZE = '#8F6237';
const CARD_GOLD = '#B98348';

function CelestialBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#111018', OB.bg, '#050607']}
        locations={[0, 0.48, 1]}
        style={absoluteFillStyle}
      />
      <View className="absolute -left-24 top-12 h-[260px] w-[260px] rounded-full bg-[#28365d]/25" />
      <View className="absolute -right-28 top-28 h-[300px] w-[300px] rounded-full bg-ob-saffron-dim" />
      <View className="absolute left-12 top-[410px] h-[320px] w-[320px] rounded-full bg-ob-gold-dim" />

      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="planet" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#D9A06F" stopOpacity="0.22" />
            <Stop offset="58%" stopColor="#8F6237" stopOpacity="0.11" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="50%" cy="43%" r="132" fill="url(#planet)" />
        <Circle cx="50%" cy="43%" r="101" stroke={OB.gold} strokeOpacity="0.08" strokeWidth="1" />
        <Circle cx="50%" cy="43%" r="72" stroke={OB.gold} strokeOpacity="0.06" strokeWidth="1" />
        {Array.from({ length: 24 }).map((_, i) => {
          const x = 24 + ((i * 53) % 320);
          const y = 86 + ((i * 89) % 650);
          return <Circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 1.4 : 0.8} fill={OB.gold} opacity={i % 4 === 0 ? 0.28 : 0.13} />;
        })}
      </Svg>
    </View>
  );
}

function Sunburst() {
  const cx = 110;
  const cy = 72;

  return (
    <Svg width={220} height={132} viewBox="0 0 220 132">
      <G opacity="0.9">
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const inner = 24;
          const outer = i % 2 === 0 ? 66 : 54;
          return (
            <Line
              key={i}
              x1={cx + Math.cos(angle) * inner}
              y1={cy + Math.sin(angle) * inner}
              x2={cx + Math.cos(angle) * outer}
              y2={cy + Math.sin(angle) * outer}
              stroke={OB.gold}
              strokeOpacity="0.12"
              strokeWidth="1"
            />
          );
        })}
        <Circle cx={cx} cy={cy} r="37" stroke={OB.gold} strokeOpacity="0.08" strokeWidth="1" />
        <Circle cx={cx} cy={cy} r="52" stroke={OB.gold} strokeOpacity="0.06" strokeWidth="1" />
      </G>
    </Svg>
  );
}

function CardOrnament() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 320 360" preserveAspectRatio="none">
      <Path
        d="M34 52 C78 16, 127 13, 160 44 C193 13, 242 16, 286 52"
        stroke={OB.gold}
        strokeOpacity="0.13"
        strokeWidth="1"
        fill="none"
      />
      <Path
        d="M44 309 C88 337, 124 334, 160 309 C196 334, 232 337, 276 309"
        stroke={OB.gold}
        strokeOpacity="0.1"
        strokeWidth="1"
        fill="none"
      />
      <Circle cx="34" cy="52" r="2" fill={OB.gold} opacity="0.35" />
      <Circle cx="286" cy="52" r="2" fill={OB.gold} opacity="0.35" />
      <Circle cx="44" cy="309" r="2" fill={OB.gold} opacity="0.25" />
      <Circle cx="276" cy="309" r="2" fill={OB.gold} opacity="0.25" />
    </Svg>
  );
}

function AlignmentPill({
  label,
  value,
  active = false,
}: {
  label: string;
  value: React.ReactNode;
  active?: boolean;
}) {
  return (
    <GlassCard
      intensity={active ? 26 : 18}
      style={StyleSheet.flatten([
        styles.alignmentPill,
        active ? styles.activeAlignmentPill : styles.passiveAlignmentPill,
      ])}
    >
      <LinearGradient
        colors={active
          ? ['rgba(217,160,111,0.18)', 'rgba(143,98,55,0.08)']
          : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.015)']}
        style={absoluteFillStyle}
      />
      <View className="gap-2 px-4 py-4">
        <Text className="font-label text-[9px] uppercase tracking-[2.6px] text-ob-muted">
          {label}
        </Text>
        {typeof value === 'string' ? (
          <Text className="font-headline text-[17px] tracking-[0.1px] text-ob-text">
            {value}
          </Text>
        ) : value}
      </View>
    </GlassCard>
  );
}

export default function Screen7() {
  const { height } = useWindowDimensions();
  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || 'Friend';
  const initial = name.slice(0, 1).toUpperCase();

  const { nakshatra, rashi } = deriveNakshatraRashi(
    data.birthDate,
    data.birthTime,
    data.unknownBirthTime
  );

  const insight = NAKSHATRA_INSIGHTS[nakshatra] ?? 'A rare alignment awaits your path.';
  const RashiIcon = RASHI_ICONS[rashi] ?? ZodiacAries;

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
    <SafeAreaView className="flex-1 bg-ob-bg">
      <CelestialBackdrop />

      <View className="flex-1 px-6 pt-5">
        <Animated.View entering={FadeInDown.duration(500)} className="gap-2">
          <Text className="font-headline text-[34px] leading-10 text-ob-text">
            Your cosmic{'\n'}signature
          </Text>
          <Text className="max-w-[250px] font-body text-sm leading-5 text-ob-muted">
            Your lunar imprint is ready.
          </Text>
        </Animated.View>

        {/* Ambient glow behind card */}
        <Animated.View
          className="absolute top-[27%] h-[310px] w-[310px] self-center rounded-full bg-ob-gold-dim"
          style={[goldGlowShadow, glowStyle]}
          pointerEvents="none"
        />

        {/* Birth Card */}
        <Animated.View
          className="mt-6"
          style={[
            cardStyle,
            styles.cardShadow,
            height < 700 && styles.compactCardOffset,
          ]}
        >
          <GlassCard intensity={24} style={styles.birthCard}>
            <LinearGradient
              colors={[
                'rgba(185,131,72,0.28)',
                'rgba(44,37,32,0.72)',
                'rgba(8,9,12,0.92)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={absoluteFillStyle}
            />
            <View className="absolute inset-0 opacity-70">
              <CardOrnament />
            </View>
            <View className="absolute -top-5 self-center opacity-100">
              <Sunburst />
            </View>

            {/* Gold border shimmer via nested view */}
            <View className="absolute inset-0 m-1 rounded-[28px] border border-[rgba(217,160,111,0.25)]" />

            <View className="items-center px-5 pb-3 pt-7">
              <View className="mb-4 h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-full border border-ob-gold-border bg-black/35">
                <LinearGradient
                  colors={['rgba(217,160,111,0.42)', 'rgba(224,122,95,0.12)', 'rgba(0,0,0,0.05)']}
                  style={absoluteFillStyle}
                />
                <Text className="font-headline text-[30px] text-ob-text">
                  {initial || 'A'}
                </Text>
                <Text className="absolute -right-1 top-1 text-[17px] text-ob-gold">✦</Text>
              </View>
              <Text className="text-center font-headline text-[29px] leading-9 text-ob-text">
                {data.userName || 'Your'}
              </Text>
              <Text className="mt-1 font-body text-xs tracking-[1.1px] text-ob-muted">
                Birth Alignment Card
              </Text>
            </View>

            <View className="mx-6 h-px bg-ob-divider" />

            <View className="flex-row gap-3 px-5 py-5">
              <AlignmentPill label="Nakshatra" value={`☽ ${nakshatra}`} />
              <AlignmentPill
                label="Rashi"
                value={(
                  <View className="flex-row items-center gap-2">
                    <RashiIcon color={OB.text} size={18} strokeWidth={1.8} />
                    <Text className="font-headline text-[17px] tracking-[0.1px] text-ob-text">
                      {rashi}
                    </Text>
                  </View>
                )}
                active
              />
            </View>

            <View className="mx-6 h-px bg-ob-divider" />

            <View className="gap-3 px-6 pb-7 pt-5">
              <View className="flex-row items-center gap-2">
                <View className="h-[5px] w-[5px] rounded-full bg-ob-saffron" />
                <Text className="font-label text-[9px] uppercase tracking-[2.4px] text-ob-saffron">
                  SOUL INSIGHT
                </Text>
              </View>
              <Text className="font-body text-sm leading-[22px] text-ob-text/95">
                <Text className="font-label text-ob-gold">{name}, </Text>
                {insight}
              </Text>
            </View>

            {/* Corner ornaments */}
            <Text className="absolute left-4 top-3 text-[18px] text-ob-gold/70">✦</Text>
            <Text className="absolute right-4 top-3 text-[18px] text-ob-gold/70">✦</Text>
            <Text className="absolute bottom-3 left-4 text-[18px] text-ob-gold/60">✦</Text>
            <Text className="absolute bottom-3 right-4 text-[18px] text-ob-gold/60">✦</Text>
          </GlassCard>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(1100).duration(500)} className="items-end px-7 pb-11">
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/onboarding/step-8');
          }}
          className="overflow-hidden rounded-full"
          style={({ pressed }) => [
            onboardingButtonShadow,
            pressed && pressedButtonStyle,
          ]}
        >
          <LinearGradient
            colors={['#F09072', OB.saffron, '#B95E45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text className="font-label text-base tracking-[0.3px] text-white">
              Meet Your Sarathi →
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  birthCard: {
    overflow: 'hidden',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(143,98,55,0.58)',
    backgroundColor: 'rgba(8,9,12,0.76)',
  },
  cardShadow: {
    shadowColor: BRONZE,
    shadowOpacity: 0.4,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  },
  compactCardOffset: {
    marginTop: 16,
  },
  alignmentPill: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  passiveAlignmentPill: {
    borderColor: 'rgba(217,160,111,0.26)',
  },
  activeAlignmentPill: {
    borderColor: 'rgba(217,160,111,0.52)',
    shadowColor: CARD_GOLD,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaGradient: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});
