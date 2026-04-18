import React from 'react';
import {
  View,
  ScrollView,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { GlowCard } from '@/components/ui/GlowCard';
import { PageHero } from '@/components/ui/PageHero';
import { DailyArthCard } from '@/features/daily/DailyArthCard';
import { SacredDayCard } from '@/features/daily/SacredDayCard';
import { DailyAlignmentCard } from '@/features/horoscope/DailyAlignmentCard';
import { useDailyAlignment } from '@/features/horoscope/useDailyAlignment';
import { useCalendarEvents } from '@/features/daily/useCalendarEvents';
import { layout } from '@/lib/theme';

export default function HomeScreen() {
  const { chart, focusAreas, isLoading, error } = useDailyAlignment();
  const { events: todayEvents } = useCalendarEvents();

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 64, paddingBottom: 176, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <PageHero
          meta="Daily Alignment"
          title="Your Daily Alignment"
          subtitle="A grounded reading for the day ahead."
          style={{ paddingBottom: 40, paddingHorizontal: layout.screenPaddingX }}
        />

        {/* Glow Hero Quote Card */}
        <GlowCard style={{ alignSelf: 'stretch', maxWidth: 480, marginHorizontal: layout.screenPaddingX }}>
          <DailyArthCard />
        </GlowCard>

        {/* What's Special Today */}
        {todayEvents.length > 0 && (
          <View className="mt-[52px] self-stretch gap-5">
            <View className="gap-1.5" style={{ paddingHorizontal: layout.screenPaddingX }}>
              <Text className="font-label text-xs uppercase tracking-[3px] text-secondary-fixed">✦  Sacred Today</Text>
            </View>
            <View className="gap-2.5" style={{ paddingHorizontal: layout.screenPaddingX }}>
              {todayEvents.map((day) => (
                <SacredDayCard key={day.id} event={day} />
              ))}
            </View>
          </View>
        )}

        {/* Celestial Alignment */}
        <View className="mb-10 mt-16 max-w-[480px] self-stretch" style={{ paddingHorizontal: layout.screenPaddingX }}>
          <View className="mb-6 gap-2">
            <Text className="font-label text-xs uppercase tracking-[3px] text-secondary-fixed">Based on your horoscope</Text>
            <Text className="font-headline-extra text-[36px] leading-[42px] tracking-[-0.8px] text-on-surface">
              Where to place your energy
            </Text>
          </View>

          <DailyAlignmentCard
            chart={chart}
            focusAreas={focusAreas}
            isLoading={isLoading}
            error={error}
          />
        </View>
      </ScrollView>
    </View>
  );
}
