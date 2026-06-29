import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { OB } from '@/lib/onboardingStore';

// Three phases, each covering a range of actual screen steps.
// Phase boundaries are intentionally vague to the user — they see the name, not the count.
export type OnboardingPhase = 'you' | 'chart' | 'plan';

const PHASES: { id: OnboardingPhase; label: string }[] = [
  { id: 'you', label: 'You' },
  { id: 'chart', label: 'Your chart' },
  { id: 'plan', label: 'Your path' },
];

const PHASE_INDEX: Record<OnboardingPhase, number> = {
  you: 0,
  chart: 1,
  plan: 2,
};

export function OnboardingProgress({ phase }: { phase: OnboardingPhase }) {
  const activeIndex = PHASE_INDEX[phase];

  return (
    <Animated.View
      entering={FadeIn.delay(200).duration(500)}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 4 }}
    >
      {PHASES.map((p, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        return (
          <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {i > 0 && (
              <View
                style={{
                  width: 20,
                  height: 1,
                  backgroundColor: isDone || isActive
                    ? 'rgba(217,160,111,0.5)'
                    : 'rgba(255,255,255,0.1)',
                }}
              />
            )}
            <View style={{ alignItems: 'center', gap: 4 }}>
              <Animated.View
                entering={isActive ? ZoomIn.delay(300).duration(350) : undefined}
                style={{
                  width: isActive ? 10 : 7,
                  height: isActive ? 10 : 7,
                  borderRadius: 999,
                  backgroundColor: isActive
                    ? OB.saffron
                    : isDone
                      ? OB.gold
                      : 'rgba(255,255,255,0.12)',
                }}
              />
              {isActive && (
                <Animated.View entering={FadeIn.delay(400).duration(400)}>
                  <Text
                    style={{
                      fontFamily: 'body',
                      fontSize: 10,
                      color: OB.gold,
                      letterSpacing: 0.3,
                    }}
                  >
                    {p.label}
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}
