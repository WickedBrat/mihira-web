import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, interpolate,
} from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { colors, fonts } from '@/lib/theme';

interface Props { reasoning: string }

export function VedicReasoningAccordion({ reasoning }: Props) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);

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
    <View style={styles.container}>
      <Pressable onPress={toggle} style={styles.header}>
        <Text style={styles.label}>View Vedic Reasoning</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={14} color={colors.secondaryFixed} />
        </Animated.View>
      </Pressable>
      <Animated.View style={bodyStyle}>
        <Text style={styles.body}>{reasoning}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    marginTop: 12,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.label,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.secondaryFixed,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    paddingTop: 10,
  },
});
