import React from 'react';
import { Pressable, View } from 'react-native';
import { CheckCircle2, Circle, X } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SacredButton } from '@/components/ui/SacredButton';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/lib/theme-context';

interface ClearChatSheetProps {
  visible: boolean;
  clearHistory: boolean;
  onClose: () => void;
  onToggleClearHistory: () => void;
  onConfirm: () => void;
}

export function ClearChatSheet({
  visible,
  clearHistory,
  onClose,
  onToggleClearHistory,
  onConfirm,
}: ClearChatSheetProps) {
  const { colors } = useTheme();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      sheetStyle={{ borderTopLeftRadius: 34, borderTopRightRadius: 34 }}
      panEnabled
    >
      <View className="mb-5 flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="font-headline text-2xl tracking-[-0.3px] text-on-surface">
            Clear chat
          </Text>
          <Text className="font-body text-sm leading-[21px] text-on-surface-variant">
            Remove the visible conversation and choose whether past Ask memory should be wiped too.
          </Text>
        </View>
        <Pressable
          className="h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-low"
          onPress={onClose}
        >
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <Pressable
        onPress={onToggleClearHistory}
        className="mb-6 flex-row items-start gap-3 rounded-[18px] border border-black/[0.05] bg-surface-container-low px-4 py-4 dark:border-white/[0.06]"
      >
        {clearHistory ? (
          <CheckCircle2 size={20} color={colors.primary} />
        ) : (
          <Circle size={20} color={colors.onSurfaceVariant} />
        )}
        <View className="flex-1 gap-1">
          <Text className="font-body-medium text-sm text-on-surface">Clear history</Text>
          <Text className="font-body text-sm leading-5 text-on-surface-variant">
            When checked, Aksha also forgets the stored Ask history used as short-term context for future replies.
          </Text>
        </View>
      </Pressable>

      <SacredButton label="Clear chat" onPress={onConfirm} style={{ marginBottom: 12 }} />
      <Pressable className="items-center py-2.5" onPress={onClose}>
        <Text className="font-body text-sm text-on-surface-variant">Cancel</Text>
      </Pressable>
    </BottomSheet>
  );
}
