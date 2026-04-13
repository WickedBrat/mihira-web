// features/chat/ChatBubble.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

const AI_FADE_IN = FadeIn.duration(700);
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import type { Message } from './useChatState';

interface ChatBubbleProps {
  message: Message;
  senderName?: string;
}

function StaggerWrapper({
  visibleAfterMs,
  children,
}: {
  visibleAfterMs: number;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(visibleAfterMs === 0);

  useEffect(() => {
    if (visibleAfterMs === 0) return;
    const timer = setTimeout(() => setVisible(true), visibleAfterMs);
    return () => clearTimeout(timer);
  }, [visibleAfterMs]);

  if (!visible) return null;
  return <Animated.View entering={AI_FADE_IN}>{children}</Animated.View>;
}

export function ChatBubble({ message, senderName = 'Narad' }: ChatBubbleProps) {
  const isAI = message.role === 'ai';
  const { bubbleType, accentColor, deityLabel, subtitle } = message;

  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      // ── Shared layout ──────────────────────────────────────────────────
      row: { maxWidth: '85%', gap: 6 },
      rowAI: { alignSelf: 'flex-start', alignItems: 'flex-start' },
      rowUser: { alignSelf: 'flex-end', alignItems: 'flex-end' },
      senderRow: { paddingHorizontal: 6, marginBottom: 2 },
      senderLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.secondaryDim,
      },
      // ── Standard bubble ────────────────────────────────────────────────
      bubble: { paddingHorizontal: 22, paddingVertical: 14, borderRadius: 28 },
      bubbleAI: {
        backgroundColor: dark ? 'rgba(242, 206, 173, 0.1)' : 'rgba(242, 206, 173, 0.18)',
        borderTopLeftRadius: 8,
        borderWidth: 1,
        borderColor: dark ? 'rgba(242, 206, 173, 0.05)' : 'rgba(200, 150, 100, 0.12)',
      },
      bubbleUser: {
        backgroundColor: dark ? 'rgba(212, 190, 228, 0.08)' : 'rgba(212, 190, 228, 0.18)',
        borderTopRightRadius: 8,
        borderWidth: 1,
        borderColor: dark ? 'rgba(212, 190, 228, 0.05)' : 'rgba(160, 120, 200, 0.12)',
      },
      text: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurface,
        lineHeight: scaleFont(22),
      },
      timestamp: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: c.outline,
        paddingHorizontal: 10,
      },
      // ── narad_greeting / narad_closing ─────────────────────────────────
      naradText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurface,
        lineHeight: scaleFont(22),
        fontStyle: 'italic',
      },
      // ── narad_journey ──────────────────────────────────────────────────
      journeyWrapper: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        maxWidth: '90%',
      },
      journeyText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: scaleFont(18),
      },
      // ── shloka ─────────────────────────────────────────────────────────
      shlokaCard: {
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 20,
        gap: 10,
        backgroundColor: dark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(212, 175, 55, 0.10)',
        borderWidth: 1,
        borderLeftWidth: 3,
      },
      shlokaDevanagari: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(20),
        color: 'rgba(212, 175, 55, 0.95)',
        lineHeight: scaleFont(30),
        textAlign: 'center',
      },
      shlokaTranslit: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: scaleFont(18),
      },
      shlokaSource: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        color: c.outline,
        textAlign: 'center',
        letterSpacing: 1,
        textTransform: 'uppercase',
      },
      // ── vani ───────────────────────────────────────────────────────────
      vaniCard: {
        borderRadius: 20,
        paddingHorizontal: 22,
        paddingVertical: 18,
        borderLeftWidth: 3,
        gap: 8,
        backgroundColor: dark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      },
      vaniDeityLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: c.outline,
      },
      vaniText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(16),
        color: c.onSurface,
        lineHeight: scaleFont(25),
      },
    }),
  );

  // ── narad_journey: stage direction, no bubble ────────────────────────────
  if (bubbleType === 'narad_journey') {
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <View style={styles.journeyWrapper}>
          <Text style={styles.journeyText}>{message.text}</Text>
        </View>
      </StaggerWrapper>
    );
  }

  // ── shloka card ──────────────────────────────────────────────────────────
  if (bubbleType === 'shloka') {
    const borderColor = accentColor ?? 'rgba(212, 175, 55, 0.5)';
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <View style={[styles.shlokaCard, { borderColor }]}>
          <Text style={styles.shlokaDevanagari}>{message.text}</Text>
          {subtitle ? <Text style={styles.shlokaTranslit}>{subtitle}</Text> : null}
          {deityLabel ? <Text style={styles.shlokaSource}>{deityLabel}</Text> : null}
        </View>
      </StaggerWrapper>
    );
  }

  // ── vani card ────────────────────────────────────────────────────────────
  if (bubbleType === 'vani') {
    const borderColor = accentColor ?? 'rgba(255,255,255,0.2)';
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <View style={[styles.vaniCard, { borderLeftColor: borderColor }]}>
          {deityLabel ? (
            <Text style={[styles.vaniDeityLabel, { color: borderColor }]}>{deityLabel}</Text>
          ) : null}
          <Text style={styles.vaniText}>{message.text}</Text>
        </View>
      </StaggerWrapper>
    );
  }

  // ── narad_greeting / narad_closing: italic narrative bubble ─────────────
  if (bubbleType === 'narad_greeting' || bubbleType === 'narad_closing') {
    return (
      <StaggerWrapper visibleAfterMs={message.visibleAfterMs ?? 0}>
        <View style={[styles.row, styles.rowAI]}>
          <View style={styles.senderRow}>
            <Text style={styles.senderLabel}>{senderName}</Text>
          </View>
          <View style={[styles.bubble, styles.bubbleAI]}>
            <Text style={styles.naradText}>{message.text}</Text>
          </View>
        </View>
      </StaggerWrapper>
    );
  }

  // ── Default (user messages + any legacy AI messages) ─────────────────────
  return (
    <Animated.View
      entering={isAI ? AI_FADE_IN : SlideInRight.duration(400)}
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
          Sent ·{' '}
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </Animated.View>
  );
}
