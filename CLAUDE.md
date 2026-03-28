# CLAUDE.md — Popshot

## What this is
A web-based screenshot beautifier. Users paste/drag a screenshot,
customize background, shadow, frame, padding, then export a PNG.
Stack is fully client-side. No backend, no auth, no database in v1.

---

## Tech stack
- React 18 + Vite + TypeScript
- Tailwind CSS v4
- shadcn/ui (for controls only — sliders, toggles, buttons, popovers)
- Zustand (global editor state)
- html-to-image (PNG export)
- colorthief (auto color extraction)
- Lemon Squeezy (payments, future)
- Domain: popshot.app (purchased March 28, 2026)

---

## Architecture rules

### Folder structure
src/
  components/
    canvas/
    controls/
    ui/
    shared/
  store/
    useEditorStore.ts
  lib/
    exportImage.ts
    colorExtract.ts
    presets.ts
  types/
    index.ts
  hooks/
    useImageUpload.ts
    useExport.ts

### Component rules
- One component per file, named exports only
- No component over 150 lines — split if longer
- No inline logic in JSX — extract to hooks or lib functions
- Canvas components never import from controls and vice versa
- All editor state lives in Zustand — no prop drilling

---

## Design system tokens

### Colors
--color-bg-page: #E8E8E6
--color-bg-panel: #F7F7F6
--color-bg-card: #FFFFFF
--color-bg-hover: #F0F0EE
--color-border: #E2E2E0
--color-border-strong: #C8C8C5
--color-text-primary: #1A1A18
--color-text-secondary: #6B6B68
--color-text-tertiary: #9F9F9B
--color-accent: #6C47FF
--color-accent-hover: #5835EE
--color-accent-subtle: #F0ECFF
--color-success: #16A34A
--color-danger: #DC2626

### Spacing scale
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px

### Border radius scale
--radius-xs: 4px
--radius-sm: 6px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px

### Shadow scale
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08)
--shadow-md: 0 4px 12px rgba(0,0,0,0.10)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.12)

### Typography
--font-sans: 'Inter Variable', system-ui, sans-serif
Font sizes: 11px / 12px / 13px / 14px / 16px / 18px / 24px
Weights: 400 / 500 / 600 only

### Panel design system
- Panel: 300px, 16px horizontal padding
- Section labels: 11px uppercase, letter-spacing 0.06em
- Number inputs: 30px height, 13px font, 64px wide, right-aligned
- Segmented controls: 30px height, 12px font, connected pills
- Slider track: 4px, thumb: 14px
- Breathing room: 20px between sections, 16px between controls
- Background swatches have named labels below each swatch
- Canvas size buttons show preset name + dimensions
- Shadow type 'ambient' renamed to 'deep' throughout codebase

---

## Tailwind rules
- Use CSS variables via Tailwind where possible
- Never use arbitrary Tailwind values like w-[347px]
- No @apply except in index.css for base styles
- Desktop-first, no responsive classes unless explicitly requested

---

## shadcn rules
- Use shadcn ONLY for: Slider, Switch, Toggle, Popover, Tooltip, Button
- Never use shadcn for layout, typography, or canvas components
- Override shadcn styles via CSS variables only, never edit component files

---

## Canvas rules
- Export target div must always have id="export-canvas"
- Never use Tailwind classes on export-canvas or its children — inline styles only
- All canvas visual properties come exclusively from Zustand store
- Test every canvas feature against PNG export before committing

---

## State shape
interface EditorState {
  imageFile: File | null
  imageUrl: string | null
  background: { type: 'solid' | 'gradient' | 'transparent'; value: string }
  padding: number
  cornerRadius: number
  shadow: 'none' | 'soft' | 'deep'
  frame: 'none' | 'macos-light' | 'macos-dark' | 'iphone'
  aspectRatio: 'free' | '16:9' | '1:1' | '4:3' | 'twitter' | 'linkedin' | 'dribbble' | 'behance' | 'og' | 'pinterest'
  autoColor: boolean
  proUnlocked: boolean
}

---

## What's been built
(Update after every session)

- [x] Project scaffold
- [x] Tailwind + shadcn configured
- [x] Zustand store
- [x] Dropzone
- [x] Canvas preview
- [x] Background picker
- [x] Padding + radius sliders
- [x] Shadow picker
- [x] Frame picker
- [x] Aspect ratio presets
- [x] Auto color extraction
- [x] Auto-color toggle
- [x] PNG export
- [x] Copy to clipboard export
- [x] Controls panel redesigned (familiar, scannable, progressively advanced)
- [x] NumberInput component
- [x] Segmented control buttons
- [x] Keyboard shortcuts
- [x] Behance aspect ratio preset
- [x] Progressive disclosure (custom shadow, custom gradient)
- [x] Canvas/panel contrast (#E8E8E6 canvas vs #F7F7F6 panel)
- [x] Transparent background preset (checkerboard swatch)
- [x] Shadow labels renamed (Ambient → Deep)
- [x] Auto-color toggle renamed (Match to image)
- [x] Export toast notifications
- [x] Swatch size 32x32px
- [x] Open Graph + Pinterest presets
- [ ] Social presets
- [ ] Pro gate

---

## What NOT to build yet
- Auth, accounts, server-side storage
- Multi-image stacking (v2)
- Annotation / text layer (v2)
- AI background generation (v2)
- Animated noise overlays (export issues)
