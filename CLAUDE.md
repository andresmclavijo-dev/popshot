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
- Export: Copy (filled primary) + Export (outline secondary), side by side
- Canvas: background CSS transition 200ms ease-out on all changes
- macOS frame: title bar 28px, dots 12px, #FF5F57/#FFBD2E/#28C840
- No border dividers between panel sections — padding-top only for breathing room
- Empty state shows 3 fan-arranged example thumbnails + clean upload zone with dashed border
- Pro badge style: gradient pill #6C47FF→#9C47FF, white text, 9px
- Shuffle picks random non-transparent bg preset + random non-none shadow combo
- Panel has two zones: IMAGE (radius, shadow, frame) and CANVAS (bg, padding, size)
- Swatch hover previews canvas, click commits
- Shadow buttons show visual preview (52px height with preview + label)
- Label scrubbing: ew-resize cursor, drag to adjust value
- Drag states: 2px accent outline + rgba tint on canvas wrapper
- All key controls have Tooltip with 600ms delay
- Pro copy formula: outcome first, "forever" always included
- Motion: "Calm over clever" — 150-200ms ease-out, no bounce, no elastic
- Easing: always use CSS variables (--ease-out, --ease-in, --ease-in-out), never browser default
- Exits always faster than enters
- Button heights: 36px primary, 32px small — never arbitrary
- Section labels: Sentence case, 11px, 500 weight, 0.06em spacing
- Focus: 2px accent ring, offset 2px, border-radius inherit (global :focus-visible)
- Toast: bottom-right, 2000ms dismiss, specific copy, past tense, green checkmark

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
- [x] Canvas dot grid background (#E4E4E2 + radial-gradient dots)
- [x] Export button hero treatment (36px, ArrowDownToLine icon, ⌘E hint, hover lift + purple shadow)
- [x] Removed panel section border dividers
- [x] Renamed all presets to evocative labels (Paper, Concrete, Deep Sea, Dusk, Nordic, Warm, Moss, Blush)
- [x] Top bar logo mark (20px violet rounded square with P) + stronger border + weight 700
- [x] Empty state with 3 fan-arranged example thumbnails + clean upload zone
- [x] Shuffle/randomize button in Background section header
- [x] Pro badges (gradient pill) on Custom Gradient, Presets section, Watermark section
- [x] Upgrade prompt at bottom of panel ($9 once CTA)
- [x] Canvas Retina devicePixelRatio fix
- [x] Background transition animation (600ms ease on all bg changes)
- [x] Copy as primary export button, Download as secondary
- [x] Clear/reset × button on canvas
- [x] Contextual Pro gate popover on PRO badge hover
- [x] Three-stop hero gradients with varied angles
- [x] Pixel-perfect macOS traffic lights (Apple HIG spec)
- [x] Shuffle cross-fade + canvas pop animation
- [x] Demo screenshot on first load (isDemoMode state)
- [x] Swatch hover preview (hover to preview, click to commit)
- [x] Shadow buttons with visual preview (tiny rect + actual shadow)
- [x] Panel reorganized into IMAGE / CANVAS zones
- [x] Label scrubbing on Padding and Corner Radius
- [x] Drag-and-drop states (outline, tint, flash on drop)
- [x] Tooltips with keyboard shortcuts (600ms delay)
- [x] Pro upgrade copy rewrite ("forever" is the key word)
- [x] Loading state during image processing
- [x] Slider thumb CSS transition
- [x] prefers-reduced-motion WCAG AA compliance
- [x] Explicit easing CSS variables (--ease-out, --ease-in, --ease-in-out)
- [x] Animation timing fixed (background 200ms, toast 2000ms, buttons 100ms)
- [x] Button heights verified (36px primary, 32px small)
- [x] Section labels converted to Sentence case
- [x] UX copy: verb rule (Save PNG, Copy image, Edit gradient, Edit shadow)
- [x] Toast specificity (Saved · 1x, Saved · 2x, Image copied)
- [x] Pro copy: aspiration pattern, "Get Popshot Pro", "forever"
- [x] Skeleton shimmer with "Extracting colors..." label
- [x] Complete hover/active/focus states on all elements
- [x] TooltipProvider at App.tsx root
- [x] hoveredBackground in local state (not Zustand)
- [x] lastShuffle timestamp pattern with @keyframes canvasPop
- [x] Canvas decomposed (CanvasLoading extracted)
- [ ] Social presets
- [ ] Pro gate (Lemon Squeezy)

---

## What NOT to build yet
- Auth, accounts, server-side storage
- Multi-image stacking (v2)
- Annotation / text layer (v2)
- AI background generation (v2)
- Animated noise overlays (export issues)
