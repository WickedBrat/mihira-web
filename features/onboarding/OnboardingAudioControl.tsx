import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { usePathname } from 'expo-router';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Volume2, VolumeX } from 'lucide-react-native';
import { OB } from '@/lib/onboardingStore';

const ASTRAL_MUSIC = require('../../assets/onboarding-astral.wav');
const MUSIC_VOLUME = 1;

export function OnboardingAudioControl() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const player = useAudioPlayer(ASTRAL_MUSIC, { updateInterval: 1000 });
  const [isMuted, setIsMuted] = useState(false);

  const isOnboarding = pathname.startsWith('/onboarding');

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  useEffect(() => {
    player.loop = true;
    player.volume = MUSIC_VOLUME;
  }, [player]);

  useEffect(() => {
    player.muted = isMuted;

    if (isOnboarding && !isMuted) {
      player.play();
      return;
    }

    player.pause();
  }, [isMuted, isOnboarding, player]);

  if (!isOnboarding) return null;

  const Icon = isMuted ? VolumeX : Volume2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isMuted ? 'Unmute onboarding music' : 'Mute onboarding music'}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsMuted((current) => !current);
      }}
      className="absolute right-5 z-50 h-11 w-11 items-center justify-center rounded-full border border-ob-card-border bg-[rgba(7,9,12,0.78)]"
      style={{
        top: Math.max(insets.top + 8, 20),
        shadowColor: OB.gold,
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      <Icon size={20} color={isMuted ? OB.muted : OB.gold} strokeWidth={2} />
    </Pressable>
  );
}
