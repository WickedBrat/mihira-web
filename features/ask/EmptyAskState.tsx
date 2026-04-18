import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';

const TOPIC_CARDS = [
  { title: 'Duty', prompt: 'What do the texts say about fear and duty?' },
  { title: 'Grief', prompt: 'How do I carry grief without losing myself?' },
  { title: 'Family', prompt: 'How do I respond to tension with my parents without hardening?' },
  { title: 'Purpose', prompt: 'I feel useful but empty. How do I find purpose again?' },
  { title: 'Money', prompt: 'How do I hold ambition without becoming consumed by it?' },
  { title: 'Mind', prompt: 'Why do I keep comparing my life to others?' },
];

interface EmptyAskStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export function EmptyAskState({ onSelectPrompt }: EmptyAskStateProps) {
  return (
    <View className="gap-5 rounded-[30px] border border-black/[0.06] bg-black/[0.03] p-6 dark:border-white/[0.06] dark:bg-white/[0.04]">
      <View className="gap-2">
        <Text className="font-headline text-3xl leading-10 text-on-surface">
          Start with what is actually weighing on you.
        </Text>
        <Text className="font-body text-lg leading-8 text-on-surface-variant">
          Ask plainly. Aksha will interpret the texts, cite the passages, and turn them into usable
          guidance for the next 24 hours.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {TOPIC_CARDS.map(({ title, prompt }) => (
          <Pressable
            key={title}
            onPress={() => onSelectPrompt(prompt)}
            className="min-w-[47%] flex-1 rounded-[20px] border border-black/[0.06] bg-white/[0.4] px-4 py-4 dark:border-white/[0.06] dark:bg-white/[0.03]"
          >
            <Text className="font-label text-xs uppercase tracking-[1.2px] text-secondary-dim">
              {title}
            </Text>
            <Text className="mt-2 font-body text-lg leading-7 text-on-surface">{prompt}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
