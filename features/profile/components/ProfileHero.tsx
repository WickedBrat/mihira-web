import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserRound, type LucideIcon } from 'lucide-react-native';
import { fonts } from '@/lib/theme';
import { useTheme, useThemedStyles } from '@/lib/theme-context';
import { scaleFont } from '@/lib/typography';
import ProfileBg from '@/assets/profile_bg.svg';

interface ProfileHeroProps {
  displayName: string;
  initials: string;
  avatarUrl?: string | null;
  isSignedIn: boolean;
  zodiacSign?: { sign: string; icon: LucideIcon } | null;
}

export function ProfileHero({
  displayName,
  initials,
  avatarUrl,
  isSignedIn,
  zodiacSign,
}: ProfileHeroProps) {
  const hasAvatar = Boolean(avatarUrl);
  const { colors } = useTheme();
  const styles = useThemedStyles((c, _glass, _gradients, dark) =>
    StyleSheet.create({
      hero: { alignItems: 'center', paddingTop: 12, paddingBottom: 20 },
      avatarContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      },
      avatarBg: {
        position: 'absolute',
        opacity: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        width: 280,
        height: 280,
      },
      avatarGlow: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 9999,
        shadowColor: c.primary,
        shadowOpacity: 0.3,
        shadowRadius: 36,
        shadowOffset: { width: 0, height: 0 },
      },
      avatarCore: {
        width: 200,
        height: 200,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: dark ? 'rgba(19, 19, 19, 0.94)' : 'rgba(250, 247, 242, 0.94)',
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        overflow: 'hidden',
      },
      avatarImage: {
        width: '100%',
        height: '100%',
      },
      avatarInitials: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(30),
        color: c.onSurface,
        letterSpacing: -0.5,
      },
      heroName: {
        fontFamily: fonts.headline,
        fontSize: scaleFont(30),
        color: c.onSurface,
        letterSpacing: -0.4,
        marginBottom: 6,
      },
      zodiacRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      },
      zodiacLabel: {
        fontFamily: fonts.body,
        fontSize: scaleFont(15),
        color: c.onSurfaceVariant,
      },
    })
  );

  const gradientColors: [string, string] = [
    `${colors.primary}99`,
    `${colors.primaryFixedDim}66`,
  ];

  return (
    <View style={styles.hero}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBg}>
          <ProfileBg width={280} height={280} fill="#F5F5DC" />
        </View>
        <View style={styles.avatarGlow} />
        
        <View style={styles.avatarCore}>
          {isSignedIn && hasAvatar ? (
            <Image source={{ uri: avatarUrl ?? undefined }} style={styles.avatarImage} />
          ) : isSignedIn ? (
            <Text style={styles.avatarInitials}>{initials}</Text>
          ) : (
            <UserRound size={36} color={colors.onSurface} strokeWidth={1.7} />
          )}
        </View>
      </View>

      <Text style={styles.heroName}>{displayName}</Text>

      {zodiacSign && (
        <View style={styles.zodiacRow}>
          <zodiacSign.icon size={16} color={colors.onSurfaceVariant} strokeWidth={2} />
          <Text style={styles.zodiacLabel}>{zodiacSign.sign}</Text>
        </View>
      )}
    </View>
  );
}
