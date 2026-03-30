import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ChatInput } from '@/features/chat/ChatInput';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { useChatState } from '@/features/chat/useChatState';
import { colors, fonts } from '@/lib/theme';
import type { Message } from '@/features/chat/useChatState';

function TypingIndicator() {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
      <View style={styles.typingBubble}>
        <View style={[styles.typingDot, { opacity: 0.6 }]} />
        <View style={[styles.typingDot, { opacity: 0.4 }]} />
        <View style={[styles.typingDot, { opacity: 0.2 }]} />
        <Text style={styles.typingText}>Krishna is reflecting…</Text>
      </View>
    </Animated.View>
  );
}

export default function AskKrishnaScreen() {
  const { messages, isTyping, inputText, setInputText, sendMessage } = useChatState();
  const flatListRef = useRef<FlatList<Message>>(null);

  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(212, 190, 228, 0.05)" top={-60} left={-40} size={300} />

      {/* Header */}
      <View style={styles.headerWrap}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerMeta}>Krishna · AI Mentor</Text>
            <Text style={styles.headerTitle}>Ask Aksha</Text>
            <Text style={styles.headerSub}>Your Sacred Space for Reflection</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* Chat List */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => <ChatBubble message={item} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={() => sendMessage(inputText)}
        />
        <SafeAreaView edges={['bottom']} style={styles.safeBottom} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    shadowColor: colors.onSurface,
    shadowOpacity: 0.04,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 2,
  },
  headerMeta: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    color: colors.secondaryDim,
  },
  headerTitle: {
    fontFamily: fonts.headlineExtra,
    fontSize: 20,
    color: colors.onSurface,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
    opacity: 0.6,
  },
  listContent: {
    paddingTop: 130,
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 28,
  },
  separator: { height: 0 },
  typingRow: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 38, 38, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(72, 72, 72, 0.1)',
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.secondaryDim,
  },
  typingText: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  safeBottom: { backgroundColor: 'rgba(5, 7, 10, 0.95)' },
});
