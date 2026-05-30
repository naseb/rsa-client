/**
 * theme.js — Design Tokens & Formatting Utilities
 * =================================================
 * All colors, fonts, and number formatting functions
 * used by every component in the app.
 *
 * Color palette updated to "money" theme:
 *   — Warm cream backgrounds instead of cool white
 *   — Forest greens replace blues for brand/accent colors
 *   — Gold replaces orange for highlights and badges
 *   — Green-tinted neutrals for a cohesive, premium feel
 *
 * Phase colors (Go-Go / Slow-Go / No-Go) are intentionally
 * kept as-is — they serve as functional visual distinctions
 * in charts and tables and should not blend into the brand palette.
 */

// Fonts (loaded via Google Fonts in index.html)
export const FONT_BODY = "'Source Sans 3', 'DM Sans', 'Segoe UI', system-ui, sans-serif";
export const FONT_MONO = "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace";

// ── Color palette ─────────────────────────────────────────────────────────────
export const C = {

  // Text colors
  navy:       "#1a2b1a",    // Near-black with green tint — primary text, headings
  slate:      "#2d4a35",    // Dark green — body text, labels

  white:      "#ffffff",

  // Brand / interactive (forest green replaces blue)
  accent:     "#2d6a4f",    // Forest green — buttons, active tabs, links
  accentDark: "#1e4d3a",    // Darker forest green — hover states

  // Retirement phases — kept as functional color distinctions
  goGo:        "#f59e0b",   // Amber — active/Go-Go phase
  goGoBg:      "#fffbeb",
  goGoBorder:  "#fcd34d",
  slowGo:      "#8b5cf6",   // Purple — Slow-Go phase
  slowGoBg:    "#f5f3ff",
  slowGoBorder:"#c4b5fd",
  noGo:        "#06b6d4",   // Cyan — No-Go phase
  noGoBg:      "#ecfeff",
  noGoBorder:  "#67e8f9",

  // Status colors
  green:      "#10b981",    // Emerald — positive values, gains, success
  greenBg:    "#f0f8f4",    // Light green tint — success backgrounds
  red:        "#dc2626",    // Red — negative values, losses, warnings
  redBg:      "#fef2f2",    // Light red — error/warning backgrounds
  orange:     "#b8860b",    // Gold — RMD badges, highlights (was orange)

  // Neutrals (green-tinted for cohesion)
  gray:       "#4d6b55",    // Muted green-gray — secondary text, placeholders
  ltGray:     "#7a9b82",    // Lighter — captions, muted labels
  xltGray:    "#b8d4be",    // Extra light — disabled states

  // Surfaces
  border:     "#d4e8d8",    // Subtle green-tinted border (was cool gray)
  cardBg:     "#ffffff",    // Card / panel backgrounds
  pageBg:     "#f7f3ea",    // Warm cream — main page background (was cool white)
  blueBg:     "#f0f8f4",    // Light green tint — info panels (was blue tint)
};

// ── Phase color maps (used in charts and tables) ─────────────────────────────
export const PHASE_COLORS = {
  "Go-Go":   C.goGo,
  "Slow-Go": C.slowGo,
  "No-Go":   C.noGo,
};

export const PHASE_BG_COLORS = {
  "Go-Go":   C.goGoBg,
  "Slow-Go": C.slowGoBg,
  "No-Go":   C.noGoBg,
};

// ── Number formatting ─────────────────────────────────────────────────────────

/**
 * Format a number as compact currency: $1.2M, $45.3K, $800
 */
export function fmtCompact(val) {
  if (val == null || isNaN(val)) return "$0";
  const abs = Math.abs(Math.round(val));
  let formatted;
  if (abs >= 1e6)      formatted = (abs / 1e6).toFixed(2) + "M";
  else if (abs >= 1e3) formatted = (abs / 1e3).toFixed(1) + "K";
  else                 formatted = abs.toLocaleString("en-US");
  return (val < 0 ? "-$" : "$") + formatted;
}

/**
 * Format a number as full currency: $1,234,567
 */
export function fmtFull(val) {
  if (val == null || isNaN(val)) return "$0";
  return (val < 0 ? "-" : "") + "$" + Math.abs(Math.round(val)).toLocaleString("en-US");
}

/**
 * Social Security claiming multiplier (for display only).
 * The actual calculation runs on the server.
 */
export function ssClaimingMultiplier(claimAge, fra = 67) {
  if (claimAge === fra) return 1;
  const monthsDiff = (claimAge - fra) * 12;
  if (claimAge < fra) {
    const abs = Math.abs(monthsDiff);
    const first36  = Math.min(abs, 36);
    const beyond36 = Math.max(0, abs - 36);
    return 1 - (first36 * (5 / 900) + beyond36 * (5 / 1200));
  }
  return 1 + Math.min(monthsDiff, 36) * (2 / 300);
}

/**
 * RMD start age based on birth year (SECURE 2.0 Act)
 */
export function rmdStartAge(currentAge) {
  const birthYear = new Date().getFullYear() - currentAge;
  if (birthYear <= 1950) return 72;
  if (birthYear <= 1959) return 73;
  return 75;
}

// localStorage key for saving/loading user settings
export const STORAGE_KEY = "spending-phases-planner";
