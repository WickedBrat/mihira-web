// features/billing/PlansScreen.tsx
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, X, Zap } from 'lucide-react-native';
import { SacredButton } from '@/components/ui/SacredButton';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { fonts, layout } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
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
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
      },
      featureLabel: {
        flex: 1,
        fontFamily: fonts.body,
        fontSize: scaleFont(14),
        color: c.onSurface,
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
      featureCellText: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(12),
        color: c.onSurfaceVariant,
        textAlign: 'center',
      },
      featureCellTextPro: {
        color: c.primaryFixed,
      },
    })
  );

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
        <View style={styles.featureCell}>
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
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
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
        color: c.onSurface,
        letterSpacing: -0.3,
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
        backgroundColor: c.surfaceContainerLow,
        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      },
      planCardPro: {
        borderColor: `${c.primary}30`,
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
        color: c.secondaryFixed,
        letterSpacing: 0.5,
      },
      planName: {
        fontFamily: fonts.bodyMedium,
        fontSize: scaleFont(15),
        color: c.onSurfaceVariant,
        marginBottom: 4,
      },
      planPrice: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(28),
        color: c.onSurface,
        letterSpacing: -0.5,
      },
      planPricePro: {
        color: c.primaryFixed,
      },
      planPriceSub: {
        fontFamily: fonts.body,
        fontSize: scaleFont(11),
        color: c.onSurfaceVariant,
      },
      currentBadge: {
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: `${c.onSurfaceVariant}18`,
      },
      currentBadgePro: {
        backgroundColor: `${c.primary}22`,
      },
      currentBadgeText: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        color: c.onSurfaceVariant,
        letterSpacing: 0.8,
      },
      currentBadgeTextPro: {
        color: c.primaryFixed,
      },
      featureTable: {
        borderRadius: 20,
        backgroundColor: c.surfaceContainerLow,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        overflow: 'hidden',
      },
      featureTableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      },
      featureTableHeaderLabel: {
        flex: 1,
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: c.onSurfaceVariant,
      },
      featureValues: {
        flexDirection: 'row',
        gap: 0,
      },
      featureColumnLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        color: c.onSurfaceVariant,
        width: 72,
        textAlign: 'center',
      },
      featureColumnLabelPro: {
        color: c.primaryFixed,
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
        backgroundColor: `${c.primary}10`,
        borderWidth: 1,
        borderColor: `${c.primary}20`,
      },
      activeMessageText: {
        flex: 1,
        fontFamily: fonts.body,
        fontSize: scaleFont(13),
        color: c.onSurfaceVariant,
        lineHeight: scaleFont(20),
      },
    })
  );

  const gradientColors: [string, string] = [
    `${colors.primary}30`,
    `${colors.primaryFixedDim}18`,
  ];

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
        <View style={styles.planCards}>
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

          <LinearGradient
            colors={gradientColors}
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
