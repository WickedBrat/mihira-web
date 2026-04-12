import React from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { View as MotiView } from 'moti/build/components/view';
import { Quote } from 'lucide-react-native';
import { SvgUri } from 'react-native-svg';
import { useAssets } from 'expo-asset';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import { useDailyArth } from './useDailyArth';

export function DailyArthCard() {
  const { arth, isLoading } = useDailyArth();
  const [bgAssets] = useAssets(
    Platform.OS !== 'web' ? [require('../../assets/daily-arth-bg.svg')] : []
  );
  const bgUri = bgAssets?.[0]?.uri;

  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      container: {
        position: 'relative',
      },
      glowBehind: {
        position: 'absolute',
        top: -28,
        left: '10%',
        right: '10%',
        height: 68,
        backgroundColor: `${c.primary}0D`,
        borderRadius: 9999,
        shadowColor: c.primary,
        shadowOpacity: 0.3,
        shadowRadius: 40,
        shadowOffset: { width: 0, height: 0 },
      },
      card: {
        position: 'relative',
        backgroundColor: dark ? 'rgba(37, 38, 38, 0.6)' : 'rgba(232, 225, 212, 0.6)',
        overflow: 'hidden',
        padding: 25,
        borderWidth: 1,
        borderColor: dark ? 'rgba(72, 72, 72, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        alignItems: 'center',
      },
      backgroundArt: {
        position: 'absolute',
        top: '50%',
        right: -132,
        width: 264,
        height: 264,
        opacity: 0.2,
        transform: [{ translateY: -132 }],
      },
      content: {
        width: '100%',
        alignItems: 'center',
        zIndex: 1,
      },
      quoteIcon: {
        marginBottom: 28,
      },
      quote: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(22),
        color: c.onSurface,
        lineHeight: scaleFont(32),
        letterSpacing: -0.3,
        textAlign: 'center',
        marginBottom: 28,
      },
      dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      dividerLine: {
        width: 28,
        height: 1,
        backgroundColor: dark ? 'rgba(72, 72, 72, 0.3)' : 'rgba(0, 0, 0, 0.12)',
      },
      source: {
        fontFamily: fonts.label,
        fontSize: scaleFont(9),
        textTransform: 'uppercase',
        letterSpacing: 3,
        color: c.onSurfaceVariant,
        fontStyle: 'italic',
      },
      quoteLong: {
        fontSize: scaleFont(17),
        lineHeight: scaleFont(26),
      },
      cardLoading: {
        minHeight: 220,
        justifyContent: 'center',
      },
      loader: {
        marginVertical: 'auto',
      },
    })
  );

  const displayQuote = arth?.quote ?? '';
  const displaySource = arth?.source ?? '';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.96, translateY: 12 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 100 }}
      style={styles.container}
    >
      <View style={[styles.glowBehind, { pointerEvents: 'none' }]} />

      <View style={[styles.card, isLoading && styles.cardLoading]}>
        <View pointerEvents="none" style={styles.backgroundArt}>
          {bgUri ? (
            <SvgUri uri={bgUri} width="100%" height="100%" />
          ) : null}
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.content}>
            <Quote size={32} color={colors.primary} style={styles.quoteIcon} />
            <Text style={[styles.quote, displayQuote.length > 50 && styles.quoteLong]}>{displayQuote}</Text>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.source}>The {displaySource}</Text>
              <View style={styles.dividerLine} />
            </View>
          </View>
        )}
      </View>
    </MotiView>
  );
}
