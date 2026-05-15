// Screen 8: Saarthi Question — Early Scripture-Backed Guidance
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/Text';
import MihiraLogo from '@/assets/logo.svg';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import {
  getQuestionPrompts,
  getScriptureGuidance,
} from '@/features/onboarding/personalGuidance';
import { OnboardingDevBackButton } from '@/features/onboarding/OnboardingDevBackButton';
import { OnboardingStarField } from '@/features/onboarding/OnboardingStarField';
import {
  onboardingButtonShadow,
  pressedButtonStyle,
} from '@/features/onboarding/onboardingStyles';

export default function Screen8() {
  const stored = getOnboardingData();
  const name = stored.userName?.split(' ')[0] || 'Friend';
  const prompts = useMemo(() => getQuestionPrompts(stored), []);
  const [question, setQuestion] = useState(stored.firstQuestion || '');
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(Boolean(stored.firstQuestion));

  const guidance = getScriptureGuidance(stored, question);

  async function handleSubmit() {
    const q = question.trim();
    if (!q || loading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    setOnboardingData({ firstQuestion: q });
    await new Promise((resolve) => setTimeout(resolve, 850));
    setLoading(false);
    setAnswered(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  return (
    <SafeAreaView className="flex-1 bg-ob-bg">
      <OnboardingDevBackButton />
      <OnboardingStarField />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow items-center gap-5 px-7 py-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeIn.delay(120).duration(500)} className="items-center gap-1.5">
            <View className="h-[88px] w-[88px] items-center justify-center rounded-full border border-ob-saffron-border bg-ob-saffron-dim">
              <MihiraLogo width={88} height={88} accessibilityLabel="Mihira logo" />
            </View>
            <Text className="font-body text-sm tracking-[0.5px] text-ob-muted">Your Saarthi</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(260).duration(500)}
            className="max-w-[90%] self-start rounded-[20px] rounded-tl border border-ob-card-border bg-ob-card p-[18px]"
          >
            <Text className="font-body text-[15px] leading-6 text-ob-text">
              {name}, what question is sitting heaviest right now?
            </Text>
          </Animated.View>

          {!answered ? (
            <Animated.View entering={FadeInDown.delay(420).duration(500)} className="w-full max-w-[360px] gap-4">
              <View className="flex-row flex-wrap justify-center gap-2.5">
                {prompts.map((prompt) => {
                  const active = question === prompt;
                  return (
                    <Pressable
                      key={prompt}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setQuestion(prompt);
                      }}
                      className={`rounded-full border px-3.5 py-2.5 ${
                        active
                          ? 'border-ob-saffron-border bg-ob-saffron-dim'
                          : 'border-ob-card-border bg-ob-card'
                      }`}
                      style={({ pressed }) => pressed && pressedButtonStyle}
                    >
                      <Text className={`font-body-medium text-[13px] leading-[18px] ${active ? 'text-ob-text' : 'text-ob-muted'}`}>
                        {prompt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="rounded-2xl border border-ob-card-border bg-ob-card p-4">
                <TextInput
                  className="min-h-[82px] font-body text-[15px] leading-[23px] text-ob-text"
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Or write your own question"
                  placeholderTextColor={OB.muted}
                  multiline
                  maxLength={280}
                  textAlignVertical="top"
                />
              </View>
            </Animated.View>
          ) : null}

          {loading ? (
            <Animated.View entering={FadeIn.duration(250)} className="w-full max-w-[360px] items-center gap-3 rounded-[18px] border border-ob-gold-border bg-ob-gold-dim p-4">
              <Text className="text-center font-body text-sm text-ob-gold">
                Finding the right scriptural thread...
              </Text>
              <View className="flex-row gap-1.5">
                {[0, 1, 2].map((index) => (
                  <Animated.View
                    key={index}
                    entering={ZoomIn.delay(index * 90).duration(200)}
                    className="h-[7px] w-[7px] rounded-full bg-ob-saffron"
                  />
                ))}
              </View>
            </Animated.View>
          ) : null}

          {answered ? (
            <Animated.View entering={FadeInDown.duration(420)} className="w-full max-w-[360px] gap-3.5">
              <View className="max-w-[88%] self-end rounded-[20px] rounded-br border border-ob-saffron-border bg-ob-saffron-dim p-4">
                <Text className="font-body text-sm leading-[22px] text-ob-text">{question}</Text>
              </View>

              <View className="gap-4 rounded-[22px] border border-ob-card-border bg-ob-card p-5">
                <GuidanceSection
                  label="What I am hearing"
                  body={guidance.hearing}
                  highlight
                />
                <GuidanceSection
                  label="Scriptural anchor"
                  body={`${guidance.reference}. ${guidance.anchor}`}
                />
                <GuidanceSection
                  label="For today"
                  body={guidance.action}
                />
              </View>
            </Animated.View>
          ) : null}

          <View className="h-[112px]" />
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(520).duration(500)} className="absolute bottom-0 left-0 right-0 items-center bg-[rgba(7,9,12,0.96)] p-8 pb-11">
          <Pressable
            disabled={!question.trim() || loading}
            onPress={() => {
              if (answered) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/onboarding/step-4-gender');
                return;
              }
              void handleSubmit();
            }}
            className={`items-center rounded-full bg-ob-saffron px-8 py-4 ${
              !question.trim() || loading ? 'opacity-[0.35]' : ''
            }`}
            style={({ pressed }) => [
              onboardingButtonShadow,
              pressed && pressedButtonStyle,
            ]}
          >
            <Text className="font-label text-base tracking-[0.3px] text-white">
              {answered ? 'Make this more personal →' : 'Ask Saarthi →'}
            </Text>
          </Pressable>

          {answered ? (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setAnswered(false);
              }}
              className="mt-3"
            >
              <Text className="text-center font-body text-sm text-ob-muted">Ask another question</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function GuidanceSection({
  label,
  body,
  highlight = false,
}: {
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <View className="gap-1.5">
      <Text className={`font-label text-[11px] uppercase tracking-[2.2px] ${highlight ? 'text-ob-saffron' : 'text-ob-gold'}`}>
        {label}
      </Text>
      <Text className="font-body text-[14px] leading-[22px] text-ob-text">
        {body}
      </Text>
    </View>
  );
}
