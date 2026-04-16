import React from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheet } from '@/components/ui/BottomSheet';

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
        <Text className="font-headline text-lg tracking-[-0.2px] text-on-surface">{title}</Text>
        <Pressable onPress={onConfirm}>
          <Text className="font-label text-sm text-primary-fixed">Done</Text>
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
        style={{ alignSelf: 'stretch' }}
      />
    </BottomSheet>
  );
}
