/**
 * theme.js — Design Tokens & Formatting Utilities
 * =================================================
 * All colors, fonts, and number formatting functions
 * extracted from the original app. Used by every component.
 */

// Fonts (loaded via Google Fonts in index.html)
export const FONT_BODY = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
export const FONT_MONO = "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace";

// Color palette
export const C = {
  navy: "#0f1729",
  slate: "#334155",
  white: "#fff",
  accent: "#3b82f6",
  accentDark: "#1d4ed8",
  goGo: "#f59e0b",
  goGoBg: "#fffbeb",
  goGoBorder: "#fcd34d",
  slowGo: "#8b5cf6",
  slowGoBg: "#f5f3ff",
  slowGoBorder: "#c4b5fd",
  noGo: "#06b6d4",
  noGoBg: "#ecfeff",
  noGoBorder: "#67e8f9",
  green: "#10b981",
  greenBg: "#ecfdf5",
  red: "#ef4444",
  redBg: "#fef2f2",
  orange: "#f97316",
  gray: "#64748b",
  ltGray: "#94a3b8",
  xltGray: "#cbd5e1",
  border: "#e2e8f0",
  cardBg: "#fff",
  pageBg: "#f8fafc",
  blueBg: "#eff6ff",
};

// Phase color maps (used in charts and tables)
export const PHASE_COLORS = {
  "Go-Go": C.goGo,
  "Slow-Go": C.slowGo,
  "No-Go": C.noGo,
};

export const PHASE_BG_COLORS = {
  "Go-Go": C.goGoBg,
  "Slow-Go": C.slowGoBg,
  "No-Go": C.noGoBg,
};

/**
 * Format a number as compact currency: $1.2M, $45.3K, $800
 */
export function fmtCompact(val) {
  if (val == null || isNaN(val)) return "$0";
  const abs = Math.abs(Math.round(val));
  let formatted;
  if (abs >= 1e6) formatted = (abs / 1e6).toFixed(2) + "M";
  else if (abs >= 1e3) formatted = (abs / 1e3).toFixed(1) + "K";
  else formatted = abs.toLocaleString("en-US");
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
 * Social Security claiming multiplier (kept in frontend for display only)
 * The actual calculation happens on the server; this is just for the
 * "Adjusted: $X/mo (+Y%)" display in the Settings tab.
 */
export function ssClaimingMultiplier(claimAge, fra = 67) {
  if (claimAge === fra) return 1;
  const monthsDiff = (claimAge - fra) * 12;
  if (claimAge < fra) {
    const abs = Math.abs(monthsDiff);
    const first36 = Math.min(abs, 36);
    const beyond36 = Math.max(0, abs - 36);
    return 1 - (first36 * (5 / 900) + beyond36 * (5 / 1200));
  }
  return 1 + Math.min(monthsDiff, 36) * (2 / 300);
}

/**
 * RMD start age based on birth year (SECURE 2.0)
 */
export function rmdStartAge(currentAge) {
  const birthYear = new Date().getFullYear() - currentAge;
  if (birthYear <= 1950) return 72;
  if (birthYear <= 1959) return 73;
  return 75;
}

// localStorage key for saving/loading user settings
export const STORAGE_KEY = "spending-phases-planner";
