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
    <View className="mt-3 border-t border-black/[0.06] pt-3 dark:border-white/[0.06]">
      <Pressable onPress={toggle} className="flex-row items-center justify-between">
        <Text className="font-label text-[9px] uppercase tracking-[1.5px] text-secondary-fixed">View Vedic Reasoning</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={14} color={colors.secondaryFixed} />
        </Animated.View>
      </Pressable>
      <Animated.View style={bodyStyle}>
        <Text className="pt-2.5 font-body text-sm leading-5 text-on-surface-variant">{reasoning}</Text>
      </Animated.View>
    </View>
  );
}
