// app/sacred-day/[id].tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import { hapticLight } from '@/lib/haptics';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';
import { useCalendarEventById } from '@/features/daily/useCalendarEvents';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_CLEAR_HEIGHT = SCREEN_HEIGHT * 0.48;

const ACCENT_COLOR = '#e8a020';

export default function SacredDayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : null;
  const { event: day, isLoading, error } = useCalendarEventById(numericId);

  const { colors } = useTheme();
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator color={colors.onSurface} />
        </View>
      </SafeAreaView>
    );
  }

  if (!day || error) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a]">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="font-body text-base text-on-surface-variant">Sacred day not found.</Text>
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5 rounded-full bg-surface-container-low px-4 py-2.5">
            <ChevronLeft size={20} color={colors.onSurface} />
            <Text className="font-label text-sm text-on-surface">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const rituals = day.rituals ?? [];
  const tag = day.tag ?? 'Sacred Day';

  return (
    <View className="flex-1 bg-[#0a0a0a]">
      {/* Full-screen fixed background image */}
      {day.image_url ? (
        <Image
          source={{ uri: day.image_url }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 h-full w-full" style={{ backgroundColor: `${ACCENT_COLOR}22` }} />
      )}

      {/* Subtle dark overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.55)']}
        locations={[0, 0.45, 1]}
        className="absolute inset-0"
        pointerEvents="none"
      />

      {/* Back button */}
      <SafeAreaView
        edges={['top']}
        className="absolute left-0 right-0 top-0 z-10 pt-2"
        style={{ paddingHorizontal: layout.screenPaddingX }}
        pointerEvents="box-none"
      >
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[rgba(14,14,14,0.50)]"
          onPress={() => { hapticLight(); router.back(); }}
        >
          <ChevronLeft size={18} color="#fff" />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: IMAGE_CLEAR_HEIGHT }} />

        <BlurView
          intensity={55}
          tint="dark"
          className="overflow-hidden rounded-t-[28px] pb-[120px]"
          style={{ minHeight: SCREEN_HEIGHT * 0.6 }}
        >
          <View className="mx-8 mb-1.5 mt-2.5 h-px border-t" style={{ borderColor: `${ACCENT_COLOR}30` }} />

          <View className="gap-0 pt-5" style={{ paddingHorizontal: layout.screenPaddingX }}>
            {/* Tag */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(500)}
              className="mb-3.5 flex-row items-center self-start rounded-full border px-3 py-[5px]"
              style={{ backgroundColor: `${ACCENT_COLOR}22`, borderColor: `${ACCENT_COLOR}44` }}
            >
              <Sparkles size={11} color={ACCENT_COLOR} />
              <Text className="font-label text-xs uppercase tracking-[1.4px]" style={{ color: ACCENT_COLOR }}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </Text>
            </Animated.View>

            <Animated.Text entering={FadeInDown.delay(160).duration(500)} className="mb-2 font-headline-extra text-[34px] leading-10 tracking-[-0.8px] text-white">
              {day.title}
            </Animated.Text>
            {day.short_description ? (
              <Animated.Text entering={FadeInDown.delay(200).duration(500)} className="mb-7 font-body text-base leading-6 text-white/65">
                {day.short_description}
              </Animated.Text>
            ) : null}

            {/* Mantra block */}
            {day.mantra ? (
              <Animated.View
                entering={FadeInDown.delay(260).duration(500)}
                className="mb-8 items-center gap-2.5 overflow-hidden rounded-2xl border p-5"
                style={{ borderColor: `${ACCENT_COLOR}30` }}
              >
                <LinearGradient
                  colors={[`${ACCENT_COLOR}18`, `${ACCENT_COLOR}08`]}
                  className="absolute inset-0"
                />
                <Text className="text-center font-headline text-2xl tracking-[1px] text-white">{day.mantra}</Text>
              </Animated.View>
            ) : null}

            {/* Significance */}
            {day.significance ? (
              <Animated.View entering={FadeInDown.delay(320).duration(500)} className="mb-7 gap-3">
                <Text className="font-label text-[11px] uppercase tracking-[2.5px] text-secondary-fixed">Significance</Text>
                <Text className="font-body text-base leading-6 text-white/60">{day.significance}</Text>
              </Animated.View>
            ) : null}

            {/* Rituals */}
            {rituals.length > 0 ? (
              <Animated.View entering={FadeInDown.delay(380).duration(500)} className="mb-7 gap-3">
                <Text className="font-label text-[11px] uppercase tracking-[2.5px] text-secondary-fixed">How to Observe</Text>
                <View className="gap-3">
                  {rituals.map((step, i) => (
                    <View key={i} className="flex-row items-start gap-3">
                      <View className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT_COLOR }} />
                      <Text className="flex-1 font-body text-sm leading-[22px] text-white/60">{step}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            ) : null}

            {/* Tag chip */}
            <Animated.View entering={FadeInDown.delay(440).duration(500)} className="mt-1 flex-row flex-wrap gap-2">
              <View className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1.5">
                <Text className="font-label text-[11px] tracking-[0.3px] text-white/55">{tag}</Text>
              </View>
            </Animated.View>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}
