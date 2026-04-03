/**
 * Component-level design tokens — specific to UI components.
 * These reference semantic tokens and encode layout decisions.
 */
import { semantic } from './semantic'

export const component = {
  panel: {
    padding: semantic.spacing.lg,               // 16
    gap: semantic.spacing.lg,                   // 16
    borderRadius: semantic.radius.lg,           // 16
    gridGap: semantic.spacing.sm,               // 8
    sectionGap: semantic.spacing.md,            // 12
  },
  card: {
    borderRadius: semantic.radius.md,           // 12
    height: 60,
    labelSize: semantic.fontSize.base,          // 12
    gridGap: semantic.spacing.md,               // 12
  },
  swatch: {
    height: 52,
    borderRadius: semantic.radius.md,           // 12
    gridGap: semantic.spacing.sm,               // 8
  },
  button: {
    height: 32,
    borderRadius: semantic.radius.pill,         // 9999
    fontSize: semantic.fontSize.md,             // 13
    fontWeight: semantic.fontWeight.medium,      // 500
  },
  canvas: {
    insetTop: 24,
    insetSides: 32,
    insetBottom: 32,
    borderRadius: semantic.radius.sm,           // 8
  },
} as const
