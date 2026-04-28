import React, { useState } from 'react';
import {
  View,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, interpolate,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/lib/theme-context';

interface Props { reasoning: string }

export function VedicReasoningAccordion({ reasoning }: Props) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const { colors } = useTheme();

  const toggle = () => {
    const next = open ? 0 : 1;
    progress.value = withTiming(next, { duration: 250 });
    setOpen(!open);
  };

  const bodyStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(progress.value, [0, 1], [0, 200]),
    opacity: progress.value,
    overflow: 'hidden',
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
  }));

  return (
    <View className="mt-3 border-t border-black/[0.08] pt-2.5 dark:border-white/[0.09]">
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="min-h-[44px] flex-row items-center justify-between rounded-xl px-0.5 active:bg-black/[0.04] dark:active:bg-white/[0.05]"
      >
        <Text className="font-label text-[11px] uppercase leading-4 tracking-[1.4px] text-secondary-fixed">
          {open ? 'Hide Vedic Reasoning' : 'View Vedic Reasoning'}
        </Text>
        <Animated.View className="h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] dark:bg-white/[0.06]" style={chevronStyle}>
          <ChevronDown size={16} color={colors.secondaryFixed} strokeWidth={2} />
        </Animated.View>
      </Pressable>
      <Animated.View style={bodyStyle}>
        <Text className="pb-1 pt-2 font-body text-[14px] leading-[22px] text-on-surface-variant dark:text-white/68">{reasoning}</Text>
      </Animated.View>
    </View>
  );
}
