// features/billing/PaywallSheet.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Zap, X } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SacredButton } from '@/components/ui/SacredButton';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';
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

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Zap size={22} color={colors.secondaryFixed} />
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      {mode === 'warning' ? (
        <>
          <Text style={styles.title}>1 free {label} remaining</Text>
          <Text style={styles.body}>
            You have 1 free {label} left this month. Upgrade to Pro for unlimited access to all features.
          </Text>

          <View style={styles.planRow}>
            <PlanFeatureRow label={`${limit} ${labelPlural}/month`} isFree />
            <PlanFeatureRow label={`Unlimited ${labelPlural}`} isFree={false} />
          </View>

          <SacredButton label="Upgrade to Pro — $19.99/mo" onPress={onUpgrade} style={styles.cta} />
          <Pressable style={styles.laterButton} onPress={onProceed ?? onClose}>
            <Text style={styles.laterText}>Use my last free {label}</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>You've used all {limit} free {labelPlural}</Text>
          <Text style={styles.body}>
            Upgrade to Aksha Pro for unlimited {labelPlural} and everything else Aksha has to offer.
          </Text>

          <View style={styles.featureList}>
            <FeatureItem text={`Unlimited ${labelPlural}`} />
            <FeatureItem text="All home page content" />
            <FeatureItem text="Priority access to new features" />
          </View>

          <SacredButton label="Upgrade to Pro — $19.99/mo" onPress={onUpgrade} style={styles.cta} />
          <Pressable style={styles.laterButton} onPress={onClose}>
            <Text style={styles.laterText}>Maybe later</Text>
          </Pressable>
        </>
      )}
    </BottomSheet>
  );
}

function PlanFeatureRow({ label, isFree }: { label: string; isFree: boolean }) {
  return (
    <View style={styles.planFeatureRow}>
      <View style={[styles.planBadge, isFree ? styles.planBadgeFree : styles.planBadgePro]}>
        <Text style={[styles.planBadgeText, isFree ? styles.planBadgeTextFree : styles.planBadgeTextPro]}>
          {isFree ? 'FREE' : 'PRO'}
        </Text>
      </View>
      <Text style={styles.planFeatureText}>{label}</Text>
    </View>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <Text style={styles.featureItemText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.secondaryFixed}18`,
    borderWidth: 1,
    borderColor: `${colors.secondaryFixed}22`,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(22),
    color: colors.onSurface,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurfaceVariant,
    lineHeight: scaleFont(21),
    marginBottom: 20,
  },
  planRow: {
    gap: 10,
    marginBottom: 20,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planBadgeFree: {
    backgroundColor: `${colors.onSurfaceVariant}18`,
  },
  planBadgePro: {
    backgroundColor: `${colors.primary}22`,
  },
  planBadgeText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    letterSpacing: 1.2,
  },
  planBadgeTextFree: {
    color: colors.onSurfaceVariant,
  },
  planBadgeTextPro: {
    color: colors.primaryFixed,
  },
  planFeatureText: {
    fontFamily: fonts.bodyMedium,
    fontSize: scaleFont(14),
    color: colors.onSurface,
    flex: 1,
  },
  featureList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  featureItemText: {
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurfaceVariant,
  },
  cta: {
    marginBottom: 12,
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  laterText: {
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: colors.onSurfaceVariant,
  },
});
