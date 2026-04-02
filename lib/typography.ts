export const FONT_SCALE = 1.14;

export function scaleFont(size: number, factor: number = FONT_SCALE) {
  return Math.max(1, Math.round(size * factor));
}
