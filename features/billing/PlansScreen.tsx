// features/billing/PlansScreen.tsx
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, X, Zap } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { colors, fonts, layout } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

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
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureLabel}>{label}</Text>
      <View style={styles.featureValues}>
        <View style={styles.featureCell}>
          {typeof freeValue === 'boolean' ? (
            freeValue
              ? <Check size={16} color={colors.onSurfaceVariant} />
              : <X size={16} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text style={styles.featureCellText}>{freeValue}</Text>
          )}
        </View>
        <View style={[styles.featureCell, styles.featureCellPro]}>
          {typeof proValue === 'boolean' ? (
            proValue
              ? <Check size={16} color={colors.primary} />
              : <X size={16} color={`${colors.onSurfaceVariant}44`} />
          ) : (
            <Text style={[styles.featureCellText, styles.featureCellTextPro]}>{proValue}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export function PlansScreen({ isPro, isCheckoutLoading = false, onUpgrade, onClose }: PlansScreenProps) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageAmbientBlobs />

      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Plans</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan cards */}
        <View style={styles.planCards}>
          {/* Free card */}
          <View style={[styles.planCard, styles.planCardFree]}>
            <Text style={styles.planName}>Free</Text>
            <Text style={styles.planPrice}>$0</Text>
            <Text style={styles.planPriceSub}>forever</Text>
            {!isPro && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current plan</Text>
              </View>
            )}
          </View>

          {/* Pro card */}
          <LinearGradient
            colors={[`${colors.primary}30`, `${colors.primaryFixedDim}18`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.planCard, styles.planCardPro]}
          >
            <View style={styles.planProHeader}>
              <Zap size={14} color={colors.secondaryFixed} />
              <Text style={styles.planProLabel}>Pro</Text>
            </View>
            <Text style={[styles.planPrice, styles.planPricePro]}>$19.99</Text>
            <Text style={styles.planPriceSub}>per month</Text>
            {isPro && (
              <View style={[styles.currentBadge, styles.currentBadgePro]}>
                <Text style={[styles.currentBadgeText, styles.currentBadgeTextPro]}>Active</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Feature comparison */}
        <View style={styles.featureTable}>
          <View style={styles.featureTableHeader}>
            <Text style={styles.featureTableHeaderLabel}>Features</Text>
            <View style={styles.featureValues}>
              <Text style={styles.featureColumnLabel}>Free</Text>
              <Text style={[styles.featureColumnLabel, styles.featureColumnLabelPro]}>Pro</Text>
            </View>
          </View>

          <FeatureRow label="Home page" freeValue={true} proValue={true} />
          <FeatureRow label="Muhurat queries" freeValue="5/mo" proValue="Unlimited" />
          <FeatureRow label="Ask conversations" freeValue="20/mo" proValue="Unlimited" />
          <FeatureRow label="Priority features" freeValue={false} proValue={true} />
        </View>

        {!isPro && (
          <SacredButton
            label={isCheckoutLoading ? 'Opening checkout…' : 'Upgrade to Pro — $19.99/mo'}
            onPress={isCheckoutLoading ? () => {} : onUpgrade}
            style={styles.upgradeCta}
          />
        )}

        {isPro && (
          <View style={styles.activeMessage}>
            <Check size={18} color={colors.primary} />
            <Text style={styles.activeMessageText}>You're on Aksha Pro. Manage your subscription from your Clerk account.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
    paddingVertical: 14,
  },
  navTitle: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(20),
    color: colors.onSurface,
    letterSpacing: -0.3,
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
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: 8,
    paddingBottom: 48,
    gap: 24,
  },
  planCards: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  planCardFree: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  planCardPro: {
    borderColor: `${colors.primary}30`,
  },
  planProHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  planProLabel: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(15),
    color: colors.secondaryFixed,
    letterSpacing: 0.5,
  },
  planName: {
    fontFamily: fonts.bodyMedium,
    fontSize: scaleFont(15),
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  planPrice: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(28),
    color: colors.onSurface,
    letterSpacing: -0.5,
  },
  planPricePro: {
    color: colors.primaryFixed,
  },
  planPriceSub: {
    fontFamily: fonts.body,
    fontSize: scaleFont(11),
    color: colors.onSurfaceVariant,
  },
  currentBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: `${colors.onSurfaceVariant}18`,
  },
  currentBadgePro: {
    backgroundColor: `${colors.primary}22`,
  },
  currentBadgeText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    color: colors.onSurfaceVariant,
    letterSpacing: 0.8,
  },
  currentBadgeTextPro: {
    color: colors.primaryFixed,
  },
  featureTable: {
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  featureTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  featureTableHeaderLabel: {
    flex: 1,
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.onSurfaceVariant,
  },
  featureColumnLabel: {
    fontFamily: fonts.label,
    fontSize: scaleFont(9),
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.onSurfaceVariant,
    width: 72,
    textAlign: 'center',
  },
  featureColumnLabelPro: {
    color: colors.primaryFixed,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  featureLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurface,
  },
  featureValues: {
    flexDirection: 'row',
    gap: 0,
  },
  featureCell: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCellPro: {},
  featureCellText: {
    fontFamily: fonts.bodyMedium,
    fontSize: scaleFont(12),
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  featureCellTextPro: {
    color: colors.primaryFixed,
  },
  upgradeCta: {
    marginTop: 4,
  },
  activeMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  activeMessageText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: scaleFont(13),
    color: colors.onSurfaceVariant,
    lineHeight: scaleFont(20),
  },
});
