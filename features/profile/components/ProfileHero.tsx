import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserRound } from 'lucide-react-native';
import { colors, fonts } from '@/lib/theme';

interface ProfileHeroProps {
  displayName: string;
  initials: string;
  isSignedIn: boolean;
}

export function ProfileHero({ displayName, initials, isSignedIn }: ProfileHeroProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.avatarGlow} />
      <LinearGradient
        colors={[`${colors.primary}D9`, `${colors.primaryFixedDim}99`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.avatarRing}
      >
        <View style={styles.avatarCore}>
          {isSignedIn ? (
            <Text style={styles.avatarInitials}>{initials}</Text>
          ) : (
            <UserRound size={58} color={colors.onSurface} strokeWidth={1.7} />
          )}
        </View>
      </LinearGradient>
      <Text style={styles.heroName}>{displayName}</Text>
      <Text style={styles.heroSub}>
        Keep your core details ready for a more personal spiritual journey.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: 36 },
  avatarGlow: {
    position: 'absolute',
    top: 28,
    width: 180,
    height: 180,
    borderRadius: 9999,
    backgroundColor: `${colors.primary}18`,
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 48,
    shadowOffset: { width: 0, height: 0 },
  },
  avatarRing: {
    width: 172,
    height: 172,
    borderRadius: 86,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarCore: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 19, 19, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  avatarInitials: {
    fontFamily: fonts.headline,
    fontSize: 48,
    color: colors.onSurface,
    letterSpacing: -1,
  },
  heroName: {
    fontFamily: fonts.headline,
    fontSize: 26,
    color: colors.onSurface,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});
