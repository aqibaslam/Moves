/**
 * Moves — design tokens.
 *
 * Single source of truth for both platforms:
 *   web    → generated into CSS custom properties (see tokens.css)
 *   native → consumed directly by StyleSheet.create in apps/mobile
 *
 * Rules:
 *  - Nothing in this file may import from react, react-native, or next.
 *    It is plain data so both bundlers can consume it.
 *  - Never hardcode a colour, size, or radius in a component. Add it here.
 *  - Values map 1:1 to Figma variables. When Figma changes, change this file.
 */

// ── Colour ───────────────────────────────────────────────────
// Semantic names, not literal ones. `accent` not `purple`, so a rebrand
// is a one-line change here rather than a find-and-replace everywhere.

export const palette = {
  // neutrals — the spine of the system
  neutral0: '#ffffff',
  neutral50: '#fafafa',
  neutral100: '#f4f4f5',
  neutral200: '#e4e4e7',
  neutral300: '#d4d4d8',
  neutral400: '#a1a1aa',
  neutral500: '#71717a',
  neutral600: '#52525b',
  neutral700: '#3f3f46',
  neutral800: '#27272a',
  neutral900: '#18181b',
  neutral950: '#09090b',

  // brand accent
  accent50: '#eef2ff',
  accent100: '#e0e7ff',
  accent300: '#a5b4fc',
  accent500: '#6366f1',
  accent600: '#4f46e5',
  accent700: '#4338ca',
  accent800: '#3730a3',

  // status
  success500: '#10b981',
  warning500: '#f59e0b',
  danger500: '#ef4444',
  danger600: '#dc2626',
} as const;

/** Light theme. Components reference these — never `palette` directly. */
export const lightTheme = {
  bg: palette.neutral0,
  bgSubtle: palette.neutral50,
  bgMuted: palette.neutral100,
  surface: palette.neutral0,
  border: palette.neutral200,
  borderStrong: palette.neutral300,

  text: palette.neutral950,
  textMuted: palette.neutral500,
  textInverse: palette.neutral0,

  // accent700, not accent600: white-on-accent600 measures 4.45:1, which fails
  // WCAG AA (4.5:1) for small text. accent700 clears it at ~6:1.
  accent: palette.accent700,
  accentHover: palette.accent800,
  accentSubtle: palette.accent50,
  onAccent: palette.neutral0,

  success: palette.success500,
  warning: palette.warning500,
  danger: palette.danger600,
} as const;

export const darkTheme = {
  bg: palette.neutral950,
  bgSubtle: palette.neutral900,
  bgMuted: palette.neutral800,
  surface: palette.neutral900,
  border: palette.neutral800,
  borderStrong: palette.neutral700,

  text: palette.neutral50,
  textMuted: palette.neutral400,
  textInverse: palette.neutral950,

  accent: palette.accent500,
  accentHover: palette.accent300,
  accentSubtle: palette.neutral800,
  onAccent: palette.neutral950,

  success: palette.success500,
  warning: palette.warning500,
  danger: palette.danger500,
} as const;

/**
 * Structural theme shape. Values are widened to `string` deliberately —
 * `typeof lightTheme` would bake in literal types like `'#ffffff'`, making
 * darkTheme unassignable to it and breaking every `theme = isDark ? … : …`
 * expression.
 */
export type Theme = { readonly [K in keyof typeof lightTheme]: string };

// ── Space ────────────────────────────────────────────────────
// 4pt base grid. Only these values may be used for padding/margin/gap.

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// ── Type ─────────────────────────────────────────────────────
// Sizes in px so native can use them directly. Web converts to rem.

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 38,
  '5xl': 48,
  '6xl': 60,
  '7xl': 76,
} as const;

export const lineHeight = {
  tight: 1.1, // display headings
  snug: 1.25, // headings
  normal: 1.5, // body
  relaxed: 1.7, // long-form prose
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const letterSpacing = {
  tighter: -0.02, // em — large display type only
  tight: -0.01,
  normal: 0,
  wide: 0.02, // small caps / eyebrow labels
} as const;

export const fontFamily = {
  sans: 'Plus Jakarta Sans',
  mono: 'JetBrains Mono',
} as const;

// ── Radius ───────────────────────────────────────────────────

export const radius = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

// ── Elevation ────────────────────────────────────────────────
// Web uses the CSS string; native uses the object.

export const shadow = {
  sm: {
    css: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    native: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  },
  md: {
    css: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
    native: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  },
  lg: {
    css: '0 12px 32px -8px rgb(0 0 0 / 0.12), 0 4px 8px -4px rgb(0 0 0 / 0.06)',
    native: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 32, shadowOffset: { width: 0, height: 12 }, elevation: 10 },
  },
} as const;

// ── Motion ───────────────────────────────────────────────────
// Durations in ms. Anything over 400ms feels broken on an interaction.

export const duration = {
  instant: 80,
  fast: 140,
  base: 220,
  slow: 320,
  slower: 480,
} as const;

export const easing = {
  /** Default. Decelerates into place — use for entrances and most UI. */
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  /** Exits and dismissals — accelerates away. */
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Playful overshoot. Use sparingly, never on frequent interactions. */
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ── Layout ───────────────────────────────────────────────────

export const breakpoint = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const maxWidth = {
  prose: 680,
  content: 1120,
  wide: 1400,
} as const;

/** Minimum touch target, both platforms. Non-negotiable — WCAG 2.5.5. */
export const MIN_TOUCH_TARGET = 44;

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
} as const;

// ── MOVES brand (Brand Guidelines v1.3) ──────────────────────
// The consumer brand system: Ink + Milk carry ~90% of every layout, Stone is
// the supporting neutral, Pulse is the single accent, Blush its soft tint.
// Mirrored as `--mv-*` custom properties in tokens.css.

export const brandPalette = {
  ink: '#091620',
  inkRaised: '#122230', // cards / panels sitting on Ink
  inkLine: '#24323D', // hairlines on Ink
  milk: '#ffffff',
  stone: '#EDEAE6',
  stoneLine: '#DAD5CE', // hairlines on Stone
  milkLine: '#E6E3DF', // hairlines on Milk
  pulse: '#ED3B44', // accent — large type, marks, details (3.95:1 on Milk)
  // Pulse deepened just enough to carry white text: 4.94:1 (WCAG AA).
  // Legacy red CTA alias. The new campaign system uses Ink/Milk primary actions.
  pulseStrong: '#D3303A',
  pulseHover: '#BC2831',
  blush: '#FFE8E9',
  textMuted: '#56606A', // on Milk 6.4:1, on Stone 5.3:1
  onInkMuted: '#B3BAC0', // on Ink 9.3:1
  onInkFaint: '#8A949C', // on Ink 5.9:1 — captions only
} as const;

/** Fluid type — rem at the 320px floor, rem at the ceiling. */
export const brandType = {
  display: 'Glacial Indifference',
  bodyFamily: 'Public Sans',
  // [min rem, max rem]
  hero: [2.5, 5.5],
  h2: [2.25, 4],
  h3: [1.5, 2],
  lede: [1.125, 1.3125],
  body: 1.0625, // 17px — brand body size
  small: 0.9375,
  label: 0.75, // uppercase, tracked
  labelTracking: 0.14, // em
  displayTracking: -0.015, // em
} as const;

export const brandLayout = {
  container: 1320,
  prose: 620, // ≈ 68ch at 17px — the brand's max line length
  radius: 4, // photographs + panels: crisp, not bubbly
  radiusCard: 8,
  radiusTile: 16,
  radiusPanel: 28, // hero colour panel
} as const;

export const brandMotion = {
  reveal: 720, // ms — section entrances
  hover: 200,
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

/** Paid-landing foundation. Keys mirror --mc-* properties in tokens.css. */
export const campaignTokens = {
  "canvas": "#FFFFFF",
  "ink": "#091620",
  "stone": "#EDEAE6",
  "pulse": "#ED3B44",
  "blush": "#FFE8E9",
  "muted": "#56606A",
  "line": "#DAD5CE",
  "clear": "transparent",
  "font-display": "var(--font-moves-display), 'Glacial Indifference', sans-serif",
  "font-body": "var(--font-moves-body), 'Public Sans', sans-serif",
  "hero-type": "4rem",
  "hero-type-mobile": "clamp(2.5rem, 10.8vw, 3.5rem)",
  "body-type": "1.0625rem",
  "small-type": "0.875rem",
  "caption-type": "1.25rem",
  "label-tracking": "0.12em",
  "title-tracking": "-0.025em",
  "title-leading": "1.1",
  "body-leading": "1.7",
  "ui-leading": "1.4",
  "frame": "1536px",
  "gutter": "clamp(1.25rem, 3.35vw, 4rem)",
  "header-height": "96px",
  "header-mobile-height": "80px",
  "announcement-height": "36px",
  "hero-height": "640px",
  "hero-padding": "clamp(2rem, 3.6vw, 3.5rem)",
  "copy-measure": "440px",
  "copy-column": "47%",
  "photo-column": "53%",
  "photo-position": "53% 42%",
  "photo-mobile-ratio": "16 / 10",
  "photo-mobile-position": "50% 36%",
  "logo-width": "160px",
  "logo-height": "36px",
  "touch": "44px",
  "button-height": "56px",
  "button-radius": "4px",
  "button-arrow-width": "56px",
  "button-border": "rgb(255 255 255 / 0.25)",
  "border-width": "1px",
  "focus-width": "2px",
  "focus-offset": "4px",
  "icon": "20px",
  "seal": "36px",
  "motion": "140ms",
  "ease": "cubic-bezier(0.2, 0, 0, 1)",
  "arrow-shift": "3px",
  "pressed-scale": "0.985",
  "photo-note-gap": "24px",
  "caption-height": "64px",
  "compact-label": "12px",
  "sticky-index": "20",
  "zero": "0",
  "full": "100%",
  "page-min": "100svh",
  "split-gap": "0",
  "desktop-breakpoint": "1024px",
  "tablet-breakpoint": "768px",
  "surface": "#EDEAE6",
  "ink-raised": "#20313E",
  "on-ink-muted": "#BCC3C8",
  "ink-line": "#35424C",
  "error": "#AB2431",
  "success": "#285A46",
  "display-type": "clamp(3rem, 5vw, 4rem)",
  "section-type": "clamp(2rem, 3.6vw, 2.5rem)",
  "subhead-type": "1.5rem",
  "lead-type": "1.25rem",
  "label-type": "0.8125rem",
  "button-type": "1rem",
  "input-type": "1rem",
  "heading-leading": "1.2",
  "short-leading": "1.5",
  "reading-frame": "1248px",
  "stage-gutter": "clamp(0.75rem, 1.7vw, 2rem)",
  "border-strong": "#7E868C",
  "card-radius": "4px",
  "media-radius": "4px",
  "pill-radius": "999px",
  "circle": "50%",
  "pulse-tab-width": "32px",
  "pulse-tab-height": "6px",
  "pulse-marker": "6px",
  "detail-width": "200px",
  "detail-height": "242px",
  "detail-overlap": "32px",
  "detail-mobile-width": "112px",
  "detail-mobile-height": "138px",
  "media-caption": "linear-gradient(0deg, rgb(9 22 32 / 0.72), rgb(9 22 32 / 0))",
  "media-caption-height": "96px",
  "image-top-label": "rgb(9 22 32 / 0.82)",
  "care-icon": "32px",
  "care-width": "340px",
  "card-shadow": "0 8px 24px rgb(9 22 32 / 0.08)",
  "stage-radius": "4px",
  "photo-inset": "12px",
  "foundation-section": "96px",
  "foundation-section-mobile": "56px",
  "foundation-sidebar": "210px",
  "specimen-height": "300px",
  "specimen-tall": "420px",
  "type-specimen-height": "72px",
  "swatch-height": "176px",
  "grid-columns": "repeat(12, minmax(0, 1fr))",
  "three-columns": "repeat(3, minmax(0, 1fr))",
  "two-columns": "repeat(2, minmax(0, 1fr))",
  "five-columns": "2fr 2fr 1fr 1fr 1fr",
  "half-columns": "1fr 1fr",
  "hero-columns": "0.95fr 1.05fr",
  "auto-column": "minmax(0, 1fr)",
  "field-height": "56px",
  "option-height": "52px",
  "check-size": "20px",
  "icon-stroke": "1.5",
  "half": "50%",
  "hero-top-gap": "24px",
  "bullet-size": "16px",
  "nav-gap": "32px",
  "system-top-gap": "72px",
  "negative-tab": "-6px",
  "negative-line": "-1px",
  "negative-detail": "-32px",
  "foundation-grid-height": "80px",
  "wide-breakpoint": "1280px",
  "mobile-wide-breakpoint": "480px",
  "hero-cta-width": "328px",
  "editorial-columns": "1.05fr 1fr",
  "diptych-columns": "1.8fr 1fr",
  "editorial-photo-height": "400px",
  "editorial-photo-position": "50% 40%",
  "focus-color": "#091620",
  "detail-compact-width": "88px",
  "detail-compact-height": "108px",
  "button-compact-type": "0.9375rem",
  "compact-breakpoint": "374px"
} as const;

export const tokens = {
  campaignTokens,
  palette,
  lightTheme,
  darkTheme,
  space,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  fontFamily,
  radius,
  shadow,
  duration,
  easing,
  breakpoint,
  maxWidth,
  zIndex,
  brandPalette,
  brandType,
  brandLayout,
  brandMotion,
} as const;
