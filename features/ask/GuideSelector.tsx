// features/ask/GuideSelector.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
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
      <Animated.View
        className="items-center justify-end gap-3 overflow-hidden rounded-[28px] border border-outline-variant/25 bg-black/70 px-7 py-12"
        style={[{ height: SH * 0.48 }, cardStyle]}
      >
        <Image
          source={{ uri: guide.imageUrl }}
          className="absolute inset-0 rounded-[28px]"
          resizeMode="cover"
        />
        <View className="absolute inset-0 rounded-[28px] bg-black/[0.52]" />
        <Animated.View
          className="absolute inset-0 rounded-[28px] border-[1.5px] border-secondary-fixed-dim/30 bg-on-secondary/[0.05]"
          style={glowStyle}
        />

        <Text className="text-center font-headline text-[28px] text-white">{guide.name}</Text>
        <Text className="text-center font-body text-sm leading-[21px] text-white/75">{guide.essence}</Text>
      </Animated.View>
    </Pressable>
  );
}

export function GuideSelector({ onCommit }: GuideSelectorProps) {
  const [activeIndex, _setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
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
    <View className="flex-1 bg-surface pt-10">
      <View pointerEvents="none" className="absolute inset-0">
        <AmbientBlob color="rgba(181, 100, 252, 0.10)" top={-80} left={-60} size={340} />
        <AmbientBlob color="rgba(184, 152, 122, 0.07)" top={400} left={20} size={300} />
      </View>

      <SafeAreaView edges={['top', 'bottom']} className="flex-1">
        <Animated.View className="items-center px-8 pb-7 pt-5" style={headerStyle}>
          <Animated.Text
            entering={FadeInDown.duration(600)}
            className="mb-3 text-center font-headline-extra text-[36px] leading-[44px] tracking-[-0.8px] text-on-surface"
          >
            Who calls to your soul?
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(350).duration(600)}
            className="text-center font-body text-base tracking-[0.3px] text-on-surface-variant"
          >
            You commit to your Guru for life. Take your time to choose.
          </Animated.Text>
        </Animated.View>

        <Animated.View className="flex-1 justify-center pb-3" style={carouselStyle}>
          <FlatList
            data={GUIDES}
            keyExtractor={g => g.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: CONTENT_PADDING }}
            viewabilityConfig={viewabilityConfig.current}
            onViewableItemsChanged={onViewableItemsChanged.current}
            renderItem={({ item, index }) => (
              <View style={{ width: CARD_W, marginHorizontal: CARD_GAP / 2 }}>
                <CarouselCard
                  guide={item}
                  isActive={index === activeIndex}
                  onLongPress={handleLongPress}
                />
              </View>
            )}
          />

          <View className="mb-2 mt-1 flex-row items-center justify-center gap-1.5 px-8">
            <Text className="font-label text-sm text-primary" numberOfLines={1}>
              {activeGuide?.commitmentVerb}
            </Text>
            <Text className="font-body text-sm text-on-surface-variant">— hold to commit</Text>
          </View>
          <Text className="mb-2 mt-2 text-center font-body text-[11px] text-outline">You cannot change this later</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
