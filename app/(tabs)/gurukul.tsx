import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PageAmbientBlobs } from '@/components/ui/PageAmbientBlobs';
import { fonts, layout } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';

export default function GurukulScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles((c) =>
    StyleSheet.create({
      root: { flex: 1, backgroundColor: c.surface },
      comingSoonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: layout.screenPaddingX,
        gap: 12,
        paddingTop: 200,
        zIndex: 1,
      },
      imagePortalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 480,
        zIndex: 0,
      },
      heroImage: {
        width: '100%',
        height: '100%',
      },
      gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 300,
      },
      comingSoonLabel: {
        fontFamily: fonts.label,
        fontSize: scaleFont(11),
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: c.secondaryFixedDim,
        marginBottom: 4,
      },
      comingSoonTitle: {
        fontFamily: fonts.headlineExtra,
        fontSize: scaleFont(40),
        color: c.onSurface,
        letterSpacing: -0.8,
        textAlign: 'center',
      },
      comingSoonSubtitle: {
        fontFamily: fonts.label,
        fontSize: scaleFont(15),
        color: c.onSurfaceVariant,
        textAlign: 'center',
        lineHeight: scaleFont(22),
        maxWidth: 280,
        marginTop: 4,
      },
    })
  );

  return (
    <View style={styles.root}>
      <PageAmbientBlobs />

      <View style={styles.imagePortalContainer}>
        <Image
          source={{uri: "https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/gurukul_coming_soon.jpg"}}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', colors.surface]}
          style={styles.gradientOverlay}
        />
      </View>

      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonLabel}>Gurukul</Text>
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonSubtitle}>
          Your sacred digital library of wisdom, breathwork & philosophy is being prepared.
        </Text>
      </View>
    </View>
  );
}
