import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { FollowUpActions } from '@/features/ask/FollowUpActions';
import { SourceCard } from '@/features/ask/SourceCard';
import type { ScriptureGuideResponse, ScriptureSource } from '@/features/ask/types';

const SECTION_LAYOUT_TRANSITION = LinearTransition
  .duration(220)
  .easing(Easing.out(Easing.cubic));

interface ScriptureAnswerCardProps {
  response: ScriptureGuideResponse;
  savedSourceIds: Set<string>;
  onToggleSavedPassage: (source: ScriptureSource) => void;
  onUseFollowUpPrompt: (prompt: string) => void;
}

export function ScriptureAnswerCard({
  response,
  savedSourceIds,
  onToggleSavedPassage,
  onUseFollowUpPrompt,
}: ScriptureAnswerCardProps) {
  const [showAllSources, setShowAllSources] = useState(false);
  const [isInterpretationOpen, setIsInterpretationOpen] = useState(response.mode !== 'quick');
  const [isNextQuestionsOpen, setIsNextQuestionsOpen] = useState(response.follow_up_prompts.length > 0);
  const visibleSources = showAllSources ? response.sources : response.sources.slice(0, 2);

  return (
    <Animated.View
      layout={SECTION_LAYOUT_TRANSITION}
      className="gap-5 self-stretch rounded-[30px] border border-white/[0.10] bg-white/[0.08] p-5 dark:border-white/[0.08] dark:bg-white/[0.04]"
    >
      <View className="flex-row flex-wrap gap-2">
        <MetaChip label={formatTopicLabel(response.topic)} />
        <MetaChip label={`${response.sources.length} ${response.sources.length === 1 ? 'source' : 'sources'}`} />
      </View>

      <View className="gap-3">
        <Text className="font-label text-xs uppercase tracking-[1.4px] text-secondary-dim">
          Guidance
        </Text>
        {response.answer.title ? (
          <Text className="font-headline text-2xl leading-9 text-on-surface">{response.answer.title}</Text>
        ) : null}
        <Text className="font-body text-lg leading-8 text-on-surface">{response.answer.summary}</Text>
        <View className="h-px bg-black/[0.06] dark:bg-white/[0.06]" />
        <Text className="font-body text-lg leading-8 text-on-surface">
          {response.answer.practical_guidance}
        </Text>
      </View>

      <View className="h-px bg-white/[0.10] dark:bg-white/[0.08]" />

      <View className="gap-3">
        <Text className="font-label text-xs uppercase tracking-[1.4px] text-secondary-dim">
          From The Scriptures
        </Text>
        {response.sources.length > 0 ? (
          <>
            {visibleSources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                isSaved={savedSourceIds.has(source.id)}
                onToggleSaved={onToggleSavedPassage}
              />
            ))}
            {response.sources.length > 2 ? (
              <Pressable onPress={() => setShowAllSources((value) => !value)} className="self-start rounded-full px-1 py-1">
                <Text className="font-label text-xs uppercase tracking-[1px] text-secondary-dim">
                  {showAllSources ? 'Hide Extra Sources' : 'Show All Sources'}
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <Text className="font-body text-sm leading-5 text-on-surface-variant">
            No direct source cards were attached to this answer.
          </Text>
        )}
      </View>

      <SectionToggle
        label="Why these apply"
        isOpen={isInterpretationOpen}
        onPress={() => setIsInterpretationOpen((value) => !value)}
      />
      {isInterpretationOpen ? (
        <Animated.View
          layout={SECTION_LAYOUT_TRANSITION}
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(180)}
          className="gap-3 px-1"
        >
          <Text className="font-body text-lg leading-8 text-on-surface">{response.interpretation.synthesis}</Text>
          {response.interpretation.alternate_view ? (
            <Text className="font-body text-base leading-7 text-on-surface-variant">
              {response.interpretation.alternate_view}
            </Text>
          ) : null}
        </Animated.View>
      ) : null}

      <View className="h-px bg-white/[0.10] dark:bg-white/[0.08]" />

      <View className="gap-3">
        <Text className="font-label text-xs uppercase tracking-[1.4px] text-secondary-dim">
          Practice For Today
        </Text>
        {response.action_steps.map((step, index) => (
          <View key={step} className="flex-row items-start gap-3">
            <Text className="mt-0.5 font-label text-xs uppercase tracking-[1px] text-secondary-dim">
              {index + 1}
            </Text>
            <Text className="flex-1 font-body text-lg leading-8 text-on-surface">{step}</Text>
          </View>
        ))}
      </View>

      {response.follow_up_prompts.length > 0 ? (
        <>
          <SectionToggle
            label="Next questions"
            isOpen={isNextQuestionsOpen}
            onPress={() => setIsNextQuestionsOpen((value) => !value)}
          />
          {isNextQuestionsOpen ? (
            <Animated.View
              layout={SECTION_LAYOUT_TRANSITION}
              entering={FadeInDown.duration(220)}
              exiting={FadeOutUp.duration(180)}
              className="px-1"
            >
              <FollowUpActions
                prompts={response.follow_up_prompts}
                onUsePrompt={onUseFollowUpPrompt}
              />
            </Animated.View>
          ) : null}
        </>
      ) : null}

      {response.safety.has_boundary && response.safety.note ? (
        <View className="rounded-[18px] border border-[rgba(160,120,200,0.12)] bg-[rgba(212,190,228,0.12)] p-4 dark:border-[rgba(212,190,228,0.08)] dark:bg-[rgba(212,190,228,0.08)]">
          <Text className="font-label text-xs uppercase tracking-[1px] text-secondary-dim">
            Boundary Note
          </Text>
          <Text className="mt-2 font-body text-lg leading-7 text-on-surface">{response.safety.note}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <View className="px-0.5 py-1">
      <Text className="font-label text-xs uppercase tracking-[1.1px] text-on-surface-variant">
        {label}
      </Text>
    </View>
  );
}

function formatTopicLabel(topic: ScriptureGuideResponse['topic']) {
  return topic
    .split('_')
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

function SectionToggle({
  label,
  isOpen,
  onPress,
}: {
  label: string;
  isOpen: boolean;
  onPress: () => void;
}) {
  const rotation = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 1 : 0, { duration: 220 });
  }, [isOpen, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-1 py-1"
    >
      <Text className="font-label text-xs uppercase tracking-[1.2px] text-secondary-dim">
        {label}
      </Text>
      <Animated.View style={chevronStyle}>
        <ChevronDown size={18} color="rgba(125, 110, 95, 0.9)" />
      </Animated.View>
    </Pressable>
  );
}
