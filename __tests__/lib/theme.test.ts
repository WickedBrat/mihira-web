import { colors, fonts, glassMorphism } from '@/lib/theme';

describe('theme', () => {
  it('exports obsidian background color', () => {
    expect(colors.surface).toBe('#0e0e0e');
  });

  it('exports primary color', () => {
    expect(colors.primary).toBeTruthy();
  });

  it('exports glassMorphism background with opacity', () => {
    expect(glassMorphism.background).toMatch(/rgba/);
  });

  it('exports Lexend font names', () => {
    expect(fonts.headline).toBe('Lexend_700Bold');
    expect(fonts.body).toBe('Lexend_400Regular');
  });
});
