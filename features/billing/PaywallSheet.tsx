// features/billing/PaywallSheet.tsx
import React from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { Zap, X } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SacredButton } from '@/components/ui/SacredButton';
import { useTheme } from '@/lib/theme-context';
import type { Feature } from '@/lib/usage';
import { LIMITS } from '@/lib/usage';

interface PaywallSheetProps {
  visible: boolean;
  feature: Feature;
  /** Warning = 1 remaining (non-blocking). Blocked = limit reached (blocking). */
  mode: 'warning' | 'blocked';
  onClose: () => void;
  onUpgrade: () => void;
  /** Called only in warning mode — user dismisses and proceeds */
  onProceed?: () => void;
}

const FEATURE_LABEL: Record<Feature, string> = {
  muhurat: 'Muhurat query',
  ask: 'Ask conversation',
};

const FEATURE_LABEL_PLURAL: Record<Feature, string> = {
  muhurat: 'Muhurat queries',
  ask: 'Ask conversations',
};

export function PaywallSheet({
  visible,
  feature,
  mode,
  onClose,
  onUpgrade,
  onProceed,
}: PaywallSheetProps) {
  const limit = LIMITS[feature];
  const label = FEATURE_LABEL[feature];
  const labelPlural = FEATURE_LABEL_PLURAL[feature];
  const { colors } = useTheme();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      sheetStyle={{ borderTopLeftRadius: 34, borderTopRightRadius: 34 }}
      panEnabled={mode !== 'blocked'}
    >
      <View className="mb-5 flex-row items-center justify-between">
        <View className="h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,149,0,0.13)] bg-[rgba(255,149,0,0.09)]">
          <Zap size={22} color={colors.secondaryFixed} />
        </View>
        <Pressable
          className="h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-low"
          onPress={onClose}
        >
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      {mode === 'warning' ? (
        <>
          <Text className="mb-2.5 font-headline text-2xl tracking-[-0.3px] text-on-surface">
            1 free {label} remaining
          </Text>
          <Text className="mb-5 font-body text-sm leading-[21px] text-on-surface-variant">
            You have 1 free {label} left this month. Upgrade to Pro for unlimited access to all features.
          </Text>

          <View className="mb-5 gap-2.5">
            <PlanFeatureRow label={`${limit} ${labelPlural}/month`} isFree />
            <PlanFeatureRow label={`Unlimited ${labelPlural}`} isFree={false} />
          </View>

          <SacredButton label="Upgrade to Pro — $19.99/mo" onPress={onUpgrade} style={{ marginBottom: 12 }} />
          <Pressable className="items-center py-2.5" onPress={onProceed ?? onClose}>
            <Text className="font-body text-sm text-on-surface-variant">Use my last free {label}</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text className="mb-2.5 font-headline text-2xl tracking-[-0.3px] text-on-surface">
            You've used all {limit} free {labelPlural}
          </Text>
          <Text className="mb-5 font-body text-sm leading-[21px] text-on-surface-variant">
            Upgrade to Aksha Pro for unlimited {labelPlural} and everything else Aksha has to offer.
          </Text>

          <View className="mb-6 gap-3">
            <FeatureItem text={`Unlimited ${labelPlural}`} />
            <FeatureItem text="All home page content" />
            <FeatureItem text="Priority access to new features" />
          </View>

          <SacredButton label="Upgrade to Pro — $19.99/mo" onPress={onUpgrade} style={{ marginBottom: 12 }} />
          <Pressable className="items-center py-2.5" onPress={onClose}>
            <Text className="font-body text-sm text-on-surface-variant">Maybe later</Text>
          </Pressable>
        </>
      )}
    </BottomSheet>
  );
}

function PlanFeatureRow({ label, isFree }: { label: string; isFree: boolean }) {
  return (
    <View className="flex-row items-center gap-3 rounded-[14px] border border-black/[0.04] bg-surface-container-low p-3.5 dark:border-white/[0.04]">
      <View className={`rounded-md px-2 py-[3px] ${isFree ? 'bg-on-surface-variant/10' : 'bg-primary/15'}`}>
        <Text className={`font-label text-[9px] tracking-[1.2px] ${isFree ? 'text-on-surface-variant' : 'text-primary-fixed'}`}>
          {isFree ? 'FREE' : 'PRO'}
        </Text>
      </View>
      <Text className="flex-1 font-body-medium text-sm text-on-surface">{label}</Text>
    </View>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-1.5 w-1.5 rounded-full bg-primary" />
      <Text className="font-body text-sm text-on-surface-variant">{text}</Text>
    </View>
  );
}
