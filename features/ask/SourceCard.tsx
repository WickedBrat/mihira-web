import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import type { ScriptureSource } from '@/features/ask/types';
import { SavedPassageButton } from '@/features/ask/SavedPassageButton';
import { analytics } from '@/lib/analytics';

interface SourceCardProps {
  source: ScriptureSource;
  isSaved: boolean;
  onToggleSaved: (source: ScriptureSource) => void;
}

export function SourceCard({ source, isSaved, onToggleSaved }: SourceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="rounded-[22px] border border-black/[0.06] bg-black/[0.03] p-4 dark:border-white/[0.06] dark:bg-white/[0.04]">
      <Pressable
        onPress={() => {
          const next = !expanded;
          setExpanded(next);
          if (next) {
            analytics.askSourceExpanded({ source_id: source.id, scripture: source.scripture });
          }
        }}
      >
        <View className="gap-2">
          <Text className="font-label text-[11px] uppercase tracking-[1.3px] text-secondary-dim">
            {source.scripture}
          </Text>
          <Text className="font-headline text-lg leading-6 text-on-surface">{source.citation_label}</Text>
          <Text className="font-body text-sm leading-5 text-on-surface-variant">{source.translation}</Text>
        </View>
      </Pressable>

      {expanded ? (
        <View className="mt-4 gap-3">
          {source.original_text ? (
            <Text className="font-body text-sm italic leading-5 text-on-surface">{source.original_text}</Text>
          ) : null}
          {source.transliteration ? (
            <Text className="font-body text-xs italic leading-4 text-on-surface-variant">
              {source.transliteration}
            </Text>
          ) : null}
          <Text className="font-body text-sm leading-5 text-on-surface">{source.relevance_reason}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="font-label text-[10px] uppercase tracking-[1px] text-outline">
              Confidence {source.confidence}
            </Text>
            <SavedPassageButton isSaved={isSaved} onPress={() => onToggleSaved(source)} />
          </View>
        </View>
      ) : null}
    </View>
  );
}
