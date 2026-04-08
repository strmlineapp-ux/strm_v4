import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse an HSL string like "hsl(210, 70%, 50%)" into { h, s, l } numbers.
 */
export function parseHsl(color: string): { h: number; s: number; l: number } | null {
  if (!color) return null;
  const match = color.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
  if (!match) return null;
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

/**
 * Extract the hue value from an HSL string. Returns null if unparseable.
 */
export function getHueFromHsl(color: string | null | undefined): number | null {
  if (!color) return null;
  const parsed = parseHsl(color);
  return parsed ? parsed.h : null;
}

/**
 * Given a background HSL color string and the current theme, return
 * either 'white' or a dark foreground color for readable contrast.
 */
export function getReadableColor(color: string, theme?: string | null): string {
  const parsed = parseHsl(color);
  if (!parsed) {
    return theme === 'dark' ? 'hsl(210, 7%, 60%)' : 'hsl(210, 7%, 40%)';
  }
  // Use perceived luminance: light colors → dark text, dark colors → white text
  const luminance = (parsed.l / 100) * (1 - parsed.s / 200);
  return luminance > 0.45 ? 'hsl(210, 7%, 20%)' : 'white';
}
