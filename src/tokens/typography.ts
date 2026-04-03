/**
 * Typography design tokens — complete spec from the codebase.
 *
 * Font: Satoshi (Fontshare CDN), loaded via @import in index.css
 * Fallback: 'DM Sans', system-ui, -apple-system, sans-serif
 */

// ── Font Family ──

export const fontFamily = {
  /** Primary font — used everywhere */
  sans: "'Satoshi', 'DM Sans', system-ui, -apple-system, sans-serif",
  /** Monospace — used for zoom %, hex inputs */
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  /** System — used for canvas badge watermark */
  system: "system-ui, -apple-system, sans-serif",
} as const

// ── Font Sizes ──

export const fontSize = {
  /** 8px — decorative illustration label ("raw" in before/after visual) */
  '2xs': 8,
  /** 10px — template card dimensions, ratio labels, "Soon" badge, watermark size labels */
  xs: 10,
  /** 11px — filter chips, legal links (Privacy · Terms), collapse label,
   *  keyboard shortcut hints (⌘0, ⌘1), template info in toolbar,
   *  frame/shadow card labels, upgrade modal plan subtitles */
  sm: 11,
  /** 12px — most common: slider labels + values, section sub-labels (Padding, Corners, Shadow, Frame),
   *  section headers (bold), sign-in text, tab labels, search input, template card names,
   *  toggle labels (Match to image), appearance label, format/resolution labels,
   *  badge checkbox label, platform group headers, assets empty state body,
   *  Pro user subtitle, "Go Pro" button text, collapse button */
  base: 12,
  /** 13px — button text (Go Pro, Export), action buttons (Download, Copy, Share),
   *  toast text, drop zone subtitle, upload/demo button text,
   *  upgrade modal feature list, ghost buttons (Maybe later, Cancel),
   *  assets empty state title */
  md: 13,
  /** 14px — logo wordmark "Popshot", upgrade modal subtitle,
   *  upgrade modal CTA button, avatar initials fallback */
  lg: 14,
  /** 16px — export modal heading "Export" */
  xl: 16,
  /** 17px — drop zone heading "Make your screenshots beautiful",
   *  upgrade modal heading "Popshot Pro" */
  '2xl': 17,
} as const

// ── Font Weights ──

export const fontWeight = {
  /** 400 — body text, inactive tabs, unselected labels, template dimensions,
   *  ratio labels, Pro user subtitle, upgrade modal subtitle + feature list,
   *  ghost buttons (Maybe later, Cancel), drop zone subtitle */
  normal: 400,
  /** 500 — button labels (Go Pro, Export, Copy, Download), tab labels,
   *  filter chips, slider labels, search placeholder, sign-in text,
   *  upgrade modal CTA, toggle labels, "Soon" badge, appearance label,
   *  format/resolution labels, platform icon text, upload/demo buttons,
   *  assets empty state title + CTA, collapse label, "raw" label */
  medium: 500,
  /** 600 — selected card labels (template, shadow, frame), active tab,
   *  platform group headers, selected segmented control, upgrade modal
   *  heading + plan toggle active, export modal heading,
   *  drop zone heading, avatar initials */
  semibold: 600,
  /** 700 — right panel section headers (Background, Layout, Effects, Watermark),
   *  Pro user name, section header titles */
  bold: 700,
} as const

// ── Letter Spacing ──

export const letterSpacing = {
  /** Default body — applied to <body> in index.css */
  body: '-0.01em',
  /** Headings — applied to h1, h2, h3 in index.css */
  heading: '-0.02em',
  /** Drop zone heading — explicit in component */
  tight: '-0.01em',
  /** Normal — no adjustment */
  normal: '0',
} as const

// ── Line Height ──

export const lineHeight = {
  /** Default — browser default ~1.2 */
  none: 1,
  /** Tight — template card names, drop zone heading */
  tight: 1.3,
  /** Relaxed — drop zone subtitle, assets empty state body */
  relaxed: 1.4,
  /** Loose — upgrade modal feature list */
  loose: 2,
} as const

// ── Font Smoothing ──
// Applied globally in index.css:
// -webkit-font-smoothing: antialiased
// -moz-osx-font-smoothing: grayscale

// ── Numeric ──

export const fontVariant = {
  /** Used on slider values (48px, 12px, 0px) and zoom percentage */
  tabularNums: 'tabular-nums',
} as const

// ── Component Typography Rules ──

export const componentTypography = {
  /** Right panel section headers — collapsible */
  sectionHeader: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.bold,     // 700
    color: 'var(--ps-text-primary)',
    textTransform: 'none' as const, // sentence case, never uppercase
    letterSpacing: letterSpacing.normal,
  },
  /** Right panel sub-labels (Padding, Corners, Shadow, Frame, Position) */
  controlLabel: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.medium,   // 500
    color: 'var(--ps-text-secondary)',
  },
  /** Slider value readout (48px, 12px) */
  controlValue: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.medium,   // 500
    color: 'var(--ps-text-primary)',
    fontVariantNumeric: fontVariant.tabularNums,
  },
  /** Primary buttons (Export, Download) */
  buttonPrimary: {
    fontSize: fontSize.md,          // 13px
    fontWeight: fontWeight.medium,   // 500
    color: 'var(--ps-bg-page)',     // inverts in dark mode
  },
  /** Secondary buttons (Go Pro) */
  buttonSecondary: {
    fontSize: fontSize.md,          // 13px
    fontWeight: fontWeight.medium,   // 500
    color: 'var(--ps-text-primary)',
  },
  /** Ghost buttons (Maybe later, Cancel) */
  buttonGhost: {
    fontSize: fontSize.md,          // 13px
    fontWeight: fontWeight.normal,   // 400
    color: 'var(--ps-text-tertiary)',
  },
  /** Template card name */
  cardLabel: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.normal,   // 400 (600 when selected)
    color: 'var(--ps-text-primary)',
    lineHeight: lineHeight.tight,   // 1.3
  },
  /** Template card dimensions + ratio */
  cardMeta: {
    fontSize: fontSize.xs,          // 10px
    fontWeight: fontWeight.normal,   // 400
    color: 'var(--ps-text-tertiary)',
  },
  /** Shadow/Frame card labels */
  effectCardLabel: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.normal,   // 400 (600 when selected)
    color: 'var(--ps-text-primary)',
  },
  /** Left panel tabs (Templates / Assets) */
  tab: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.normal,   // 400 (600 when active)
  },
  /** Filter chips (All, Social, Portfolio, PH) */
  chip: {
    fontSize: fontSize.sm,          // 11px
    fontWeight: fontWeight.medium,   // 500
  },
  /** Platform group header (X (Twitter), LinkedIn, etc.) */
  platformHeader: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.semibold, // 600
    color: 'var(--ps-text-primary)',
  },
  /** Left panel logo wordmark */
  logo: {
    fontSize: fontSize.lg,          // 14px
    fontWeight: fontWeight.medium,   // 500
    color: 'var(--ps-text-primary)',
  },
  /** Toast notification */
  toast: {
    fontSize: fontSize.md,          // 13px
    fontWeight: fontWeight.medium,   // 500
    color: '#ffffff',               // always white on dark overlay
  },
  /** Bottom toolbar zoom percentage */
  zoom: {
    fontSize: fontSize.base,        // 12px
    fontWeight: fontWeight.medium,   // 500
    fontFamily: fontFamily.mono,
    fontVariantNumeric: fontVariant.tabularNums,
    color: 'var(--ps-text-secondary)',
  },
  /** Legal links (Privacy · Terms) */
  legal: {
    fontSize: fontSize.sm,          // 11px
    fontWeight: fontWeight.normal,   // 400
    color: 'var(--ps-text-tertiary)',
  },
  /** Drop zone heading */
  dropZoneHeading: {
    fontSize: fontSize['2xl'],      // 17px
    fontWeight: fontWeight.semibold, // 600
    color: 'var(--ps-text-primary)',
    letterSpacing: letterSpacing.tight,
    lineHeight: lineHeight.tight,
  },
  /** Drop zone subtitle */
  dropZoneBody: {
    fontSize: fontSize.md,          // 13px
    fontWeight: fontWeight.normal,   // 400
    color: 'var(--ps-text-secondary)',
    lineHeight: lineHeight.relaxed,
  },
  /** Export modal heading */
  modalHeading: {
    fontSize: fontSize.xl,          // 16px
    fontWeight: fontWeight.semibold, // 600
    color: 'var(--ps-text-primary)',
  },
  /** Upgrade modal heading */
  upgradeHeading: {
    fontSize: fontSize['2xl'],      // 17px
    fontWeight: fontWeight.semibold, // 600
    color: 'var(--ps-text-primary)',
  },
  /** Upgrade modal subtitle */
  upgradeSubtitle: {
    fontSize: fontSize.lg,          // 14px
    fontWeight: fontWeight.normal,   // 400
    color: 'var(--ps-text-secondary)',
  },
  /** Upgrade modal feature list item */
  upgradeFeature: {
    fontSize: fontSize.md,          // 13px
    fontWeight: fontWeight.normal,   // 400
    color: 'var(--ps-text-primary)',
    lineHeight: lineHeight.loose,   // 2
  },
} as const
