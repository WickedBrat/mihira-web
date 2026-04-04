import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import type { Message } from './useChatState';

interface ChatBubbleProps {
  message: Message;
  senderName?: string;
}

export function ChatBubble({ message, senderName = 'Aksha' }: ChatBubbleProps) {
  const isAI = message.role === 'ai';

  return (
    <Animated.View
      entering={isAI ? FadeIn.duration(700) : SlideInRight.duration(400)}
      style={[styles.row, isAI ? styles.rowAI : styles.rowUser]}
    >
      {isAI && (
        <View style={styles.senderRow}>
          <Text style={styles.senderLabel}>{senderName}</Text>
        </View>
      )}
      <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
        <Text style={styles.text}>{message.text}</Text>
      </View>
      {!isAI && (
        <Text style={styles.timestamp}>
          Sent · {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    maxWidth: '85%',
    gap: 6,
  },
  rowAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  rowUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  senderRow: {
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  senderLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.secondaryDim,
  },
  bubble: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
  },
  bubbleAI: {
    backgroundColor: 'rgba(242, 206, 173, 0.1)',
    borderTopLeftRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(242, 206, 173, 0.05)',
  },
  bubbleUser: {
    backgroundColor: 'rgba(212, 190, 228, 0.08)',
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 190, 228, 0.05)',
  },
  text: {
    fontFamily: fonts.body,
    fontSize: scaleFont(15),
    color: colors.onSurface,
    lineHeight: scaleFont(22),
  },
  timestamp: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.outline,
    paddingHorizontal: 10,
  },
});
