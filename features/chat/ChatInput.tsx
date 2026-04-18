import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send } from 'lucide-react-native';
import { hapticMedium } from '@/lib/haptics';
import { useTheme } from '@/lib/theme-context';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  placeholder = 'Ask for guidance…',
}: ChatInputProps) {
  const { colors, gradients } = useTheme();
  const isSendDisabled = value.trim().length === 0;

  const handleSend = () => {
    if (isSendDisabled) return;
    hapticMedium();
    onSend();
  };

  return (
    <View className="p-3 pt-2">
      <View
        className="flex-row items-end gap-2 rounded-[28px] border bg-[rgba(255,255,255,0.12)] pl-5 pr-2.5 dark:bg-[rgba(255,255,255,0.05)]"
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          shadowColor: colors.primary,
          shadowOpacity: 0.08,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        <TextInput
          className="flex-1 py-3 font-body text-lg leading-7 text-on-surface"
          style={{ textAlignVertical: 'center' }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.outline}
          selectionColor={colors.primary}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          disabled={isSendDisabled}
          style={({ pressed }) => [{ opacity: isSendDisabled ? 0.45 : 1 }, pressed && !isSendDisabled && { opacity: 0.8 }]}
        >
          <LinearGradient
            colors={gradients.primaryToContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendButton}
          >
            <Send size={18} color={colors.onPrimary} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
