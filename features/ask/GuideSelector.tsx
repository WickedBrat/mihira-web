// features/ask/GuideSelector.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import type { ViewToken } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { GUIDES, type GuidePersona } from './guidePersonas';
import { analytics } from '@/lib/analytics';

const { width: SW, height: SH } = Dimensions.get('window');
const CARD_W = SW * 0.76;
const CARD_GAP = 12;
const SNAP = CARD_W + CARD_GAP;
const CONTENT_PADDING = (SW - CARD_W) / 2 - CARD_GAP / 2;

interface GuideSelectorProps {
  onCommit: (guideName: string) => void;
}

function CarouselCard({
  guide,
  isActive,
  onLongPress,
}: {
  guide: GuidePersona;
  isActive: boolean;
  onLongPress: () => void;
}) {
  const scale = useSharedValue(isActive ? 1 : 0.88);
  const opacity = useSharedValue(isActive ? 1 : 0.38);
  const glowOpacity = useSharedValue(isActive ? 1 : 0);
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      card: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(72, 72, 72, 0.25)',
        paddingVertical: 48,
        paddingHorizontal: 28,
        alignItems: 'center',
        gap: 12,
        overflow: 'hidden',
        height: SH * 0.48,
        justifyContent: 'flex-end',
      },
      cardBgImage: {
        borderRadius: 28,
      },
      cardScrim: {
        borderRadius: 28,
        backgroundColor: 'rgba(0, 0, 0, 0.52)',
      },
      cardGlow: {
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: `${c.secondaryFixedDim}55`,
        backgroundColor: `${c.onSecondary}0d`,
      },
      cardName: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(28),
        color: '#ffffff',
        textAlign: 'center',
      },
      cardEssence: {
        fontFamily: fonts.body,
        fontSize: scaleFont(14),
        color: 'rgba(255,255,255,0.75)',
        textAlign: 'center',
        lineHeight: scaleFont(21),
      },
    })
  );

  useEffect(() => {
    scale.value = withTiming(isActive ? 1 : 0.88, {
      duration: 380,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(isActive ? 1 : 0.38, { duration: 380 });
    glowOpacity.value = withTiming(isActive ? 1 : 0, { duration: 520 });
  }, [isActive]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Pressable
      onLongPress={isActive ? onLongPress : undefined}
      delayLongPress={400}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <Image
          source={{ uri: guide.imageUrl }}
          style={[StyleSheet.absoluteFill, styles.cardBgImage]}
          resizeMode="cover"
        />
        <View style={[StyleSheet.absoluteFill, styles.cardScrim]} />
        <Animated.View style={[StyleSheet.absoluteFill, styles.cardGlow, glowStyle]} />

        <Text style={styles.cardName}>{guide.name}</Text>
        <Text style={styles.cardEssence}>{guide.essence}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function GuideSelector({ onCommit }: GuideSelectorProps) {
  const [activeIndex, _setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      root: {
        flex: 1,
        backgroundColor: c.surface,
        paddingTop: 40,
      },
      safe: { flex: 1 },
      header: {
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 20,
        paddingBottom: 28,
      },
      title: {
        fontFamily: fonts.headlineExtra,
        fontSize: scaleFont(36),
        color: c.onSurface,
        letterSpacing: -0.8,
        lineHeight: scaleFont(44),
        textAlign: 'center',
        marginBottom: 12,
      },
      subtitle: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurfaceVariant,
        textAlign: 'center',
        letterSpacing: 0.3,
      },
      carouselWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 12,
      },
      carouselContent: {
        paddingHorizontal: CONTENT_PADDING,
      },
      cardSlot: {
        width: CARD_W,
        marginHorizontal: CARD_GAP / 2,
      },
      hintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        gap: 6,
        marginBottom: 8,
        paddingHorizontal: 32,
      },
      commitVerb: {
        fontFamily: fonts.label,
        fontSize: scaleFont(14),
        color: c.primary,
      },
      holdHint: {
        fontFamily: fonts.body,
        fontSize: scaleFont(13),
        color: c.onSurfaceVariant,
      },
      permanentNote: {
        fontFamily: fonts.body,
        fontSize: scaleFont(11),
        color: c.outline,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 8,
      },
    })
  );

  const headerOffsetY = useSharedValue(SH * 0.27);
  const carouselOpacity = useSharedValue(0);
  const carouselOffsetY = useSharedValue(48);

  useEffect(() => {
    const t = setTimeout(() => {
      headerOffsetY.value = withTiming(0, {
        duration: 720,
        easing: Easing.out(Easing.cubic),
      });
      carouselOpacity.value = withDelay(320, withTiming(1, { duration: 600 }));
      carouselOffsetY.value = withDelay(
        320,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) })
      );
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerOffsetY.value }],
  }));

  const carouselStyle = useAnimatedStyle(() => ({
    opacity: carouselOpacity.value,
    transform: [{ translateY: carouselOffsetY.value }],
  }));

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 });
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const visible = viewableItems.filter(v => v.isViewable);
      if (visible.length > 0 && visible[0].index !== null) {
        const newIdx = visible[0].index;
        if (newIdx !== activeIndexRef.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          activeIndexRef.current = newIdx;
          _setActiveIndex(newIdx);
        }
      }
    }
  );

  const handleLongPress = useCallback(() => {
    const guide = GUIDES[activeIndexRef.current];
    if (!guide) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    analytics.guideSelected({
      guide_name: guide.name,
      guide_index: activeIndexRef.current,
    });
    onCommit(guide.name);
  }, [onCommit]);

  const activeGuide = GUIDES[activeIndex];

  return (
    <View style={styles.root}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AmbientBlob color="rgba(181, 100, 252, 0.10)" top={-80} left={-60} size={340} />
        <AmbientBlob color="rgba(184, 152, 122, 0.07)" top={400} left={20} size={300} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        <Animated.View style={[styles.header, headerStyle]}>
          <Animated.Text entering={FadeInDown.duration(600)} style={styles.title}>
            Who calls to your soul?
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(350).duration(600)} style={styles.subtitle}>
            You commit to your Guru for life. Take your time to choose.
          </Animated.Text>
        </Animated.View>

        <Animated.View style={[styles.carouselWrapper, carouselStyle]}>
          <FlatList
            data={GUIDES}
            keyExtractor={g => g.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            viewabilityConfig={viewabilityConfig.current}
            onViewableItemsChanged={onViewableItemsChanged.current}
            renderItem={({ item, index }) => (
              <View style={styles.cardSlot}>
                <CarouselCard
                  guide={item}
                  isActive={index === activeIndex}
                  onLongPress={handleLongPress}
                />
              </View>
            )}
          />

          <View style={styles.hintRow}>
            <Text style={styles.commitVerb} numberOfLines={1}>
              {activeGuide?.commitmentVerb}
            </Text>
            <Text style={styles.holdHint}>— hold to commit</Text>
          </View>
          <Text style={styles.permanentNote}>You cannot change this later</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
