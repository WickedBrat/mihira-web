# NativeWind Full Migration Design

**Date:** 2026-04-16  
**Scope:** Replace all `StyleSheet.create()` with NativeWind `className` props across the entire codebase (62 files).

---

## Approach

Approach 1: Keep ThemeProvider, sync NativeWind colorScheme.

NativeWind v4 + Tailwind CSS v3 are already installed and configured (`tailwind.config.js`, `babel.config.js`, `global.css`). The migration wires the existing `ThemeProvider` to NativeWind's `setColorScheme()` and replaces all `StyleSheet.create` calls with `className` props.

---

## Architecture

### Deleted
- `useThemedStyles()` hook — removed from `lib/theme-context.tsx`
- All `StyleSheet.create()` calls across all 62 files
- `scaleFont()` and `FONT_SCALE` — `lib/typography.ts` deleted, all imports removed

### Slimmed but kept
- `ThemeProvider` / `useTheme()` — exposes `isDark`, `gradients`, `glassMorphism`, `preference`, `setPreference`. On every preference change calls NativeWind's `setColorScheme()`.
- `lib/theme.ts` — keeps color palettes and gradient/glassMorphism constants for `LinearGradient` and `BlurView` props.

### Permanently inline (cannot be className)
- `useAnimatedStyle()` return values (Reanimated requirement)
- `LinearGradient` `colors` prop (array of strings)
- `BlurView` `intensity` and `tint` props
- Dynamic pixel values computed at runtime (e.g. `selectorWidth`)

---

## Migration Pattern

### StyleSheet → className
```tsx
// Before
const styles = useThemedStyles((colors, _glass, _gradients, darkMode) =>
  StyleSheet.create({
    container: {
      backgroundColor: darkMode ? 'rgba(18,18,22,0.10)' : 'rgba(250,247,242,0.10)',
      borderRadius: 9999,
      padding: 4,
      borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
  })
);
<View style={styles.container} />

// After
<View className="rounded-full p-1 border border-white/8 dark:border-black/8 bg-white/10 dark:bg-black/10" />
```

### Key translation rules
| Old | New |
|-----|-----|
| `borderRadius: 9999` | `rounded-full` |
| `padding: 4` | `p-1` |
| `flex: 1` | `flex-1` |
| `position: 'absolute'` | `absolute` |
| `StyleSheet.absoluteFill` | `absolute inset-0` |
| `gap: 8` | `gap-2` |
| `colors.onSurface` | `text-on-surface` |
| `darkMode ? colorA : colorB` | `bg-colorB dark:bg-colorA` |
| `fontFamily: fonts.label` | `font-label` |
| `fontSize: scaleFont(10)` | `text-xs` (drop scaling) |
| `rgba(255,255,255,0.08)` | `border-white/8` |

---

## ThemeProvider Change

Add `setColorScheme` call from NativeWind inside `setPreference`:

```tsx
import { useColorScheme } from 'nativewind';

// Inside ThemeProvider:
const { setColorScheme } = useColorScheme();

const setPreference = useCallback((p: ThemePreference) => {
  userSetRef.current = true;
  setPreferenceState(p);
  AsyncStorage.setItem(STORAGE_KEY, p);
  setColorScheme(p === 'system' ? 'system' : p);
}, [setColorScheme]);
```

---

## File Scope

- `app/(tabs)/` — 6 files
- `app/onboarding/` — 11 files  
- `app/` (root) — 5 files
- `components/ui/` — 10 files
- `features/auth/` — 1 file
- `features/profile/components/` — 6 files
- `features/billing/` — 2 files
- `features/chat/` — 2 files
- `features/ask/` — 3 files
- `features/daily/` — 2 files
- `features/gurukul/` — 3 files
- `features/horoscope/` — 6 files
- `features/muhurat/` — 2 files
- `features/onboarding/` — 1 file

**Total: 62 files**
