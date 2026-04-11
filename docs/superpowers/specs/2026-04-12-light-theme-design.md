# Light Theme Design

**Date:** 2026-04-12  
**Status:** Approved

## Overview

Add a warm cream/parchment light theme to Aksha. The theme follows the OS preference by default but can be overridden by the user via a toggle in Settings. All screens — including onboarding — participate in the theme system.

## Color Palettes

Both palettes share the same token names. `lib/theme.ts` exports `darkColors` and `lightColors`; the theme context selects between them at runtime.

### Dark palette (existing, renamed to `darkColors`)

Unchanged from current `colors` export.

### Light palette (`lightColors`) — warm cream/parchment

| Token | Value |
|---|---|
| `surface` | `#faf7f2` |
| `surfaceDim` | `#f5f0e8` |
| `surfaceContainerLowest` | `#ffffff` |
| `surfaceContainerLow` | `#f2ede4` |
| `surfaceContainer` | `#ede7db` |
| `surfaceContainerHigh` | `#e8e1d4` |
| `surfaceContainerHighest` | `#e2dacb` |
| `surfaceBright` | `#fdfaf6` |
| `surfaceBrightGlass` | `rgba(250, 247, 242, 0.8)` |
| `surfaceVariant` | `#e8e1d4` |
| `primary` | `#7c3aed` |
| `primaryDim` | `#9a6cc4` |
| `primaryFixed` | `#4c1d95` |
| `primaryFixedDim` | `#6d28d9` |
| `primaryContainer` | `#7c3aed` |
| `onPrimary` | `#ffffff` |
| `onPrimaryFixed` | `#6d28d9` |
| `secondary` | `#92722a` |
| `secondaryDim` | `#92722a` |
| `secondaryFixed` | `#c47c00` |
| `secondaryFixedDim` | `#d4890f` |
| `secondaryContainer` | `#f5e6c8` |
| `onSecondary` | `#5c3f00` |
| `onSecondaryContainer` | `#7a5500` |
| `onSurface` | `#1a1410` |
| `onSurfaceVariant` | `#6b5e4e` |
| `onBackground` | `#1a1410` |
| `background` | `#faf7f2` |
| `outline` | `#a89880` |
| `outlineVariant` | `#d4c8b8` |
| `error` | `#c0392b` |
| `errorContainer` | `#fde8e6` |

### glassMorphism (light)

| Token | Value |
|---|---|
| `background` | `rgba(250, 247, 242, 0.8)` |
| `backgroundLight` | `rgba(250, 247, 242, 0.6)` |
| `backgroundInput` | `rgba(242, 237, 228, 0.9)` |

### gradients (light)

`peaceBg` shifts to warm lavender/gold tones against cream:
```ts
['rgba(124, 58, 237, 0.1)', 'transparent', 'rgba(146, 114, 42, 0.08)', 'transparent']
```

`fonts` and `layout` are theme-neutral — unchanged.

### Onboarding (OB) palette

The OB palette lives in `lib/onboardingStore.ts` (separate from `lib/theme.ts`). The current `OB` export becomes `OB_DARK`; a new `OB_LIGHT` is added alongside it. Onboarding screens select between them via `useTheme().isDark`.

**`OB_DARK`** — current values, unchanged.

**`OB_LIGHT`** — warm cream base with deeper saffron/gold for contrast:

| Token | Value |
|---|---|
| `bg` | `#faf7f2` |
| `saffron` | `#c0543a` |
| `saffronDim` | `rgba(192, 84, 58, 0.12)` |
| `saffronBorder` | `rgba(192, 84, 58, 0.35)` |
| `gold` | `#a06030` |
| `goldDim` | `rgba(160, 96, 48, 0.10)` |
| `goldBorder` | `rgba(160, 96, 48, 0.30)` |
| `text` | `#1a1410` |
| `muted` | `#6b5e4e` |
| `card` | `rgba(0, 0, 0, 0.04)` |
| `cardBorder` | `rgba(0, 0, 0, 0.08)` |
| `divider` | `rgba(0, 0, 0, 0.06)` |

## Theme Context

### New file: `lib/theme-context.tsx`

**Exports:**

- `ThemeProvider` — wraps the entire app, reads OS preference and AsyncStorage override, provides the active palette downward
- `useTheme()` — returns `{ colors, glassMorphism, gradients, isDark, preference, setPreference }`
- `useThemedStyles<T>(factory: (colors, glassMorphism, gradients) => T): T` — memoizes style objects per active theme; called inside components

**Preference type:** `'system' | 'light' | 'dark'`

**AsyncStorage key:** `@aksha/theme-preference`

**Startup flow:**
1. `ThemeProvider` mounts with default preference `'system'` (synchronously safe — no flash because the splash screen is still visible during font loading in `_layout.tsx`)
2. Asynchronously reads stored preference from AsyncStorage and applies it
3. Subscribes to `Appearance.addChangeListener` to react to OS changes
4. Active theme = stored preference if not `'system'`, otherwise the current OS color scheme

### `useThemedStyles` contract

```ts
function useThemedStyles<T>(
  factory: (colors: Colors, glassMorphism: GlassMorphism, gradients: Gradients) => T
): T
```

- Calls `factory` once per theme change, not per render
- Returns memoized result — stable reference if theme hasn't changed
- Components call this inside the function body, replacing their top-level `StyleSheet.create`

## `_layout.tsx` Changes

- `ThemeProvider` wraps all children (inside `ClerkProvider`, outside everything else)
- `StatusBar` style: `isDark ? 'light' : 'dark'`
- Stack `contentStyle` background: `colors.background` (from `useTheme`)

## Settings Toggle

**Location:** `ProfileSettingsSheet`, new "Appearance" section above "Content Language"

**Shape:** Three horizontally-arranged pill buttons in a row

```
APPEARANCE
[ System ✓ ]  [ Light ]  [ Dark ]
```

- Selected option: primary-tinted background + checkmark icon, matching the existing `dropdownOptionSelected` style pattern
- New props on `ProfileSettingsSheet`: `themePreference: ThemePreference`, `onSetThemePreference: (p: ThemePreference) => void`
- `profile.tsx` passes these from `useTheme()`

## Component Migration

### Pattern

Every file that references `colors` inside `StyleSheet.create` migrates from:

```ts
// Before
import { colors } from '@/lib/theme';
const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface },
});
```

to:

```ts
// After
import { useThemedStyles } from '@/lib/theme-context';

function MyComponent() {
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: { backgroundColor: colors.surface },
    })
  );
  ...
}
```

Styles containing **only** layout/spacing/size values (no color tokens) remain as top-level `StyleSheet.create` calls — they don't need to move.

### Scope

**47 existing files updated + 1 new file created (`lib/theme-context.tsx`)**

Files using `@/lib/theme` `colors` (migrated to `useThemedStyles`):

| Area | Count |
|---|---|
| `lib/theme.ts` (updated) + `app/_layout.tsx` | 2 |
| `app/(tabs)/` (5 tab screens) | 5 |
| `app/` other screens (`pricing`, `payment-success`, `user-profile`, `sacred-day/[id]`) | 4 |
| `features/profile/components/` (6 components) | 6 |
| `features/billing/` (2 components) | 2 |
| `features/daily/` (3 components) | 3 |
| `features/horoscope/` (5 components) | 5 |
| `features/gurukul/` (3 components) | 3 |
| `features/muhurat/` (2 components) | 2 |
| `features/ask/` (2 components) | 2 |
| `features/chat/` (2 components) | 2 |
| `features/auth/` + `features/onboarding/` (2 components) | 2 |
| `components/ui/` (8 components) | 8 |

**Onboarding screens (separate migration path — use `OB_DARK`/`OB_LIGHT`):**

| Area | Count |
|---|---|
| `lib/onboardingStore.ts` (add `OB_DARK`, `OB_LIGHT`) | 1 |
| `app/onboarding/` (12 screens) | 12 |

The 3 `.md` files that reference the `@/lib/theme` import are documentation — not migrated.

## Implementation Order

1. Update `lib/theme.ts` — add `lightColors`, `lightGlassMorphism`, `lightGradients`; export `Colors`, `GlassMorphism`, `Gradients` types
2. Create `lib/theme-context.tsx` — `ThemeProvider`, `useTheme`, `useThemedStyles`
3. Update `app/_layout.tsx` — wrap with `ThemeProvider`, reactive `StatusBar` + Stack background
4. Migrate `components/ui/` — shared components used everywhere, highest leverage
5. Migrate `features/` area by area
6. Migrate `app/(tabs)/` screens
7. Migrate remaining `app/` screens
8. Update `lib/onboardingStore.ts` — rename `OB` → `OB_DARK`, add `OB_LIGHT`
9. Migrate `app/onboarding/` screens — replace `OB` with `isDark ? OB_DARK : OB_LIGHT`
10. Add Appearance toggle to `ProfileSettingsSheet`
11. Wire toggle in `profile.tsx`
