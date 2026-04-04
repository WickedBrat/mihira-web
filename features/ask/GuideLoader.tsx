// features/ask/GuideLoader.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { getGuide } from './guidePersonas';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CENTER_X = SCREEN_W / 2;
const CENTER_Y = SCREEN_H / 2;

// Scattered starting positions (as fractions of screen)
const ORB_STARTS: { x: number; y: number; size: number }[] = [
  { x: 0.08,  y: 0.18, size: 14 },
  { x: 0.82,  y: 0.12, size: 18 },
  { x: 0.06,  y: 0.52, size: 12 },
  { x: 0.88,  y: 0.48, size: 16 },
  { x: 0.18,  y: 0.82, size: 20 },
  { x: 0.76,  y: 0.78, size: 13 },
];

interface OrbProps {
  startX: number;
  startY: number;
  size: number;
  delay: number;
  onAllArrived?: () => void;
  isLast: boolean;
}

function Orb({ startX, startY, size, delay, onAllArrived, isLast }: OrbProps) {
  const x = useSharedValue(startX * SCREEN_W - size / 2);
  const y = useSharedValue(startY * SCREEN_H - size / 2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const targetX = CENTER_X - size / 2;
    const targetY = CENTER_Y - size / 2;
    const easing = Easing.out(Easing.cubic);

    // Fade in gently first
    opacity.value = withDelay(delay, withTiming(0.75, { duration: 600, easing }));

    // Drift to center
    x.value = withDelay(delay + 200, withTiming(targetX, { duration: 2800, easing }));

    if (isLast && onAllArrived) {
      y.value = withDelay(delay + 200, withTiming(targetY, { duration: 2800, easing }, () => {
        runOnJS(onAllArrived)();
      }));
    } else {
      y.value = withDelay(delay + 200, withTiming(targetY, { duration: 2800, easing }));
    }
  }, []);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        { width: size, height: size, borderRadius: size / 2 },
        orbStyle,
      ]}
    />
  );
}

interface MergePulseProps {
  onComplete: () => void;
}

function MergePulse({ onComplete }: MergePulseProps) {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    scale.value = withTiming(2.2, { duration: 900, easing });
    opacity.value = withSequence(
      withTiming(1, { duration: 300, easing }),
      withTiming(0, { duration: 600, easing }, () => {
        runOnJS(onComplete)();
      }),
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.mergePulse, pulseStyle]}
    />
  );
}

interface GuideLoaderProps {
  guideName: string;
  onComplete: () => void;
}

export function GuideLoader({ guideName, onComplete }: GuideLoaderProps) {
  const [showMerge, setShowMerge] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(false);

  const guide = getGuide(guideName);

  const handleOrbsArrived = () => {
    setShowMerge(true);
  };

  const handleMergeComplete = () => {
    setShowGuide(true);
    // Auto-advance after emoji + text have settled
    setTimeout(onComplete, 2200);
  };

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color="rgba(181, 100, 252, 0.08)" top={-60} left={-80} size={360} />
        <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={380} left={60} size={280} />
      </View>

      {/* Orbs layer */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {ORB_STARTS.map((orb, i) => (
          <Orb
            key={i}
            startX={orb.x}
            startY={orb.y}
            size={orb.size}
            delay={500 + i * 120}
            isLast={i === ORB_STARTS.length - 1}
            onAllArrived={handleOrbsArrived}
          />
        ))}
        {showMerge && <MergePulse onComplete={handleMergeComplete} />}
      </View>

      {/* Guide reveal */}
      {showGuide && (
        <Animated.View entering={FadeIn.duration(900)} style={styles.guideReveal}>
          <Text style={styles.guideEmoji}>{guide.emoji}</Text>
          <Animated.Text
            entering={FadeIn.delay(400).duration(900)}
            style={styles.guideText}
          >
            {guideName} is with you
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 240, 200, 0.85)',
    shadowColor: '#fff8e0',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  mergePulse: {
    position: 'absolute',
    alignSelf: 'center',
    top: CENTER_Y - 30,
    left: CENTER_X - 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 240, 200, 0.75)',
    shadowColor: '#fff8e0',
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  guideReveal: {
    alignItems: 'center',
    gap: 20,
  },
  guideEmoji: {
    fontSize: 80,
  },
  guideText: {
    fontFamily: fonts.labelLight,
    fontSize: scaleFont(20),
    color: colors.onSurfaceVariant,
    letterSpacing: 2,
    textAlign: 'center',
  },
});
