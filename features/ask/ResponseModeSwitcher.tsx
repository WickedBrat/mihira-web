import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { AskResponseMode } from '@/features/ask/types';

const MODE_LABELS: Record<AskResponseMode, string> = {
  quick: 'Quick Guidance',
  deep: 'Deep Study',
  compare: 'Compare Texts',
};

interface ResponseModeSwitcherProps {
  mode: AskResponseMode;
  onChange: (mode: AskResponseMode) => void;
}

export function ResponseModeSwitcher({ mode, onChange }: ResponseModeSwitcherProps) {
  return (
    <View className="flex-row flex-wrap gap-2 px-4 pb-2">
      {(['quick', 'deep', 'compare'] as AskResponseMode[]).map((candidate) => {
        const active = candidate === mode;
        return (
          <Pressable
            key={candidate}
            onPress={() => onChange(candidate)}
            className={`rounded-full border px-4 py-2 ${
              active
                ? 'border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.12)]'
                : 'border-black/[0.06] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.03]'
            }`}
          >
            <Text className={`font-label text-[11px] uppercase tracking-[1px] ${active ? 'text-[rgba(150,110,10,0.95)]' : 'text-on-surface-variant'}`}>
              {MODE_LABELS[candidate]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
