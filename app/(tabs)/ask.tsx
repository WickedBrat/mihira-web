// app/(tabs)/ask.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ChatInput } from '@/features/chat/ChatInput';
import { PageHero } from '@/components/ui/PageHero';
import { RealmBackdrop } from '@/components/ui/RealmBackdrop';
import { NaradIntro } from '@/features/ask/NaradIntro';
import { useNaradState } from '@/features/ask/useNaradState';
import { useUsage } from '@/lib/usage';
import { useSubscription } from '@/lib/subscription';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
import { analytics } from '@/lib/analytics';
import { fonts, layout } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import type { Message } from '@/features/chat/useChatState';

const staticStyles = StyleSheet.create({
  separator: { height: 0 },
  bottomSpacer: { height: 96 },
});

function TypingIndicator() {
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      typingRow: { alignSelf: 'flex-start', marginTop: 8 },
      typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.7)' : 'rgba(232, 225, 212, 0.7)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: dark ? 'rgba(72, 72, 72, 0.1)' : 'rgba(0, 0, 0, 0.08)',
      },
      typingDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.secondaryDim },
      typingText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(11),
        color: c.onSurfaceVariant,
        fontStyle: 'italic',
        marginLeft: 4,
      },
    }),
  );

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
      <View style={styles.typingBubble}>
        <View style={[styles.typingDot, { opacity: 0.6 }]} />
        <View style={[styles.typingDot, { opacity: 0.4 }]} />
        <View style={[styles.typingDot, { opacity: 0.2 }]} />
        <Text style={styles.typingText}>Narad is journeying…</Text>
      </View>
    </Animated.View>
  );
}

export default function AskScreen() {
  const { isPro, isLoaded: isSubscriptionLoaded, openCheckout } = useSubscription();
  const { isAtLimit, isNearLimit, isLoaded: isUsageLoaded, increment } = useUsage('ask');
  const [paywallMode, setPaywallMode] = React.useState<'warning' | 'blocked' | null>(null);
  const pendingEnterRef = React.useRef(false);

  const {
    messages,
    isTyping,
    inputText,
    setInputText,
    sendMessage,
    clearChat,
    naradContext,
    isContextLoaded,
    realmPhase,
    currentDeity,
    accentColor,
  } = useNaradState();

  const [hasEnteredChat, setHasEnteredChat] = React.useState(false);
  const showIntro = isContextLoaded && naradContext.interactionCount === 0 && !hasEnteredChat;

  const flatListRef = useRef<FlatList<Message>>(null);
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
      flex: { flex: 1 },
      headerSafeArea: { marginBottom: 20, position: 'relative' },
      topRightButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 0 : 20,
        right: 16,
        zIndex: 10,
        padding: 8,
      },
      header: { paddingBottom: 24 },
      headerTitle: { fontSize: scaleFont(38), lineHeight: scaleFont(44) },
      headerSub: { maxWidth: 340 },
      listContent: {
        paddingTop: 28,
        paddingHorizontal: layout.screenPaddingX,
        paddingBottom: 28,
        gap: 28,
      },
    }),
  );

  const doEnter = () => {
    increment();
    setHasEnteredChat(true);
    analytics.guideSelected({ guide_name: 'Narad', guide_index: 0 });
  };

  const handleEnter = () => {
    if (!isSubscriptionLoaded || !isUsageLoaded) return;
    if (isPro) { doEnter(); return; }
    if (isAtLimit) {
      analytics.paywallShown({ feature: 'ask', mode: 'blocked' });
      setPaywallMode('blocked');
      return;
    }
    if (isNearLimit) {
      analytics.paywallShown({ feature: 'ask', mode: 'warning' });
      pendingEnterRef.current = true;
      setPaywallMode('warning');
      return;
    }
    doEnter();
  };

  // Show blank while context loads (avoids flicker between intro and chat)
  if (!isContextLoaded) return <View style={styles.root} />;

  if (showIntro) {
    return (
      <>
        <NaradIntro onEnter={handleEnter} />
        <PaywallSheet
          visible={paywallMode !== null}
          feature="ask"
          mode={paywallMode ?? 'warning'}
          onClose={() => {
            analytics.paywallDismissed({ feature: 'ask', mode: paywallMode ?? 'warning' });
            setPaywallMode(null);
            pendingEnterRef.current = false;
          }}
          onUpgrade={() => {
            analytics.paywallUpgradeTapped({ feature: 'ask' });
            setPaywallMode(null);
            openCheckout();
          }}
          onProceed={() => {
            analytics.paywallProceedTapped({ feature: 'ask' });
            setPaywallMode(null);
            if (pendingEnterRef.current) { pendingEnterRef.current = false; doEnter(); }
          }}
        />
      </>
    );
  }

  return (
    <View style={styles.root}>
      <RealmBackdrop phase={realmPhase} deityName={currentDeity} accentColor={accentColor} />

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
          renderItem={({ item }) => <ChatBubble message={item} senderName="Narad" />}
          ItemSeparatorComponent={() => <View style={staticStyles.separator} />}
          ListHeaderComponent={(
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <View style={styles.topRightButton}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Clear Chat',
                      'Are you sure you want to clear your conversation?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Clear', style: 'destructive', onPress: clearChat },
                      ],
                    );
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MoreVertical color={colors.onSurfaceVariant} size={24} />
                </TouchableOpacity>
              </View>
              <PageHero
                meta="Sacred Guidance"
                title="Ask Narad"
                subtitle="Bring your question into the sacred space."
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

      <View style={staticStyles.bottomSpacer} />
    </View>
  );
}
