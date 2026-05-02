// features/billing/PlansScreen.tsx
import React from 'react';
import {
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';

interface PlansScreenProps {
  isPlus: boolean;
  isCheckoutLoading?: boolean;
  onUpgrade: () => void;
  onClose: () => void;
  onManageSubscription?: () => void;
}

interface FeatureRowProps {
  label: string;
  freeValue: string | boolean;
  plusValue: string | boolean;
}

const PLAN_COLUMN_WIDTH = 84;

function FeatureRow({ label, freeValue, plusValue }: FeatureRowProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center border-b border-black/[0.04] px-4 py-4 dark:border-white/[0.03]">
      <Text className="flex-1 pr-3 font-body text-base leading-6 text-on-surface">{label}</Text>
      <View className="flex-row">
        <View style={{ width: PLAN_COLUMN_WIDTH }} className="flex items-center justify-center">
          {typeof freeValue === 'boolean' ? (
            freeValue
              ? <Check size={18} color={colors.onSurfaceVariant} />
              : <X size={18} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text className="text-center font-body-medium text-sm text-on-surface-variant">{freeValue}</Text>
          )}
        </View>
        <View style={{ width: PLAN_COLUMN_WIDTH }} className="flex items-center justify-center">
          {typeof plusValue === 'boolean' ? (
            plusValue
              ? <Check size={18} color={colors.primary} />
              : <X size={18} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text className="text-center font-body-medium text-sm text-primary-fixed">{plusValue}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function PlansScreen({ isPlus, isCheckoutLoading = false, onUpgrade, onClose, onManageSubscription }: PlansScreenProps) {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <PageAmbientBlobs />

      <View className="flex-row items-center justify-between py-3.5" style={{ paddingHorizontal: layout.screenPaddingX }}>
        <Text className="font-headline text-[30px] leading-[34px] tracking-[-0.5px] text-on-surface">
          {isPlus ? 'Your plan' : 'Choose a plan'}
        </Text>
        <Pressable
          className="h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-low"
          onPress={onClose}
        >
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: layout.screenPaddingX,
          paddingTop: 8,
          paddingBottom: 48,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-3">
          <View className="flex-1">
            <View className="items-center gap-1.5 rounded-[20px] border border-black/[0.06] bg-surface-container-low px-4 py-5 dark:border-white/[0.06]">
              <Text className="mb-1 font-body-medium text-lg text-on-surface-variant">Free</Text>
              <Text className="font-headline text-[36px] leading-[40px] tracking-[-0.8px] text-on-surface">$0</Text>
              <Text className="font-body text-sm text-on-surface-variant">forever</Text>
              {!isPlus && (
                <View className="mt-2 rounded-[20px] bg-on-surface-variant/10 px-3 py-1.5">
                  <Text className="font-label text-[11px] tracking-[0.8px] text-on-surface-variant">Current plan</Text>
                </View>
              )}
            </View>
          </View>
          <View className="flex-1 h-max ">
            <View className="items-center gap-1.5 rounded-[20px] border border-black/[0.06] bg-surface-container-low px-4 py-5 dark:border-white/[0.06]">
              <Text className="mb-1 font-body-medium text-lg text-on-surface-variant">Plus</Text>
              <Text className="font-headline text-[36px] leading-[40px] tracking-[-0.8px] text-on-surface">$9.99</Text>
              <Text className="font-body text-sm text-on-surface-variant">per month</Text>
              {isPlus && (
                <View className="mt-2 rounded-[20px] bg-on-surface-variant/10 px-3 py-1.5">
                  <Text className="font-label text-[11px] tracking-[0.8px] text-on-surface-variant">Current plan</Text>
                </View>
              )}
            </View>
          </View>

        </View>

        <View className="overflow-hidden rounded-[20px] border border-black/[0.04] bg-surface-container-low dark:border-white/[0.04]">
          <View className="flex-row items-center border-b border-black/[0.04] px-4 py-3 dark:border-white/[0.04]">
            <Text className="flex-1 font-label text-[10px] uppercase tracking-[1.5px] text-on-surface-variant">
              Features
            </Text>
            <View className="flex-row">
              <Text style={{ width: PLAN_COLUMN_WIDTH }} className="text-center font-label text-[10px] uppercase tracking-[1.2px] text-on-surface-variant">
                Free
              </Text>
              <Text style={{ width: PLAN_COLUMN_WIDTH }} className="text-center font-label text-[10px] uppercase tracking-[1.2px] text-primary-fixed">
                Plus
              </Text>
            </View>
          </View>

          <FeatureRow label="Daily alignment" freeValue={true} plusValue={true} />
          <FeatureRow label="Sacred Timing" freeValue="3/mo" plusValue="Unlimited" />
          <FeatureRow label="Guidance" freeValue="5/mo" plusValue="Unlimited" />
          <FeatureRow label="Early access to new features" freeValue={false} plusValue={true} />
        </View>

        {!isPlus && (
          <SacredButton
            label={isCheckoutLoading ? 'Opening checkout…' : 'Upgrade to Plus for $9.99/mo'}
            onPress={isCheckoutLoading ? () => {} : onUpgrade}
            fullWidth
            labelStyle={{ fontSize: 18 }}
            style={{ marginTop: 4 }}
          />
        )}

        {isPlus && (
          <View className="gap-3">
            <View
              className="flex-row items-start gap-3 rounded-2xl border p-4"
              style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}20` }}
            >
              <Check size={18} color={colors.primary} />
              <Text className="flex-1 font-body text-base leading-6 text-on-surface-variant">
                You’re on Mihira Plus. Manage your subscription from RevenueCat Customer Center once store billing is configured for this build.
              </Text>
            </View>

            {onManageSubscription ? (
              <SacredButton
                label="Manage subscription"
                onPress={onManageSubscription}
                variant="secondary"
              />
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
