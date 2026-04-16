// app/(tabs)/ask.tsx
import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ChatInput } from '@/features/chat/ChatInput';
import { PageHero } from '@/components/ui/PageHero';
import { NaradIntro } from '@/features/ask/NaradIntro';
import { useNaradState } from '@/features/ask/useNaradState';
import { useUsage } from '@/lib/usage';
import { useSubscription } from '@/lib/subscription';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
import { analytics } from '@/lib/analytics';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';

function TypingIndicator() {
  return (
    <View className="mt-2 self-start">
      <View className="flex-row items-center gap-1 rounded-full border border-black/[0.08] bg-[rgba(232,225,212,0.7)] px-3.5 py-2 dark:border-outline-variant/10 dark:bg-[rgba(37,38,38,0.7)]">
        <View className="h-[5px] w-[5px] rounded-full bg-secondary-dim opacity-60" />
        <View className="h-[5px] w-[5px] rounded-full bg-secondary-dim opacity-40" />
        <View className="h-[5px] w-[5px] rounded-full bg-secondary-dim opacity-20" />
        <Text className="ml-1 font-body text-[11px] italic text-on-surface-variant">Narad is journeying…</Text>
      </View>
    </View>
  );
}

export default function AskScreen() {
  const { isPro, isLoaded: isSubscriptionLoaded, openCheckout } = useSubscription();
  const { isAtLimit, isNearLimit, isLoaded: isUsageLoaded, increment } = useUsage('ask');
  const [paywallMode, setPaywallMode] = React.useState<'warning' | 'blocked' | null>(null);
  const pendingEnterRef = React.useRef(false);

  const {
    messages,
    hasMoreMessages,
    loadMoreMessages,
    isTyping,
    inputText,
    setInputText,
    sendMessage,
    clearChat,
    naradContext,
    isContextLoaded,
  } = useNaradState();

  const [hasEnteredChat, setHasEnteredChat] = React.useState(false);
  const showIntro = isContextLoaded && naradContext.interactionCount === 0 && !hasEnteredChat;

  const flatListRef = useRef<FlatList>(null);
  const isLoadingMoreRef = useRef(false);

  const handleScroll = useCallback(
    ({ nativeEvent }: { nativeEvent: { contentOffset: { y: number } } }) => {
      if (nativeEvent.contentOffset.y < 80 && hasMoreMessages && !isLoadingMoreRef.current) {
        isLoadingMoreRef.current = true;
        loadMoreMessages();
        setTimeout(() => { isLoadingMoreRef.current = false; }, 400);
      }
    },
    [hasMoreMessages, loadMoreMessages],
  );
  const { colors } = useTheme();

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

  if (!isContextLoaded) return <View className="flex-1 bg-surface" />;

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
    <View className="flex-1 bg-surface">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingTop: 28,
            paddingHorizontal: layout.screenPaddingX,
            paddingBottom: 28,
            gap: 28,
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          onScroll={handleScroll}
          scrollEventThrottle={200}
          renderItem={({ item }) => <ChatBubble message={item} senderName="Narad" />}
          ListHeaderComponent={(
            <SafeAreaView edges={['top']} className="relative mb-5">
              {hasMoreMessages && (
                <ActivityIndicator
                  size="small"
                  color={colors.onSurfaceVariant}
                  style={{ marginBottom: 12 }}
                />
              )}
              <View className="absolute right-4 z-10 p-2" style={{ top: Platform.OS === 'ios' ? 0 : 20 }}>
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
                style={{ paddingBottom: 24 }}
                titleStyle={{ fontSize: 38, lineHeight: 44 }}
                subtitleStyle={{ maxWidth: 340 }}
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

      <View className="h-24" />
    </View>
  );
}
