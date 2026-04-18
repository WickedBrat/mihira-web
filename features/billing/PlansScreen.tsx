// features/billing/PlansScreen.tsx
import React from 'react';
import {
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, X, Zap } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { layout } from '@/lib/theme';
import { useTheme } from '@/lib/theme-context';

interface PlansScreenProps {
  isPro: boolean;
  isCheckoutLoading?: boolean;
  onUpgrade: () => void;
  onClose: () => void;
}

interface FeatureRowProps {
  label: string;
  freeValue: string | boolean;
  proValue: string | boolean;
}

function FeatureRow({ label, freeValue, proValue }: FeatureRowProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center border-b border-black/[0.04] px-4 py-3.5 dark:border-white/[0.03]">
      <Text className="flex-1 font-body text-sm text-on-surface">{label}</Text>
      <View className="flex-row">
        <View className="w-[72px] items-center justify-center">
          {typeof freeValue === 'boolean' ? (
            freeValue
              ? <Check size={16} color={colors.onSurfaceVariant} />
              : <X size={16} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text className="text-center font-body-medium text-xs text-on-surface-variant">{freeValue}</Text>
          )}
        </View>
        <View className="w-[72px] items-center justify-center">
          {typeof proValue === 'boolean' ? (
            proValue
              ? <Check size={16} color={colors.primary} />
              : <X size={16} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text className="text-center font-body-medium text-xs text-primary-fixed">{proValue}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function PlansScreen({ isPro, isCheckoutLoading = false, onUpgrade, onClose }: PlansScreenProps) {
  const { colors } = useTheme();
  const gradientColors: [string, string] = [
    `${colors.primary}30`,
    `${colors.primaryFixedDim}18`,
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <PageAmbientBlobs />

      <View className="flex-row items-center justify-between py-3.5" style={{ paddingHorizontal: layout.screenPaddingX }}>
        <Text className="font-headline text-xl tracking-[-0.3px] text-on-surface">Choose a plan</Text>
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
          <View className="flex-1 items-center gap-1 rounded-[20px] border border-black/[0.06] bg-surface-container-low p-[18px] dark:border-white/[0.06]">
            <Text className="mb-1 font-body-medium text-base text-on-surface-variant">Free</Text>
            <Text className="font-headline text-[28px] tracking-[-0.5px] text-on-surface">$0</Text>
            <Text className="font-body text-[11px] text-on-surface-variant">forever</Text>
            {!isPro && (
              <View className="mt-2 rounded-[20px] bg-on-surface-variant/10 px-2.5 py-1">
                <Text className="font-label text-[9px] tracking-[0.8px] text-on-surface-variant">Current plan</Text>
              </View>
            )}
          </View>

          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1 items-center gap-1 rounded-[20px] border p-[18px]"
            style={{ borderColor: `${colors.primary}30` }}
          >
            <View className="mb-0.5 flex-row items-center gap-[5px]">
              <Zap size={14} color={colors.secondaryFixed} />
              <Text className="font-headline text-base tracking-[0.5px] text-secondary-fixed">Pro</Text>
            </View>
            <Text className="font-headline text-[28px] tracking-[-0.5px] text-primary-fixed">$19.99</Text>
            <Text className="font-body text-[11px] text-on-surface-variant">per month</Text>
            {isPro && (
              <View className="mt-2 rounded-[20px] bg-primary/15 px-2.5 py-1">
                <Text className="font-label text-[9px] tracking-[0.8px] text-primary-fixed">Active</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        <View className="overflow-hidden rounded-[20px] border border-black/[0.04] bg-surface-container-low dark:border-white/[0.04]">
          <View className="flex-row items-center border-b border-black/[0.04] px-4 py-3 dark:border-white/[0.04]">
            <Text className="flex-1 font-label text-[9px] uppercase tracking-[1.5px] text-on-surface-variant">
              Features
            </Text>
            <View className="flex-row">
              <Text className="w-[72px] text-center font-label text-[9px] uppercase tracking-[1.2px] text-on-surface-variant">
                Free
              </Text>
              <Text className="w-[72px] text-center font-label text-[9px] uppercase tracking-[1.2px] text-primary-fixed">
                Pro
              </Text>
            </View>
          </View>

          <FeatureRow label="Daily alignment" freeValue={true} proValue={true} />
          <FeatureRow label="Sacred Timing" freeValue="5/mo" proValue="Unlimited" />
          <FeatureRow label="Guidance" freeValue="20/mo" proValue="Unlimited" />
          <FeatureRow label="Early access to new features" freeValue={false} proValue={true} />
        </View>

        {!isPro && (
          <SacredButton
            label={isCheckoutLoading ? 'Opening checkout…' : 'Upgrade to Pro for $19.99/mo'}
            onPress={isCheckoutLoading ? () => {} : onUpgrade}
            style={{ marginTop: 4 }}
          />
        )}

        {isPro && (
          <View
            className="flex-row items-start gap-3 rounded-2xl border p-4"
            style={{ backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}20` }}
          >
            <Check size={18} color={colors.primary} />
            <Text className="flex-1 font-body text-sm leading-5 text-on-surface-variant">
              You’re on Aksha Pro. You can manage your subscription from your Clerk account.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
