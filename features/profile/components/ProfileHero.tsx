import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BadgeCheck, UserRound } from 'lucide-react-native';
import { colors, fonts } from '@/lib/theme';
import { scaleFont } from '@/lib/typography';

interface ProfileHeroProps {
  displayName: string;
  initials: string;
  avatarUrl?: string | null;
  badgeLabel?: string;
  isSignedIn: boolean;
}

export function ProfileHero({
  displayName,
  initials,
  avatarUrl,
  badgeLabel = 'Aksha FREE',
  isSignedIn,
}: ProfileHeroProps) {
  const hasAvatar = Boolean(avatarUrl);

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
          {isSignedIn && hasAvatar ? (
            <Image source={{ uri: avatarUrl ?? undefined }} style={styles.avatarImage} />
          ) : isSignedIn ? (
            <Text style={styles.avatarInitials}>{initials}</Text>
          ) : (
            <UserRound size={58} color={colors.onSurface} strokeWidth={1.7} />
          )}
        </View>
      </LinearGradient>
      <View style={styles.planBadge}>
        <BadgeCheck size={13} color={colors.secondaryFixed} />
        <Text style={styles.planBadgeText}>{badgeLabel}</Text>
      </View>
      <Text style={styles.heroName}>{displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginBottom: 10 },
  avatarGlow: {
    position: 'absolute',
    top: 32,
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
    marginBottom: 28,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(48),
    color: colors.onSurface,
    letterSpacing: -1,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: `${colors.secondary}22`,
    borderWidth: 1,
    borderColor: `${colors.secondary}26`,
    marginBottom: 12,
  },
  planBadgeText: {
    fontFamily: fonts.label,
    fontSize: scaleFont(10),
    color: colors.secondaryFixed,
    letterSpacing: 1.2,
  },
  heroName: {
    fontFamily: fonts.headline,
    fontSize: scaleFont(26),
    color: colors.onSurface,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  heroSub: {
    fontFamily: fonts.body,
    fontSize: scaleFont(14),
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: scaleFont(22),
    maxWidth: 300,
  },
});
