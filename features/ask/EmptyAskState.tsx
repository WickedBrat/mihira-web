import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';

const SUGGESTIONS = [
  'What do the texts say about fear and duty?',
  'How do I carry grief without losing myself?',
  'Why do I keep comparing my life to others?',
];

interface EmptyAskStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export function EmptyAskState({ onSelectPrompt }: EmptyAskStateProps) {
  return (
    <View className="gap-4 rounded-[28px] border border-black/[0.06] bg-black/[0.03] p-6 dark:border-white/[0.06] dark:bg-white/[0.04]">
      <View className="gap-2">
        <Text className="font-headline text-2xl leading-8 text-on-surface">Ask from the texts.</Text>
        <Text className="font-body text-base leading-6 text-on-surface-variant">
          Bring a real question about duty, grief, relationships, money, purpose, or the wandering mind.
        </Text>
      </View>
      <View className="gap-2">
        {SUGGESTIONS.map((prompt) => (
          <Pressable
            key={prompt}
            onPress={() => onSelectPrompt(prompt)}
            className="rounded-[18px] border border-black/[0.06] bg-white/[0.4] px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <Text className="font-body text-sm leading-5 text-on-surface">{prompt}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
