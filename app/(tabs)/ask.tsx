// app/(tabs)/ask.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChatBubble } from '@/features/chat/ChatBubble';
import { ChatInput } from '@/features/chat/ChatInput';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { PageHero } from '@/components/ui/PageHero';
import { useChatState } from '@/features/chat/useChatState';
import { GuideSelector } from '@/features/ask/GuideSelector';
import { GuideLoader } from '@/features/ask/GuideLoader';
import { getGuide } from '@/features/ask/guidePersonas';
import { useGuide } from '@/lib/guideStore';
import { useUsage } from '@/lib/usage';
import { useSubscription } from '@/lib/subscription';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
import { analytics } from '@/lib/analytics';
import { fonts, layout } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import type { Message } from '@/features/chat/useChatState';

type Phase = 'selector' | 'loading' | 'chat';

const staticStyles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
  separator: { height: 0 },
  bottomSpacer: { height: 96 },
});

function AskBackdrop({ guideName }: { guideName: string | null }) {
  const persona = guideName ? getGuide(guideName) : null;

  return (
    <View pointerEvents="none" style={staticStyles.backdrop}>
      {persona?.imageUrl ? (
        <View style={StyleSheet.absoluteFillObject}>
          <Image
            source={{ uri: persona.imageUrl }}
            style={[StyleSheet.absoluteFillObject, { opacity: 0.15 }]}
            resizeMode="cover"
          />
        </View>
      ) : null}
      <AmbientBlob color="rgba(212, 190, 228, 0.12)" top={-110} left={-90} size={380} />
      <AmbientBlob color="rgba(184, 152, 122, 0.08)" top={280} left={-20} size={280} />
    </View>
  );
}

function TypingIndicator({ guideName }: { guideName: string | null }) {
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      typingRow: {
        alignSelf: 'flex-start',
        marginTop: 8,
      },
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
      typingDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: c.secondaryDim,
      },
      typingText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(11),
        color: c.onSurfaceVariant,
        fontStyle: 'italic',
        marginLeft: 4,
      },
    })
  );

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.typingRow}>
      <View style={styles.typingBubble}>
        <View style={[styles.typingDot, { opacity: 0.6 }]} />
        <View style={[styles.typingDot, { opacity: 0.4 }]} />
        <View style={[styles.typingDot, { opacity: 0.2 }]} />
        <Text style={styles.typingText}>
          {guideName ? `${guideName} is reflecting…` : 'Aksha is reflecting…'}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function AskScreen() {
  const { guide, isLoading, commitToGuide } = useGuide();
  const { isPro, isLoaded: isSubscriptionLoaded, openCheckout } = useSubscription();
  const { isAtLimit, isNearLimit, isLoaded: isUsageLoaded, increment } = useUsage('ask');
  const [paywallMode, setPaywallMode] = React.useState<'warning' | 'blocked' | null>(null);
  const pendingGuideRef = React.useRef<string | null>(null);
  const [phase, setPhase] = React.useState<Phase>(() =>
    guide ? 'chat' : 'selector'
  );
  const [pendingGuide, setPendingGuide] = React.useState<string | null>(null);

  // Resolve phase once guide store finishes loading
  React.useEffect(() => {
    if (!isLoading) {
      setPhase(guide ? 'chat' : 'selector');
    }
  }, [isLoading, guide]);

  const activeGuide = guide ?? pendingGuide;
  const { messages, isTyping, inputText, setInputText, sendMessage, clearChat } =
    useChatState(activeGuide);
  const flatListRef = useRef<FlatList<Message>>(null);
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
      flex: { flex: 1 },
      headerSafeArea: {
        marginBottom: 20,
        position: 'relative',
      },
      topRightButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 0 : 20,
        right: 16,
        zIndex: 10,
        padding: 8,
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
    })
  );

  const doCommit = async (guideName: string) => {
    increment();
    setPendingGuide(guideName);
    await commitToGuide(guideName);
    setPhase('loading');
  };

  const handleCommit = (guideName: string) => {
    if (!isSubscriptionLoaded || !isUsageLoaded) return; // loading guard

    if (isPro) {
      doCommit(guideName);
      return;
    }

    if (isAtLimit) {
      analytics.paywallShown({ feature: 'ask', mode: 'blocked' });
      setPaywallMode('blocked');
      return;
    }

    if (isNearLimit) {
      analytics.paywallShown({ feature: 'ask', mode: 'warning' });
      pendingGuideRef.current = guideName;
      setPaywallMode('warning');
      return;
    }

    doCommit(guideName);
  };

  const handleLoaderComplete = () => {
    setPhase('chat');
  };

  if (isLoading) return <View style={styles.root} />;

  if (phase === 'selector') {
    return (
      <>
        <GuideSelector onCommit={handleCommit} />
        <PaywallSheet
          visible={paywallMode !== null}
          feature="ask"
          mode={paywallMode ?? 'warning'}
          onClose={() => {
            analytics.paywallDismissed({ feature: 'ask', mode: paywallMode ?? 'warning' });
            setPaywallMode(null);
            pendingGuideRef.current = null;
          }}
          onUpgrade={() => {
            analytics.paywallUpgradeTapped({ feature: 'ask' });
            setPaywallMode(null);
            openCheckout();
          }}
          onProceed={() => {
            analytics.paywallProceedTapped({ feature: 'ask' });
            const name = pendingGuideRef.current;
            pendingGuideRef.current = null;
            setPaywallMode(null);
            if (name) doCommit(name);
          }}
        />
      </>
    );
  }

  if (phase === 'loading' && pendingGuide) {
    return (
      <GuideLoader
        guideName={pendingGuide}
        onComplete={handleLoaderComplete}
      />
    );
  }

  return (
    <View style={styles.root}>
      <AskBackdrop guideName={activeGuide} />

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
          renderItem={({ item }) => (
            <ChatBubble message={item} senderName={activeGuide ?? 'Aksha'} />
          )}
          ItemSeparatorComponent={() => <View style={staticStyles.separator} />}
          ListHeaderComponent={(
            <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
              <View style={styles.topRightButton}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Clear Chat',
                      'Are you sure you want to clear your conversation history?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Clear', style: 'destructive', onPress: clearChat },
                      ]
                    );
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MoreVertical color={colors.onSurfaceVariant} size={24} />
                </TouchableOpacity>
              </View>
              <PageHero
                meta="Sacred Guidance"
                title={`Ask ${activeGuide ?? 'Aksha'}`}
                subtitle="Bring your doubt, conflict, or question into one clear sacred space."
                style={styles.header}
                titleStyle={styles.headerTitle}
                subtitleStyle={styles.headerSub}
              />
            </SafeAreaView>
          )}
          ListFooterComponent={isTyping ? <TypingIndicator guideName={activeGuide} /> : null}
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
