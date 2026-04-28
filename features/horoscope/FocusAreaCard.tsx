import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  View,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import { AlarmClockPlus } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/components/ui/ToastProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { VedicReasoningAccordion } from './VedicReasoningAccordion';
import { useTheme } from '@/lib/theme-context';
import type { DailyFocusArea } from '@/lib/dailyAlignmentTypes';

const BASE = 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/aksha/daily-prediction';
const img = (filename: string) => ({ uri: `${BASE}/${filename}.jpg` });

const IMAGES: Record<string, { uri: string }> = {
  // Ambition / Career
  Ambition:               img('ambition'),
  Work:                   img('ambition'),
  Career:                 img('ambition'),
  'Public presence':      img('public-presence'),
  'Public Presence':      img('public-presence'),
  Networking:             img('networking'),
  Community:              img('community'),

  // Mind / Knowledge
  Knowledge:              img('knowledge'),
  Learning:               img('knowledge'),
  Reading:                img('reading'),
  Writing:                img('writing'),
  Speaking:               img('speaking'),
  'Problem solving':      img('problem-solving'),
  'Problem Solving':      img('problem-solving'),
  Focus:                  img('focus'),

  // Decisions / Finance
  Decisions:              img('decision'),
  Decision:               img('decision'),
  'Material decisions':   img('material-decision'),
  'Material Decisions':   img('material-decision'),
  Financial:              img('financial'),
  Money:                  img('money'),
  Negotiations:           img('negotiations'),
  Correspondence:         img('correspondence'),

  // Relationships
  Romance:                img('romance'),
  Partnership:            img('romance'),
  'Social bonds':         img('social-bonds'),
  'Social Bonds':         img('social-bonds'),

  // Family / Home
  Home:                   img('domestic'),
  'Domestic matters':     img('domestic'),
  'Domestic Matters':     img('domestic'),
  Domestic:               img('domestic'),
  Lineage:                img('lineage'),

  // Self-care / Wellness
  Rest:                   img('rest'),
  Health:                 img('health'),
  Body:                   img('body'),
  Routines:               img('routine'),
  Routine:                img('routine'),
  Exercise:               img('exercise'),
  Healing:                img('healing'),
  'Physical vitality':    img('physical-vitality'),
  'Physical Vitality':    img('physical-vitality'),
  Movement:               img('movement'),
  Meditation:             img('meditation'),

  // Creativity / Spirit
  Art:                    img('art'),
  Making:                 img('making'),
  Ritual:                 img('ritual'),
};

const FALLBACK = img('focus');

interface Props {
  focusArea: DailyFocusArea;
  isLast?: boolean;
}

export function FocusAreaCard({ focusArea, isLast = false }: Props) {
  const image = IMAGES[focusArea.area] ?? FALLBACK;
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [isAddingReminder, setIsAddingReminder] = useState(false);

  const handleSetReminder = async () => {
    if (isAddingReminder) return;

    setIsAddingReminder(true);
    try {
      const { startDate, endDate } = getFocusAreaWindow(focusArea.timeRange);
      const title = focusArea.action;
      const notes = buildReminderNotes(focusArea);

      if (Platform.OS === 'ios') {
        const permission = await Calendar.requestRemindersPermissionsAsync();
        if (!permission.granted) {
          showToast({
            type: 'error',
            title: 'Reminders access needed',
            message: 'Allow reminder access to save this focus task.',
          });
          return;
        }

        await Calendar.createReminderAsync(null, {
          title,
          notes,
          dueDate: startDate,
          startDate,
          allDay: false,
          completed: false,
          alarms: isFutureDate(startDate) ? [{ absoluteDate: startDate.toISOString() }] : [],
        });

        await Linking.openURL('x-apple-reminderkit://');
        showToast({
          type: 'success',
          title: 'Reminder added',
          message: 'Your focus task was added to Reminders.',
        });
        return;
      }

      await Calendar.createEventInCalendarAsync({
        title,
        notes,
        startDate,
        endDate,
        alarms: [{ relativeOffset: -15 }],
      });
    } catch (error) {
      console.error('[focus-area] reminder error', error);
      showToast({
        type: 'error',
        title: 'Could not open reminder',
        message: 'Please try again from this focus card.',
      });
    } finally {
      setIsAddingReminder(false);
    }
  };

  return (
    <View>
      <ImageBackground
        source={image}
        className="h-[140px] self-stretch overflow-hidden rounded-3xl"
        imageStyle={{ borderRadius: 24 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.5)']}
          style={styles.imageOverlay}
        >
          <View style={styles.imageTextBlock}>
            <Text className="text-right font-headline-extra text-3xl tracking-[-0.3px] text-white">{focusArea.area}</Text>
            <Text className="mt-0.5 text-right font-body text-sm text-white/55">{focusArea.timeRange}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View className="mt-2.5 gap-2.5 self-stretch rounded-[20px] border border-black/[0.06] bg-[rgba(232,225,212,0.6)] p-5 dark:border-white/[0.05] dark:bg-[rgba(37,38,38,0.6)]">
        <View className="flex-row items-start gap-3">
          <Text className="flex-1 font-body text-xl leading-[27px] tracking-[-0.3px] text-white">{focusArea.action}</Text>
          <Pressable
            onPress={() => {
              void handleSetReminder();
            }}
            disabled={isAddingReminder}
            accessibilityRole="button"
            accessibilityLabel={`Set reminder for ${focusArea.area}`}
            accessibilityHint="Creates a reminder with this focus task and opens your reminder app."
            className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] active:bg-white/[0.14]"
          >
            {isAddingReminder ? (
              <ActivityIndicator size="small" color={colors.secondaryFixed} />
            ) : (
              <AlarmClockPlus size={18} color={colors.secondaryFixed} strokeWidth={1.8} />
            )}
          </Pressable>
        </View>
        <Text className="font-body text-base leading-[23px] text-white/65">{focusArea.suggestion}</Text>
        <VedicReasoningAccordion reasoning={focusArea.reasoning} />
      </View>

      {!isLast && (
        <View className="h-9 items-center gap-1 py-1">
          <View className="w-[1.5px] flex-1 bg-black/10 dark:bg-white/10" />
          <View className="h-[5px] w-[5px] rounded-full bg-black/15 dark:bg-white/20" />
          <View className="w-[1.5px] flex-1 bg-black/10 dark:bg-white/10" />
        </View>
      )}
    </View>
  );
}

function buildReminderNotes(focusArea: DailyFocusArea) {
  return [
    `Focus area: ${focusArea.area}`,
    `Best window: ${focusArea.timeRange}`,
    '',
    focusArea.suggestion,
    '',
    `Jyotish reasoning: ${focusArea.reasoning}`,
  ].join('\n');
}

function getFocusAreaWindow(timeRange: string) {
  const fallbackStart = new Date();
  fallbackStart.setMinutes(fallbackStart.getMinutes() + 15, 0, 0);
  const fallbackEnd = new Date(fallbackStart);
  fallbackEnd.setMinutes(fallbackEnd.getMinutes() + 30);

  const matches = [...timeRange.matchAll(/(\d{1,2})(?::(\d{2}))?\s*([AaPp]\.?[Mm]\.?)?/g)];
  const startMatch = matches[0];
  if (!startMatch) return { startDate: fallbackStart, endDate: fallbackEnd };

  const endMatch = matches[1];
  const inferredStartMeridiem = inferStartMeridiem(startMatch, endMatch);
  const startDate = buildTodayDate(startMatch, inferredStartMeridiem);
  const endDate = endMatch
    ? buildTodayDate(endMatch, normalizeMeridiem(endMatch[3]) ?? inferredStartMeridiem)
    : new Date(startDate);

  if (endDate.getTime() <= startDate.getTime()) {
    endDate.setMinutes(startDate.getMinutes() + 30);
  }

  return { startDate, endDate };
}

function inferStartMeridiem(
  startMatch: RegExpMatchArray,
  endMatch: RegExpMatchArray | undefined,
) {
  const startMeridiem = normalizeMeridiem(startMatch[3]);
  if (startMeridiem) return startMeridiem;

  const endMeridiem = normalizeMeridiem(endMatch?.[3]);
  if (!endMeridiem) return undefined;

  const startHour = Number(startMatch[1]);
  const endHour = Number(endMatch?.[1]);
  if (endMeridiem === 'PM' && startHour > endHour) return 'AM';
  return endMeridiem;
}

function normalizeMeridiem(value: string | undefined) {
  if (!value) return undefined;
  return value.toUpperCase().replace(/\./g, '') === 'PM' ? 'PM' : 'AM';
}

function buildTodayDate(match: RegExpMatchArray, meridiem: 'AM' | 'PM' | undefined) {
  const date = new Date();
  const hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  date.setHours(toTwentyFourHour(hour, meridiem), minute, 0, 0);
  return date;
}

function toTwentyFourHour(hour: number, meridiem: 'AM' | 'PM' | undefined) {
  if (!meridiem) return hour;
  if (meridiem === 'AM') return hour === 12 ? 0 : hour;
  return hour === 12 ? 12 : hour + 12;
}

function isFutureDate(date: Date) {
  return date.getTime() > Date.now();
}

const styles = StyleSheet.create({
  imageOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  imageTextBlock: {
    alignItems: 'flex-end',
  },
});
