import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { AskResponseMode } from '@/features/ask/types';

const MODE_CONTENT: Record<AskResponseMode, { label: string; description: string }> = {
  quick: {
    label: 'Quick Guidance',
    description: 'Short answer with a few grounded passages.',
  },
  deep: {
    label: 'Deep Study',
    description: 'Longer synthesis with richer interpretation.',
  },
  compare: {
    label: 'Compare Texts',
    description: 'See where different sources converge or diverge.',
  },
};

interface ResponseModeSwitcherProps {
  mode: AskResponseMode;
  onChange: (mode: AskResponseMode) => void;
}

export function ResponseModeSwitcher({ mode, onChange }: ResponseModeSwitcherProps) {
  return (
    <View className="gap-2 px-1">
      <Text className="px-3 font-label text-[11px] uppercase tracking-[1.4px] text-secondary-dim">
        Response Mode
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {(['quick', 'deep', 'compare'] as AskResponseMode[]).map((candidate) => {
          const { label, description } = MODE_CONTENT[candidate];
          const active = candidate === mode;

          return (
            <Pressable
              key={candidate}
              onPress={() => onChange(candidate)}
              className={`min-w-[31%] flex-1 rounded-[22px] border px-4 py-3.5 ${
                active
                  ? 'border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.14)]'
                  : 'border-black/[0.06] bg-black/[0.03] dark:border-white/[0.06] dark:bg-white/[0.03]'
              }`}
            >
              <Text
                className={`font-label text-[11px] uppercase tracking-[1.1px] ${
                  active ? 'text-[rgba(150,110,10,0.95)]' : 'text-on-surface-variant'
                }`}
              >
                {label}
              </Text>
              <Text className="mt-1.5 font-body text-xs leading-4 text-on-surface">
                {description}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
