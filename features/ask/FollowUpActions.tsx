import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';

interface FollowUpActionsProps {
  prompts: string[];
  onUsePrompt: (prompt: string) => void;
  onToggleAlternateSources?: () => void;
  showAlternateSources?: boolean;
}

export function FollowUpActions({
  prompts,
  onUsePrompt,
  onToggleAlternateSources,
  showAlternateSources = false,
}: FollowUpActionsProps) {
  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-2">
        {prompts.map((prompt) => (
          <Pressable
            key={prompt}
            onPress={() => onUsePrompt(prompt)}
            className="rounded-full border border-black/[0.06] bg-black/[0.04] px-3.5 py-2 dark:border-white/[0.06] dark:bg-white/[0.04]"
          >
            <Text className="font-body text-sm leading-5 text-on-surface">{prompt}</Text>
          </Pressable>
        ))}
      </View>
      {onToggleAlternateSources ? (
        <Pressable onPress={onToggleAlternateSources} className="self-start rounded-full px-1 py-1">
          <Text className="font-label text-[11px] uppercase tracking-[1px] text-secondary-dim">
            {showAlternateSources ? 'Hide Alternate Sources' : 'Show Alternate Sources'}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
