/**
 * Clarity4Vets design system — Phase 1 tokens.
 *
 * **Runtime styling** comes from `app/design-tokens.css` (CSS variables + `@theme`).
 * Keep numeric/string values in sync when you change either file.
 *
 * Use in TS when you need the same values outside Tailwind (e.g. charts, inline styles).
 */

export const designTokens = {
  colors: {
    primary: "#334155",
    primaryDark: "#1e293b",
    primaryLight: "#64748b",
    background: "#f3f4f6",
    surface: "#ffffff",
    textPrimary: "#18181b",
    textSecondary: "#52525b",
    border: "#e4e4e7",
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
  },
  /** rem — align with Tailwind `text-*` utilities where possible */
  typography: {
    h1: { size: "2.25rem", lineHeight: "2.5rem", weight: 600 },
    h2: { size: "1.5rem", lineHeight: "2rem", weight: 600 },
    h3: { size: "1.25rem", lineHeight: "1.75rem", weight: 600 },
    h4: { size: "1.125rem", lineHeight: "1.75rem", weight: 600 },
    h5: { size: "1rem", lineHeight: "1.5rem", weight: 600 },
    h6: { size: "0.875rem", lineHeight: "1.25rem", weight: 600 },
    bodyLarge: { size: "1.125rem", lineHeight: "1.75rem", weight: 400 },
    body: { size: "1rem", lineHeight: "1.625rem", weight: 400 },
    bodySmall: { size: "0.875rem", lineHeight: "1.5rem", weight: 400 },
    buttonText: { size: "0.875rem", lineHeight: "1.25rem", weight: 500 },
    linkText: { size: "inherit", lineHeight: "inherit", weight: 500 },
  },
  /** rem — use with `p-ds-*`, `gap-ds-*`, etc. after tokens are in `@theme` */
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
  },
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
  },
} as const;

export type DesignTokenColors = keyof typeof designTokens.colors;
