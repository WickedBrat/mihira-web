import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/theme-context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  zIndex?: number;
  panEnabled?: boolean;
  showHandle?: boolean;
  safeAreaEdges?: Edge[];
  sheetStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  zIndex = 50,
  panEnabled = true,
  showHandle = true,
  safeAreaEdges = ['bottom'],
  sheetStyle,
  contentStyle,
}: BottomSheetProps) {
  const { height: windowHeight } = useWindowDimensions();
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useSharedValue(windowHeight);
  const measuredHeight = useSharedValue(windowHeight);
  const dragStartY = useSharedValue(0);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.value = measuredHeight.value + 32;
      translateY.value = withSpring(0, { damping: 50, stiffness: 300 });
      return;
    }
    if (!isMounted) return;
    translateY.value = withTiming(measuredHeight.value + 32, { duration: 220 }, (finished) => {
      if (finished) runOnJS(setIsMounted)(false);
    });
  }, [isMounted, measuredHeight, translateY, visible]);

  const onSheetLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    measuredHeight.value = nextHeight;
    if (!visible) translateY.value = nextHeight + 32;
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(panEnabled)
        .onBegin(() => { dragStartY.value = translateY.value; })
        .onUpdate((event) => {
          translateY.value = Math.max(0, dragStartY.value + event.translationY);
        })
        .onEnd((event) => {
          const shouldClose =
            translateY.value > measuredHeight.value * 0.32 || event.velocityY > 950;
          if (shouldClose) {
            runOnJS(onClose)();
            return;
          }
          translateY.value = withSpring(0, { damping: 22, stiffness: 220 });
        }),
    [dragStartY, measuredHeight, onClose, panEnabled, translateY]
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, measuredHeight.value + 32],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) return null;

  const sheet = (
    <Animated.View
      onLayout={onSheetLayout}
      className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-t-[30px] border border-black/[0.08] dark:border-white/[0.06]"
      style={[{ zIndex, maxHeight: windowHeight * 0.82 }, sheetAnimatedStyle, sheetStyle]}
    >
      <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} className="absolute inset-0" />
      <View className="absolute inset-0 bg-[rgba(250,247,242,0.96)] dark:bg-[rgba(19,19,19,0.92)]" />
      <SafeAreaView className="flex-1 px-5 pb-6 pt-3" style={contentStyle} edges={safeAreaEdges}>
        {showHandle && (
          <View
            className="mb-[18px] h-[5px] w-12 self-center rounded-full"
            style={{ backgroundColor: `${colors.onSurfaceVariant}66` }}
          />
        )}
        {children}
      </SafeAreaView>
    </Animated.View>
  );

  return (
    <View pointerEvents="box-none" className="absolute inset-0">
      <Animated.View
        className="absolute inset-0 bg-black/30 dark:bg-black/[0.54]"
        style={[{ zIndex: zIndex - 1 }, backdropStyle]}
      >
        <Pressable className="absolute inset-0" onPress={onClose} />
      </Animated.View>
      {panEnabled ? <GestureDetector gesture={panGesture}>{sheet}</GestureDetector> : sheet}
    </View>
  );
}
