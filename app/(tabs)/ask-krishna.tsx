import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SvgUri } from 'react-native-svg';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ChatInput } from '@/features/chat/ChatInput';
import { PageHero } from '@/components/ui/PageHero';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { useChatState } from '@/features/chat/useChatState';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
import type { Message } from '@/features/chat/useChatState';

const askBackgroundArt = Image.resolveAssetSource(
  require('../../assets/daily-arth-bg.svg')
);

function AskBackdrop() {
  return (
    <View pointerEvents="none" style={styles.backdrop}>
      <AmbientBlob color="rgba(212, 190, 228, 0.12)" top={-110} left={-90} size={380} />
      <AmbientBlob color="rgba(184, 152, 122, 0.08)" top={280} left={-20} size={280} />
      {askBackgroundArt?.uri ? (
        <View style={styles.backgroundArt}>
          <SvgUri uri={askBackgroundArt.uri} width="100%" height="100%" />
        </View>
      ) : null}
    </View>
  );
}

function TypingIndicator() {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
      <View style={styles.typingBubble}>
        <View style={[styles.typingDot, { opacity: 0.6 }]} />
        <View style={[styles.typingDot, { opacity: 0.4 }]} />
        <View style={[styles.typingDot, { opacity: 0.2 }]} />
        <Text style={styles.typingText}>Aksha is reflecting…</Text>
      </View>
    </Animated.View>
  );
}

export default function AskKrishnaScreen() {
  const { messages, isTyping, inputText, setInputText, sendMessage } = useChatState();
  const flatListRef = useRef<FlatList<Message>>(null);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <AskBackdrop />

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
          ListHeaderComponent={(
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <PageHero
                meta="Sacred Guidance"
                title="Ask Aksha"
                subtitle="Bring your doubt, conflict, or question into one clear sacred space."
                style={styles.header}
                titleStyle={styles.headerTitle}
                subtitleStyle={styles.headerSub}
              />
            </SafeAreaView>
          )}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={() => sendMessage(inputText)}
        />
      </KeyboardAvoidingView>

      {/* Sits outside KAV — keeps input above the floating tab bar without being lifted by keyboard */}
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundArt: {
    position: 'absolute',
    top: -100,
    right: -140,
    width: 380,
    height: 380,
    opacity: 0.14,
    transform: [{ rotate: '10deg' }],
  },
  headerSafeArea: {
    marginBottom: 20,
  },
  header: {
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: scaleFont(38),
    lineHeight: scaleFont(44),
  },
  headerSub: {
    maxWidth: 340,
  },
  listContent: {
    paddingTop: 28,
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: 28,
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
    fontSize: scaleFont(11),
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  bottomSpacer: {
    height: 96,
    // backgroundColor: 'rgba(5, 7, 10, 0.95)',
  },
});
