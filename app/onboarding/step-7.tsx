// Screen 7: The Revelation — Birth Card
import React, { useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  FadeInDown,
  FadeInUp,
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import { GlassCard } from '@/components/ui/GlassCard';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import {
  absoluteFillStyle,
  goldGlowShadow,
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';
import {
  OB,
  getOnboardingData,
  NAKSHATRA_INSIGHTS,
  setOnboardingData,
} from '@/lib/onboardingStore';
import { deriveMoonProfile } from '@/lib/vedic/moonProfile';
import { LucideIcon, ZodiacAries, ZodiacTaurus, ZodiacGemini, ZodiacCancer, ZodiacLeo, ZodiacVirgo, ZodiacLibra, ZodiacScorpio, ZodiacSagittarius, ZodiacCapricorn, ZodiacAquarius, ZodiacPisces } from 'lucide-react-native';

const BRONZE = '#8F6237';

const RASHI_SYMBOLS: Record<string, LucideIcon> = {
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


function AmbientGlowCircle({
  size,
  color,
  gradientId,
  style,
  innerOpacity = 0.22,
  midOpacity = 0.1,
  wobbleX = 0,
  wobbleY = 0,
  wobbleScale = 1.03,
  wobbleDelay = 0,
  wobbleDuration = 2800,
}: {
  size: number;
  color: string;
  gradientId: string;
  style?: ViewStyle;
  innerOpacity?: number;
  midOpacity?: number;
  wobbleX?: number;
  wobbleY?: number;
  wobbleScale?: number;
  wobbleDelay?: number;
  wobbleDuration?: number;
}) {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    offsetX.value = -wobbleX;
    offsetY.value = wobbleY;
    scale.value = 1;

    offsetX.value = withDelay(
      wobbleDelay,
      withRepeat(
        withTiming(wobbleX, { duration: wobbleDuration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
    offsetY.value = withDelay(
      wobbleDelay,
      withRepeat(
        withTiming(-wobbleY, { duration: wobbleDuration * 1.05, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
    scale.value = withDelay(
      wobbleDelay,
      withRepeat(
        withTiming(wobbleScale, { duration: wobbleDuration * 1.1, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(offsetX);
      cancelAnimation(offsetY);
      cancelAnimation(scale);
    };
  }, [offsetX, offsetY, scale, wobbleDelay, wobbleDuration, wobbleScale, wobbleX, wobbleY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.ambientCircle, { width: size, height: size }, style, animatedStyle]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={innerOpacity} />
            <Stop offset="62%" stopColor={color} stopOpacity={midOpacity} />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} />
      </Svg>
    </Animated.View>
  );
}


function CelestialBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#111018', OB.bg, '#050607']}
        locations={[0, 0.48, 1]}
        style={absoluteFillStyle}
      />

      <AmbientGlowCircle
        size={260}
        color="#5D78D3"
        gradientId="backdrop-glow-left"
        style={{ left: -96, top: 48 }}
        innerOpacity={0.16}
        midOpacity={0.07}
        wobbleX={7}
        wobbleY={5}
        wobbleScale={2.04}
        wobbleDelay={220}
        wobbleDuration={3200}
      />
      <AmbientGlowCircle
        size={300}
        color={OB.saffron}
        gradientId="backdrop-glow-right"
        style={{ right: -112, top: 112 }}
        innerOpacity={0.16}
        midOpacity={0.08}
        wobbleX={-6}
        wobbleY={7}
        wobbleDelay={480}
        wobbleDuration={3600}
      />
      <AmbientGlowCircle
        size={320}
        color={OB.gold}
        gradientId="backdrop-glow-bottom"
        style={{ left: 48, top: 410 }}
        innerOpacity={0.14}
        midOpacity={0.07}
        wobbleX={5}
        wobbleScale={2.04}
        wobbleY={-8}
        wobbleDelay={760}
        wobbleDuration={4000}
      />

      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="planet" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#D9A06F" stopOpacity="0.18" />
            <Stop offset="58%" stopColor="#8F6237" stopOpacity="0.08" />
            <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="50%" cy="43%" r="132" fill="url(#planet)" />
        <Circle cx="50%" cy="43%" r="101" stroke={OB.gold} strokeOpacity="0.05" strokeWidth="1" />
        <Circle cx="50%" cy="43%" r="72" stroke={OB.gold} strokeOpacity="0.04" strokeWidth="1" />
        {Array.from({ length: 24 }).map((_, i) => {
          const x = 24 + ((i * 53) % 320);
          const y = 86 + ((i * 89) % 650);
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r={i % 5 === 0 ? 1.4 : 0.8}
              fill={OB.gold}
              opacity={i % 4 === 0 ? 0.24 : 0.1}
            />
          );
        })}
      </Svg>
    </View>
  );
}

function AvatarHalo({ initial }: { initial: string }) {
  return (
    <View className="items-center justify-center">
      <View style={styles.avatarRingOuter} />
      <View style={styles.avatarRingMiddle} />
      <View style={styles.avatarRingInner} />
      <View style={styles.avatarCore}>
        <LinearGradient
          colors={['rgba(62,62,62,0.95)', 'rgba(8,8,8,1)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={absoluteFillStyle}
        />
        <Text className="font-headline text-[34px] text-white">{initial}</Text>
      </View>
    </View>
  );
}

function AlignmentTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <View style={styles.alignmentTile}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={absoluteFillStyle}
      />
      <View className="gap-4 px-5 py-5">
        <Text className="font-label text-[11px] uppercase tracking-[2.4px] text-[#69708B]">
          {label}
        </Text>
        {value}
      </View>
    </View>
  );
}

export default function Screen7() {
  const { height } = useWindowDimensions();
  const data = getOnboardingData();
  const name = data.userName?.split(' ')[0] || 'Friend';
  const initial = name.slice(0, 1).toUpperCase();

  const { nakshatra, rashi } = deriveMoonProfile(
    data.birthDate,
    data.birthTime,
    data.unknownBirthTime
  );

  const insight = NAKSHATRA_INSIGHTS[nakshatra] ?? 'A rare alignment awaits your path.';
  const RashiIcon = RASHI_SYMBOLS[rashi] ?? ZodiacAries;

  useEffect(() => {
    setOnboardingData({ birthPlace: data.birthPlace });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const cardScale = useSharedValue(0.88);
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

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />

      <CelestialBackdrop />
      <OnboardingStarField />

      <View className="flex-1 items-center px-6 pt-5">
        <Animated.View entering={FadeInDown.duration(500)} className="items-center gap-2">
          <Text className="text-center font-headline text-[34px] leading-10 text-ob-text">
            Your cosmic{'\n'}signature
          </Text>
          <Text className="max-w-[250px] text-center font-body text-sm leading-5 text-ob-muted">
            We’ve mapped the lunar pattern you were born into.
          </Text>
        </Animated.View>

        <Animated.View
          className="absolute top-[27%] self-center"
          style={[goldGlowShadow, glowStyle]}
          pointerEvents="none"
        >
          <AmbientGlowCircle
            size={310}
            color={OB.gold}
            gradientId="card-glow"
            innerOpacity={0.2}
            midOpacity={0.1}
            wobbleX={4}
            wobbleY={10}
            wobbleScale={2.04}
            wobbleDelay={900}
            wobbleDuration={2400}
          />
        </Animated.View>

        <Animated.View
          className="mt-6 w-full"
          style={[
            styles.cardWrap,
            styles.cardShadow,
            cardStyle,
            height < 700 && styles.compactCardOffset,
          ]}
        >
          <GlassCard intensity={40} style={styles.birthCard}>
            <LinearGradient
              colors={[
                'rgba(78, 63, 91, 0.14)',
                'rgba(29,26,34,0.16)',
                'rgba(10,10,10,0.08)',
              ]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={absoluteFillStyle}
            />
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.16)',
                'rgba(255,255,255,0.05)',
                'rgba(255,255,255,0)',
              ]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 0.55 }}
              style={styles.cardHighlight}
            />

            <View style={styles.cardInnerBorder} />

            <Text style={[styles.cornerGlyph, styles.cornerTopLeft]}>✦</Text>
            <Text style={[styles.cornerGlyph, styles.cornerTopRight]}>✦</Text>
            <Text style={[styles.cornerGlyph, styles.cornerBottomLeft]}>✦</Text>
            <Text style={[styles.cornerGlyph, styles.cornerBottomRight]}>✦</Text>

            <View className="items-center px-8 pb-3 pt-11">
              <AvatarHalo initial={initial || 'A'} />
              <Text className="mt-7 text-center font-headline text-[28px] leading-9 text-white">
                {data.userName || 'Your'}
              </Text>
              <Text className="mt-2 font-label text-sm uppercase tracking-[3.6px] text-[#8B8FA0]">
                Birth Alignment Card
              </Text>
            </View>

            <View style={styles.divider} />

            <View className="flex-row gap-5 px-8 py-4">
              <AlignmentTile
                label="Nakshatra"
                value={(
                  <Text className="font-headline text-[17px] leading-6 text-white">
                    <Text className="text-[#C6C9D4]">☽</Text> {nakshatra}
                  </Text>
                )}
              />
              <AlignmentTile
                label="Rashi"
                value={(
                  <View className="flex-row items-center gap-2">
                    <RashiIcon size={18} color="#ffffffff" strokeWidth={1.8} />
                    <Text className="font-headline text-[17px] leading-6 text-white">
                      {rashi}
                    </Text>
                  </View>
                )}
              />
            </View>

            <View style={styles.divider} />

            <View className="gap-4 px-8 pb-11 pt-8">
              <View className="flex-row items-center gap-2">
                <View className="h-[7px] w-[7px] rounded-full bg-[#E2AF87]" />
                <Text className="font-label text-[11px] uppercase tracking-[3.2px] text-[#E2AF87]">
                  Soul Insight
                </Text>
              </View>
              <Text className="font-body text-[17px] leading-8 text-[rgba(245,242,239,0.92)]">
                <Text className="font-body-medium text-[#E2AF87]">{name}, </Text>
                {insight}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(1100).duration(500)} className="items-center px-7 pb-11">
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
              Meet your Sarathi →
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ambientCircle: {
    position: 'absolute',
  },
  cardWrap: {
    width: '100%',
    maxWidth: 372,
    alignSelf: 'center',
  },
  birthCard: {
    overflow: 'hidden',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(22,18,28,0.14)',
  },
  cardHighlight: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  cardInnerBorder: {
    ...StyleSheet.absoluteFillObject,
    margin: 1,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardShadow: {
    shadowColor: BRONZE,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
  compactCardOffset: {
    marginTop: 16,
  },
  avatarRingOuter: {
    position: 'absolute',
    width: 198,
    height: 198,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120,106,129,0.18)',
  },
  avatarRingMiddle: {
    position: 'absolute',
    width: 164,
    height: 164,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120,106,129,0.14)',
  },
  avatarRingInner: {
    position: 'absolute',
    width: 126,
    height: 126,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(124,130,135,0.28)',
  },
  avatarCore: {
    width: 92,
    height: 92,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(142,146,144,0.42)',
    backgroundColor: '#090909',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 40,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  alignmentTile: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cornerGlyph: {
    position: 'absolute',
    fontSize: 18,
    color: '#E2AF87',
    opacity: 0.9,
  },
  cornerTopLeft: {
    left: 24,
    top: 24,
  },
  cornerTopRight: {
    right: 24,
    top: 24,
  },
  cornerBottomLeft: {
    left: 24,
    bottom: 18,
  },
  cornerBottomRight: {
    right: 24,
    bottom: 18,
  },
  ctaGradient: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});
