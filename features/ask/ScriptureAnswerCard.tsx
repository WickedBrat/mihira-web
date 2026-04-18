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
  const [isScripturesOpen, setIsScripturesOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isNextQuestionsOpen, setIsNextQuestionsOpen] = useState(false);
  const visibleSources = showAllSources ? response.sources : response.sources.slice(0, 2);

  return (
    <Animated.View
      layout={SECTION_LAYOUT_TRANSITION}
      className="gap-4 self-start rounded-[28px] border border-[rgba(200,150,100,0.12)] bg-[rgba(242,206,173,0.14)] p-5 dark:border-[rgba(242,206,173,0.06)] dark:bg-[rgba(242,206,173,0.08)]"
    >
      <View className="gap-2">
        {response.answer.title ? (
          <Text className="font-headline text-xl leading-8 text-on-surface">{response.answer.title}</Text>
        ) : null}
        <Text className="font-body text-md leading-6 text-on-surface">{response.answer.summary}</Text>
        <Text className="font-body text-md leading-6 text-on-surface">
          {response.answer.practical_guidance}
        </Text>
      </View>

      <SectionToggle
        label="From the scriptures"
        isOpen={isScripturesOpen}
        onPress={() => setIsScripturesOpen((value) => !value)}
      />
      {isScripturesOpen ? (
        <Animated.View
          layout={SECTION_LAYOUT_TRANSITION}
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(180)}
          className="gap-3 px-3"
        >
          <Text className="font-body text-md leading-6 text-on-surface">{response.interpretation.synthesis}</Text>
          {response.interpretation.alternate_view ? (
            <Text className="font-body text-md leading-6 text-on-surface-variant">
              {response.interpretation.alternate_view}
            </Text>
          ) : null}
          {response.sources.length > 0 ? visibleSources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              isSaved={savedSourceIds.has(source.id)}
              onToggleSaved={onToggleSavedPassage}
            />
          )) : (
            <Text className="font-body text-sm leading-5 text-on-surface-variant">
              No direct source cards were attached to this answer.
            </Text>
          )}
          {response.sources.length > 2 ? (
            <Pressable onPress={() => setShowAllSources((value) => !value)} className="self-start rounded-full px-1 py-1">
              <Text className="font-label text-[11px] uppercase tracking-[1px] text-secondary-dim">
                {showAllSources ? 'Hide extra sources' : 'Show all sources'}
              </Text>
            </Pressable>
          ) : null}
        </Animated.View>
      ) : null}

      <SectionToggle
        label="Practice for today"
        isOpen={isPracticeOpen}
        onPress={() => setIsPracticeOpen((value) => !value)}
      />
      {isPracticeOpen ? (
        <Animated.View
          layout={SECTION_LAYOUT_TRANSITION}
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(180)}
          className="gap-2"
        >
          {response.action_steps.map((step, index) => (
            <Text key={step} className="px-3 font-body text-md leading-6 text-on-surface">
              {index + 1}. {step}
            </Text>
          ))}
        </Animated.View>
      ) : null}

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
        >
          <FollowUpActions
            prompts={response.follow_up_prompts}
            onUsePrompt={onUseFollowUpPrompt}
          />
        </Animated.View>
      ) : null}

      {response.safety.has_boundary && response.safety.note ? (
        <View className="rounded-[18px] border border-[rgba(160,120,200,0.12)] bg-[rgba(212,190,228,0.12)] p-4 dark:border-[rgba(212,190,228,0.08)] dark:bg-[rgba(212,190,228,0.08)]">
          <Text className="font-label text-[11px] uppercase tracking-[1px] text-secondary-dim">Boundary Note</Text>
          <Text className="mt-2 font-body text-sm leading-5 text-on-surface">{response.safety.note}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
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
      className="flex-row items-center justify-between rounded-[18px] border border-black/[0.06] bg-black/[0.03] px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.04]"
    >
      <Text className="font-label text-[11px] uppercase tracking-[1.2px] text-secondary-dim">
        {label}
      </Text>
      <Animated.View style={chevronStyle}>
        <ChevronDown size={18} color="rgba(125, 110, 95, 0.9)" />
      </Animated.View>
    </Pressable>
  );
}
