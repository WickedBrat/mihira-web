import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Text } from '@/components/ui/Text';
import { BirthDataScaffold } from '@/features/onboarding/BirthDataScaffold';
import { OB, getOnboardingData, setOnboardingData } from '@/lib/onboardingStore';
import { PlaceSuggestion, searchBirthPlaces } from '@/lib/vedic/geocode';
import { LockKeyholeIcon } from 'lucide-react-native';

export default function Screen5Place() {
  const stored = getOnboardingData();
  const [birthPlace, setBirthPlace] = useState(stored.birthPlace);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const skipLookupRef = useRef(false);
  const smoothLayout = LinearTransition.duration(220);

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
        const nextSuggestions = await searchBirthPlaces(query);
        if (!active) return;
        setSuggestions(nextSuggestions);
      } catch {
        if (!active) return;
        setSuggestions([]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [birthPlace]);

  function proceed() {
    const place = birthPlace.trim();
    if (!place) return;
    setOnboardingData({ birthPlace: place });
    router.push('/onboarding/step-6');
  }

  function selectSuggestion(place: string) {
    skipLookupRef.current = true;
    setBirthPlace(place);
    setSuggestions([]);
  }

  return (
    <BirthDataScaffold
      title={`Where were${'\n'}you born?`}
      description="Your birthplace sets the sky, timezone, and coordinates we use to calculate your chart precisely."
      ctaLabel="Continue"
      canProceed={birthPlace.trim().length > 0}
      onProceed={proceed}
      footer={(
        <View className="w-full max-w-[360px] items-center gap-2.5 rounded-xl border border-ob-card-border bg-ob-card p-4">
          <Text className="text-sm"><LockKeyholeIcon size={20} color={OB.saffron} /></Text>
          <Text className="text-center font-body text-xs leading-[18px] text-ob-muted">
            Your birth data is encrypted and used only for your personal alignment. It is never shared.
          </Text>
        </View>
      )}
    >
      <View className="w-full items-center gap-4">
        <Text className="text-center font-label text-[12px] uppercase tracking-[2.4px] text-ob-muted">
          PLACE OF BIRTH
        </Text>
        <Animated.View
          layout={smoothLayout}
          className="w-full rounded-2xl border border-ob-card-border bg-ob-card px-6 py-5"
        >
          <TextInput
            className="font-body-medium text-[21px] text-ob-text"
            value={birthPlace}
            onChangeText={(value) => {
              setBirthPlace(value);
            }}
            placeholder="Start typing your city…"
            placeholderTextColor={OB.muted}
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={proceed}
          />
          {isSearching ? (
            <View className="mt-4 items-center">
              <ActivityIndicator color={OB.gold} />
            </View>
          ) : null}
          {suggestions.length > 0 ? (
            <View className="mt-4 gap-1">
              {suggestions.map((suggestion, index) => (
                <Pressable
                  key={suggestion.id}
                  onPress={() => selectSuggestion(suggestion.label)}
                  className={`py-3 ${index > 0 ? 'border-t border-ob-card-border' : ''}`}
                >
                  <Text className="font-body text-[16px] leading-6 text-ob-text">
                    {suggestion.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </Animated.View>
      </View>
    </BirthDataScaffold>
  );
}
