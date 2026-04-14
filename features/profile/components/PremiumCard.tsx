import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '@/lib/theme';
import { useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';

interface PremiumCardProps {
  isPro: boolean;
  onPress: () => void;
}

export function PremiumCard({ isPro, onPress }: PremiumCardProps) {
  const styles = useThemedStyles(() =>
    StyleSheet.create({
      card: {
        borderRadius: 22,
        overflow: 'hidden',
        marginBottom: 4,
      },
      bg: {
        borderRadius: 22,
        overflow: 'hidden',
      },
      overlay: {
        backgroundColor: 'rgba(0,0,0,0.18)',
        borderRadius: 22,
        paddingVertical: 30,
        paddingHorizontal: 30,
        minHeight: 88,
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      },
      title: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(24),
        color: '#fff',
        letterSpacing: -0.3,
        marginBottom: 5,
      },
      subtitle: {
        fontFamily: fonts.body,
        fontSize: scaleFont(12),
        textAlign: 'center',
        color: 'rgba(255,255,255,0.78)',
        lineHeight: scaleFont(18),
        maxWidth: 220,
      },
    })
  );

  // if (isPro) return null;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#cd792cff', '#51301c']}
        style={styles.bg}
      >
        <ImageBackground
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('@/assets/premium-card-bg.png')}
          style={{ flex: 1 }}
          imageStyle={{ opacity: 0.3 }}
          resizeMode="cover"
        >
        <View style={styles.overlay}>
          <Text style={styles.title}>Get Premium</Text>
          <Text style={styles.subtitle}>
            Unlimited Ask Aksha, No Ads &amp; Exclusive Spiritual Insights
          </Text>
        </View>
        </ImageBackground>
      </LinearGradient>
    </Pressable>
  );
}
