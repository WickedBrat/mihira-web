// app/(tabs)/muhurat.tsx
import React, { useMemo, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
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
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { useToast } from '@/components/ui/ToastProvider';
import { PageHero } from '@/components/ui/PageHero';
import { fonts, layout } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
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
  const { isPro, isLoaded: isSubscriptionLoaded, openCheckout } = useSubscription();
  const { isAtLimit, isNearLimit, isLoaded: isUsageLoaded, increment } = useUsage('muhurat');
  const [paywallMode, setPaywallMode] = useState<'warning' | 'blocked' | null>(null);
  const pendingQueryRef = useRef<(() => void) | null>(null);
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [request, setRequest] = useState<MuhuratRequest | null>(null);
  const [activeDateField, setActiveDateField] = useState<DateField>('start');
  const [isIosDateSheetOpen, setIsIosDateSheetOpen] = useState(false);
  const [iosPickerValue, setIosPickerValue] = useState(today);
  const { rankedWindows, recommendation, confidence, suggestion, reasoning, warnings, festivalNote, isLoading, error } = useMuhurat(request);

  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
      scroll: { flex: 1 },
      content: { paddingTop: 64, paddingHorizontal: layout.screenPaddingX, paddingBottom: 176, gap: 24 },
      banner: { paddingBottom: 24 },
      title: {
        fontSize: scaleFont(38),
        lineHeight: scaleFont(44),
      },
      sub: { lineHeight: scaleFont(22) },
      formCard: {
        padding: 24,
        borderRadius: 24,
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.62)' : 'rgba(232, 225, 212, 0.62)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        gap: 16,
      },
      inputHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      },
      inputMeta: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.secondaryFixed,
      },
      textArea: {
        minHeight: 126,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}40`,
        backgroundColor: dark ? 'rgba(14, 14, 14, 0.45)' : 'rgba(240, 234, 222, 0.55)',
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurface,
        lineHeight: scaleFont(22),
      },
      rangeLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(10),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.onSurfaceVariant,
      },
      dateRow: {
        flexDirection: 'row',
        gap: 14,
      },
      dateField: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}40`,
        backgroundColor: dark ? 'rgba(14, 14, 14, 0.45)' : 'rgba(240, 234, 222, 0.55)',
        paddingHorizontal: 10,
        paddingVertical: 14,
      },
      dateCopy: {
        flex: 1,
        gap: 3,
      },
      dateCaption: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: c.onSurfaceVariant,
      },
      dateValue: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(14),
        color: c.onSurface,
      },
      cta: {
        marginTop: 4,
      },
    })
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
    increment();
    setRequest({
      eventDescription: trimmedEvent,
      startDate: toApiDate(startDate),
      endDate: toApiDate(endDate),
    });
  };

  const handleFindMuhurat = () => {
    const trimmedEvent = eventDescription.trim();

    if (!trimmedEvent) {
      showToast({
        type: 'error',
        title: 'Describe your event',
        message: 'Add the situation or issue you want guidance for.',
      });
      return;
    }

    if (isPro) {
      runQuery();
      return;
    }

    if (isAtLimit) {
      analytics.paywallShown({ feature: 'muhurat', mode: 'blocked' });
      setPaywallMode('blocked');
      return;
    }

    if (isNearLimit) {
      analytics.paywallShown({ feature: 'muhurat', mode: 'warning' });
      pendingQueryRef.current = runQuery;
      setPaywallMode('warning');
      return;
    }

    runQuery();
  };

  return (
    <View style={styles.root}>
      <PageAmbientBlobs />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageHero
          meta="Auspicious Timing"
          title="Muhurat Finder"
          subtitle="Describe your situation and scan a chosen date range for auspicious windows."
          style={styles.banner}
          titleStyle={styles.title}
          subtitleStyle={styles.sub}
          subtitleMaxWidth={360}
        />

        <View style={styles.formCard}>
          <View style={styles.inputHeader}>
            <Sparkles size={16} color={colors.secondaryFixed} />
            <Text style={styles.inputMeta}>Your Intention</Text>
          </View>

          <TextInput
            value={eventDescription}
            onChangeText={setEventDescription}
            placeholder="Describe your issue or event. For example: I want to schedule a difficult financial conversation with my co-founder."
            placeholderTextColor={colors.outline}
            multiline
            textAlignVertical="top"
            selectionColor={colors.primary}
            style={styles.textArea}
          />

          <Text style={styles.rangeLabel}>Date Range</Text>
          <View style={styles.dateRow}>
            <Pressable
              onPress={() => openDatePicker('start')}
              style={styles.dateField}
            >
              <CalendarDays size={16} color={colors.secondaryFixed} />
              <View style={styles.dateCopy}>
                <Text style={styles.dateCaption}>Start</Text>
                <Text style={styles.dateValue}>{formatDateLabel(startDate)}</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => openDatePicker('end')}
              style={styles.dateField}
            >
              <CalendarDays size={16} color={colors.secondaryFixed} />
              <View style={styles.dateCopy}>
                <Text style={styles.dateCaption}>End</Text>
                <Text style={styles.dateValue}>{formatDateLabel(endDate)}</Text>
              </View>
            </Pressable>
          </View>

          <SacredButton
            label="Find Auspicious Windows"
            onPress={(!isSubscriptionLoaded || !isUsageLoaded) ? () => {} : handleFindMuhurat}
            style={styles.cta}
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
        mode={paywallMode ?? 'warning'}
        onClose={() => {
          analytics.paywallDismissed({ feature: 'muhurat', mode: paywallMode ?? 'warning' });
          setPaywallMode(null);
          pendingQueryRef.current = null;
        }}
        onUpgrade={() => {
          analytics.paywallUpgradeTapped({ feature: 'muhurat' });
          setPaywallMode(null);
          openCheckout();
        }}
        onProceed={() => {
          analytics.paywallProceedTapped({ feature: 'muhurat' });
          const fn = pendingQueryRef.current;
          pendingQueryRef.current = null;
          setPaywallMode(null);
          fn?.();
        }}
      />
    </View>
  );
}
