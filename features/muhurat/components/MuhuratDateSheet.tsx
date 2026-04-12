import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';

interface MuhuratDateSheetProps {
  visible: boolean;
  title: string;
  value: Date;
  minimumDate?: Date;
  onChange: (value: Date) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function MuhuratDateSheet({
  visible,
  title,
  value,
  minimumDate,
  onChange,
  onClose,
  onConfirm,
}: MuhuratDateSheetProps) {
  const styles = useThemedStyles((c) =>
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
      picker: {
        alignSelf: 'stretch',
      },
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
        <Text style={styles.title}>{title}</Text>
        <Pressable onPress={onConfirm}>
          <Text style={styles.action}>Done</Text>
        </Pressable>
      </View>

      <DateTimePicker
        mode="date"
        display="spinner"
        value={value}
        minimumDate={minimumDate}
        onChange={(_, nextValue) => {
          if (nextValue) onChange(nextValue);
        }}
        style={styles.picker}
      />
    </BottomSheet>
  );
}
