import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { CompareTextsView } from '@/features/ask/CompareTextsView';
import { FollowUpActions } from '@/features/ask/FollowUpActions';
import { SourceCard } from '@/features/ask/SourceCard';
import type { ScriptureGuideResponse, ScriptureSource } from '@/features/ask/types';

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
  const visibleSources = showAllSources ? response.sources : response.sources.slice(0, 2);

  return (
    <View className="gap-4 self-start rounded-[28px] border border-[rgba(200,150,100,0.12)] bg-[rgba(242,206,173,0.14)] p-5 dark:border-[rgba(242,206,173,0.06)] dark:bg-[rgba(242,206,173,0.08)]">
      <View className="gap-2">
        <Text className="font-label text-[11px] uppercase tracking-[1.5px] text-secondary-dim">
          {response.mode === 'quick' ? 'Quick Guidance' : response.mode === 'deep' ? 'Deep Study' : 'Compare Texts'}
        </Text>
        {response.answer.title ? (
          <Text className="font-headline text-2xl leading-8 text-on-surface">{response.answer.title}</Text>
        ) : null}
        <Text className="font-body text-base leading-6 text-on-surface">{response.answer.summary}</Text>
        <Text className="font-body text-sm leading-5 text-on-surface-variant">
          {response.answer.practical_guidance}
        </Text>
      </View>

      {response.sources.length > 0 ? (
        <View className="gap-3">
          <Text className="font-label text-[11px] uppercase tracking-[1.2px] text-secondary-dim">
            From The Scriptures
          </Text>
          {visibleSources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              isSaved={savedSourceIds.has(source.id)}
              onToggleSaved={onToggleSavedPassage}
            />
          ))}
        </View>
      ) : null}

      <View className="gap-2">
        <Text className="font-label text-[11px] uppercase tracking-[1.2px] text-secondary-dim">
          Why These Apply
        </Text>
        <Text className="font-body text-sm leading-5 text-on-surface">{response.interpretation.synthesis}</Text>
      </View>

      {response.mode === 'compare' && response.interpretation.alternate_view ? (
        <CompareTextsView alternateView={response.interpretation.alternate_view} />
      ) : null}

      <View className="gap-2">
        <Text className="font-label text-[11px] uppercase tracking-[1.2px] text-secondary-dim">
          Practice For Today
        </Text>
        <View className="gap-2">
          {response.action_steps.map((step) => (
            <Text key={step} className="font-body text-sm leading-5 text-on-surface">
              • {step}
            </Text>
          ))}
        </View>
      </View>

      {response.safety.has_boundary && response.safety.note ? (
        <View className="rounded-[18px] border border-[rgba(160,120,200,0.12)] bg-[rgba(212,190,228,0.12)] p-4 dark:border-[rgba(212,190,228,0.08)] dark:bg-[rgba(212,190,228,0.08)]">
          <Text className="font-label text-[11px] uppercase tracking-[1px] text-secondary-dim">Boundary Note</Text>
          <Text className="mt-2 font-body text-sm leading-5 text-on-surface">{response.safety.note}</Text>
        </View>
      ) : null}

      <FollowUpActions
        prompts={response.follow_up_prompts}
        onUsePrompt={onUseFollowUpPrompt}
        onToggleAlternateSources={response.sources.length > 2 ? () => setShowAllSources((value) => !value) : undefined}
        showAlternateSources={showAllSources}
      />
    </View>
  );
}
