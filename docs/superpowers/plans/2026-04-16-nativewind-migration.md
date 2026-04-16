# NativeWind Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all `StyleSheet.create()` calls with NativeWind `className` props across 50 files, syncing the existing ThemeProvider with NativeWind's `setColorScheme()`.

**Architecture:** NativeWind v4 + Tailwind CSS v3 are already installed. `ThemeProvider` is kept slim — `setColorScheme()` from nativewind is wired in so `dark:` Tailwind classes respond to user preference. `useThemedStyles()` is deleted; `useTheme()` stays for icon colors, `gradients`, `glassMorphism`, and `isDark` (BlurView tint). `lib/typography.ts` is deleted; `scaleFont()` calls are replaced with Tailwind text size classes.

**Tech Stack:** NativeWind v4, Tailwind CSS v3, React Native, Expo SDK 54, TypeScript

**Excluded:** All `app/onboarding/` screens (12 files) — skip these entirely.

**Rules — read before every task:**
- `useAnimatedStyle()` return values → always keep as `style={}` (Reanimated requirement)
- `LinearGradient colors` prop → always keep as `style={}` or prop (array of strings)
- `BlurView intensity` and `tint` props → always keep as props
- Dynamic pixel values computed at runtime (e.g. `selectorWidth`) → keep as `style={}`
- `StyleSheet.absoluteFill` / `StyleSheet.absoluteFillObject` → `absolute inset-0` className
- Dark mode: `darkMode ? A : B` → `className="B dark:A"` (light is default, dark: overrides)
- Opacity: `rgba(255,255,255,0.08)` → `white/8`; `rgba(0,0,0,0.08)` → `black/8`
- Font families: `fonts.headline` → `font-headline`, `fonts.label` → `font-label`, `fonts.body` → `font-body`, `fonts.bodyMedium` → `font-body-medium`, `fonts.headlineExtra` → `font-headline-extra`, `fonts.labelLight` → `font-label-light`
- `scaleFont(10)` → `text-xs`, `scaleFont(12)` → `text-xs`, `scaleFont(13)` → `text-sm`, `scaleFont(14)` → `text-sm`, `scaleFont(15)` → `text-base`, `scaleFont(16)` → `text-base`, `scaleFont(17)` → `text-lg`, `scaleFont(18)` → `text-lg`, `scaleFont(20)` → `text-xl`, `scaleFont(24)` → `text-2xl`

---

## Task 1: Wire NativeWind into ThemeProvider + delete typography.ts

**Files:**
- Modify: `lib/theme-context.tsx`
- Delete: `lib/typography.ts`

- [ ] **Step 1: Update `lib/theme-context.tsx`**

Replace the entire file with:

```tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import {
  darkColors,
  lightColors,
  darkGlassMorphism,
  lightGlassMorphism,
  darkGradients,
  lightGradients,
  type Colors,
  type GlassMorphism,
  type Gradients,
} from '@/lib/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = '@aksha/theme-preference';

interface ThemeContextValue {
  colors: Colors;
  glassMorphism: GlassMorphism;
  gradients: Gradients;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [osScheme, setOsScheme] = useState(Appearance.getColorScheme());
  const isMounted = useRef(true);
  const userSetRef = useRef(false);
  const { setColorScheme } = useColorScheme();

  // Load persisted preference on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!isMounted.current) return;
      if (userSetRef.current) return;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
        setColorScheme(stored === 'system' ? 'system' : stored);
      }
    });
    return () => {
      isMounted.current = false;
    };
  }, [setColorScheme]);

  // Listen for OS colour scheme changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setOsScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setPreference = useCallback((p: ThemePreference) => {
    userSetRef.current = true;
    setPreferenceState(p);
    AsyncStorage.setItem(STORAGE_KEY, p);
    setColorScheme(p === 'system' ? 'system' : p);
  }, [setColorScheme]);

  const isDark = useMemo(() => {
    if (preference === 'light') return false;
    if (preference === 'dark') return true;
    return osScheme !== 'light';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preference, osScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      glassMorphism: isDark ? darkGlassMorphism : lightGlassMorphism,
      gradients: isDark ? darkGradients : lightGradients,
      isDark,
      preference,
      setPreference,
    }),
    [isDark, preference, setPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

- [ ] **Step 2: Delete `lib/typography.ts`**

```bash
rm lib/typography.ts
```

- [ ] **Step 3: Commit**

```bash
git add lib/theme-context.tsx lib/typography.ts
git commit -m "feat(theme): wire NativeWind setColorScheme into ThemeProvider, remove useThemedStyles and typography.ts"
```

---

## Task 2: Migrate `components/ui/PageAmbientBlobs.tsx` and `components/ui/AmbientBlob.tsx`

**Files:**
- Modify: `components/ui/PageAmbientBlobs.tsx`
- Modify: `components/ui/AmbientBlob.tsx`

- [ ] **Step 1: Read both files**

```bash
# Read current content
```

Read [components/ui/PageAmbientBlobs.tsx](components/ui/PageAmbientBlobs.tsx) and [components/ui/AmbientBlob.tsx](components/ui/AmbientBlob.tsx).

- [ ] **Step 2: Migrate `PageAmbientBlobs.tsx`**

Replace any `StyleSheet.absoluteFillObject` / `StyleSheet.absoluteFill` usage with `className="absolute inset-0"`. Remove `StyleSheet` import if no longer used.

- [ ] **Step 3: Migrate `AmbientBlob.tsx`**

Replace `position: 'absolute', zIndex: -1` style with `className="absolute -z-10"`. Remove `StyleSheet` import if no longer used. Keep any SVG props as-is.

- [ ] **Step 4: Commit**

```bash
git add components/ui/PageAmbientBlobs.tsx components/ui/AmbientBlob.tsx
git commit -m "feat(ui): migrate PageAmbientBlobs and AmbientBlob to NativeWind"
```

---

## Task 3: Migrate `components/ui/PageHero.tsx`

**Files:**
- Modify: `components/ui/PageHero.tsx`

- [ ] **Step 1: Read the file**

Read [components/ui/PageHero.tsx](components/ui/PageHero.tsx).

- [ ] **Step 2: Migrate**

Replace `StyleSheet.create` and `useThemedStyles` with `className` props. Remove `StyleSheet`, `useThemedStyles` imports. Keep `useTheme` if `colors.*` or `isDark` is needed for non-className props (icon colors etc).

Typical translations for this file:
- Container: `flex-1` or `gap-*`
- Text colors: `text-on-surface`, `text-on-surface-variant`
- Font: `font-headline`, `font-body`, etc.
- Spacing: `mb-*`, `px-*`, `py-*`

- [ ] **Step 3: Commit**

```bash
git add components/ui/PageHero.tsx
git commit -m "feat(ui): migrate PageHero to NativeWind"
```

---

## Task 4: Migrate `components/ui/GlowCard.tsx` and `components/ui/GlassCard.tsx`

**Files:**
- Modify: `components/ui/GlowCard.tsx`
- Modify: `components/ui/GlassCard.tsx`

- [ ] **Step 1: Read both files**

Read [components/ui/GlowCard.tsx](components/ui/GlowCard.tsx) and [components/ui/GlassCard.tsx](components/ui/GlassCard.tsx).

- [ ] **Step 2: Migrate `GlowCard.tsx`**

- Remove `useThemedStyles`, keep `useTheme()` for `colors.primaryFixedDim` passed to `LinearGradient colors` prop (must stay inline)
- Replace layout/border/spacing StyleSheet styles with `className`
- Keep `LinearGradient` `colors` prop as-is (array of strings, cannot be className)

- [ ] **Step 3: Migrate `GlassCard.tsx`**

- Remove `useThemedStyles`, keep `useTheme()` for `isDark` (BlurView tint prop — cannot be className)
- Replace layout/border/padding StyleSheet styles with `className`
- Keep `BlurView intensity` and `tint` props as-is

- [ ] **Step 4: Commit**

```bash
git add components/ui/GlowCard.tsx components/ui/GlassCard.tsx
git commit -m "feat(ui): migrate GlowCard and GlassCard to NativeWind"
```

---

## Task 5: Migrate `components/ui/SacredButton.tsx`

**Files:**
- Modify: `components/ui/SacredButton.tsx`

- [ ] **Step 1: Read the file**

Read [components/ui/SacredButton.tsx](components/ui/SacredButton.tsx).

- [ ] **Step 2: Migrate**

- Remove `useThemedStyles`, keep `useTheme()` for `gradients.primaryToContainer` passed to `LinearGradient colors`
- Replace button container, text, padding StyleSheet styles with `className`
- Keep `LinearGradient colors` prop inline
- Keep `useAnimatedStyle()` return value as `style={}` (Reanimated)

- [ ] **Step 3: Commit**

```bash
git add components/ui/SacredButton.tsx
git commit -m "feat(ui): migrate SacredButton to NativeWind"
```

---

## Task 6: Migrate `components/ui/BottomSheet.tsx`

**Files:**
- Modify: `components/ui/BottomSheet.tsx`

- [ ] **Step 1: Read the file**

Read [components/ui/BottomSheet.tsx](components/ui/BottomSheet.tsx).

- [ ] **Step 2: Migrate**

- Remove `useThemedStyles`, keep `useTheme()` for `isDark` (BlurView tint)
- Replace overlay/container/handle StyleSheet styles with `className`
- **Keep** all `useAnimatedStyle()` return values as `style={}` (Reanimated)
- **Keep** `StyleSheet.absoluteFill` used inside `style={}` prop for BlurView → change to `className="absolute inset-0"` on the BlurView wrapper if possible, or keep as `style={StyleSheet.absoluteFill}` only if the component requires it as a style prop
- Keep `BlurView intensity` and `tint` props

- [ ] **Step 3: Commit**

```bash
git add components/ui/BottomSheet.tsx
git commit -m "feat(ui): migrate BottomSheet to NativeWind"
```

---

## Task 7: Migrate `components/ui/ToastProvider.tsx`

**Files:**
- Modify: `components/ui/ToastProvider.tsx`

- [ ] **Step 1: Read the file**

Read [components/ui/ToastProvider.tsx](components/ui/ToastProvider.tsx).

- [ ] **Step 2: Migrate**

- Remove `useThemedStyles`
- Replace static container/text/padding StyleSheet styles with `className`
- **Keep** `Animated.Value` style objects as `style={}` (React Native Animated API — not Reanimated, but animated style objects still cannot be className)
- Colors for toast type variants (success/error/info) can use conditional `className` strings

- [ ] **Step 3: Commit**

```bash
git add components/ui/ToastProvider.tsx
git commit -m "feat(ui): migrate ToastProvider to NativeWind"
```

---

## Task 8: Migrate `components/ui/TabBar.tsx`

**Files:**
- Modify: `components/ui/TabBar.tsx`

- [ ] **Step 1: Read the file**

Read [components/ui/TabBar.tsx](components/ui/TabBar.tsx).

- [ ] **Step 2: Migrate**

This file has multiple constraints — read the rules section at the top carefully.

- Remove `useThemedStyles`, `scaleFont` imports
- Keep `useTheme()` for `isDark` (BlurView tint, inactiveIconColor)
- The `staticStyles` object (module-level `StyleSheet.create`) — migrate these to `className` on the elements directly
- **Keep** `selectorStyle` from `useAnimatedStyle()` as `style={}` (Reanimated)
- **Keep** `{ width: selectorWidth, left: BAR_PADDING, ... }` as `style={}` (dynamic pixel values)
- **Keep** `BlurView intensity={36} tint={...}` props as-is
- **Keep** `style={StyleSheet.absoluteFill}` on BlurView (or replace with `className="absolute inset-0"`)

For the container styles (previously in `useThemedStyles`):
```tsx
// container
className="w-[95%] max-w-[620px] rounded-full overflow-hidden p-1 border border-white/8 dark:border-black/8 bg-[rgba(250,247,242,0.10)] dark:bg-[rgba(18,18,22,0.10)] shadow-black"
// Use style for shadow props (shadowOpacity etc not in Tailwind)
```

For `tabLabel`:
```tsx
className="font-label text-xs leading-3 text-black/35 dark:text-white/40 tracking-[0.2px] text-center"
```

For `tabLabelActive` — use conditional className:
```tsx
className={`font-label text-xs ... ${isFocused ? 'text-on-surface' : 'text-black/35 dark:text-white/40'}`}
```

Note: `styles.tabLabelActive.color` is currently used for `iconColor`. After migration, derive `iconColor` directly from `isDark`:
```tsx
const activeIconColor = isDark ? '#ffffff' : '#000000'; // colors.onSurface
const inactiveIconColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.35)';
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/TabBar.tsx
git commit -m "feat(ui): migrate TabBar to NativeWind"
```

---

## Task 9: Migrate `components/ui/GurukulYogiBackdrop.tsx`

**Files:**
- Modify: `components/ui/GurukulYogiBackdrop.tsx`

- [ ] **Step 1: Read the file**

Read [components/ui/GurukulYogiBackdrop.tsx](components/ui/GurukulYogiBackdrop.tsx).

- [ ] **Step 2: Migrate**

- Remove `StyleSheet` import and module-level `StyleSheet.create` call
- Replace static layout styles with `className`
- **Keep** any dynamic computed size values (canvasWidth, canvasHeight, etc.) as `style={}` inline

- [ ] **Step 3: Commit**

```bash
git add components/ui/GurukulYogiBackdrop.tsx
git commit -m "feat(ui): migrate GurukulYogiBackdrop to NativeWind"
```

---

## Task 10: Migrate `features/auth/OAuthButton.tsx`

**Files:**
- Modify: `features/auth/OAuthButton.tsx`

- [ ] **Step 1: Migrate**

Current `useThemedStyles` output:
- `button`: `rounded-2xl bg-surface-container-low border border-white/7 dark:border-black/7`
- `pressed`: handled via Pressable `style={({ pressed }) => pressed && 'opacity-70'}` — use inline style `opacity: 0.7`
- `inner`: `flex-row items-center px-4 py-4 gap-[14px]`
- `symbolWrap`: `w-8 h-8 rounded-lg items-center justify-center bg-white/6 dark:bg-black/6`
- `label`: `flex-1 font-body-medium text-base text-on-surface`
- `placeholder`: `w-5`

Remove `useThemedStyles`, `fonts` import, `StyleSheet` import. Keep `useTheme()` only if `colors.onSurface` is needed for the `ActivityIndicator color` prop.

```tsx
import React from 'react';
import { Pressable, View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/lib/theme-context';
import AppleLogoIcon from './AppleLogo';
import GoogleLogoSolidIcon from './GoogleLogo';

// ... (keep interfaces and constants)

export function OAuthButton({ provider, onPress, isLoading }: OAuthButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => pressed ? { opacity: 0.7 } : undefined}
      className="rounded-2xl bg-surface-container-low border border-white/7 dark:border-black/7"
      onPress={onPress}
      disabled={isLoading}
    >
      <View className="flex-row items-center px-4 py-4 gap-[14px]">
        <View className="w-8 h-8 rounded-lg items-center justify-center bg-white/6 dark:bg-black/6">
          {PROVIDER_SYMBOL[provider]}
        </View>
        <Text className="flex-1 font-body-medium text-base text-on-surface">{PROVIDER_LABEL[provider]}</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.onSurface} />
        ) : (
          <View className="w-5" />
        )}
      </View>
    </Pressable>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add features/auth/OAuthButton.tsx
git commit -m "feat(auth): migrate OAuthButton to NativeWind"
```

---

## Task 11: Migrate `features/onboarding/ChoiceCard.tsx`

**Files:**
- Modify: `features/onboarding/ChoiceCard.tsx`

- [ ] **Step 1: Read the file**

Read [features/onboarding/ChoiceCard.tsx](features/onboarding/ChoiceCard.tsx).

- [ ] **Step 2: Migrate**

Remove `useThemedStyles`, `StyleSheet` import. Replace styles with `className`. Keep `useTheme()` if icon colors or gradient colors are needed inline.

- [ ] **Step 3: Commit**

```bash
git add features/onboarding/ChoiceCard.tsx
git commit -m "feat(onboarding): migrate ChoiceCard to NativeWind"
```

---

## Task 12: Migrate `features/profile/components/ProfileHeader.tsx` and `features/profile/components/ProfileHero.tsx`

**Files:**
- Modify: `features/profile/components/ProfileHeader.tsx`
- Modify: `features/profile/components/ProfileHero.tsx`

- [ ] **Step 1: Read both files**

Read [features/profile/components/ProfileHeader.tsx](features/profile/components/ProfileHeader.tsx) and [features/profile/components/ProfileHero.tsx](features/profile/components/ProfileHero.tsx).

- [ ] **Step 2: Migrate `ProfileHeader.tsx`**

- Remove `useThemedStyles`, `StyleSheet` import
- Replace layout/text/button styles with `className`
- Keep `useTheme()` for icon `color` props if needed

- [ ] **Step 3: Migrate `ProfileHero.tsx`**

- Remove `useThemedStyles`, `StyleSheet` import
- Replace avatar/text/container styles with `className`
- Keep `useTheme()` for colors used in non-className props

- [ ] **Step 4: Commit**

```bash
git add features/profile/components/ProfileHeader.tsx features/profile/components/ProfileHero.tsx
git commit -m "feat(profile): migrate ProfileHeader and ProfileHero to NativeWind"
```

---

## Task 13: Migrate `features/profile/components/ProfileFields.tsx` and `features/profile/components/ProfileDateTimeSheet.tsx`

**Files:**
- Modify: `features/profile/components/ProfileFields.tsx`
- Modify: `features/profile/components/ProfileDateTimeSheet.tsx`

- [ ] **Step 1: Read both files**

Read [features/profile/components/ProfileFields.tsx](features/profile/components/ProfileFields.tsx) and [features/profile/components/ProfileDateTimeSheet.tsx](features/profile/components/ProfileDateTimeSheet.tsx).

- [ ] **Step 2: Migrate both files**

- Remove `useThemedStyles`, `StyleSheet` imports
- Replace all layout/text/border styles with `className`
- Keep `useTheme()` for any colors used in non-className props (e.g. icon colors)

- [ ] **Step 3: Commit**

```bash
git add features/profile/components/ProfileFields.tsx features/profile/components/ProfileDateTimeSheet.tsx
git commit -m "feat(profile): migrate ProfileFields and ProfileDateTimeSheet to NativeWind"
```

---

## Task 14: Migrate `features/profile/components/ProfileAuthSheet.tsx`

**Files:**
- Modify: `features/profile/components/ProfileAuthSheet.tsx`

- [ ] **Step 1: Migrate**

Current styles map to:
- `sheet`: applied via `sheetStyle` prop on BottomSheet — pass `className` or inline borderRadius since sheetStyle is a StyleProp
  - Note: `sheetStyle` prop accepts StyleProp — keep as `style={{ borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingBottom: 30 }}` inline since it's a prop not a View style
- `header`: `flex-row justify-between items-start mb-[22px] gap-3`
- `title`: `font-headline text-2xl text-on-surface tracking-[-0.4px] mb-1`
- `subtitle`: `font-body text-sm text-on-surface-variant leading-[19px] max-w-[220px]`
- `closeButton`: `w-9 h-9 rounded-[18px] items-center justify-center bg-surface-container-low border border-outline-variant/20`
- `oauthList`: `gap-3`

Remove `useThemedStyles`, `StyleSheet`, `fonts` imports. Keep `useTheme()` for `colors.onSurfaceVariant` used as X icon color prop.

```tsx
export function ProfileAuthSheet({ visible, onClose, onSignInWithGoogle, onSignInWithApple, isLoading }: ProfileAuthSheetProps) {
  const { colors } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} sheetStyle={{ borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingBottom: 30 }}>
      <View className="flex-row justify-between items-start mb-[22px] gap-3">
        <View>
          <Text className="font-headline text-2xl text-on-surface tracking-[-0.4px] mb-1">Welcome</Text>
          <Text className="font-body text-sm text-on-surface-variant leading-[19px] max-w-[220px]">Sign in to save your spiritual profile.</Text>
        </View>
        <Pressable className="w-9 h-9 rounded-[18px] items-center justify-center bg-surface-container-low border border-outline-variant/20" onPress={onClose}>
          <X size={18} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>

      <View className="gap-3">
        <OAuthButton provider="google" onPress={onSignInWithGoogle} isLoading={isLoading} />
        <OAuthButton provider="apple" onPress={onSignInWithApple} isLoading={isLoading} />
      </View>
    </BottomSheet>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add features/profile/components/ProfileAuthSheet.tsx
git commit -m "feat(profile): migrate ProfileAuthSheet to NativeWind"
```

---

## Task 15: Migrate `features/profile/components/ProfileSettingsSheet.tsx`

**Files:**
- Modify: `features/profile/components/ProfileSettingsSheet.tsx`

- [ ] **Step 1: Read the file**

Read [features/profile/components/ProfileSettingsSheet.tsx](features/profile/components/ProfileSettingsSheet.tsx).

- [ ] **Step 2: Migrate**

Large file. Work section by section:
- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports
- Replace all styles with `className`
- Keep `useTheme()` for icon `color` props
- Any `sheetStyle` / bottom sheet style props → pass as inline style object

- [ ] **Step 3: Commit**

```bash
git add features/profile/components/ProfileSettingsSheet.tsx
git commit -m "feat(profile): migrate ProfileSettingsSheet to NativeWind"
```

---

## Task 16: Migrate `features/profile/components/PremiumCard.tsx`

**Files:**
- Modify: `features/profile/components/PremiumCard.tsx`

- [ ] **Step 1: Read the file**

Read [features/profile/components/PremiumCard.tsx](features/profile/components/PremiumCard.tsx).

- [ ] **Step 2: Migrate**

- Remove `StyleSheet`, `useThemedStyles` imports
- Replace layout/text styles with `className`
- Keep `LinearGradient colors` prop inline (hardcoded array of strings)

- [ ] **Step 3: Commit**

```bash
git add features/profile/components/PremiumCard.tsx
git commit -m "feat(profile): migrate PremiumCard to NativeWind"
```

---

## Task 17: Migrate `features/billing/PaywallSheet.tsx` and `features/billing/PlansScreen.tsx`

**Files:**
- Modify: `features/billing/PaywallSheet.tsx`
- Modify: `features/billing/PlansScreen.tsx`

- [ ] **Step 1: Read both files**

Read [features/billing/PaywallSheet.tsx](features/billing/PaywallSheet.tsx) and [features/billing/PlansScreen.tsx](features/billing/PlansScreen.tsx).

- [ ] **Step 2: Migrate `PaywallSheet.tsx`**

Large file with inner helper components `PlanFeatureRow` and `FeatureItem`. Migrate each component's styles:
- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports for each component
- Replace with `className`
- Keep `LinearGradient colors` props inline
- Keep `useTheme()` for icon color props

- [ ] **Step 3: Migrate `PlansScreen.tsx`**

Large file with inner `FeatureRow` component. Same approach as above.

- [ ] **Step 4: Commit**

```bash
git add features/billing/PaywallSheet.tsx features/billing/PlansScreen.tsx
git commit -m "feat(billing): migrate PaywallSheet and PlansScreen to NativeWind"
```

---

## Task 18: Migrate `features/chat/ChatBubble.tsx` and `features/chat/ChatInput.tsx`

**Files:**
- Modify: `features/chat/ChatBubble.tsx`
- Modify: `features/chat/ChatInput.tsx`

- [ ] **Step 1: Read both files**

Read [features/chat/ChatBubble.tsx](features/chat/ChatBubble.tsx) and [features/chat/ChatInput.tsx](features/chat/ChatInput.tsx).

- [ ] **Step 2: Migrate `ChatBubble.tsx`**

Large file with inner `VaniCard` component:
- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports
- Replace bubble container/text/spacing styles with `className`
- Keep `useTheme()` for `colors.*` used in non-className props
- Keep `LinearGradient colors` inline

- [ ] **Step 3: Migrate `ChatInput.tsx`**

- Remove `useThemedStyles`, `StyleSheet` imports
- Replace input container/text styles with `className`
- Keep `useTheme()` for `gradients` passed to `LinearGradient colors`

- [ ] **Step 4: Commit**

```bash
git add features/chat/ChatBubble.tsx features/chat/ChatInput.tsx
git commit -m "feat(chat): migrate ChatBubble and ChatInput to NativeWind"
```

---

## Task 19: Migrate `features/ask/NaradIntro.tsx`, `features/ask/GuideSelector.tsx`, `features/ask/GuideLoader.tsx`

**Files:**
- Modify: `features/ask/NaradIntro.tsx`
- Modify: `features/ask/GuideSelector.tsx`
- Modify: `features/ask/GuideLoader.tsx`

- [ ] **Step 1: Read all three files**

Read [features/ask/NaradIntro.tsx](features/ask/NaradIntro.tsx), [features/ask/GuideSelector.tsx](features/ask/GuideSelector.tsx), and [features/ask/GuideLoader.tsx](features/ask/GuideLoader.tsx).

- [ ] **Step 2: Migrate `NaradIntro.tsx`**

- Remove `useThemedStyles`, `StyleSheet` imports
- Replace layout/text styles with `className`
- **Keep** `useAnimatedStyle()` return values as `style={}` (Reanimated)

- [ ] **Step 3: Migrate `GuideSelector.tsx`**

Complex: carousel + Reanimated + `useThemedStyles`:
- Remove `useThemedStyles`, `StyleSheet` imports
- Replace static layout/card/text styles with `className`
- **Keep** all `useAnimatedStyle()` return values as `style={}` (Reanimated)
- **Keep** dynamic width/transform values as `style={}`

- [ ] **Step 4: Migrate `GuideLoader.tsx`**

Has both a module-level `orbStyles` StyleSheet (static, no theme) and `useThemedStyles`:
- Replace `orbStyles` (module-level) with `className` props inline on the elements
- Remove `useThemedStyles`, `StyleSheet` imports
- Replace remaining styles with `className`

- [ ] **Step 5: Commit**

```bash
git add features/ask/NaradIntro.tsx features/ask/GuideSelector.tsx features/ask/GuideLoader.tsx
git commit -m "feat(ask): migrate NaradIntro, GuideSelector, GuideLoader to NativeWind"
```

---

## Task 20: Migrate `features/daily/DailyArthCard.tsx`, `features/daily/SacredDayCard.tsx`, `features/daily/LessonCard.tsx`

**Files:**
- Modify: `features/daily/DailyArthCard.tsx`
- Modify: `features/daily/SacredDayCard.tsx`
- Modify: `features/daily/LessonCard.tsx`

- [ ] **Step 1: Read all three files**

Read [features/daily/DailyArthCard.tsx](features/daily/DailyArthCard.tsx), [features/daily/SacredDayCard.tsx](features/daily/SacredDayCard.tsx), and [features/daily/LessonCard.tsx](features/daily/LessonCard.tsx).

- [ ] **Step 2: Migrate each file**

For each file:
- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports
- Replace styles with `className`
- Keep `LinearGradient colors` props inline (use `colors.surface` from `useTheme()` where needed)
- Keep moti `animate` props as-is (they are not StyleSheet based)

- [ ] **Step 3: Commit**

```bash
git add features/daily/DailyArthCard.tsx features/daily/SacredDayCard.tsx features/daily/LessonCard.tsx
git commit -m "feat(daily): migrate DailyArthCard, SacredDayCard, LessonCard to NativeWind"
```

---

## Task 21: Migrate `features/gurukul/FeaturedCard.tsx`, `features/gurukul/LessonRow.tsx`, `features/gurukul/CategoryCard.tsx`

**Files:**
- Modify: `features/gurukul/FeaturedCard.tsx`
- Modify: `features/gurukul/LessonRow.tsx`
- Modify: `features/gurukul/CategoryCard.tsx`

- [ ] **Step 1: Read all three files**

Read [features/gurukul/FeaturedCard.tsx](features/gurukul/FeaturedCard.tsx), [features/gurukul/LessonRow.tsx](features/gurukul/LessonRow.tsx), and [features/gurukul/CategoryCard.tsx](features/gurukul/CategoryCard.tsx).

- [ ] **Step 2: Migrate each file**

- Remove `useThemedStyles`, `StyleSheet` imports
- Replace styles with `className`
- `FeaturedCard`: Keep `LinearGradient colors` prop inline (dynamic from theme)
- `CategoryCard`: Progress bar has inline `width` style (computed percentage) — **keep** that `style={{ width: ... }}` inline

- [ ] **Step 3: Commit**

```bash
git add features/gurukul/FeaturedCard.tsx features/gurukul/LessonRow.tsx features/gurukul/CategoryCard.tsx
git commit -m "feat(gurukul): migrate FeaturedCard, LessonRow, CategoryCard to NativeWind"
```

---

## Task 22: Migrate `features/horoscope/` (6 files)

**Files:**
- Modify: `features/horoscope/DailyAlignmentCard.tsx`
- Modify: `features/horoscope/FocusAreaCard.tsx`
- Modify: `features/horoscope/FocusAreaChips.tsx`
- Modify: `features/horoscope/VedicReasoningAccordion.tsx`
- Modify: `features/horoscope/TimelineItem.tsx`
- Modify: `features/horoscope/TimeOfDayCard.tsx`

- [ ] **Step 1: Read all six files**

Read each file in [features/horoscope/](features/horoscope/).

- [ ] **Step 2: Migrate each file**

- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports
- Replace styles with `className`

Specific notes:
- `FocusAreaChips.tsx`: Has dynamic chip colors from `AREA_META` object — keep `style={{ backgroundColor: ..., color: ... }}` inline for those (data-driven colors not in Tailwind)
- `VedicReasoningAccordion.tsx`: Has Reanimated shared values for `maxHeight`/`opacity`/`chevronRotation` — **keep** `useAnimatedStyle()` return values as `style={}`
- `TimelineItem.tsx`: Uses moti — keep moti `animate` props as-is
- `TimeOfDayCard.tsx`: Has `ImageBackground` + `BlurView` + `LinearGradient` — keep their props inline; replace container layout styles with `className`

- [ ] **Step 3: Commit**

```bash
git add features/horoscope/DailyAlignmentCard.tsx features/horoscope/FocusAreaCard.tsx features/horoscope/FocusAreaChips.tsx features/horoscope/VedicReasoningAccordion.tsx features/horoscope/TimelineItem.tsx features/horoscope/TimeOfDayCard.tsx
git commit -m "feat(horoscope): migrate all horoscope components to NativeWind"
```

---

## Task 23: Migrate `features/muhurat/MuhuratCard.tsx` and `features/muhurat/components/MuhuratDateSheet.tsx`

**Files:**
- Modify: `features/muhurat/MuhuratCard.tsx`
- Modify: `features/muhurat/components/MuhuratDateSheet.tsx`

- [ ] **Step 1: Read both files**

Read [features/muhurat/MuhuratCard.tsx](features/muhurat/MuhuratCard.tsx) and [features/muhurat/components/MuhuratDateSheet.tsx](features/muhurat/components/MuhuratDateSheet.tsx).

- [ ] **Step 2: Migrate `MuhuratCard.tsx`**

Large file with `scoreColor` function that returns dynamic colors:
- Remove `useThemedStyles`, `StyleSheet` imports
- Replace static styles with `className`
- The `scoreColor` function returns a color string used inline as `style={{ color: scoreColor(...) }}` — **keep** these inline (dynamic runtime values)

- [ ] **Step 3: Migrate `MuhuratDateSheet.tsx`**

- Remove `useThemedStyles`, `StyleSheet` imports
- Replace styles with `className`

- [ ] **Step 4: Commit**

```bash
git add features/muhurat/MuhuratCard.tsx features/muhurat/components/MuhuratDateSheet.tsx
git commit -m "feat(muhurat): migrate MuhuratCard and MuhuratDateSheet to NativeWind"
```

---

## Task 24: Migrate `app/(tabs)/profile.tsx`

**Files:**
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Migrate**

Current `useThemedStyles` output:
- `container`: `flex-1 bg-surface`
- `scroll`: `flex-1`
- `scrollContent`: `px-[${layout.screenPaddingX}px] pt-4 pb-44 gap-4`
- `debugActions`: `gap-3`
- `StyleSheet.absoluteFill` on the PlansScreen wrapper View: `absolute inset-0`

```tsx
// Remove useThemedStyles, StyleSheet, layout imports (if only used for screenPaddingX)
// Check layout.screenPaddingX value in lib/theme.ts first

<SafeAreaView className="flex-1 bg-surface" edges={['top']}>
  <PageAmbientBlobs />
  <ScrollView
    className="flex-1"
    contentContainerStyle={{ paddingHorizontal: layout.screenPaddingX, paddingTop: 16, paddingBottom: 176, gap: 16 }}
    showsVerticalScrollIndicator={false}
  >
    ...
    {__DEV__ && (
      <View className="gap-3">
        ...
      </View>
    )}
  </ScrollView>
  ...
  {isPlansOpen && (
    <View className="absolute inset-0">
      <PlansScreen ... />
    </View>
  )}
</SafeAreaView>
```

Note: `contentContainerStyle` on ScrollView accepts a StyleProp — use inline object for the padding values since `layout.screenPaddingX` is a runtime value. Remove `StyleSheet` import, `useThemedStyles` import, `style` import if only used for screenPaddingX (check if `layout` is still needed).

- [ ] **Step 2: Commit**

```bash
git add app/(tabs)/profile.tsx
git commit -m "feat(tabs): migrate profile screen to NativeWind"
```

---

## Task 25: Migrate `app/(tabs)/_layout.tsx` and `app/(tabs)/index.tsx`

**Files:**
- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/(tabs)/index.tsx`

- [ ] **Step 1: Read both files**

Read [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) and [app/(tabs)/index.tsx](app/(tabs)/index.tsx).

- [ ] **Step 2: Migrate `_layout.tsx`**

Trivial: `StyleSheet.create({ root: { flex: 1 } })` → `className="flex-1"` on the root View. Remove `StyleSheet` import.

- [ ] **Step 3: Migrate `index.tsx`**

- Remove `useThemedStyles`, `StyleSheet` imports
- Replace layout/container styles with `className`
- Keep `useTheme()` if colors are needed for non-className props

- [ ] **Step 4: Commit**

```bash
git add "app/(tabs)/_layout.tsx" "app/(tabs)/index.tsx"
git commit -m "feat(tabs): migrate tab layout and home screen to NativeWind"
```

---

## Task 26: Migrate `app/(tabs)/ask.tsx`

**Files:**
- Modify: `app/(tabs)/ask.tsx`

- [ ] **Step 1: Read the file**

Read [app/(tabs)/ask.tsx](app/(tabs)/ask.tsx).

- [ ] **Step 2: Migrate**

Large screen with inner `TypingIndicator` component:
- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports for both the screen and inner component
- Replace layout/container/text styles with `className`
- Keep `useTheme()` for icon colors, gradient colors
- **Keep** any `useAnimatedStyle()` values as `style={}` (Reanimated in TypingIndicator dot animations)

- [ ] **Step 3: Commit**

```bash
git add "app/(tabs)/ask.tsx"
git commit -m "feat(tabs): migrate ask screen and TypingIndicator to NativeWind"
```

---

## Task 27: Migrate `app/(tabs)/gurukul.tsx` and `app/(tabs)/muhurat.tsx`

**Files:**
- Modify: `app/(tabs)/gurukul.tsx`
- Modify: `app/(tabs)/muhurat.tsx`

- [ ] **Step 1: Read both files**

Read [app/(tabs)/gurukul.tsx](app/(tabs)/gurukul.tsx) and [app/(tabs)/muhurat.tsx](app/(tabs)/muhurat.tsx).

- [ ] **Step 2: Migrate both files**

- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports
- Replace styles with `className`
- `gurukul.tsx`: Keep `LinearGradient colors` inline (uses `colors.surface` from `useTheme()`)
- `muhurat.tsx`: Large file, work section by section

- [ ] **Step 3: Commit**

```bash
git add "app/(tabs)/gurukul.tsx" "app/(tabs)/muhurat.tsx"
git commit -m "feat(tabs): migrate gurukul and muhurat screens to NativeWind"
```

---

## Task 28: Migrate `app/pricing.tsx` and `app/payment-success.tsx`

**Files:**
- Modify: `app/pricing.tsx`
- Modify: `app/payment-success.tsx`

- [ ] **Step 1: Read both files**

Read [app/pricing.tsx](app/pricing.tsx) and [app/payment-success.tsx](app/payment-success.tsx).

- [ ] **Step 2: Migrate both files**

Web-only static screens, no theme dependency:
- Remove `StyleSheet` import
- Replace all static styles with `className`

- [ ] **Step 3: Commit**

```bash
git add app/pricing.tsx app/payment-success.tsx
git commit -m "feat(app): migrate pricing and payment-success screens to NativeWind"
```

---

## Task 29: Migrate `app/user-profile.tsx`

**Files:**
- Modify: `app/user-profile.tsx`

- [ ] **Step 1: Read the file**

Read [app/user-profile.tsx](app/user-profile.tsx).

- [ ] **Step 2: Migrate**

Has inner `NativeManageAccount` component with `useThemedStyles`:
- Remove `useThemedStyles`, `StyleSheet` imports for both the screen and inner component
- Replace styles with `className`
- Keep `useTheme()` for any non-className color props

- [ ] **Step 3: Commit**

```bash
git add app/user-profile.tsx
git commit -m "feat(app): migrate user-profile screen to NativeWind"
```

---

## Task 30: Migrate `app/sacred-day/[id].tsx`

**Files:**
- Modify: `app/sacred-day/[id].tsx`

- [ ] **Step 1: Read the file**

Read [app/sacred-day/[id].tsx](app/sacred-day/[id].tsx).

- [ ] **Step 2: Migrate**

Large screen with BlurView, LinearGradient, Reanimated:
- Remove `useThemedStyles`, `StyleSheet`, `scaleFont`, `fonts` imports
- Replace layout/text styles with `className`
- **Keep** `useAnimatedStyle()` return values as `style={}` (Reanimated)
- **Keep** `LinearGradient colors` props inline
- **Keep** `BlurView intensity` and `tint` props

- [ ] **Step 3: Commit**

```bash
git add "app/sacred-day/[id].tsx"
git commit -m "feat(app): migrate sacred-day detail screen to NativeWind"
```

---

## Task 31: Final cleanup — remove all remaining `scaleFont` and `useThemedStyles` imports

**Files:**
- Any file still importing from `lib/typography.ts` or `useThemedStyles` from `lib/theme-context`

- [ ] **Step 1: Search for remaining references**

```bash
grep -r "scaleFont\|useThemedStyles\|from '@/lib/typography'" --include="*.tsx" --include="*.ts" -l
```

- [ ] **Step 2: Fix any remaining references**

For each file found: remove the import, replace any remaining `scaleFont()` calls with appropriate Tailwind text size classes, remove any remaining `useThemedStyles` usage.

- [ ] **Step 3: Verify no StyleSheet.create remains (excluding files that legitimately keep inline styles)**

```bash
grep -r "StyleSheet\.create\|useThemedStyles" --include="*.tsx" --include="*.ts" -l
```

Expected: zero results (or only app/onboarding/ files which were excluded).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final cleanup of scaleFont and useThemedStyles remnants"
```

---

## Notes for Executor

1. **Read before editing**: Always read the current file content before making changes. Files may differ from what the plan describes.

2. **NativeWind className on RN primitives**: NativeWind v4 applies `className` to all React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`, etc.) via babel transform. No import needed.

3. **Tailwind config colors**: The tailwind.config.js already maps `surface`, `surface-container-low`, `surface-container`, `on-surface`, `on-surface-variant`, `primary`, `secondary-fixed`, `outline-variant`, etc. Use these directly in className.

4. **Arbitrary values**: For values not in the Tailwind config, use bracket notation: `w-[95%]`, `max-w-[620px]`, `pb-[176px]`, `tracking-[-0.4px]`, `leading-[19px]`.

5. **Shadow styles**: `shadowColor`, `shadowOpacity`, `shadowRadius`, `shadowOffset` have no Tailwind equivalent in React Native — keep these as `style={}` inline.

6. **Elevation**: `elevation` (Android) has no Tailwind equivalent — keep as `style={{ elevation: N }}` inline.

7. **Check tailwind.config.js**: Before using a color class like `text-on-surface`, verify the key exists in tailwind.config.js under `theme.extend.colors`.
