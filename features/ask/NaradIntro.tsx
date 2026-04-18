// features/ask/NaradIntro.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
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

interface NaradIntroProps {
  onEnter: () => void;
}

const TRUST_PILLARS = [
  'Grounded in sacred texts',
  'Interpreted for modern life',
  'Practical steps for today',
];

export function NaradIntro({ onEnter }: NaradIntroProps) {
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(32);

  useEffect(() => {
    contentOpacity.value = withDelay(220, withTiming(1, { duration: 800 }));
    contentY.value = withDelay(
      220,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  return (
    <View className="flex-1">
      <View pointerEvents="none" className="absolute inset-0">
        <AmbientBlob color="rgba(212, 175, 55, 0.10)" top={-80} left={-60} size={360} />
        <AmbientBlob color="rgba(212, 190, 228, 0.08)" top={180} left={180} size={260} />
        <AmbientBlob color="rgba(255, 140, 0, 0.06)" top={470} left={40} size={260} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} className="flex-1 justify-center px-7">
        <Animated.View className="w-full" style={contentStyle}>
          <View className="self-center rounded-full border border-[rgba(212,175,55,0.22)] bg-[rgba(242,206,173,0.12)] px-4 py-2">
            <Text className="font-label text-[11px] uppercase tracking-[1.8px] text-[rgb(150,110,10)]">
              Scripture Grounded Guidance
            </Text>
          </View>

          <Text className="mt-6 text-center font-headline-extra text-[42px] leading-[48px] tracking-[-1px] text-on-surface">
            Bring a life question.
          </Text>
          <Text className="mt-3 text-center font-body text-base leading-7 text-on-surface-variant">
            Aksha responds with scripture-backed guidance, careful interpretation, and one clear
            practice for today.
          </Text>

          <View className="mt-8 gap-3 text-center">
            {TRUST_PILLARS.map((pillar) => (
              <View
                key={pillar}
                className="rounded-[22px] border w-[240px] mx-auto border-black/[0.06] bg-black/[0.03] px-5 py-4 dark:border-white/[0.06] dark:bg-white/[0.04]"
              >
                <Text className="font-body-medium text-center text-on-surface">{pillar}</Text>
              </View>
            ))}
          </View>

          <SacredButton label="Begin With A Question" onPress={onEnter} className="mt-8" />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
