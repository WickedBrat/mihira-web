import React from 'react';
import { Pressable } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  /** 'pill' = full rounded row (S2 ache pills), 'chip' = compact rounded chip (S3 context grid, S18 vow chips) */
  shape?: 'pill' | 'chip';
  showCheck?: boolean;
  fullWidth?: boolean;
}

/** Generic selectable pill/chip — active state = gold-tinted border + fill, matching the HTML mock's selBg/selBorder/selColor tokens. */
export function Chip({ label, active, onPress, shape = 'pill', showCheck = true, fullWidth = true }: ChipProps) {
  const isPill = shape === 'pill';
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-center gap-2 border ${fullWidth ? 'w-full' : ''} ${
        isPill ? 'rounded-2xl px-[22px] py-4' : 'rounded-full px-4 py-3'
      } ${active ? 'border-obn-gold-border bg-obn-gold-dim' : 'border-obn-card-border bg-obn-card'}`}
    >
      {active && showCheck ? (
        <Animated.View entering={ZoomIn.duration(180)}>
          <Text className="text-[11px] text-obn-gold">✦</Text>
        </Animated.View>
      ) : null}
      <Text
        numberOfLines={2}
        className={`text-center font-manrope-semibold ${isPill ? 'text-[15px]' : 'text-[13px]'} ${
          active ? 'text-obn-text' : 'text-obn-muted'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
