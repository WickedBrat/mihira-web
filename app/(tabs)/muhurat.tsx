// app/(tabs)/muhurat.tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CalendarDays, Sparkles } from 'lucide-react-native';
import { MuhuratCard } from '@/features/muhurat/MuhuratCard';
import { MuhuratDateSheet } from '@/features/muhurat/components/MuhuratDateSheet';
import { useMuhurat, type MuhuratRequest } from '@/features/muhurat/useMuhurat';
import { SacredButton } from '@/components/ui/SacredButton';
import { useToast } from '@/components/ui/ToastProvider';
import { PageHero } from '@/components/ui/PageHero';
import { useFocusEffect } from 'expo-router';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';
import { useUsage } from '@/lib/usage';
import { useSubscription } from '@/lib/subscription';
import { PaywallSheet } from '@/features/billing/PaywallSheet';
import { analytics } from '@/lib/analytics';

type DateField = 'start' | 'end';

function normalizeDate(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0, 0);
}

function formatDateLabel(value: Date) {
  return value.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function toApiDate(value: Date) {
  return normalizeDate(value).toISOString();
}

export default function MuhuratScreen() {
  const today = useMemo(() => normalizeDate(new Date()), []);
  const defaultEndDate = useMemo(() => {
    const next = new Date(today);
    next.setDate(next.getDate() + 6);
    return normalizeDate(next);
  }, [today]);
  const { showToast } = useToast();
  const { isPlus, isLoaded: isSubscriptionLoaded, openCheckout, refreshSubscription } = useSubscription();
  const { isAtLimit, isLoaded: isUsageLoaded, increment } = useUsage('muhurat');
  const [paywallMode, setPaywallMode] = useState<'blocked' | null>(null);
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [request, setRequest] = useState<MuhuratRequest | null>(null);
  const [activeDateField, setActiveDateField] = useState<DateField>('start');
  const [isIosDateSheetOpen, setIsIosDateSheetOpen] = useState(false);
  const [iosPickerValue, setIosPickerValue] = useState(today);
  const { rankedWindows, recommendation, confidence, suggestion, reasoning, warnings, festivalNote, isLoading, error } = useMuhurat(request);

  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      void refreshSubscription();
    }, [refreshSubscription])
  );

  const applyDateSelection = (field: DateField, nextValue: Date) => {
    const normalized = normalizeDate(nextValue);

    if (field === 'start') {
      setStartDate(normalized);
      if (normalized.getTime() > endDate.getTime()) {
        setEndDate(normalized);
      }
      return;
    }

    setEndDate(normalized);
    if (normalized.getTime() < startDate.getTime()) {
      setStartDate(normalized);
    }
  };

  const openDatePicker = (field: DateField) => {
    Keyboard.dismiss();
    const currentValue = field === 'start' ? startDate : endDate;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentValue,
        mode: 'date',
        minimumDate: today,
        onChange: (event, pickedDate) => {
          if (event.type !== 'set' || !pickedDate) return;
          applyDateSelection(field, pickedDate);
        },
      });
      return;
    }

    setActiveDateField(field);
    setIosPickerValue(currentValue);
    setIsIosDateSheetOpen(true);
  };

  const runQuery = () => {
    const trimmedEvent = eventDescription.trim();
    if (!trimmedEvent) return;
    const dateRangeDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    analytics.muhuratQueried({ event_description_length: trimmedEvent.length, date_range_days: dateRangeDays });
    setRequest({
      eventDescription: trimmedEvent,
      startDate: toApiDate(startDate),
      endDate: toApiDate(endDate),
    });
  };

  const handleFindMuhurat = async () => {
    const trimmedEvent = eventDescription.trim();

    if (!trimmedEvent) {
      showToast({
        type: 'error',
        title: 'Describe the event',
        message: 'Tell Mihira what you’re trying to time.',
      });
      return;
    }

    if (!isPlus) {
      if (isAtLimit) {
        analytics.paywallShown({ feature: 'muhurat', mode: 'blocked' });
        setPaywallMode('blocked');
        return;
      }

      await increment();
    }

    runQuery();
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 64,
          paddingHorizontal: layout.screenPaddingX,
          paddingBottom: 176,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <PageHero
          meta="Auspicious Timing"
          title="Sacred Timing"
          subtitle="Describe what you’re planning and scan a date range for the most supportive windows."
          style={{ paddingBottom: 24 }}
          titleStyle={{ fontSize: 38, lineHeight: 44 }}
          subtitleStyle={{ lineHeight: 22 }}
          subtitleMaxWidth={360}
        />

        <View className="gap-4 rounded-3xl border border-black/[0.05] bg-[rgba(232,225,212,0.62)] p-6 dark:border-white/[0.05] dark:bg-[rgba(37,38,38,0.62)]">
          <View className="flex-row items-center gap-2">
            <Sparkles size={16} color={colors.secondaryFixed} />
            <Text className="font-label text-xs uppercase tracking-[2px] text-secondary-fixed">Your Intention</Text>
          </View>

          <TextInput
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholder="Describe the event or decision you want help timing. Example: I need the best window for a difficult conversation with my co-founder."
            placeholderTextColor={colors.outline}
            multiline
            textAlignVertical="top"
            selectionColor={colors.primary}
            className="min-h-[126px] rounded-[18px] border border-outline-variant/25 bg-[rgba(240,234,222,0.55)] px-5 py-4 font-body text-base leading-[22px] text-on-surface dark:bg-[rgba(14,14,14,0.45)]"
          />

          <Text className="font-label text-xs uppercase tracking-[2px] text-on-surface-variant">Date Range</Text>
          <View className="flex-row gap-3.5">
            <Pressable
              onPress={() => openDatePicker('start')}
              className="flex-1 flex-row items-start gap-2.5 rounded-[18px] border border-outline-variant/25 bg-[rgba(240,234,222,0.55)] px-2.5 py-3.5 dark:bg-[rgba(14,14,14,0.45)]"
            >
              <CalendarDays size={16} color={colors.secondaryFixed} />
              <View className="flex-1 gap-[3px]">
                <Text className="font-label text-[9px] uppercase tracking-[1.5px] text-on-surface-variant">Start</Text>
                <Text className="font-body-medium text-sm text-on-surface">{formatDateLabel(startDate)}</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => openDatePicker('end')}
              className="flex-1 flex-row items-start gap-2.5 rounded-[18px] border border-outline-variant/25 bg-[rgba(240,234,222,0.55)] px-2.5 py-3.5 dark:bg-[rgba(14,14,14,0.45)]"
            >
              <CalendarDays size={16} color={colors.secondaryFixed} />
              <View className="flex-1 gap-[3px]">
                <Text className="font-label text-[9px] uppercase tracking-[1.5px] text-on-surface-variant">End</Text>
                <Text className="font-body-medium text-sm text-on-surface">{formatDateLabel(endDate)}</Text>
              </View>
            </Pressable>
          </View>

          <SacredButton
            label="Find Best Windows"
            onPress={
              (!isSubscriptionLoaded || !isUsageLoaded)
                ? () => {}
                : () => {
                    void handleFindMuhurat();
                  }
            }
            fullWidth
            style={{ marginTop: 4 }}
          />
        </View>

        <MuhuratCard
          hasRequested={Boolean(request)}
          recommendation={recommendation}
          confidence={confidence}
          suggestion={suggestion}
          reasoning={reasoning}
          warnings={warnings}
          festivalNote={festivalNote}
          rankedWindows={rankedWindows}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>

      <MuhuratDateSheet
        visible={isIosDateSheetOpen}
        title={activeDateField === 'start' ? 'Start Date' : 'End Date'}
        value={iosPickerValue}
        minimumDate={today}
        onChange={setIosPickerValue}
        onClose={() => setIsIosDateSheetOpen(false)}
        onConfirm={() => {
          applyDateSelection(activeDateField, iosPickerValue);
          setIsIosDateSheetOpen(false);
        }}
      />

      <PaywallSheet
        visible={paywallMode !== null}
        feature="muhurat"
        mode="blocked"
        onClose={() => {
          analytics.paywallDismissed({ feature: 'muhurat', mode: 'blocked' });
          setPaywallMode(null);
        }}
        onUpgrade={() => {
          analytics.paywallUpgradeTapped({ feature: 'muhurat' });
          setPaywallMode(null);
          openCheckout();
        }}
      />
    </View>
  );
}
