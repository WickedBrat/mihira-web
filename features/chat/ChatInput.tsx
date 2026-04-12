import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send } from 'lucide-react-native';
import { hapticMedium } from '@/lib/haptics';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChangeText, onSend }: ChatInputProps) {
  const { colors, gradients } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      container: {
        paddingHorizontal: 10,
        paddingVertical: 8,
      },
      inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.7)' : 'rgba(232, 225, 212, 0.7)',
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: `${c.primaryFixedDim}02`,
        paddingLeft: 26,
        paddingRight: 10,
        paddingVertical: 5,
        shadowColor: c.primary,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 0 },
      },
      input: {
        flex: 1,
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        lineHeight: scaleFont(20),
        color: c.onSurface,
        paddingVertical: 12,
        textAlignVertical: 'center',
        maxHeight: 100,
      },
      sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      pressed: { opacity: 0.8 },
      sendBtnWrapper: {},
    })
  );

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
          selectionColor={colors.primary}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => [styles.sendBtnWrapper, pressed && styles.pressed]}
        >
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
