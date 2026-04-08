import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check, ChevronDown, LogOut, X, Zap } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SacredButton } from '@/components/ui/SacredButton';
import { LANGUAGE_OPTIONS } from '@/features/profile/constants';
import type { ProfileData } from '@/features/profile/useProfile';
import { colors, fonts } from '@/lib/theme';

interface ProfileSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  isSignedIn: boolean;
  initials: string;
  fullName: string;
  email: string;
  language: ProfileData['language'];
  region: string;
  userIdLabel: string;
  onSelectLanguage: (language: ProfileData['language']) => void;
  onOpenAuth: () => void;
  onSignOut: () => void | Promise<void>;
  isPro: boolean;
  onOpenPlans: () => void;
}

export function ProfileSettingsSheet({
  visible,
  onClose,
  isSignedIn,
  initials,
  fullName,
  email,
  language,
  region,
  userIdLabel,
  onSelectLanguage,
  onOpenAuth,
  onSignOut,
  isPro,
  onOpenPlans,
}: ProfileSettingsSheetProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      setIsLanguageDropdownOpen(false);
    }
  }, [visible]);

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={styles.sheet}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Profile controls and content preferences.</Text>
        </View>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isSignedIn ? (
          <>
            <View style={styles.identityRow}>
              <View style={styles.identityAvatar}>
                <Text style={styles.identityInitials}>{initials}</Text>
              </View>
              <View style={styles.identityText}>
                <Text style={styles.identityName}>{fullName}</Text>
                <Text style={styles.identityEmail}>{email}</Text>
              </View>
            </View>

            {!isPro && (
              <Pressable style={styles.upgradeRow} onPress={onOpenPlans}>
                <Zap size={16} color={colors.secondaryFixed} />
                <Text style={styles.upgradeText}>Upgrade to Pro</Text>
              </Pressable>
            )}

            <Pressable style={styles.signOutRow} onPress={onSignOut}>
              <LogOut size={16} color="#CF6679" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <SacredButton label="Sign In" onPress={onOpenAuth} style={styles.signInButton} />
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Content Language</Text>
          <Pressable
            style={styles.dropdownTrigger}
            onPress={() => setIsLanguageDropdownOpen((current) => !current)}
          >
            <Text style={styles.dropdownTriggerText}>{language}</Text>
            <ChevronDown
              size={18}
              color={colors.onSurfaceVariant}
              style={isLanguageDropdownOpen ? styles.dropdownChevronOpen : undefined}
            />
          </Pressable>

          {isLanguageDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {LANGUAGE_OPTIONS.map((option) => {
                const isSelected = language === option;

                return (
                  <Pressable
                    key={option}
                    style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                    onPress={() => {
                      onSelectLanguage(option);
                      setIsLanguageDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[styles.dropdownOptionText, isSelected && styles.dropdownOptionTextSelected]}
                    >
                      {option}
                    </Text>
                    {isSelected && <Check size={16} color={colors.primaryFixed} />}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Region</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{region}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>User ID</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{userIdLabel}</Text>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
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
    alignItems: 'flex-start',
    marginBottom: 22,
    gap: 12,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.onSurface,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 19,
    maxWidth: 220,
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
  scrollContent: {
    overflow: 'scroll',
    paddingBottom: 6,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1,
    borderColor: `${colors.primary}22`,
  },
  identityAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}30`,
  },
  identityInitials: {
    fontFamily: fonts.headline,
    fontSize: 16,
    color: colors.primaryFixed,
  },
  identityText: { flex: 1 },
  identityName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
    marginBottom: 2,
  },
  identityEmail: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  signInButton: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  upgradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 149, 0, 0.063)',
    borderColor: 'rgba(255, 149, 0, 0.102)',
    borderWidth: 1,
    marginBottom: 12,
  },
  upgradeText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.secondaryFixed,
  },
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(207, 102, 121, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(207, 102, 121, 0.15)',
    marginBottom: 20,
  },
  signOutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: '#CF6679',
  },
  section: { marginBottom: 18 },
  label: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    color: colors.onSurfaceVariant,
    marginBottom: 10,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownTriggerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  dropdownChevronOpen: { transform: [{ rotate: '180deg' }] },
  dropdownMenu: {
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownOptionSelected: { backgroundColor: `${colors.primary}14` },
  dropdownOptionText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.onSurface,
  },
  dropdownOptionTextSelected: {
    fontFamily: fonts.bodyMedium,
    color: colors.primaryFixed,
  },
  infoRow: {
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoValue: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
});
