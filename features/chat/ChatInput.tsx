import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Mic } from 'lucide-react-native';
import { hapticMedium } from '@/lib/haptics';
import { colors, fonts, gradients } from '@/lib/theme';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChangeText, onSend }: ChatInputProps) {
  const handleSend = () => {
    hapticMedium();
    onSend();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Ask for guidance…"
          placeholderTextColor={colors.outline}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Pressable style={styles.micBtn} onPress={() => {}}>
          <Mic size={20} color={colors.outline} />
        </Pressable>
        <Pressable onPress={handleSend} style={({ pressed }) => pressed ? styles.pressed : undefined}>
          <LinearGradient
            colors={gradients.primaryToContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendBtn}
          >
            <Send size={18} color={colors.onPrimary} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(5, 7, 10, 0.95)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(37, 38, 38, 0.7)',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: `${colors.primaryFixedDim}22`,
    paddingLeft: 20,
    paddingRight: 6,
    paddingVertical: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurface,
    paddingVertical: 8,
    maxHeight: 100,
  },
  micBtn: {
    padding: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
