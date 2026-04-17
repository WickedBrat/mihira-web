import React from 'react';
import { Pressable } from 'react-native';
import { Text } from '@/components/ui/Text';

interface SavedPassageButtonProps {
  isSaved: boolean;
  onPress: () => void;
}

export function SavedPassageButton({ isSaved, onPress }: SavedPassageButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-full border border-[rgba(212,175,55,0.28)] bg-[rgba(212,175,55,0.08)] px-3 py-1.5"
    >
      <Text className="font-label text-[11px] uppercase tracking-[1px] text-[rgba(150,110,10,0.9)]">
        {isSaved ? 'Saved' : 'Save Passage'}
      </Text>
    </Pressable>
  );
}
