// features/chat/ChatBubble.tsx
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/ui/Text';
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

  return (
    <View
      className="gap-2 rounded-[20px] border border-black/[0.05] border-l-[3px] bg-black/[0.03] px-[2px] py-[18px] dark:border-white/[0.06] dark:bg-white/[0.04]"
      style={{ borderLeftColor: borderColor }}
    >
      <Text className="font-body text-lg leading-8 text-on-surface">{text}</Text>
      {shloka ? (
        <TouchableOpacity
          className="mt-1 self-start rounded-[20px] border border-[rgba(180,140,30,0.35)] bg-[rgba(212,175,55,0.08)] px-3 py-1.5 dark:border-[rgba(212,175,55,0.3)] dark:bg-[rgba(212,175,55,0.06)]"
          onPress={() => setExpanded(v => !v)}
          activeOpacity={0.7}
        >
          <Text className="font-label text-xs tracking-[0.8px] text-[rgba(150,110,10,0.9)] dark:text-[rgba(212,175,55,0.85)]">
            {expanded ? 'Hide verse' : `Read from ${shloka.source}`}
          </Text>
        </TouchableOpacity>
      ) : null}
      {expanded && shloka ? (
        <View className="mt-1 gap-2.5 rounded-[14px] border border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.09)] px-[18px] py-4 dark:border-[rgba(212,175,55,0.15)] dark:bg-[rgba(212,175,55,0.06)]">
          <Text className="text-center font-headline text-lg leading-9 text-[rgba(212,175,55,0.95)]">{shloka.devanagari}</Text>
          <Text className="text-center font-body text-base italic leading-7 text-on-surface-variant">
            {shloka.transliteration}
          </Text>
          <View className="my-0.5 h-px bg-[rgba(212,175,55,0.18)] dark:bg-[rgba(212,175,55,0.12)]" />
          <Text className="font-body text-lg leading-7 text-on-surface">{shloka.meaning}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function ChatBubble({ message, senderName = 'Narad' }: ChatBubbleProps) {
  const isAI = message.role === 'ai';
  const { bubbleType, accentColor, deityLabel, subtitle } = message;

  // ── narad_journey: stage direction, no bubble ────────────────────────────
  if (bubbleType === 'narad_journey') {
    return (
      <View className="max-w-[90%] self-center px-5 py-2.5">
        <Text className="text-center font-body text-sm italic leading-6 text-on-surface-variant">
          {message.text}
        </Text>
      </View>
    );
  }

  // ── shloka card ──────────────────────────────────────────────────────────
  if (bubbleType === 'shloka') {
    const borderColor = accentColor ?? 'rgba(212, 175, 55, 0.5)';
    return (
      <View
        className="gap-2.5 rounded-[20px] border border-l-[3px] bg-[rgba(212,175,55,0.10)] px-6 py-5 dark:bg-[rgba(212,175,55,0.06)]"
        style={{ borderColor }}
      >
        <Text className="text-center font-headline text-2xl leading-9 text-[rgba(212,175,55,0.95)]">
          {message.text}
        </Text>
        {subtitle ? (
          <Text className="text-center font-body text-base italic leading-7 text-on-surface-variant">
            {subtitle}
          </Text>
        ) : null}
        {deityLabel ? (
          <Text className="text-center font-label text-xs uppercase tracking-[1px] text-outline">
            {deityLabel}
          </Text>
        ) : null}
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
      <View className="max-w-[85%] items-start gap-1.5 self-start">
        <View className="mb-0.5 px-1.5">
          <Text className="font-label text-[10px] uppercase tracking-[2px] text-secondary-dim">{senderName}</Text>
        </View>
        <View className="rounded-[28px] rounded-tl-lg border border-[rgba(200,150,100,0.12)] bg-[rgba(242,206,173,0.18)] px-[22px] py-3.5 dark:border-[rgba(242,206,173,0.05)] dark:bg-[rgba(242,206,173,0.1)]">
          <Text className="font-body text-lg italic leading-8 text-on-surface">{message.text}</Text>
        </View>
      </View>
    );
  }

  // ── Default (user messages + any legacy AI messages) ─────────────────────
  return (
    <View className={`max-w-[85%] gap-1.5 ${isAI ? 'items-start self-start' : 'items-end self-end'}`}>
      {isAI && (
        <View className="mb-0.5 px-1.5">
          <Text className="font-label text-[10px] uppercase tracking-[2px] text-secondary-dim">{senderName}</Text>
        </View>
      )}
      <View
        className={`rounded-[28px] border px-[22px] py-3.5 ${
          isAI
            ? 'rounded-tl-lg border-[rgba(200,150,100,0.12)] bg-[rgba(242,206,173,0.18)] dark:border-[rgba(242,206,173,0.05)] dark:bg-[rgba(242,206,173,0.1)]'
            : 'rounded-tr-lg border-[rgba(160,120,200,0.12)] bg-[rgba(212,190,228,0.18)] dark:border-[rgba(212,190,228,0.05)] dark:bg-[rgba(212,190,228,0.08)]'
        }`}
      >
        <Text className="font-body text-lg leading-8 text-on-surface">{message.text}</Text>
      </View>
      {!isAI && (
        <Text className="px-2.5 font-label text-[10px] uppercase tracking-[1px] text-outline">
          Sent ·{' '}
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );
}
