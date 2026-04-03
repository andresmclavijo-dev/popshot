/**
 * Semantic design tokens — purpose-based aliases referencing primitives.
 * These map 1:1 to the CSS custom properties in src/index.css.
 *
 * CSS variable mapping:
 *   semantic.light.text.primary  →  --ps-text-primary: #1a1a1a
 *   semantic.dark.text.primary   →  .dark { --ps-text-primary: #f0f0f0 }
 */
import { primitive } from './primitive'

export const semantic = {
  light: {
    text: {
      primary: primitive.color.gray[900],           // #1a1a1a  →  --ps-text-primary
      secondary: '#5c5c5c',                         //          →  --ps-text-secondary
      tertiary: '#8a8a8a',                          //          →  --ps-text-tertiary
      onDark: primitive.color.white,                // #ffffff  →  --ps-text-on-dark
      success: primitive.color.green[600],          // #16a34a  →  --ps-text-success
      danger: primitive.color.red[600],             // #dc2626  →  --ps-text-danger
    },
    bg: {
      page: primitive.color.sand[50],               // #f0ede8  →  --ps-bg-page
      surface: primitive.color.white,               // #ffffff  →  --ps-bg-surface
      panel: `rgba(255,255,255,${primitive.opacity[88]})`,  //  →  --ps-bg-panel
      hover: `rgba(0,0,0,${primitive.opacity[4]})`,         //  →  --ps-bg-hover
      active: `rgba(0,0,0,${primitive.opacity[8]})`,        //  →  --ps-bg-active
      dark: `rgba(0,0,0,${primitive.opacity[85]})`,         //  →  --ps-bg-dark
    },
    border: {
      default: `rgba(0,0,0,${primitive.opacity[8]})`,      //  →  --ps-border
      strong: `rgba(0,0,0,${primitive.opacity[15]})`,       //  →  --ps-border-strong
      selected: primitive.color.gray[900],          // #1a1a1a  →  --ps-border-selected
      panel: `rgba(255,255,255,${primitive.opacity[90]})`,  //  →  --ps-border-panel
    },
  },
  dark: {
    text: {
      primary: '#f0f0f0',                           //          →  --ps-text-primary
      secondary: '#a0a0a0',                         //          →  --ps-text-secondary
      tertiary: '#666666',                          //          →  --ps-text-tertiary
      onDark: primitive.color.white,                // #ffffff  →  --ps-text-on-dark
      success: primitive.color.green[600],          //          →  (unchanged)
      danger: primitive.color.red[600],             //          →  (unchanged)
    },
    bg: {
      page: primitive.color.gray[950],              // #141414  →  --ps-bg-page
      surface: '#1e1e1e',                           //          →  --ps-bg-surface
      panel: `rgba(28,28,28,${primitive.opacity[92]})`,     //  →  --ps-bg-panel
      hover: `rgba(255,255,255,${primitive.opacity[6]})`,   //  →  --ps-bg-hover
      active: `rgba(255,255,255,${primitive.opacity[10]})`,  // →  --ps-bg-active
      dark: `rgba(0,0,0,${primitive.opacity[90]})`,         //  →  --ps-bg-dark
    },
    border: {
      default: `rgba(255,255,255,${primitive.opacity[8]})`,  // →  --ps-border
      strong: `rgba(255,255,255,${primitive.opacity[15]})`,   // →  --ps-border-strong
      selected: '#f0f0f0',                          //          →  --ps-border-selected
      panel: `rgba(255,255,255,${primitive.opacity[12]})`,   // →  --ps-border-panel
    },
  },
  brand: {
    gradient: `linear-gradient(135deg, ${primitive.color.brand.indigo}, ${primitive.color.brand.purple}, ${primitive.color.brand.pink})`,
  },
  radius: primitive.radius,
  spacing: primitive.spacing,
  fontSize: primitive.fontSize,
  fontWeight: primitive.fontWeight,
} as const
