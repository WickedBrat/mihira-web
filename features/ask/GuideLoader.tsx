// features/ask/GuideLoader.tsx
import React, { useEffect } from 'react';
import {
  View,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/ui/Text';
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
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { getGuide } from './guidePersonas';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CENTER_X = SCREEN_W / 2;
const CENTER_Y = SCREEN_H / 2;

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

    opacity.value = withDelay(delay, withTiming(0.75, { duration: 600, easing }));
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
      className="absolute bg-[rgba(255,240,200,0.85)]"
      style={[
        {
          shadowColor: '#fff8e0',
          shadowOpacity: 0.9,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 0 },
        },
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
      className="absolute self-center rounded-full bg-[rgba(255,240,200,0.75)]"
      style={[
        {
          top: CENTER_Y - 30,
          left: CENTER_X - 30,
          width: 60,
          height: 60,
          shadowColor: '#fff8e0',
          shadowOpacity: 1,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 0 },
        },
        pulseStyle,
      ]}
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

  const handleOrbsArrived = () => setShowMerge(true);
  const handleMergeComplete = () => {
    setShowGuide(true);
    setTimeout(onComplete, 2200);
  };

  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <View pointerEvents="none" className="absolute inset-0">
        <AmbientBlob color="rgba(181, 100, 252, 0.08)" top={-60} left={-80} size={360} />
        <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={380} left={60} size={280} />
      </View>

      <View className="absolute inset-0" pointerEvents="none">
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

      {showGuide && (
        <Animated.View entering={FadeIn.duration(900)} className="items-center gap-5">
          <Text className="text-[80px]">{guide.emoji}</Text>
          <Animated.Text
            entering={FadeIn.delay(400).duration(900)}
            className="text-center font-label-light text-xl tracking-[2px] text-on-surface-variant"
          >
            {guideName} is with you
          </Animated.Text>
        </Animated.View>
      )}
    </View>
  );
}
