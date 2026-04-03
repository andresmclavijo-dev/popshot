/**
 * Primitive design tokens — raw values with no semantic meaning.
 * These are the building blocks that semantic tokens reference.
 */
export const primitive = {
  color: {
    gray: {
      0: '#ffffff',
      50: '#f5f5f5',
      100: '#e0e0e0',
      200: '#d4d4d4',
      900: '#1a1a1a',
      950: '#141414',
    },
    sand: {
      50: '#f0ede8',
    },
    green: {
      600: '#16a34a',
    },
    red: {
      600: '#dc2626',
    },
    brand: {
      indigo: '#6366f1',
      purple: '#8b5cf6',
      pink: '#ec4899',
    },
    black: '#000000',
    white: '#ffffff',
  },
  opacity: {
    4: 0.04,
    6: 0.06,
    8: 0.08,
    10: 0.10,
    12: 0.12,
    15: 0.15,
    85: 0.85,
    88: 0.88,
    90: 0.90,
    92: 0.92,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  fontSize: {
    xs: 10,
    sm: 11,
    base: 12,
    md: 13,
    lg: 14,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const
