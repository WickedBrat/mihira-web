import React from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheet } from '@/components/ui/BottomSheet';

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
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      panEnabled={false}
      sheetStyle={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
      contentStyle={{ paddingBottom: 18 }}
    >
      <View className="mb-3.5 flex-row items-center justify-between">
        <Pressable onPress={onClose}>
          <Text className="font-label text-sm text-primary-fixed">Cancel</Text>
        </Pressable>
        <Text className="font-headline text-lg tracking-[-0.2px] text-on-surface">Birth Details</Text>
        <Pressable onPress={onConfirm}>
          <Text className="font-label text-sm text-primary-fixed">Done</Text>
        </Pressable>
      </View>

      <View className="gap-2.5">
        <Text className="font-label text-xs uppercase tracking-[1.8px] text-on-surface-variant">Date</Text>
        <DateTimePicker
          mode="date"
          display="spinner"
          value={value}
          onChange={(_, nextValue) => {
            if (nextValue) onChangeDate(nextValue);
          }}
          style={{ alignSelf: 'stretch' }}
        />
      </View>

      <View className="my-3 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

      <View className="gap-2.5">
        <Text className="font-label text-xs uppercase tracking-[1.8px] text-on-surface-variant">Time</Text>
        <DateTimePicker
          mode="time"
          display="spinner"
          value={value}
          onChange={(_, nextValue) => {
            if (nextValue) onChangeTime(nextValue);
          }}
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    </BottomSheet>
  );
}
