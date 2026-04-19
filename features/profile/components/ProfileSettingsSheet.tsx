import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { Text } from '@/components/ui/Text';
import { Check, ChevronDown, LogOut, Settings, X, Zap } from 'lucide-react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SacredButton } from '@/components/ui/SacredButton';
import { LANGUAGE_OPTIONS } from '@/features/profile/constants';
import type { ProfileData } from '@/features/profile/useProfile';
import { useTheme, type ThemePreference } from '@/lib/theme-context';

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
  isPlus: boolean;
  onOpenPlans: () => void;
  onManageAccount: () => void;
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
  userIdLabel: _userIdLabel,
  onSelectLanguage,
  onOpenAuth,
  onSignOut,
  isPlus,
  onOpenPlans,
  onManageAccount,
}: ProfileSettingsSheetProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { colors, preference, setPreference } = useTheme();

  useEffect(() => {
    if (!visible) {
      setIsLanguageDropdownOpen(false);
    }
  }, [visible]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      sheetStyle={{ borderTopLeftRadius: 34, borderTopRightRadius: 34 }}
    >
      <View className="mb-[22px] flex-row items-start justify-between gap-3">
        <View>
          <Text className="mb-1 font-headline text-2xl tracking-[-0.4px] text-on-surface">Settings</Text>
          <Text className="max-w-[220px] font-body text-sm leading-[19px] text-on-surface-variant">
            Account, preferences, and reading settings.
          </Text>
        </View>
        <Pressable
          className="h-9 w-9 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-container-low"
          onPress={onClose}
        >
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 pb-5"
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 6 }}
      >
        {isSignedIn ? (
          <>
            <View
              className="mb-4 flex-row items-center gap-3.5 rounded-[18px] border p-3.5"
              style={{ backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}22` }}
            >
              <View
                className="h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}30` }}
              >
                <Text className="font-headline text-base text-primary-fixed">{initials}</Text>
              </View>
              <View className="flex-1">
                <Text className="mb-0.5 font-body-medium text-base text-on-surface">{fullName}</Text>
                <Text className="font-body text-xs text-on-surface-variant">{email}</Text>
              </View>
            </View>

            <Pressable
              className="mb-3 flex-row items-center gap-2.5 rounded-2xl border border-black/[0.05] bg-surface-container-low px-4 py-3.5 dark:border-white/[0.05]"
              onPress={onManageAccount}
            >
              <Settings size={16} color={colors.onSurfaceVariant} />
              <Text className="font-body-medium text-base text-on-surface">Manage account</Text>
            </Pressable>

            <Pressable
              className="mb-3 flex-row items-center gap-2.5 rounded-2xl border border-[rgba(255,149,0,0.102)] bg-[rgba(255,149,0,0.063)] px-4 py-3.5"
              onPress={onOpenPlans}
            >
              <Zap size={16} color={colors.secondaryFixed} />
              <Text className="font-body-medium text-base text-secondary-fixed">
                {isPlus ? 'Current plan: Mihira Plus' : 'Upgrade to Mihira Plus'}
              </Text>
            </Pressable>

            <Pressable
              className="mb-5 flex-row items-center gap-2.5 rounded-2xl border border-[rgba(207,102,121,0.15)] bg-[rgba(207,102,121,0.08)] px-4 py-3.5"
              onPress={onSignOut}
            >
              <LogOut size={16} color="#CF6679" />
              <Text className="font-body-medium text-base text-[#CF6679]">Sign out</Text>
            </Pressable>
          </>
        ) : (
          <SacredButton
            label="Sign in"
            onPress={onOpenAuth}
            style={{ alignSelf: 'stretch', marginBottom: 20 }}
          />
        )}

        <View className="mb-[18px]">
          <Text className="mb-2.5 pt-6 font-label text-xs uppercase tracking-[1.8px] text-on-surface-variant">
            Content Language
          </Text>
          <Pressable
            className="flex-row items-center justify-between rounded-2xl border border-black/[0.05] bg-surface-container-low px-4 py-3.5 dark:border-white/[0.05]"
            onPress={() => setIsLanguageDropdownOpen((current) => !current)}
          >
            <Text className="font-body-medium text-base text-on-surface">{language}</Text>
            <ChevronDown
              size={18}
              color={colors.onSurfaceVariant}
              style={isLanguageDropdownOpen ? { transform: [{ rotate: '180deg' }] } : undefined}
            />
          </Pressable>

          {isLanguageDropdownOpen && (
            <View className="mt-2.5 overflow-hidden rounded-[18px] border border-black/[0.05] bg-surface-container dark:border-white/[0.05]">
              {LANGUAGE_OPTIONS.map((option) => {
                const isSelected = language === option;

                return (
                  <Pressable
                    key={option}
                    className="flex-row items-center justify-between px-4 py-3.5"
                    style={isSelected ? { backgroundColor: `${colors.primary}14` } : undefined}
                    onPress={() => {
                      onSelectLanguage(option);
                      setIsLanguageDropdownOpen(false);
                    }}
                  >
                    <Text
                      className={`text-base ${
                        isSelected
                          ? 'font-body-medium text-primary-fixed'
                          : 'font-body text-on-surface'
                      }`}
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

        <View className="mb-[18px]">
          <Text className="mb-2.5 font-label text-xs uppercase tracking-[1.8px] text-on-surface-variant">Appearance</Text>
          <View className="flex-row gap-1 rounded-2xl border border-black/[0.05] bg-surface-container-low p-1 dark:border-white/[0.05]">
            {(['system', 'light', 'dark'] as ThemePreference[]).map((option) => (
              <Pressable
                key={option}
                className={`flex-1 items-center rounded-xl py-2.5 ${
                  preference === option
                    ? 'border border-black/[0.08] bg-surface-container-high dark:border-white/[0.08]'
                    : ''
                }`}
                onPress={() => setPreference(option)}
              >
                <Text
                  className={`text-sm ${
                    preference === option
                      ? 'font-body-medium text-on-surface'
                      : 'font-body text-on-surface-variant'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="mb-[18px]">
          <Text className="mb-2.5 font-label text-xs uppercase tracking-[1.8px] text-on-surface-variant">Region</Text>
          <View className="rounded-2xl border border-black/[0.05] bg-surface-container-low px-4 py-3.5 dark:border-white/[0.05]">
            <Text className="font-body-medium text-base text-on-surface">{region}</Text>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
