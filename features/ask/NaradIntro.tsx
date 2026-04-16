// features/ask/NaradIntro.tsx
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { SacredButton } from '@/components/ui/SacredButton';

// Replace with a Narad-specific image when available
const NARAD_IMAGE_URL =
  'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/sacred%20days/krishna.webp';

interface NaradIntroProps {
  onEnter: () => void;
}

export function NaradIntro({ onEnter }: NaradIntroProps) {
  const imageOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(32);

  useEffect(() => {
    imageOpacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
    contentOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    contentY.value = withDelay(
      600,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const imageStyle = useAnimatedStyle(() => ({ opacity: imageOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  return (
    <View className="flex-1 bg-surface">
      <View pointerEvents="none" className="absolute inset-0">
        <AmbientBlob color="rgba(212, 175, 55, 0.10)" top={-80} left={-60} size={360} />
        <AmbientBlob color="rgba(255, 140, 0, 0.06)" top={400} left={60} size={280} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center px-8">
        <Animated.View
          className="mb-9 h-40 w-40 overflow-hidden rounded-full border border-[rgba(212,175,55,0.3)]"
          style={imageStyle}
        >
          <Image source={{ uri: NARAD_IMAGE_URL }} className="h-full w-full" resizeMode="cover" />
        </Animated.View>

        <Animated.View className="w-full items-center" style={contentStyle}>
          <Text className="mb-1.5 text-center font-headline-extra text-[40px] tracking-[-1px] text-on-surface">
            Narad
          </Text>
          <Text className="mb-7 text-center font-label text-xs uppercase tracking-[3px] text-[rgba(212,175,55,0.85)]">
            Celestial Companion
          </Text>
          <Text className="mb-12 text-center font-body text-base leading-6 text-on-surface-variant">
            Share what is on your mind. Narad will seek the wisest counsel and return with their
            words — a shloka, a truth, a direction.
          </Text>
          <SacredButton label="Seek Counsel" onPress={onEnter} />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
