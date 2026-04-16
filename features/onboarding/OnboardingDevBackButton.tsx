import React from 'react';
import { Pressable, View } from 'react-native';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OB } from '@/lib/onboardingStore';

export const ENABLE_DEV_BUTTONS = Constants.expoConfig?.extra?.enableDevButtons === true;

export function OnboardingDevBackButton() {
  const insets = useSafeAreaInsets();

  if (!ENABLE_DEV_BUTTONS) return null;

  return (
    <View pointerEvents="box-none" className="absolute left-5 z-50" style={{ top: insets.top + 12 }}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.back();
        }}
        className="h-11 w-11 items-center justify-center rounded-full border border-ob-card-border bg-[rgba(7,9,12,0.86)]"
        style={({ pressed }) => (pressed ? { opacity: 0.85, transform: [{ scale: 0.96 }] } : undefined)}
      >
        <ChevronLeft size={20} color={OB.text} />
      </Pressable>
    </View>
  );
}
