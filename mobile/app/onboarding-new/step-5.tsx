// S5: First Whisper — Ask Saarthi
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { getQuestionPrompts, getScriptureGuidance } from '@/features/onboarding/personalGuidance';
import type { OnboardingData } from '@/lib/onboardingStore';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { ACHES, CONTEXTS, getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

function toLegacyShim(name: string, aches: string[], contexts: string[], question: string): OnboardingData {
  return {
    painPoints: ACHES.filter((a) => aches.includes(a.id)).map((a) => a.label),
    guidanceContext: CONTEXTS.filter((c) => contexts.includes(c.id)).map((c) => c.label),
    supportTypes: [],
    userName: name,
    gender: '',
    birthDate: new Date(2000, 0, 1),
    birthTime: new Date(2000, 0, 1, 9, 0),
    birthPlace: '',
    unknownBirthTime: false,
    commitmentTier: null,
    firstQuestion: question,
  };
}

export default function OnboardingNewS5() {
  const stored = getOnboardingNewData();
  const shim = useMemo(() => toLegacyShim(stored.name, stored.aches, stored.contexts, stored.firstQuestion), []);
  const prompts = useMemo(() => getQuestionPrompts(shim), [shim]);
  const [question, setQuestion] = useState(stored.firstQuestion);
  const [answered, setAnswered] = useState(Boolean(stored.firstQuestion));
  const [loading, setLoading] = useState(false);

  const guidance = getScriptureGuidance(shim, question);

  async function handleSubmit() {
    const q = question.trim();
    if (!q || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    setOnboardingNewData({ firstQuestion: q });
    await new Promise((resolve) => setTimeout(resolve, 850));
    setLoading(false);
    setAnswered(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function proceed() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding-new/step-6');
  }

  return (
    <OnboardingNewScreen glow="center" glowIntensity={0.16}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerClassName="gap-4 px-7 pt-9 pb-6" keyboardShouldPersistTaps="handled">
          <View className="gap-1.5">
            <ScreenLabel>Ask Saarthi</ScreenLabel>
            <Text className="font-serif-medium text-[30px] leading-[36px] text-obn-text">Ask it out loud, once.</Text>
          </View>

          <View style={{ maxWidth: '88%' }} className="self-end rounded-[20px] rounded-tr-md border border-obn-card-border bg-obn-card px-[18px] py-3.5">
            <Text className="font-manrope text-[15px] leading-[22px] text-obn-text-soft">
              {question || "I keep doing everything right and feeling nothing. What am I missing?"}
            </Text>
          </View>

          {!answered ? (
            <Animated.View entering={FadeInDown.delay(200).duration(400)} className="gap-3">
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
                        active ? 'border-obn-gold-border bg-obn-gold-dim' : 'border-obn-card-border bg-obn-card'
                      }`}
                    >
                      <Text className={`font-manrope-semibold text-[13px] ${active ? 'text-obn-text' : 'text-obn-muted'}`}>
                        {prompt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <View className="rounded-2xl border border-obn-card-border bg-obn-card p-4">
                <TextInput
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Or write your own question"
                  placeholderTextColor="rgba(242,234,217,0.35)"
                  multiline
                  maxLength={280}
                  textAlignVertical="top"
                  className="min-h-[82px] font-manrope text-[15px] leading-[22px] text-obn-text"
                />
              </View>
            </Animated.View>
          ) : null}

          {loading ? (
            <View className="items-center gap-3 rounded-[18px] border border-obn-gold-border-soft bg-obn-gold-dim p-4">
              <Text className="font-manrope text-sm text-obn-gold">Finding the right scriptural thread…</Text>
              <View className="flex-row gap-1.5">
                {[0, 1, 2].map((i) => (
                  <Animated.View key={i} entering={ZoomIn.delay(i * 90).duration(200)} className="h-[7px] w-[7px] rounded-full bg-obn-gold" />
                ))}
              </View>
            </View>
          ) : null}

          {answered ? (
            <Animated.View entering={FadeIn.duration(500)} className="gap-0 rounded-[22px] border border-obn-gold-border-soft bg-obn-gold-dim px-[22px] py-5">
              <View className="gap-1.5 border-b border-obn-gold-border-soft pb-4">
                <Text className="font-manrope-bold text-[10px] uppercase tracking-[2.5px] text-obn-gold">What I'm hearing</Text>
                <Text className="font-manrope text-[14px] leading-[22px] text-obn-text-soft">{guidance.hearing}</Text>
              </View>
              <View className="gap-1.5 border-b border-obn-gold-border-soft py-4">
                <Text className="font-manrope-bold text-[10px] uppercase tracking-[2.5px] text-obn-gold">Scriptural anchor</Text>
                <Text className="font-serif-regular-italic text-[17px] leading-[24px] text-obn-text">{guidance.anchor}</Text>
                <Text className="font-manrope text-xs text-obn-muted">{guidance.reference}</Text>
              </View>
              <View className="gap-1.5 pt-4">
                <Text className="font-manrope-bold text-[10px] uppercase tracking-[2.5px] text-obn-gold">For today</Text>
                <Text className="font-manrope text-[14px] leading-[22px] text-obn-text-soft">{guidance.action}</Text>
              </View>
            </Animated.View>
          ) : null}
        </ScrollView>

        <View className="gap-3.5 px-7 pb-11 pt-3">
          {answered ? (
            <Text className="text-center font-manrope text-[12px] leading-[18px] text-obn-muted-dim">
              This used only your words. Give it your birth rhythm, and the same question gets a sharper answer.
            </Text>
          ) : null}
          <PrimaryButton
            label={answered ? 'Give it my birth rhythm →' : 'Ask Saarthi →'}
            onPress={() => (answered ? proceed() : void handleSubmit())}
            disabled={!question.trim() || loading}
          />
        </View>
      </KeyboardAvoidingView>
    </OnboardingNewScreen>
  );
}
