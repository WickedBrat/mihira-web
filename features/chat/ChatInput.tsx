import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send } from 'lucide-react-native';
import { hapticMedium } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChangeText, onSend }: ChatInputProps) {
  const { colors, gradients } = useTheme();

  const handleSend = () => {
    hapticMedium();
    onSend();
  };

  return (
    <View className="px-2.5 py-2">
      <View
        className="flex-row items-center gap-2 rounded-full border bg-[rgba(232,225,212,0.7)] py-[5px] pl-[26px] pr-2.5 dark:bg-[rgba(37,38,38,0.7)]"
        style={{
          borderColor: `${colors.primaryFixedDim}02`,
          shadowColor: colors.primary,
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <TextInput
          className="max-h-[100px] flex-1 py-3 font-body text-base leading-5 text-on-surface"
          style={{ textAlignVertical: 'center' }}
          value={value}
          onChangeText={onChangeText}
          placeholder="Ask for guidance…"
          placeholderTextColor={colors.outline}
          selectionColor={colors.primary}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => pressed && { opacity: 0.8 }}
        >
          <LinearGradient
            colors={gradients.primaryToContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <Send size={18} color={colors.onPrimary} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
