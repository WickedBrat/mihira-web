// S11: Place of Birth
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PlaceSuggestion, searchBirthPlaces } from '@/lib/vedic/geocode';
import { OnboardingNewScreen } from '@/features/onboarding-new/Screen';
import { PrimaryButton, ScreenLabel } from '@/features/onboarding-new/PrimaryButton';
import { getOnboardingNewData, setOnboardingNewData } from '@/lib/onboardingNewStore';

export default function OnboardingNewS11() {
  const stored = getOnboardingNewData();
  const [birthPlace, setBirthPlace] = useState(stored.birthPlace);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const skipLookupRef = useRef(false);

  useEffect(() => {
    const query = birthPlace.trim();
    if (skipLookupRef.current) {
      skipLookupRef.current = false;
      return;
    }
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    let active = true;
    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const next = await searchBirthPlaces(query);
        if (active) setSuggestions(next);
      } catch {
        if (active) setSuggestions([]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [birthPlace]);

  function selectSuggestion(place: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipLookupRef.current = true;
    setBirthPlace(place);
    setSuggestions([]);
  }

  function proceed() {
    const place = birthPlace.trim();
    if (!place) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOnboardingNewData({ birthPlace: place });
    router.push('/onboarding-new/step-12');
  }

  return (
    <OnboardingNewScreen>
      <View className="flex-1 items-center gap-7 px-8 pt-11">
        <Animated.View entering={FadeInDown.duration(500)} className="max-w-[320px] items-center gap-2">
          <ScreenLabel>Place of birth</ScreenLabel>
          <Text className="text-center font-serif-medium text-[30px] leading-[36px] text-obn-text">
            Where the sky first held you.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(450)} className="w-full max-w-[340px] gap-3.5">
          <View className="flex-row items-center gap-3 rounded-full border border-obn-gold-border bg-obn-card px-[22px] py-4">
            <TextInput
              value={birthPlace}
              onChangeText={setBirthPlace}
              placeholder="Start typing your birth city…"
              placeholderTextColor="rgba(242,234,217,0.35)"
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={proceed}
              className="flex-1 font-manrope-medium text-[16px] text-obn-text"
            />
            {isSearching ? <ActivityIndicator color="#E8A33D" /> : null}
          </View>

          {suggestions.length > 0 ? (
            <View className="overflow-hidden rounded-[20px] border border-obn-card-border">
              {suggestions.map((s, index) => (
                <Pressable
                  key={s.id}
                  onPress={() => selectSuggestion(s.label)}
                  className={`px-[22px] py-4 ${index === 0 ? 'bg-obn-gold-dim' : 'bg-obn-card'} ${index > 0 ? 'border-t border-obn-card-border' : ''}`}
                >
                  <Text className="font-manrope text-[15px] text-obn-text">{s.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(500).duration(500)} className="items-center gap-4 px-8 pb-11">
        <PrimaryButton label="Continue →" onPress={proceed} disabled={!birthPlace.trim()} />
        <Text className="px-4 text-center font-manrope text-[12px] leading-[18px] text-obn-muted-dim">
          Birth details are encrypted, used only to compute your chart, and never shared.
        </Text>
      </Animated.View>
    </OnboardingNewScreen>
  );
}
