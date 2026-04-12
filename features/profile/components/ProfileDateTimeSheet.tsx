import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';

interface ProfileDateTimeSheetProps {
  visible: boolean;
  value: Date;
  onChangeDate: (value: Date) => void;
  onChangeTime: (value: Date) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProfileDateTimeSheet({
  visible,
  value,
  onChangeDate,
  onChangeTime,
  onClose,
  onConfirm,
}: ProfileDateTimeSheetProps) {
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      sheet: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      },
      content: {
        paddingBottom: 18,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
      },
      title: {
        fontFamily: fonts.headline,
        fontSize: 17,
        color: c.onSurface,
        letterSpacing: -0.2,
      },
      action: {
        fontFamily: fonts.label,
        fontSize: 13,
        color: c.primaryFixed,
      },
      section: {
        gap: 10,
      },
      label: {
        fontFamily: fonts.label,
        fontSize: 10,
        letterSpacing: 1.8,
        textTransform: 'uppercase',
        color: c.onSurfaceVariant,
      },
      divider: {
        height: 1,
        backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        marginVertical: 12,
      },
      picker: { alignSelf: 'stretch' },
    })
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      panEnabled={false}
      sheetStyle={styles.sheet}
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <Pressable onPress={onClose}>
          <Text style={styles.action}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Birth Details</Text>
        <Pressable onPress={onConfirm}>
          <Text style={styles.action}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <DateTimePicker
          mode="date"
          display="spinner"
          value={value}
          onChange={(_, nextValue) => {
            if (nextValue) onChangeDate(nextValue);
          }}
          style={styles.picker}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.label}>Time</Text>
        <DateTimePicker
          mode="time"
          display="spinner"
          value={value}
          onChange={(_, nextValue) => {
            if (nextValue) onChangeTime(nextValue);
          }}
          style={styles.picker}
        />
      </View>
    </BottomSheet>
  );
}
