import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
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
import { colors } from '@/lib/theme';

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

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.value = measuredHeight.value + 32;
      translateY.value = withSpring(0, {
        damping: 50,
        stiffness: 300,
      });
      return;
    }

    if (!isMounted) return;

    translateY.value = withTiming(measuredHeight.value + 32, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(setIsMounted)(false);
      }
    });
  }, [isMounted, measuredHeight, translateY, visible]);

  const onSheetLayout = (event: LayoutChangeEvent) => {
    const nextHeight = event.nativeEvent.layout.height;
    measuredHeight.value = nextHeight;
    if (!visible) {
      translateY.value = nextHeight + 32;
    }
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(panEnabled)
        .onBegin(() => {
          dragStartY.value = translateY.value;
        })
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

          translateY.value = withSpring(0, {
            damping: 22,
            stiffness: 220,
          });
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
      style={[styles.sheet, { zIndex, maxHeight: windowHeight * 0.82 }, sheetAnimatedStyle, sheetStyle]}
    >
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.sheetOverlay} />
      <SafeAreaView style={[styles.content, contentStyle]} edges={safeAreaEdges}>
        {showHandle && <View style={styles.handle} />}
        {children}
      </SafeAreaView>
    </Animated.View>
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, { zIndex: zIndex - 1 }, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      {panEnabled ? <GestureDetector gesture={panGesture}>{sheet}</GestureDetector> : sheet}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.54)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 19, 19, 0.92)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 9999,
    backgroundColor: `${colors.onSurfaceVariant}66`,
    marginBottom: 18,
  },
});
