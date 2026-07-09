# Design System

Aksha's visual language is a dark-first, warm-saffron spiritual aesthetic built on Material-inspired semantic color roles, layered with a separate high-contrast "OB" (onboarding) palette. Tokens are defined once in `lib/theme.ts` / `lib/onboardingStore.ts`, wired into Tailwind (`tailwind.config.js`) as CSS variables via `nativewind`, and consumed in components either through Tailwind class names (`bg-surface`, `text-on-surface`, etc.) or directly via `useTheme()`.

## Color Palettes

### Brand Primitives
Defined as private constants in `lib/theme.ts`, not exported directly — they seed the semantic palettes below.

| Token | Value | Usage |
|-------|-------|-------|
| `DARK_SURFACE` | `#0e0e0e` | Dark theme base surface/background |
| `DARK_CARD` | `#191a1a` | Dark theme card/container surfaces |
| `DARK_TEXT` | `#fff7ed` | Dark theme primary text |
| `DARK_MUTED_TEXT` | `#d8ccbc` | Dark theme secondary/muted text |
| `SAFFRON` | `#ffae42` | Dark theme primary/secondary brand color |
| `LIGHT_SURFACE` | `#faf7f2` | Light theme base surface/background |
| `LIGHT_CARD` | `#ede7db` | Light theme card/container surfaces |
| `LIGHT_TEXT` | `#1a1410` | Light theme primary text |
| `LIGHT_MUTED_TEXT` | `#6b5e4e` | Light theme secondary/muted text |
| `LIGHT_SAFFRON` | `#9a6500` | Light theme primary/secondary brand color |

### Dark Theme (`darkColors`)
| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `surface` | `#0e0e0e` | `bg-surface` |
| `surfaceDim` | `#0e0e0e` | `bg-surface-dim` |
| `surfaceContainerLowest` | `#000000` | `bg-surface-container-lowest` |
| `surfaceContainerLow` | `#191a1a` | `bg-surface-container-low` |
| `surfaceContainer` | `#191a1a` | `bg-surface-container` |
| `surfaceContainerHigh` | `#191a1a` | `bg-surface-container-high` |
| `surfaceContainerHighest` | `#191a1a` | `bg-surface-container-highest` |
| `surfaceBright` | `#191a1a` | `bg-surface-bright` |
| `surfaceBrightGlass` | `rgba(25, 26, 26, 0.72)` | *(not in Tailwind — used directly)* |
| `surfaceVariant` | `#191a1a` | `bg-surface-variant` |
| `primary` | `#ffae42` | `bg-primary` / `text-primary` |
| `primaryDim` | `#ffae42` | `bg-primary-dim` |
| `primaryFixed` | `#ffae42` | `bg-primary-fixed` |
| `primaryFixedDim` | `#ffae42` | `bg-primary-fixed-dim` |
| `primaryContainer` | `#ffae42` | `bg-primary-container` |
| `onPrimary` | `#1a1410` | `text-on-primary` |
| `onPrimaryFixed` | `#ffae42` | `text-on-primary-fixed` |
| `secondary` | `#ffae42` | `bg-secondary` |
| `secondaryDim` | `#ffae42` | `bg-secondary-dim` |
| `secondaryFixed` | `#ffae42` | `bg-secondary-fixed` / `text-secondary-fixed` |
| `secondaryFixedDim` | `#ffae42` | `bg-secondary-fixed-dim` |
| `secondaryContainer` | `#ffae42` | `bg-secondary-container` |
| `onSecondary` | `#2f1c07` | `text-on-secondary` |
| `onSecondaryContainer` | `#ffae42` | `text-on-secondary-container` |
| `onSurface` | `#fff7ed` | `text-on-surface` |
| `onSurfaceVariant` | `#d8ccbc` | `text-on-surface-variant` |
| `onBackground` | `#fff7ed` | `text-on-background` |
| `background` | `#0e0e0e` | `bg-background` |
| `outline` | `#767575` | `border-outline` |
| `outlineVariant` | `#484848` | `border-outline-variant` |
| `error` | `#ee7d77` | `text-error` |
| `errorContainer` | `#7f2927` | `bg-error-container` |

Note: in the dark theme, `primary` and `secondary` role families all resolve to the same `SAFFRON` value — there is currently no visual distinction between "primary" and "secondary" semantic roles beyond their "on-" text colors.

### Light Theme (`lightColors`)
| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `surface` | `#faf7f2` | `bg-surface` |
| `surfaceDim` | `#faf7f2` | `bg-surface-dim` |
| `surfaceContainerLowest` | `#ffffff` | `bg-surface-container-lowest` |
| `surfaceContainerLow` | `#ede7db` | `bg-surface-container-low` |
| `surfaceContainer` | `#ede7db` | `bg-surface-container` |
| `surfaceContainerHigh` | `#ede7db` | `bg-surface-container-high` |
| `surfaceContainerHighest` | `#ede7db` | `bg-surface-container-highest` |
| `surfaceBright` | `#faf7f2` | `bg-surface-bright` |
| `surfaceBrightGlass` | `rgba(250, 247, 242, 0.8)` | *(not in Tailwind — used directly)* |
| `surfaceVariant` | `#ede7db` | `bg-surface-variant` |
| `primary` | `#9a6500` | `bg-primary` |
| `primaryDim` | `#9a6500` | `bg-primary-dim` |
| `primaryFixed` | `#9a6500` | `bg-primary-fixed` |
| `primaryFixedDim` | `#9a6500` | `bg-primary-fixed-dim` |
| `primaryContainer` | `#9a6500` | `bg-primary-container` |
| `onPrimary` | `#ffffff` | `text-on-primary` |
| `onPrimaryFixed` | `#9a6500` | `text-on-primary-fixed` |
| `secondary` | `#9a6500` | `bg-secondary` |
| `secondaryDim` | `#9a6500` | `bg-secondary-dim` |
| `secondaryFixed` | `#9a6500` | `bg-secondary-fixed` |
| `secondaryFixedDim` | `#9a6500` | `bg-secondary-fixed-dim` |
| `secondaryContainer` | `#9a6500` | `bg-secondary-container` |
| `onSecondary` | `#5c3f00` | `text-on-secondary` |
| `onSecondaryContainer` | `#9a6500` | `text-on-secondary-container` |
| `onSurface` | `#1a1410` | `text-on-surface` |
| `onSurfaceVariant` | `#6b5e4e` | `text-on-surface-variant` |
| `onBackground` | `#1a1410` | `text-on-background` |
| `background` | `#faf7f2` | `bg-background` |
| `outline` | `#a89880` | `border-outline` |
| `outlineVariant` | `#d4c8b8` | `border-outline-variant` |
| `error` | `#c0392b` | `text-error` |
| `errorContainer` | `#fde8e6` | `bg-error-container` |

Same caveat as dark: light `primary`/`secondary` families collapse to one saffron value (`#9a6500`).

### Onboarding (OB) Palette
Defined separately in `lib/onboardingStore.ts` (exported as `OB`) and duplicated as raw hex/rgba literals in `tailwind.config.js`. This palette is dark-only and intentionally distinct from the main theme — deep near-black background with warm saffron/gold accents, used exclusively across the 12 onboarding steps (`app/onboarding/*`).

| Token (`OB.*`) | Value | Tailwind Class |
|-------|-------|----------------|
| `bg` | `#07090C` | `bg-ob-bg` |
| `saffron` | `#E07A5F` | `text-ob-saffron` / `bg-ob-saffron` |
| `saffronDim` | `rgba(224,122,95,0.15)` | `bg-ob-saffron-dim` |
| `saffronBorder` | `rgba(224,122,95,0.45)` | `border-ob-saffron-border` |
| `gold` | `#D9A06F` | `text-ob-gold` / `bg-ob-gold` |
| `goldDim` | `rgba(217,160,111,0.12)` | `bg-ob-gold-dim` |
| `goldBorder` | `rgba(217,160,111,0.4)` | `border-ob-gold-border` |
| `text` | `#F0EDE8` | `text-ob-text` |
| `muted` | `#8E8880` | `text-ob-muted` |
| `card` | `rgba(255,255,255,0.04)` | `bg-ob-card` |
| `cardBorder` | `rgba(255,255,255,0.09)` | `border-ob-card-border` |
| `divider` | `rgba(255,255,255,0.07)` | `border-ob-divider` |

## Glassmorphism
`GlassMorphism` tokens (`lib/theme.ts`) back frosted-glass surfaces, typically paired with `AppBlurView` (a thin wrapper around `expo-blur`'s `BlurView` with Android-specific blur tuning).

| Token | Dark | Light |
|-------|------|-------|
| `background` | `rgba(43, 44, 44, 0.6)` | `rgba(250, 247, 242, 0.8)` |
| `backgroundLight` | `rgba(43, 44, 44, 0.4)` | `rgba(250, 247, 242, 0.6)` |
| `backgroundInput` | `rgba(37, 38, 38, 0.7)` | `rgba(242, 237, 228, 0.9)` |

Component-level glass overlays hardcode close variants of these rather than importing them directly, e.g.:
- `GlassCard.tsx`: `rgba(250,247,242,0.6)` (light) / `rgba(37,38,38,0.5)` (dark)
- `BottomSheet.tsx`: `rgba(250,247,242,0.88)` (light) / `rgba(19,19,19,0.72)` (dark)
- `ToastProvider.tsx`: `rgba(250,247,242,0.95)` (light) / `rgba(25,26,26,0.9)` (dark)
- `TabBar.tsx`: `rgba(250,247,242,0.14)` (light) / `rgba(18,18,22,0.16)` (dark)

## Gradients
| Name | Dark Stops | Light Stops |
|------|------|-------|
| `primaryToContainer` | `[primary, primaryContainer]` → both `#ffae42` | `[primary, primaryContainer]` → both `#9a6500` |
| `secondaryToContainer` | `[secondary, secondaryContainer]` → both `#ffae42` | both `#9a6500` |
| `peaceBg` | `rgba(255,174,66,0.12)` → transparent → `rgba(255,174,66,0.08)` → transparent | `rgba(154,101,0,0.10)` → transparent → `rgba(154,101,0,0.08)` → transparent |

`SacredButton` consumes `primaryToContainer` / `secondaryToContainer` directly via `useTheme().gradients`. Because primary/secondary collapse to one color per theme (see above), these gradients currently render as flat fills rather than true two-stop gradients.

Ad-hoc radial gradients also appear in `AmbientBlob.tsx` (accepts any `rgba(...)` or `#rrggbbaa` color prop, defaults to `rgba(212, 190, 228, 0.08)`) and are composed into full-page backgrounds by `PageAmbientBlobs.tsx` (`#7b523cc4` + `rgba(25, 202, 237, 0.16)`) and `RealmBackdrop.tsx`'s Skia-unavailable fallback (`rgba(181, 100, 252, 0.10)` + `rgba(184, 152, 122, 0.08)`).

## Typography

### Font Families
All fonts are static Google Fonts assets (Cormorant Garamond for display/headline, Google Sans for body/label). Mapped in `lib/theme.ts` (`fonts`) and mirrored in `tailwind.config.js` (`fontFamily`).

| Role | Font Name | Tailwind Class |
|------|-----------|----------------|
| `headlineExtra` | `CormorantGaramond_700Bold` | `font-headline-extra` |
| `headline` | `CormorantGaramond_600SemiBold` | `font-headline` |
| `brand` | `CormorantGaramond_600SemiBold` | *(applied inline via `MihiraText`)* |
| `brandBold` | `CormorantGaramond_700Bold` | *(applied inline via `MihiraText`, `bold` prop)* |
| `label` | `GoogleSans_600SemiBold` | `font-label` |
| `bodyMedium` | `GoogleSans_500Medium` | `font-body-medium` |
| `body` | `GoogleSans_400Regular` | `font-body` |
| `labelLight` | `GoogleSans_400Regular` | `font-label-light` |

**Gap:** the project CLAUDE.md documents a `FONT_SCALE = 1.14` constant and a `scaleFont()` helper in `lib/typography.ts` used to derive all font sizes — no such file exists in this codebase today, and every font size found (`PageHero`, `SacredButton`, `TabBar`, `PageFooter`, etc.) is a raw literal (`text-[42px]`, `fontSize: 16`, `text-[10px]`, `text-[11px]`). If `scaleFont()` is planned but not yet built, this doc should be revisited once it lands so raw sizes get routed through it.

### Type Scale (observed in components)
No central scale file exists; sizes are set per-component. Recorded values:

| Usage | fontSize | fontFamily | letterSpacing |
|-------|----------|------------|---------------|
| `PageHero` title | `42px` | `headline-extra` | `-1px` (leading `46px`) |
| `PageHero` meta | `12px` (`text-xs`) | `label` | `3px` |
| `PageHero` subtitle | `16px` (`text-base`) | `body` | default (leading `24px`) |
| `SacredButton` label | `16px` | `label` (`GoogleSans_600SemiBold`) | `0.3px` |
| `TabBar` tab label | `10px` | `label` | `0.1px` (leading `12px`) |
| `PageFooter` text | `11px` | `label` | `1.8px` |
| `ToastProvider` title | `14px` (`text-sm`) | `label` | default |
| `ToastProvider` message | `12px` (`text-xs`) | `body` | default (leading `18px`) |
| `ConstellationLoader` message | `14px` (`text-sm`) | `body` | default |
| `Text` (base) | inherited | inherited | `0.2px` (global default in `BaseText`) |
| `MihiraText` (wordmark) | inherited | `brand` / `brandBold` | `0` |

## Spacing
There is no central spacing scale constant beyond one layout token; most spacing is expressed as raw Tailwind utilities (`px-4`, `py-2`, `gap-1.5`, etc.) or raw pixel literals in `StyleSheet.create` blocks.

| Token | Value | Usage |
|-------|-------|-------|
| `layout.screenPaddingX` (`lib/theme.ts`) | `24` | Standard horizontal screen padding |
| `SacredButton` `paddingHorizontal` | `32` | Button horizontal padding |
| `SacredButton` `paddingVertical` | `16` | Button vertical padding |
| `TabBar` `BAR_PADDING` | `4` | Outer tab bar padding |
| `TabBar` `TAB_HORIZONTAL_PADDING` | `4` | Per-tab horizontal padding |
| `TabBar` `TAB_CONTENT_TOP_PADDING` / `BOTTOM_PADDING` | `5` / `6` | Per-tab vertical padding |
| `TabBar` `ICON_RAIL_HEIGHT` | `24` | Icon slot height |
| `TabBar` `LABEL_RAIL_HEIGHT` | `13` | Label slot height |
| `TabBar` `ICON_LABEL_GAP` | `3` | Gap between icon and label |
| `TabBar` `SELECTOR_VERTICAL_INSET` | `7` | Active-tab pill inset |
| `PageHero` `subtitleMaxWidth` (default) | `340` | Subtitle max width |

## Border Radius
Central scale lives in `tailwind.config.js` (`borderRadius`), but several components hardcode radii outside this scale (notably fully-pill buttons and bespoke sheet corners).

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `DEFAULT` | `4px` | `rounded` |
| `lg` | `8px` | `rounded-lg` |
| `xl` | `12px` | `rounded-xl` |
| `2xl` | `16px` | `rounded-2xl` |
| `3xl` | `24px` | `rounded-3xl` (used by `GlassCard`, `GlowCard`) |
| `4xl` | `32px` | `rounded-4xl` |
| `full` | `9999px` | `rounded-full` |
| *(component override)* | `999` | `SacredButton` pill shape (`StyleSheet`, equivalent to `full`) |
| *(component override)* | `28px` | `BottomSheet` top corners (`rounded-t-[28px]`) |
| *(component override)* | `26px` | `TabBar` active-tab selector pill (`rounded-[26px]`) |
| *(component override)* | `22px` | `ToastProvider` toast card (`rounded-[22px]`) |

## Shadows
No shared shadow tokens exist — every component defines its own `shadowColor`/`shadowOpacity`/`shadowRadius`/`elevation` combination, generally theme-color-tinted for interactive elements and pure black for structural chrome (bars, sheets).

| Component | shadowColor | shadowOpacity | shadowRadius | shadowOffset | elevation |
|-----------|-------------|---------------|--------------|--------------|-----------|
| `SacredButton` (primary) | `colors.primary` | `0.2` | `20` | `{0, 0}` | `4` |
| `SacredButton` (secondary) | `colors.secondaryFixed` | `0.2` | `20` | `{0, 0}` | `4` |
| `TabBar` (bar) | `#000` | `0.22` | `18` | `{0, 10}` | `12` |
| `TabBar` (active selector) | `#000` | `0.08` | `10` | `{0, 4}` | *(none)* |
| Onboarding `onboardingButtonShadow` | `OB.saffron` | `0.45` | `24` | `{0, 4}` | `8` |
| Onboarding `goldGlowShadow` | `OB.gold` | `0.6` | `80` | `{0, 0}` | *(none)* |
| Onboarding `dialGlowShadow` | `OB.gold` | `0.4` | `60` | `{0, 0}` | *(none)* |

## Component Tokens

| Component | Constant | Value | Note |
|-----------|----------|-------|------|
| `GlassCard` | `intensity` (default) | `20` | Blur intensity passed to `AppBlurView` |
| `BottomSheet` | `zIndex` (default) | `50` | Stacking default |
| `BottomSheet` | corner radius | `28px` | `rounded-t-[28px]` |
| `BottomSheet` | `maxHeight` | `82%` of window height | `windowHeight * 0.82` |
| `BottomSheet` | close spring | `damping: 22, stiffness: 220` (drag release) / `damping: 50, stiffness: 300` (open) | |
| `GlowCard` | `glowIntensity` (default) | `0.2` | Alpha of top glow gradient |
| `TabBar` | `SPRING` | `damping: 22, stiffness: 240, mass: 0.85` | Selector pill motion |
| `ConstellationLoader` | `size` (default) | `168` | SVG viewBox is fixed `100×100`, scaled to `size` |
| `ToastProvider` | `duration` (default) | `2600ms` | Auto-dismiss timing |
| `AmbientBlob` | `size` / `top` / `left` (defaults) | `400` / `-100` / `-100` | Radial blob positioning |
| Onboarding `pressedButtonStyle` | `opacity: 0.82, scale: 0.98` | | Shared pressed-state transform |
| Onboarding `pressedSendButtonStyle` | `opacity: 0.75, scale: 0.94` | | Send-button-specific pressed state |

## Gaps & Recommendations

1. **`lib/typography.ts` does not exist yet.** The project's own CLAUDE.md documents `FONT_SCALE = 1.14` and a `scaleFont()` helper as the required path for all font sizes, but every component today hardcodes raw `fontSize`/`text-[Npx]` values. Either the helper needs to be built and retrofitted, or the CLAUDE.md reference is stale — worth confirming which.
2. **Primary and secondary color roles are indistinguishable.** In both themes, every `primary*` and `secondary*` token resolves to the same saffron hex. The Material-style two-role structure is in place but unused — gradients like `primaryToContainer` currently render as flat color rather than a real gradient.
3. **No central spacing or shadow scale.** Padding, gaps, and shadow definitions are re-declared per component (e.g. `SacredButton`, `TabBar`, onboarding styles each hardcode their own shadow trio). A shared `spacing.ts` / `shadows.ts` alongside `theme.ts` would reduce drift as new screens are added.
4. **OB palette is duplicated, not derived.** `lib/onboardingStore.ts` and `tailwind.config.js` both hardcode the same OB hex/rgba values independently — a future edit to one is easy to miss in the other (unlike the main theme, which flows through `getThemeColorVariables()`).
