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
  it('exports primary', () => expect(darkColors.primary).toBe('#b564fc'));
  it('exports glassMorphism background', () => expect(darkGlassMorphism.background).toMatch(/rgba/));
});

describe('theme — light palette', () => {
  it('exports cream surface', () => expect(lightColors.surface).toBe('#faf7f2'));
  it('exports deeper violet primary', () => expect(lightColors.primary).toBe('#7c3aed'));
  it('exports dark onSurface text', () => expect(lightColors.onSurface).toBe('#1a1410'));
  it('exports glassMorphism background', () => expect(lightGlassMorphism.background).toMatch(/rgba/));
  it('exports peaceBg gradient', () => expect(lightGradients.peaceBg).toHaveLength(4));
});

describe('theme — shared', () => {
  it('exports Google Sans font names', () => {
    expect(fonts.headline).toBe('GoogleSans_700Bold');
    expect(fonts.body).toBe('GoogleSans_400Regular');
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
    expect(variables['--color-primary-fixed-dim']).toBe('109 40 217');
  });
});
