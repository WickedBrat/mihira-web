// features/chat/ChatBubble.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import type { Message, ShlokaData } from '@/features/ask/types';

interface ChatBubbleProps {
  message: Message;
  senderName?: string;
}

function VaniCard({
  text,
  borderColor,
  shloka,
}: {
  text: string;
  borderColor: string;
  shloka: ShlokaData | undefined;
}) {
  const [expanded, setExpanded] = useState(false);

  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      card: {
        borderRadius: 20,
        paddingHorizontal: 22,
        paddingVertical: 18,
        borderLeftWidth: 3,
        gap: 8,
        backgroundColor: dark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      },
      text: {
        fontFamily: fonts.body,
        fontSize: scaleFont(16),
        color: c.onSurface,
        lineHeight: scaleFont(25),
      },
      readBtn: {
        alignSelf: 'flex-start',
        marginTop: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: dark ? 'rgba(212, 175, 55, 0.3)' : 'rgba(180, 140, 30, 0.35)',
        backgroundColor: dark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(212, 175, 55, 0.08)',
      },
      readBtnText: {
        fontFamily: fonts.label,
        fontSize: scaleFont(11),
        letterSpacing: 0.8,
        color: dark ? 'rgba(212, 175, 55, 0.85)' : 'rgba(150, 110, 10, 0.9)',
      },
      panel: {
        marginTop: 4,
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        gap: 10,
        backgroundColor: dark ? 'rgba(212, 175, 55, 0.06)' : 'rgba(212, 175, 55, 0.09)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.22)',
      },
      panelDevanagari: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(18),
        color: 'rgba(212, 175, 55, 0.95)',
        lineHeight: scaleFont(28),
        textAlign: 'center',
      },
      panelTranslit: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: scaleFont(18),
      },
      panelDivider: {
        height: 1,
        backgroundColor: dark ? 'rgba(212, 175, 55, 0.12)' : 'rgba(212, 175, 55, 0.18)',
        marginVertical: 2,
      },
      panelMeaning: {
        fontFamily: fonts.body,
        fontSize: scaleFont(13),
        color: c.onSurface,
        lineHeight: scaleFont(20),
      },
    }),
  );

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      <Text style={styles.text}>{text}</Text>
      {shloka ? (
        <TouchableOpacity
          style={styles.readBtn}
          onPress={() => setExpanded(v => !v)}
          activeOpacity={0.7}
        >
          <Text style={styles.readBtnText}>
            {expanded ? 'Hide verse' : `Read from ${shloka.source}`}
          </Text>
        </TouchableOpacity>
      ) : null}
      {expanded && shloka ? (
        <View style={styles.panel}>
          <Text style={styles.panelDevanagari}>{shloka.devanagari}</Text>
          <Text style={styles.panelTranslit}>{shloka.transliteration}</Text>
          <View style={styles.panelDivider} />
          <Text style={styles.panelMeaning}>{shloka.meaning}</Text>
        </View>
      ) : null}
    </View>
  );
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
    }),
  );

  // ── narad_journey: stage direction, no bubble ────────────────────────────
  if (bubbleType === 'narad_journey') {
    return (
      <View style={styles.journeyWrapper}>
        <Text style={styles.journeyText}>{message.text}</Text>
      </View>
    );
  }

  // ── shloka card ──────────────────────────────────────────────────────────
  if (bubbleType === 'shloka') {
    const borderColor = accentColor ?? 'rgba(212, 175, 55, 0.5)';
    return (
      <View style={[styles.shlokaCard, { borderColor }]}>
        <Text style={styles.shlokaDevanagari}>{message.text}</Text>
        {subtitle ? <Text style={styles.shlokaTranslit}>{subtitle}</Text> : null}
        {deityLabel ? <Text style={styles.shlokaSource}>{deityLabel}</Text> : null}
      </View>
    );
  }

  // ── vani card ────────────────────────────────────────────────────────────
  if (bubbleType === 'vani') {
    const borderColor = accentColor ?? 'rgba(255,255,255,0.2)';
    return (
      <VaniCard
        text={message.text}
        borderColor={borderColor}
        shloka={message.shlokaData}
      />
    );
  }

  // ── narad_greeting / narad_closing: italic narrative bubble ─────────────
  if (bubbleType === 'narad_greeting' || bubbleType === 'narad_closing') {
    return (
      <View style={[styles.row, styles.rowAI]}>
        <View style={styles.senderRow}>
          <Text style={styles.senderLabel}>{senderName}</Text>
        </View>
        <View style={[styles.bubble, styles.bubbleAI]}>
          <Text style={styles.naradText}>{message.text}</Text>
        </View>
      </View>
    );
  }

  // ── Default (user messages + any legacy AI messages) ─────────────────────
  return (
    <View style={[styles.row, isAI ? styles.rowAI : styles.rowUser]}>
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
    </View>
  );
}
