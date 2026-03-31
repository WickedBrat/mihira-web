import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { AnimatePresence, MotiView } from 'moti';
import {
  Settings2,
  UserRound,
  CalendarClock,
  MapPin,
  BadgeCheck,
  ChevronDown,
  X,
  Check,
  LogOut,
} from 'lucide-react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { AmbientBlob } from '@/components/ui/AmbientBlob';
import { SacredButton } from '@/components/ui/SacredButton';
import { OAuthButton } from '@/features/auth/OAuthButton';
import { useSignIn } from '@/features/auth/useSignIn';
import { useProfile } from '@/features/profile/useProfile';
import { colors, fonts } from '@/lib/theme';

type ProfileFieldId = 'name' | 'birth_dt' | 'birth_place';

const DEFAULT_BIRTH_DATE = new Date(2000, 0, 1, 9, 0);

const PROFILE_FIELDS: {
  id: ProfileFieldId;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  autoCapitalize: 'none' | 'words';
}[] = [
  {
    id: 'name',
    label: 'Name',
    placeholder: 'Enter your full name',
    icon: UserRound,
    autoCapitalize: 'words',
  },
  {
    id: 'birth_dt',
    label: 'Date & Time of Birth',
    placeholder: 'DD/MM/YYYY, HH:MM AM',
    icon: CalendarClock,
    autoCapitalize: 'none',
  },
  {
    id: 'birth_place',
    label: 'Place of Birth',
    placeholder: 'City, State, Country',
    icon: MapPin,
    autoCapitalize: 'words',
  },
];

export default function ProfileScreen() {
  const { isSignedIn, userId, signOut } = useAuth();
  const { user } = useUser();
  const { profile, updateField } = useProfile();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isAuthSheetOpen, setIsAuthSheetOpen] = useState(false);
  const [selectedBirthDateTime, setSelectedBirthDateTime] = useState<Date | null>(null);
  const [isIosDatePickerOpen, setIsIosDatePickerOpen] = useState(false);
  const [iosPickerValue, setIosPickerValue] = useState(DEFAULT_BIRTH_DATE);

  const { signInWithGoogle, signInWithApple, isLoading: isSigningIn } = useSignIn(() => {
    setIsAuthSheetOpen(false);
  });

  const formatBirthDateTime = (value: Date) => {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    const rawHours = value.getHours();
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const meridiem = rawHours >= 12 ? 'PM' : 'AM';
    const hours = rawHours % 12 || 12;
    return `${day}/${month}/${year}, ${hours}:${minutes} ${meridiem}`;
  };

  const saveBirthDateTime = (value: Date) => {
    setSelectedBirthDateTime(value);
    updateField('birth_dt', formatBirthDateTime(value));
  };

  const mergeDateAndTime = (datePart: Date, timePart: Date) =>
    new Date(
      datePart.getFullYear(),
      datePart.getMonth(),
      datePart.getDate(),
      timePart.getHours(),
      timePart.getMinutes()
    );

  const openBirthDateTimePicker = () => {
    Keyboard.dismiss();
    const initialValue = selectedBirthDateTime ?? DEFAULT_BIRTH_DATE;

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialValue,
        mode: 'date',
        onChange: (dateEvent, pickedDate) => {
          if (dateEvent.type !== 'set' || !pickedDate) return;
          const chosenDate = pickedDate;
          DateTimePickerAndroid.open({
            value: mergeDateAndTime(chosenDate, initialValue),
            mode: 'time',
            is24Hour: false,
            onChange: (timeEvent, pickedTime) => {
              if (timeEvent.type !== 'set' || !pickedTime) return;
              saveBirthDateTime(mergeDateAndTime(chosenDate, pickedTime));
            },
          });
        },
      });
      return;
    }

    setIosPickerValue(initialValue);
    setIsIosDatePickerOpen(true);
  };

  const closeSettingsDrawer = () => {
    setIsLanguageDropdownOpen(false);
    setIsSettingsOpen(false);
  };

  const selectLanguage = (language: 'English' | 'Hindi') => {
    updateField('language', language);
    setIsLanguageDropdownOpen(false);
  };

  const displayName = profile.name.trim()
    ? profile.name.trim()
    : user?.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
      : 'Your Aksha Profile';

  const initials = user?.firstName
    ? `${user.firstName[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AmbientBlob color="rgba(212, 190, 228, 0.08)" top={-90} left={-80} size={340} />
      <AmbientBlob color="rgba(184, 152, 122, 0.06)" top={280} left={190} size={280} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          automaticallyAdjustKeyboardInsets
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>You</Text>
            <View style={styles.headerActions}>
              <View style={styles.planBadge}>
                <BadgeCheck size={13} color={colors.secondaryFixed} />
                <Text style={styles.planBadgeText}>Aksha FREE</Text>
              </View>
              <Pressable style={styles.settingsButton} onPress={() => setIsSettingsOpen(true)}>
                <Settings2 size={18} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>
          </View>

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

          <View style={styles.sectionList}>
            {PROFILE_FIELDS.map(({ id, label, placeholder, icon: Icon, autoCapitalize }) => (
              <View key={id} style={styles.infoCard}>
                <View style={styles.infoIconWrap}>
                  <Icon size={18} color={colors.primaryFixed} />
                </View>
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>{label}</Text>
                  {id === 'birth_dt' ? (
                    <Pressable style={styles.infoInput} onPress={openBirthDateTimePicker}>
                      <Text
                        style={[
                          styles.infoInputText,
                          !profile[id] && styles.infoInputPlaceholder,
                        ]}
                      >
                        {profile[id] || placeholder}
                      </Text>
                    </Pressable>
                  ) : (
                    <TextInput
                      value={profile[id]}
                      onChangeText={(text) => updateField(id, text)}
                      placeholder={placeholder}
                      placeholderTextColor={colors.outline}
                      autoCapitalize={autoCapitalize}
                      autoCorrect={false}
                      selectionColor={colors.primary}
                      style={styles.infoInput}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AnimatePresence>
        {isIosDatePickerOpen && (
          <>
            <MotiView
              key="birth-datetime-backdrop"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 180 }}
              style={styles.drawerBackdrop}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setIsIosDatePickerOpen(false)}
              />
            </MotiView>

            <MotiView
              key="birth-datetime-sheet"
              from={{ opacity: 0, translateY: 28 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 28 }}
              transition={{ type: 'timing', duration: 220 }}
              style={styles.dateSheetWrap}
            >
              <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.dateSheetOverlay} />
              <SafeAreaView style={styles.dateSheetSafe} edges={['bottom']}>
                <View style={styles.dateSheetHeader}>
                  <Pressable onPress={() => setIsIosDatePickerOpen(false)}>
                    <Text style={styles.dateSheetAction}>Cancel</Text>
                  </Pressable>
                  <Text style={styles.dateSheetTitle}>Birth Date & Time</Text>
                  <Pressable
                    onPress={() => {
                      saveBirthDateTime(iosPickerValue);
                      setIsIosDatePickerOpen(false);
                    }}
                  >
                    <Text style={styles.dateSheetAction}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  mode="datetime"
                  display="spinner"
                  value={iosPickerValue}
                  onChange={(_, nextValue) => {
                    if (nextValue) setIosPickerValue(nextValue);
                  }}
                  style={styles.iosDatePicker}
                />
              </SafeAreaView>
            </MotiView>
          </>
        )}

        {isSettingsOpen && (
          <>
            <MotiView
              key="settings-backdrop"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 180 }}
              style={styles.drawerBackdrop}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={closeSettingsDrawer} />
            </MotiView>

            <MotiView
              key="settings-drawer"
              from={{ opacity: 0, translateY: 32 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 32 }}
              transition={{ type: 'timing', duration: 220 }}
              style={styles.drawerWrap}
            >
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.drawerOverlay} />

              <SafeAreaView style={styles.drawerSafe} edges={['bottom']}>
                <View style={styles.drawerHandle} />
                <View style={styles.drawerHeader}>
                  <View>
                    <Text style={styles.drawerTitle}>Settings</Text>
                    <Text style={styles.drawerSub}>Profile controls and content preferences.</Text>
                  </View>
                  <Pressable style={styles.drawerCloseButton} onPress={closeSettingsDrawer}>
                    <X size={18} color={colors.onSurfaceVariant} />
                  </Pressable>
                </View>

                {isSignedIn ? (
                  <>
                    <View style={styles.identityRow}>
                      <View style={styles.identityAvatar}>
                        <Text style={styles.identityInitials}>{initials}</Text>
                      </View>
                      <View style={styles.identityText}>
                        <Text style={styles.identityName}>
                          {user?.firstName} {user?.lastName}
                        </Text>
                        <Text style={styles.identityEmail}>
                          {user?.primaryEmailAddress?.emailAddress ?? ''}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <SacredButton
                    label="Sign In"
                    onPress={() => setIsAuthSheetOpen(true)}
                    style={styles.signInButton}
                  />
                )}

                <View style={styles.drawerSection}>
                  <Text style={styles.drawerLabel}>Content Language</Text>
                  <Pressable
                    style={styles.dropdownTrigger}
                    onPress={() => setIsLanguageDropdownOpen((current) => !current)}
                  >
                    <Text style={styles.dropdownTriggerText}>{profile.language}</Text>
                    <ChevronDown
                      size={18}
                      color={colors.onSurfaceVariant}
                      style={isLanguageDropdownOpen ? styles.dropdownChevronOpen : undefined}
                    />
                  </Pressable>

                  {isLanguageDropdownOpen && (
                    <View style={styles.dropdownMenu}>
                      {(['English', 'Hindi'] as const).map((language) => {
                        const isSelected = profile.language === language;
                        return (
                          <Pressable
                            key={language}
                            style={[styles.dropdownOption, isSelected && styles.dropdownOptionSelected]}
                            onPress={() => selectLanguage(language)}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                isSelected && styles.dropdownOptionTextSelected,
                              ]}
                            >
                              {language}
                            </Text>
                            {isSelected && <Check size={16} color={colors.primaryFixed} />}
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>

                <View style={styles.drawerSection}>
                  <Text style={styles.drawerLabel}>Region</Text>
                  <View style={styles.drawerInfoRow}>
                    <Text style={styles.drawerInfoValue}>{profile.region}</Text>
                  </View>
                </View>

                <View style={styles.drawerSection}>
                  <Text style={styles.drawerLabel}>User ID</Text>
                  <View style={styles.drawerInfoRow}>
                    <Text style={styles.drawerInfoValue}>
                      {isSignedIn ? (userId?.slice(0, 12) ?? '—') : '—'}
                    </Text>
                  </View>
                </View>

                {isSignedIn && (
                  <Pressable
                    style={styles.signOutRow}
                    onPress={async () => {
                      await signOut();
                      closeSettingsDrawer();
                    }}
                  >
                    <LogOut size={16} color="#CF6679" />
                    <Text style={styles.signOutText}>Sign Out</Text>
                  </Pressable>
                )}
              </SafeAreaView>
            </MotiView>
          </>
        )}

        {isAuthSheetOpen && (
          <>
            <MotiView
              key="auth-backdrop"
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'timing', duration: 180 }}
              style={styles.drawerBackdrop}
            >
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setIsAuthSheetOpen(false)}
              />
            </MotiView>

            <MotiView
              key="auth-sheet"
              from={{ opacity: 0, translateY: 28 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 28 }}
              transition={{ type: 'timing', duration: 220 }}
              style={styles.drawerWrap}
            >
              <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.drawerOverlay} />

              <SafeAreaView style={styles.drawerSafe} edges={['bottom']}>
                <View style={styles.drawerHandle} />
                <View style={styles.drawerHeader}>
                  <View>
                    <Text style={styles.drawerTitle}>Welcome</Text>
                    <Text style={styles.drawerSub}>Sign in to save your spiritual profile.</Text>
                  </View>
                  <Pressable
                    style={styles.drawerCloseButton}
                    onPress={() => setIsAuthSheetOpen(false)}
                  >
                    <X size={18} color={colors.onSurfaceVariant} />
                  </Pressable>
                </View>

                <View style={styles.oauthList}>
                  <OAuthButton
                    provider="google"
                    onPress={signInWithGoogle}
                    isLoading={isSigningIn}
                  />
                  <OAuthButton
                    provider="apple"
                    onPress={signInWithApple}
                    isLoading={isSigningIn}
                  />
                </View>
              </SafeAreaView>
            </MotiView>
          </>
        )}
      </AnimatePresence>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 160,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontFamily: fonts.headlineExtra,
    fontSize: 34,
    color: colors.onSurface,
    letterSpacing: -0.8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  },
  planBadgeText: {
    fontFamily: fonts.label,
    fontSize: 10,
    color: colors.secondaryFixed,
    letterSpacing: 1.2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
  },
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
  sectionList: { gap: 14 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(37, 38, 38, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}18`,
  },
  infoText: { flex: 1, gap: 4 },
  infoLabel: {
    fontFamily: fonts.label,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    color: colors.onSurfaceVariant,
  },
  infoInput: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.onSurface,
    letterSpacing: -0.2,
    backgroundColor: 'rgba(14, 14, 14, 0.45)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}40`,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoInputText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.onSurface,
    letterSpacing: -0.2,
  },
  infoInputPlaceholder: { color: colors.outline },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
  },
  dateSheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 55,
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  dateSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 19, 19, 0.92)',
  },
  dateSheetSafe: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
  },
  dateSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateSheetTitle: {
    fontFamily: fonts.headline,
    fontSize: 17,
    color: colors.onSurface,
    letterSpacing: -0.2,
  },
  dateSheetAction: {
    fontFamily: fonts.label,
    fontSize: 13,
    color: colors.primaryFixed,
  },
  iosDatePicker: { alignSelf: 'stretch' },
  drawerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    justifyContent: 'flex-end',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 19, 19, 0.9)',
  },
  drawerSafe: {
    maxHeight: '78%',
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(19, 19, 19, 0.92)',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 9999,
    backgroundColor: `${colors.onSurfaceVariant}66`,
    marginBottom: 18,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
    gap: 12,
  },
  drawerTitle: {
    fontFamily: fonts.headline,
    fontSize: 24,
    color: colors.onSurface,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  drawerSub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 19,
    maxWidth: 220,
  },
  drawerCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: `${colors.outlineVariant}33`,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
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
    marginBottom: 24,
  },
  drawerSection: { marginBottom: 18 },
  drawerLabel: {
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
  drawerInfoRow: {
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  drawerInfoValue: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.onSurface,
  },
  oauthList: { gap: 12 },
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
    marginTop: 8,
  },
  signOutText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: '#CF6679',
  },
});
