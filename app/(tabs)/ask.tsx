import React, { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { PageHero } from '@/components/ui/PageHero';
import { ClearChatSheet } from '@/features/ask/ClearChatSheet';
import { EmptyAskState } from '@/features/ask/EmptyAskState';
import { NaradIntro } from '@/features/ask/NaradIntro';
import { ScriptureAnswerCard } from '@/features/ask/ScriptureAnswerCard';
import { useAskState } from '@/features/ask/useAskState';
import { ChatInput } from '@/features/chat/ChatInput';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
import { analytics } from '@/lib/analytics';
import { useSubscription } from '@/lib/subscription';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';
import { useUsage } from '@/lib/usage';

function TypingIndicator() {
  return (
    <View className="mt-2 self-start">
      <View className="flex-row items-center gap-1 rounded-full border border-black/[0.08] bg-[rgba(232,225,212,0.7)] px-3.5 py-2 dark:border-outline-variant/10 dark:bg-[rgba(37,38,38,0.7)]">
        <View className="h-[5px] w-[5px] rounded-full bg-secondary-dim opacity-60" />
        <View className="h-[5px] w-[5px] rounded-full bg-secondary-dim opacity-40" />
        <View className="h-[5px] w-[5px] rounded-full bg-secondary-dim opacity-20" />
        <Text className="ml-1 font-body text-[11px] italic text-on-surface-variant">Searching the texts…</Text>
      </View>
    </View>
  );
}

export default function AskScreen() {
  const { isPro, isLoaded: isSubscriptionLoaded, openCheckout } = useSubscription();
  const { isAtLimit, isNearLimit, isLoaded: isUsageLoaded, increment } = useUsage('ask');
  const [paywallMode, setPaywallMode] = React.useState<'warning' | 'blocked' | null>(null);
  const [isClearSheetOpen, setIsClearSheetOpen] = React.useState(false);
  const [shouldClearHistory, setShouldClearHistory] = React.useState(true);
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
    askContext,
    isContextLoaded,
    savedPassages,
    toggleSavedPassage,
    setFollowUpPrompt,
  } = useAskState();
  const [hasEnteredChat, setHasEnteredChat] = React.useState(false);
  const showIntro = isContextLoaded && askContext.interactionCount === 0 && !hasEnteredChat;
  const flatListRef = useRef<FlatList>(null);
  const isLoadingMoreRef = useRef(false);
  const { colors } = useTheme();
  const savedSourceIds = useMemo(() => new Set(savedPassages.map((entry) => entry.source.id)), [savedPassages]);

  const handleScroll = useCallback(
    ({ nativeEvent }: { nativeEvent: { contentOffset: { y: number } } }) => {
      if (nativeEvent.contentOffset.y < 80 && hasMoreMessages && !isLoadingMoreRef.current) {
        isLoadingMoreRef.current = true;
        loadMoreMessages();
        setTimeout(() => {
          isLoadingMoreRef.current = false;
        }, 400);
      }
    },
    [hasMoreMessages, loadMoreMessages],
  );

  const doEnter = () => {
    increment();
    setHasEnteredChat(true);
  };

  const openClearSheet = () => {
    setShouldClearHistory(true);
    setIsClearSheetOpen(true);
  };

  const handleConfirmClear = async () => {
    await clearChat({ clearHistory: shouldClearHistory });
    setIsClearSheetOpen(false);
  };

  const handleEnter = () => {
    if (!isSubscriptionLoaded || !isUsageLoaded) return;
    if (isPro) {
      doEnter();
      return;
    }
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
            if (pendingEnterRef.current) {
              pendingEnterRef.current = false;
              doEnter();
            }
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
          renderItem={({ item }) => {
            if (item.kind === 'user_message') {
              return (
                <ChatBubble
                  message={{
                    id: item.id,
                    role: item.role,
                    text: item.text,
                    timestamp: item.timestamp,
                  }}
                  senderName="Aksha"
                />
              );
            }

            return (
              <ScriptureAnswerCard
                response={item.response}
                savedSourceIds={savedSourceIds}
                onToggleSavedPassage={toggleSavedPassage}
                onUseFollowUpPrompt={setFollowUpPrompt}
              />
            );
          }}
          ListEmptyComponent={!isTyping ? <EmptyAskState onSelectPrompt={setInputText} /> : null}
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
                  onPress={openClearSheet}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MoreVertical color={colors.onSurfaceVariant} size={24} />
                </TouchableOpacity>
              </View>
              <PageHero
                meta="Scripture Grounded"
                title="Ask Aksha"
                subtitle="Guidance rooted in Hindu sacred texts."
                style={{ paddingBottom: 16 }}
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
          placeholder="Ask about duty, grief, family, fear, work, or purpose…"
        />
      </KeyboardAvoidingView>

      <View className="h-24" />

      <ClearChatSheet
        visible={isClearSheetOpen}
        clearHistory={shouldClearHistory}
        onClose={() => setIsClearSheetOpen(false)}
        onToggleClearHistory={() => setShouldClearHistory((value) => !value)}
        onConfirm={handleConfirmClear}
      />
    </View>
  );
}
