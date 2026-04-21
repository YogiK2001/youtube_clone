/**
 * Typography & Font Configuration
 * YouTube-style sans-serif fonts
 * Easily customizable - modify these constants to change fonts across the app
 */

// Main font family (YouTube uses Roboto)
export const FONTS = {
  // Primary font for most text
  primary: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",

  // Secondary font (alternative, rarely used)
  secondary:
    "'Roboto Flex', Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

// Font sizes for different elements
export const FONT_SIZES = {
  // Large headings
  h1: "24px",
  h2: "20px",
  h3: "16px",

  // Body text
  body: "14px",
  bodySmall: "12px",
  bodyLarge: "16px",

  // Special sizes
  navbar: "14px",
  videoTitle: "14px",
  channelName: "12px",
  metadata: "12px", // views and date
};

// Font weights
export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Line heights
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

// Text colors
export const TEXT_COLORS = {
  primary: "#030303", // Main text color
  secondary: "#606060", // Secondary text (metadata, descriptions)
  muted: "#909090", // Muted text
  light: "#ffffff", // Light text on dark backgrounds
};

// Helper function to generate consistent text styles
// Usage: getTextStyle('body', 'medium')
export function getTextStyle(
  size: keyof typeof FONT_SIZES,
  weight: keyof typeof FONT_WEIGHTS = "normal"
) {
  return {
    fontSize: FONT_SIZES[size],
    fontWeight: FONT_WEIGHTS[weight],
    fontFamily: FONTS.primary,
  };
}
