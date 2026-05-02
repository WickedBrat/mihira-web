import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import type { ScriptureSource } from '@/features/ask/types';
import { SavedPassageButton } from '@/features/ask/SavedPassageButton';
import { analytics } from '@/lib/analytics';
import { getSanskritDisplayText } from '@/lib/sanskrit';

const SOURCE_LAYOUT_TRANSITION = LinearTransition
  .duration(220)
  .easing(Easing.out(Easing.cubic));

interface SourceCardProps {
  source: ScriptureSource;
  isSaved: boolean;
  onToggleSaved: (source: ScriptureSource) => void;
}

export function SourceCard({ source, isSaved, onToggleSaved }: SourceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { devanagari, transliteration } = getSanskritDisplayText(
    source.original_text,
    source.transliteration,
  );
  const hasSanskrit = devanagari.length > 0;

  return (
    <Animated.View
      layout={SOURCE_LAYOUT_TRANSITION}
      className="py-2"
    >
      <View className="gap-2">
        <Text className="font-label text-xs uppercase tracking-[1.3px] text-secondary-dim">
          {source.scripture}
        </Text>
        <Text className="font-headline text-2xl leading-9 text-on-surface">{source.citation_label}</Text>
        <Text className="font-body text-lg leading-8 text-on-surface">
          {source.relevance_reason}
        </Text>
        <Text className="font-body text-lg leading-8 text-on-surface-variant" numberOfLines={2}>
          {source.translation}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-3">
        <Pressable
          onPress={() => {
            const next = !expanded;
            setExpanded(next);
            if (next) {
              analytics.askSourceExpanded({ source_id: source.id, scripture: source.scripture });
            }
          }}
          className="self-start px-0.5 py-1"
        >
          <Text className="font-label text-xs uppercase tracking-[1px] text-secondary-dim">
            {expanded ? 'Hide Full Passage' : 'Read Full Passage'}
          </Text>
        </Pressable>
        <SavedPassageButton isSaved={isSaved} onPress={() => onToggleSaved(source)} />
      </View>

      {expanded ? (
        <Animated.View
          layout={SOURCE_LAYOUT_TRANSITION}
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(180)}
          className="mt-4 gap-4"
        >
          {hasSanskrit ? (
            <View className="rounded-[22px] border border-[rgba(212,175,55,0.16)] bg-[rgba(242,206,173,0.08)] px-5 py-5">
              <Text
                className="text-center text-3xl leading-normal text-[rgba(212,175,55,0.95)]"
                style={{ letterSpacing: 0 }}
              >
                {devanagari}
              </Text>
              {transliteration ? (
                <Text className="mt-3 text-center font-body text-lg italic leading-8 text-on-surface-variant">
                  {transliteration}
                </Text>
              ) : null}
            </View>
          ) : null}
          <Text className="font-body text-lg leading-8 text-on-surface">{source.translation}</Text>
          <Text className="font-label text-xs uppercase tracking-[1px] text-outline">
            Retrieval Confidence {source.confidence}
          </Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
