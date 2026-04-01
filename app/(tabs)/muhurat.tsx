// app/(tabs)/muhurat.tsx
import React, { useMemo, useState } from 'react';
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
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { MuhuratCard } from '@/features/muhurat/MuhuratCard';
import { MuhuratDateSheet } from '@/features/muhurat/components/MuhuratDateSheet';
import { useMuhurat, type MuhuratRequest } from '@/features/muhurat/useMuhurat';
import { SacredButton } from '@/components/ui/SacredButton';
import { useToast } from '@/components/ui/ToastProvider';
import { colors, fonts } from '@/lib/theme';

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
  const [eventDescription, setEventDescription] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [request, setRequest] = useState<MuhuratRequest | null>(null);
  const [activeDateField, setActiveDateField] = useState<DateField>('start');
  const [isIosDateSheetOpen, setIsIosDateSheetOpen] = useState(false);
  const [iosPickerValue, setIosPickerValue] = useState(today);
  const { windows, recommendation, suggestion, reasoning, isLoading, error } = useMuhurat(request);

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

    const rangeDays = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
    if (rangeDays > 14) {
      showToast({
        type: 'error',
        title: 'Date range too large',
        message: 'Choose a span of 14 days or fewer.',
      });
      return;
    }

    setRequest({
      eventDescription: trimmedEvent,
      startDate: toApiDate(startDate),
      endDate: toApiDate(endDate),
    });
  };

  return (
    <View style={styles.root}>
      <AmbientBlob color="rgba(255,159,75,0.06)" top={-40} left={180} size={280} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Text style={styles.meta}>Auspicious Timing</Text>
          <Text style={styles.title}>Muhurat Finder</Text>
          <Text style={styles.sub}>
            Describe your situation and scan a chosen date range for auspicious windows.
          </Text>
        </View>

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

          <SacredButton label="Find Auspicious Windows" onPress={handleFindMuhurat} style={styles.cta} />
        </View>

        <MuhuratCard
          hasRequested={Boolean(request)}
          recommendation={recommendation}
          suggestion={suggestion}
          reasoning={reasoning}
          windows={windows}
          isLoading={isLoading}
          error={error}
        />
      </ScrollView>

      <MuhuratDateSheet
        visible={isIosDateSheetOpen}
        title={activeDateField === 'start' ? 'Start Date' : 'End Date'}
        value={iosPickerValue}
        onChange={setIosPickerValue}
        onClose={() => setIsIosDateSheetOpen(false)}
        onConfirm={() => {
          applyDateSelection(activeDateField, iosPickerValue);
          setIsIosDateSheetOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingTop: 100, paddingHorizontal: 24, paddingBottom: 160, gap: 20 },
  banner: { gap: 8 },
  meta: {
    fontFamily: fonts.label, fontSize: 10, textTransform: 'uppercase',
    letterSpacing: 3, color: colors.secondaryFixed,
  },
  title: {
    fontFamily: fonts.headlineExtra, fontSize: 36,
    color: colors.onSurface, letterSpacing: -0.5, lineHeight: 42,
  },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.onSurfaceVariant, lineHeight: 22 },
  formCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(37, 38, 38, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 14,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputMeta: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.secondaryFixed,
  },
  textArea: {
    minHeight: 118,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}40`,
    backgroundColor: 'rgba(14, 14, 14, 0.45)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurface,
    lineHeight: 22,
  },
  rangeLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}40`,
    backgroundColor: 'rgba(14, 14, 14, 0.45)',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dateCopy: {
    flex: 1,
    gap: 3,
  },
  dateCaption: {
    fontFamily: fonts.label,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.onSurfaceVariant,
  },
  dateValue: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.onSurface,
  },
  cta: {
    marginTop: 4,
  },
});
