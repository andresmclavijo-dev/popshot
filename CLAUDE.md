# CLAUDE.md — Popshot
# ~/screenshoot-app
# Last updated: March 28, 2026

## Global rules
Inherits from ~/.claude/CLAUDE.md.
Motion (150-200ms, calm over clever), WCAG AA, UX writing verb rule,
sentence case labels, React 300-line limit, 3-layer CSS architecture,
no arbitrary Tailwind — all apply from global.
Do not re-state those rules here.

## Monetization notes
- Watermark: bottom-right, 11px system-ui, 0.5 opacity, auto light/dark
- Watermark = #1 Pro benefit (removal unlocks first)
- Pro price: $19 one-time (show ~~$29~~ as launch framing)
- 2x export is free — never gate resolution
- Lemon Squeezy variant ID: VARIANT_ID_PLACEHOLDER (update before launch)
- localStorage key: 'popshot_pro' = 'true'
- Export gate shown once (localStorage 'hasSeenExportGate')

## Global rule adaptations for Popshot
- Background transition: 200ms var(--ease-out) — not 600ms
- Toast dismiss: 2000ms — global standard applies
- Export canvas children: inline styles ONLY, never Tailwind classes
  (Tailwind purges classes on export-canvas break html-to-image)
- No server-side code — fully client-side, no API routes needed
- hoveredBackground MUST be local useState in BackgroundPicker
  NOT in Zustand store — hover state is UI-only, not shared state

## Stack
- React 18 + Vite + TypeScript
- Tailwind CSS v4 + @tailwindcss/vite
- shadcn/ui — Slider, Switch, Toggle, Button, Tooltip, Popover only
- Zustand (global editor state)
- html-to-image (PNG export) — use stable useRef, not getElementById
- colorthief (auto color extraction) — run once per image load only
- Lemon Squeezy (payments, Pro gate — future)
- Vercel (hosting)
- Domain: popshot.app (Cloudflare)

## Design tokens
--color-bg-page: #E4E4E2        canvas area with dot grid
--color-bg-panel: #F7F7F6       right panel
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
--color-danger: #DC2626
--color-success: #16A34A

--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1)
--ease-in: cubic-bezier(0.4, 0.0, 1, 1)
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1)

## Panel design rules
- Width: 300px
- Padding: 16px horizontal on all sections
- Section labels: 11px, 500 weight, sentence case, 0.06em spacing
- Number inputs: 30px height, 13px font, 64px wide, right-aligned
- Segmented controls: 30px height, 12px font, connected pills
- Button heights: 36px primary, 32px small (global standard)
- Slider track: 4px, thumb: 14px
- Breathing room: 20px between sections
- Two zones: Image (radius, shadow, frame) / Canvas (bg, padding, size)
- TooltipProvider at App.tsx root, delayDuration=600

## ICP — locked
Indie makers + product designers. Forever.
No developer features. No code snippet beautification.
The dev tool is a separate future product — not this repo.

## Key UX decisions locked
- "Calm over clever" motion — no bounce, no elastic, no spring
- Swatch hover previews canvas, click commits (local state only)
- Pro copy: lead with outcome — "Make every screenshot stunning"
- Pro CTA: "Get Popshot Pro" — "$19 · one-time · no subscription" below
- Toast copy: "Saved · 1x" / "Saved · 2x" / "Image copied"
- Export buttons: "Copy image" (primary filled) + "Save PNG" (outline)
- Section labels: sentence case — "Background" not "BACKGROUND"
- Presets: Paper, Concrete, Midnight, Deep Sea, Dusk, Nordic, Warm, Moss, Blush

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
- [x] Price updated to $19 throughout UI (~~$29~~ launch framing)
- [x] 2x export is free for all users
- [x] 'Made with Popshot' watermark on free exports (system-ui font)
- [x] Export gate modal (first export shows watermark vs no-watermark)
- [x] Lemon Squeezy overlay checkout wired (localStorage flow)
- [x] Jordan fixes: pixelRatio 2, double rAF, URL cleanup, CORS note
- [x] Error toasts: export fail, wrong type, file too large (4000ms)
- [x] Meta tags + favicon in index.html
- [x] Swatch grid fixed (4 per row with labels)
- [x] IMAGE/CANVAS zone tints (rounded wrappers)
- [x] WCAG prefers-reduced-motion verified
- [x] Sentence case labels verified
- [x] Swatch grid: 4 per row, labels, hover/active, checkerboard refined
- [x] IMAGE/CANVAS zone tints (rounded wrappers, barely-visible)
- [x] Export gate flow verified (watermark inside export-canvas)
- [x] All transitions use var(--ease-out), no plain ease keyword
- [x] Background transition 200ms confirmed
- [x] Toast: bottom-right, 2000ms success, 4000ms error
- [ ] Social presets
- [ ] Pro gate (Lemon Squeezy — variant ID needed)

---

## What NOT to build yet
- Auth, accounts, server-side storage
- Multi-image stacking (v2)
- Annotation / text layer (v2)
- AI background generation (v2)
- Animated noise overlays (export issues)
