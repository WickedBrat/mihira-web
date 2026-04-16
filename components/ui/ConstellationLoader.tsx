import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/lib/theme-context';

interface ConstellationLoaderProps {
  size?: number;
  message?: string;
  style?: StyleProp<ViewStyle>;
  messageStyle?: StyleProp<TextStyle>;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

const VIEWBOX_SIZE = 100;
const KEYFRAME_RANGE = [0, 1, 2, 3, 4, 5, 6] as const;
const LINE_OPACITY_KEYFRAMES = [0, 0.92, 0, 0.92, 0, 0.92, 0] as const;
const STAR_OPACITY_KEYFRAMES = [0.92, 1, 0.92, 1, 0.92, 1, 0.92] as const;
const STAR_RADII = [6.8, 1.5, 3.5, 3.7, 6.1, 3.2, 3.4, 3.8, 4.2, 3.7, 6.3, 4.3, 3.4, 3.1] as const;

const CLUSTER_POINTS = [
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
  [43, 53],
] as const;

const SHAPE_ONE_POINTS = [
  [12, 74],
  [18, 60],
  [31, 55],
  [48, 58],
  [52, 68],
  [50.5, 52],
  [55, 48],
  [61, 48],
  [69, 32],
  [67, 56],
  [84, 46],
  [74, 61],
  [84, 73],
  [83, 80],
] as const;

const SHAPE_TWO_POINTS = [
  [17, 67],
  [27, 59],
  [39, 50],
  [45, 61],
  [55, 58],
  [56, 45],
  [52, 37],
  [61, 34],
  [73, 26],
  [67, 51],
  [83, 59],
  [75, 68],
  [68, 77],
  [72, 86],
] as const;

const SHAPE_THREE_POINTS = [
  [14, 44],
  [24, 41],
  [36, 36],
  [44, 46],
  [50, 59],
  [58, 49],
  [64, 40],
  [72, 36],
  [84, 30],
  [64, 60],
  [81, 67],
  [61, 71],
  [48, 79],
  [38, 86],
] as const;

const STATE_POINTS = [
  CLUSTER_POINTS,
  SHAPE_ONE_POINTS,
  CLUSTER_POINTS,
  SHAPE_TWO_POINTS,
  CLUSTER_POINTS,
  SHAPE_THREE_POINTS,
  CLUSTER_POINTS,
] as const;

const STAR_KEYFRAMES = STAR_RADII.map((radius, starIndex) => ({
  x: STATE_POINTS.map((state) => state[starIndex][0]),
  y: STATE_POINTS.map((state) => state[starIndex][1]),
  radius,
}));

const CONNECTIONS = [
  [0, 4],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 7],
  [6, 7],
  [7, 8],
  [4, 9],
  [7, 9],
  [9, 11],
  [11, 10],
  [11, 12],
  [12, 13],
  [4, 11],
] as const;

function ConstellationLine({
  startIndex,
  endIndex,
  stroke,
  progress,
}: {
  startIndex: number;
  endIndex: number;
  stroke: string;
  progress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    x1: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[startIndex].x, Extrapolation.CLAMP),
    y1: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[startIndex].y, Extrapolation.CLAMP),
    x2: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[endIndex].x, Extrapolation.CLAMP),
    y2: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[endIndex].y, Extrapolation.CLAMP),
    opacity: interpolate(progress.value, KEYFRAME_RANGE, LINE_OPACITY_KEYFRAMES, Extrapolation.CLAMP),
  }));

  return (
    <AnimatedLine
      animatedProps={animatedProps}
      stroke={stroke}
      strokeWidth={1}
      strokeLinecap="round"
      strokeDasharray="2.6 3.2"
    />
  );
}

function ConstellationStar({
  starIndex,
  fill,
  progress,
}: {
  starIndex: number;
  fill: string;
  progress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => ({
    cx: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[starIndex].x, Extrapolation.CLAMP),
    cy: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[starIndex].y, Extrapolation.CLAMP),
    r: STAR_KEYFRAMES[starIndex].radius,
    opacity: interpolate(progress.value, KEYFRAME_RANGE, STAR_OPACITY_KEYFRAMES, Extrapolation.CLAMP),
  }));

  const glowAnimatedProps = useAnimatedProps(() => ({
    cx: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[starIndex].x, Extrapolation.CLAMP),
    cy: interpolate(progress.value, KEYFRAME_RANGE, STAR_KEYFRAMES[starIndex].y, Extrapolation.CLAMP),
    r: STAR_KEYFRAMES[starIndex].radius * 1.9,
    opacity: interpolate(progress.value, KEYFRAME_RANGE, STAR_OPACITY_KEYFRAMES, Extrapolation.CLAMP) * 0.16,
  }));

  return (
    <>
      {/* <AnimatedCircle animatedProps={glowAnimatedProps} fill={fill} /> */}
      <AnimatedCircle animatedProps={animatedProps} fill={fill} />
    </>
  );
}

export function ConstellationLoader({
  size = 168,
  message,
  style,
  messageStyle,
}: ConstellationLoaderProps) {
  const progress = useSharedValue(0);
  const breathe = useSharedValue(0);
  const { colors } = useTheme();

  useEffect(() => {
    const easing = Easing.bezier(0.22, 1, 0.36, 1);
    const morphDuration = 920;
    const holdDuration = 520;

    progress.value = withRepeat(
      withSequence(
        withDelay(holdDuration, withTiming(1, { duration: morphDuration, easing })),
        withDelay(holdDuration, withTiming(2, { duration: morphDuration, easing })),
        withDelay(holdDuration, withTiming(3, { duration: morphDuration, easing })),
        withDelay(holdDuration, withTiming(4, { duration: morphDuration, easing })),
        withDelay(holdDuration, withTiming(5, { duration: morphDuration, easing })),
        withDelay(holdDuration, withTiming(6, { duration: morphDuration, easing })),
      ),
      -1,
      false,
    );

    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [breathe, progress]);

  const constellationStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breathe.value, [0, 1], [0.94, 1]),
    transform: [
      { scale: interpolate(breathe.value, [0, 1], [0.97, 1.02]) },
      { rotate: `${interpolate(breathe.value, [0, 1], [-1.2, 1.2])}deg` },
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={constellationStyle}>
        <Svg width={size} height={size} viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
          {CONNECTIONS.map(([startIndex, endIndex], index) => (
            <ConstellationLine
              key={`line-${startIndex}-${endIndex}-${index}`}
              startIndex={startIndex}
              endIndex={endIndex}
              stroke={colors.onSurface}
              progress={progress}
            />
          ))}
          {STAR_KEYFRAMES.map((_, starIndex) => (
            <ConstellationStar
              key={`star-${starIndex}`}
              starIndex={starIndex}
              fill={colors.onSurfaceVariant}
              progress={progress}
            />
          ))}
        </Svg>
      </Animated.View>

      {message ? (
        <Text
          className="mt-3 text-center font-body text-sm text-on-surface-variant"
          style={messageStyle}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
