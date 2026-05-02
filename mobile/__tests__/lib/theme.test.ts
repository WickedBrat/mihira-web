import {
  darkColors,
  lightColors,
  darkGlassMorphism,
  lightGlassMorphism,
  darkGradients,
  lightGradients,
  fonts,
  layout,
  getThemeColorVariables,
  hexToRgbChannels,
  type Colors,
  type GlassMorphism,
  type Gradients,
} from '@/lib/theme';

describe('theme — dark palette', () => {
  it('exports obsidian surface', () => expect(darkColors.surface).toBe('#0e0e0e'));
  it('exports a single saffron accent', () => {
    expect(darkColors.primary).toBe('#ffae42');
    expect(darkColors.secondaryFixed).toBe(darkColors.primary);
  });
  it('keeps secondary text warm, not blue', () => expect(darkColors.onSurfaceVariant).toBe('#d8ccbc'));
  it('exports glassMorphism background', () => expect(darkGlassMorphism.background).toMatch(/rgba/));
});

describe('theme — light palette', () => {
  it('exports cream surface', () => expect(lightColors.surface).toBe('#faf7f2'));
  it('exports saffron primary', () => expect(lightColors.primary).toBe('#9a6500'));
  it('exports dark onSurface text', () => expect(lightColors.onSurface).toBe('#1a1410'));
  it('exports glassMorphism background', () => expect(lightGlassMorphism.background).toMatch(/rgba/));
  it('exports peaceBg gradient', () => expect(lightGradients.peaceBg).toHaveLength(4));
});

describe('theme — shared', () => {
  it('exports the app font names', () => {
    expect(fonts.headline).toBe('CormorantGaramond_600SemiBold');
    expect(fonts.body).toBe('GoogleSans_400Regular');
    expect(fonts.brand).toBe('CormorantGaramond_600SemiBold');
  });
  it('Colors type has surface token', () => {
    const c: Colors = darkColors;
    expect(c.surface).toBeTruthy();
  });
  it('converts hex colors to rgb channel strings', () => {
    expect(hexToRgbChannels('#fff')).toBe('255 255 255');
    expect(hexToRgbChannels('#1a1410')).toBe('26 20 16');
  });
  it('builds NativeWind theme variables from the active palette', () => {
    const variables = getThemeColorVariables(lightColors);
    expect(variables['--color-background']).toBe('250 247 242');
    expect(variables['--color-on-surface']).toBe('26 20 16');
    expect(variables['--color-primary-fixed-dim']).toBe('154 101 0');
  });
});
