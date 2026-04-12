// features/billing/PaywallSheet.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Zap, X } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SacredButton } from '@/components/ui/SacredButton';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
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
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
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
        backgroundColor: 'rgba(255, 149, 0, 0.09)',
        borderWidth: 1,
        borderColor: 'rgba(255, 149, 0, 0.13)',
      },
      closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.surfaceContainerLow,
        borderWidth: 1,
        borderColor: `${c.outlineVariant}33`,
      },
      title: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(22),
        color: c.onSurface,
        letterSpacing: -0.3,
        marginBottom: 10,
      },
      body: {
        fontFamily: fonts.body,
        fontSize: scaleFont(14),
        color: c.onSurfaceVariant,
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
        backgroundColor: c.surfaceContainerLow,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      },
      planBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
      },
      planBadgeFree: {
        backgroundColor: `${c.onSurfaceVariant}18`,
      },
      planBadgePro: {
        backgroundColor: `${c.primary}22`,
      },
      planBadgeText: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        letterSpacing: 1.2,
      },
      planBadgeTextFree: {
        color: c.onSurfaceVariant,
      },
      planBadgeTextPro: {
        color: c.primaryFixed,
      },
      planFeatureText: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(14),
        color: c.onSurface,
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
        backgroundColor: c.primary,
      },
      featureItemText: {
        fontFamily: fonts.body,
        fontSize: scaleFont(14),
        color: c.onSurfaceVariant,
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
        color: c.onSurfaceVariant,
      },
    })
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet} panEnabled={mode !== 'blocked'}>
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
            <PlanFeatureRow label={`${limit} ${labelPlural}/month`} isFree styles={styles} />
            <PlanFeatureRow label={`Unlimited ${labelPlural}`} isFree={false} styles={styles} />
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
            <FeatureItem text={`Unlimited ${labelPlural}`} styles={styles} />
            <FeatureItem text="All home page content" styles={styles} />
            <FeatureItem text="Priority access to new features" styles={styles} />
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

type SheetStyles = ReturnType<typeof StyleSheet.create<Record<string, object>>>;

function PlanFeatureRow({ label, isFree, styles }: { label: string; isFree: boolean; styles: any }) {
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

function FeatureItem({ text, styles }: { text: string; styles: any }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <Text style={styles.featureItemText}>{text}</Text>
    </View>
  );
}
