import { useState, useRef } from 'react'
import { ChevronDown, Lock, Upload, X, RotateCcw, Check, Sparkles } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import { showToast } from '@/components/shared/Toast'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import { openExportModal } from '@/components/shared/ExportModal'
import type { Background, WatermarkPosition, ImagePosition } from '@/types'

const PANEL_WIDTH = 220
const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach', 'transparent'])
const CHECKERBOARD = 'repeating-conic-gradient(#D0D0CE 0% 25%, #F0F0EE 0% 50%) 0 0 / 8px 8px'
const FREE_SWATCH_COUNT = 6

const sliderRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' }
const sliderLabelRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

function Section({ label, locked, defaultOpen = true, children }: { label: string; locked?: boolean; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button type="button" onClick={() => !locked && setOpen(!open)}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          cursor: locked ? 'default' : 'pointer', padding: '11px 0 8px',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ps-text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {label}
          {locked && <Lock size={10} strokeWidth={2.5} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />}
        </span>
        {!locked && <ChevronDown size={16} style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 220ms ease', color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />}
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '800px' : '0px',
        opacity: open ? 1 : 0,
        transition: 'max-height 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease',
      }}>
        {children}
      </div>
    </div>
  )
}

// Frame options
const FRAME_OPTIONS: { id: import('@/types').FrameType; label: string; pro?: boolean }[] = [
  { id: 'none', label: 'None' }, { id: 'macos-light', label: 'macOS' }, { id: 'macos-dark', label: 'Dark' },
  { id: 'safari', label: 'Safari' }, { id: 'arc', label: 'Arc', pro: true }, { id: 'card', label: 'Card', pro: true },
  { id: 'stack', label: 'Stack', pro: true },
]

function FrameThumb({ type }: { type: import('@/types').FrameType }) {
  const w = 32, h = 22
  if (type === 'none') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x="1" y="1" width="30" height="20" rx="3" stroke="var(--ps-text-tertiary)" strokeWidth="1" fill="none" /></svg>
  if (type === 'macos-light') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#F5F5F5" stroke="#DDD" /><circle cx="5" cy="4" r="1.5" fill="#FF5F57" /><circle cx="9" cy="4" r="1.5" fill="#FFBD2E" /><circle cx="13" cy="4" r="1.5" fill="#28C840" /></svg>
  if (type === 'macos-dark') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#2D2D2D" stroke="#444" /><circle cx="5" cy="4" r="1.5" fill="#FF5F57" /><circle cx="9" cy="4" r="1.5" fill="#FFBD2E" /><circle cx="13" cy="4" r="1.5" fill="#28C840" /></svg>
  if (type === 'safari') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#F5F5F5" stroke="#DDD" /><circle cx="5" cy="3.5" r="1.2" fill="#FF5F57" /><circle cx="8.5" cy="3.5" r="1.2" fill="#FFBD2E" /><circle cx="12" cy="3.5" r="1.2" fill="#28C840" /><rect x="6" y="7" width="20" height="3" rx="1.5" fill="#E8E8E8" /></svg>
  if (type === 'arc') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#1A1A2E" stroke="#333" /><rect x="3" y="4" width="2" height="8" rx="1" fill="url(#ag2)" /><defs><linearGradient id="ag2" x1="4" y1="4" x2="4" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs></svg>
  if (type === 'card') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x="1" y="1" width="30" height="20" rx="4" fill="white" stroke="#DDD" /><rect x="4" y="4" width="24" height="14" rx="2" fill="#F0F0F0" /></svg>
  return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x="4" y="4" width="27" height="17" rx="3" fill="#E0E0E0" stroke="#CCC" strokeWidth=".5" /><rect x="2" y="2" width="27" height="17" rx="3" fill="#EEE" stroke="#CCC" strokeWidth=".5" /><rect x="0.5" y="0.5" width="27" height="17" rx="3" fill="white" stroke="#DDD" /></svg>
}

const IMAGE_POSITIONS: ImagePosition[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']
const WM_POSITIONS: WatermarkPosition[] = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right']

export function RightPanel({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)
  const setAutoColor = useEditorStore((s) => s.setAutoColor)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const padding = useEditorStore((s) => s.padding)
  const setPadding = useEditorStore((s) => s.setPadding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)
  const imagePosition = useEditorStore((s) => s.imagePosition)
  const setImagePosition = useEditorStore((s) => s.setImagePosition)
  const imageOffsetX = useEditorStore((s) => s.imageOffsetX)
  const setImageOffsetX = useEditorStore((s) => s.setImageOffsetX)
  const imageOffsetY = useEditorStore((s) => s.imageOffsetY)
  const setImageOffsetY = useEditorStore((s) => s.setImageOffsetY)
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)
  const frame = useEditorStore((s) => s.frame)
  const setFrame = useEditorStore((s) => s.setFrame)
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl)
  const setBackgroundImageUrl = useEditorStore((s) => s.setBackgroundImageUrl)
  const watermarkUrl = useEditorStore((s) => s.watermarkUrl)
  const setWatermarkUrl = useEditorStore((s) => s.setWatermarkUrl)
  const watermarkPosition = useEditorStore((s) => s.watermarkPosition)
  const setWatermarkPosition = useEditorStore((s) => s.setWatermarkPosition)
  const watermarkOpacity = useEditorStore((s) => s.watermarkOpacity)
  const setWatermarkOpacity = useEditorStore((s) => s.setWatermarkOpacity)
  const watermarkScale = useEditorStore((s) => s.watermarkScale)
  const setWatermarkScale = useEditorStore((s) => s.setWatermarkScale)
  const reset = useEditorStore((s) => s.reset)

  const wmInputRef = useRef<HTMLInputElement>(null)

  const hasImage = !!imageUrl
  const dimmed = !hasImage

  return (
    <div style={{
      position: 'absolute', right: '12px', top: '12px', bottom: '12px',
      width: `${PANEL_WIDTH}px`, borderRadius: '16px',
      background: 'var(--ps-bg-panel)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: '0.5px solid var(--ps-border-panel)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 10,
    }}>
      {/* Header — action buttons only */}
      <div style={{ padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {!proUnlocked && (
            <button type="button" onClick={openUpgradeModal}
              style={{ flex: 1, height: '34px', background: 'transparent', border: `1px solid var(--ps-border-strong)`, borderRadius: 'var(--ps-radius-pill)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 150ms ease-out' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ps-border-selected)'; e.currentTarget.style.color = 'var(--ps-text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = 'var(--ps-text-secondary)' }}>
              <Sparkles size={12} aria-hidden="true" /> Go Pro
            </button>
          )}
          <button type="button" onClick={() => hasImage && openExportModal()} disabled={!hasImage}
            style={{ flex: 1, height: '34px', background: 'var(--ps-text-primary)', color: 'var(--ps-bg-page)', border: 'none', borderRadius: 'var(--ps-radius-pill)', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', cursor: hasImage ? 'pointer' : 'not-allowed', opacity: hasImage ? 1 : 0.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'background 150ms ease-out' }}
            onMouseEnter={(e) => { if (hasImage) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = hasImage ? '1' : '0.4' }}>
            Export <ChevronDown size={12} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="canvas-workspace" style={{ flex: 1, overflowY: 'auto', padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '18px', opacity: dimmed ? 0.35 : 1, pointerEvents: dimmed ? 'none' : 'auto', transition: 'opacity 200ms ease-out' }}>
        {/* Background */}
        <Section label="Background">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
            {BACKGROUND_PRESETS.map((preset, i) => {
              const active = background.value === preset.background.value && !backgroundImageUrl
              const isTransparent = preset.id === 'transparent'
              const locked = i >= FREE_SWATCH_COUNT && !proUnlocked
              return (
                <button key={preset.id} type="button"
                  onClick={() => {
                    if (locked) { openUpgradeModal(); return }
                    setBackground(preset.background)
                    if (backgroundImageUrl) setBackgroundImageUrl(null)
                    if (autoColor) setAutoColor(false)
                  }}
                  onMouseEnter={() => !locked && onHoverBackground(preset.background)}
                  onMouseLeave={() => onHoverBackground(null)}
                  aria-label={`${preset.label} background`} aria-pressed={active}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 'var(--ps-radius-md)', border: '1.5px solid var(--ps-border)',
                    background: isTransparent ? CHECKERBOARD : preset.background.value,
                    cursor: 'pointer', outline: active ? `2px solid var(--ps-border-selected)` : 'none',
                    outlineOffset: active ? '2px' : undefined, opacity: locked ? 0.45 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 150ms ease-out',
                  }}>
                  {locked && <Lock size={10} strokeWidth={2.5} style={{ color: LIGHT_SWATCHES.has(preset.id) ? '#666' : '#FFF' }} aria-hidden="true" />}
                  {active && !locked && <Check size={12} strokeWidth={3} style={{ color: LIGHT_SWATCHES.has(preset.id) ? 'var(--ps-text-primary)' : '#FFF' }} aria-hidden="true" />}
                </button>
              )
            })}
          </div>
          {/* Match to image */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label htmlFor="match-img" style={{ fontSize: '12px', color: 'var(--ps-text-secondary)', cursor: 'pointer' }}>Match to image</label>
            <Switch id="match-img" checked={autoColor} onCheckedChange={async (checked) => { setAutoColor(checked); if (checked && imageUrl) { try { const bg = await extractColorsFromImage(imageUrl); setBackground(bg) } catch {} } }} size="sm" />
          </div>
        </Section>

        {/* Layout */}
        <Section label="Layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Padding</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{padding}px</span>
              </div>
              <Slider value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v)} min={0} max={240} step={4} aria-label="Padding" />
            </div>
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Corners</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{cornerRadius}px</span>
              </div>
              <Slider value={[cornerRadius]} onValueChange={(v) => setCornerRadius(Array.isArray(v) ? v[0] : v)} min={0} max={48} step={2} aria-label="Corner radius" />
            </div>
            {/* Position */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Position</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 24px)', gap: '6px', justifyContent: 'center' }}>
                {IMAGE_POSITIONS.map((pos) => {
                  const active = imagePosition === pos
                  return (
                    <button key={pos} type="button" onClick={() => setImagePosition(pos)} aria-label={`Position ${pos}`} aria-pressed={active}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', border: active ? 'none' : `0.5px solid var(--ps-border)`, background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', cursor: 'pointer', padding: 0, transition: 'background 150ms ease-out' }} />
                  )
                })}
              </div>
            </div>
            {/* Offset sliders */}
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>X offset</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{imageOffsetX}px</span>
              </div>
              <Slider value={[imageOffsetX]} onValueChange={(v) => setImageOffsetX(Array.isArray(v) ? v[0] : v)} min={-500} max={500} step={1} aria-label="X offset" />
            </div>
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Y offset</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{imageOffsetY}px</span>
              </div>
              <Slider value={[imageOffsetY]} onValueChange={(v) => setImageOffsetY(Array.isArray(v) ? v[0] : v)} min={-500} max={500} step={1} aria-label="Y offset" />
            </div>
          </div>
        </Section>

        {/* Effects */}
        <Section label="Effects" defaultOpen={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Shadow */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Shadow</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {SHADOW_PRESETS.map((opt) => {
                  const active = shadow === opt.id
                  const previewShadow = opt.id === 'soft' ? '0 2px 8px rgba(0,0,0,0.10)' : opt.id === 'deep' ? '0 4px 16px rgba(0,0,0,0.28)' : 'none'
                  return (
                    <button key={opt.id} type="button" onClick={() => setShadow(opt.id)} aria-pressed={active} aria-label={`${opt.label} shadow`}
                      style={{ background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', color: active ? 'var(--ps-bg-page)' : 'var(--ps-text-secondary)', border: 'none', cursor: 'pointer', padding: '6px 4px', fontSize: '11px', fontWeight: 500, fontFamily: 'inherit', borderRadius: 'var(--ps-radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', transition: 'all 150ms ease-out' }}>
                      <div style={{ width: '20px', height: '14px', borderRadius: '3px', background: active ? 'rgba(255,255,255,0.9)' : 'var(--ps-bg-surface)', boxShadow: previewShadow }} />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Frame */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Frame</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {FRAME_OPTIONS.map((f) => {
                  const active = frame === f.id
                  const locked = f.pro && !proUnlocked
                  return (
                    <button key={f.id} type="button" onClick={() => { if (locked) { openUpgradeModal(); return }; setFrame(f.id) }} aria-pressed={active} aria-label={`${f.label} frame`}
                      style={{ border: active ? `2px solid var(--ps-border-selected)` : `1px solid var(--ps-border-strong)`, borderRadius: 'var(--ps-radius-sm)', background: 'var(--ps-bg-surface)', padding: '6px 2px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', outline: 'none', fontFamily: 'inherit', opacity: locked ? 0.45 : 1, transition: 'border-color 150ms ease-out' }}>
                      <FrameThumb type={f.id} />
                      <span style={{ fontSize: '11px', fontWeight: active ? 600 : 500, color: locked ? 'var(--ps-text-tertiary)' : 'var(--ps-text-primary)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {f.label}
                        {locked && <Lock size={7} strokeWidth={2.5} aria-hidden="true" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* Watermark */}
        <Section label="Watermark" locked={!proUnlocked} defaultOpen={false}>
          {!proUnlocked ? (
            <button type="button" onClick={openUpgradeModal}
              style={{ border: '1.5px dashed var(--ps-border)', borderRadius: 'var(--ps-radius-md)', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.45, cursor: 'pointer', fontSize: '12px', color: 'var(--ps-text-tertiary)', background: 'transparent', fontFamily: 'inherit', width: '100%' }}>
              <Upload size={14} aria-hidden="true" /> Add logo
            </button>
          ) : watermarkUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: 'var(--ps-radius-sm)', border: `1px solid var(--ps-border-strong)`, overflow: 'hidden', flexShrink: 0, background: 'var(--ps-bg-hover)' }}>
                  <img src={watermarkUrl} alt="Watermark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button type="button" onClick={() => { setWatermarkUrl(null); showToast('Watermark removed') }} aria-label="Remove watermark"
                    style={{ position: 'absolute', top: '-1px', right: '-1px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--ps-text-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <X size={7} color="var(--ps-bg-page)" aria-hidden="true" />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', width: '48px' }}>
                  {WM_POSITIONS.map((pos) => (
                    <button key={pos} type="button" onClick={() => setWatermarkPosition(pos)} aria-label={`Watermark ${pos}`}
                      style={{ width: '14px', height: '14px', borderRadius: '50%', border: 'none', background: watermarkPosition === pos ? 'var(--ps-text-primary)' : 'var(--ps-border-strong)', cursor: 'pointer', padding: 0 }} />
                  ))}
                </div>
              </div>
              <div style={sliderRow}>
                <div style={sliderLabelRow}>
                  <span style={{ fontSize: '12px', color: 'var(--ps-text-secondary)' }}>Opacity</span>
                  <span style={{ fontSize: '12px', color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{watermarkOpacity}%</span>
                </div>
                <Slider value={[watermarkOpacity]} onValueChange={(v) => setWatermarkOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} aria-label="Watermark opacity" />
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {([{ l: 'S', v: 0.08 }, { l: 'M', v: 0.12 }, { l: 'L', v: 0.18 }] as const).map((o) => (
                  <button key={o.l} type="button" onClick={() => setWatermarkScale(o.v)} aria-pressed={Math.abs(watermarkScale - o.v) < 0.01}
                    style={{ flex: 1, background: Math.abs(watermarkScale - o.v) < 0.01 ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', color: Math.abs(watermarkScale - o.v) < 0.01 ? 'var(--ps-bg-page)' : 'var(--ps-text-secondary)', border: 'none', cursor: 'pointer', padding: '5px 0', fontSize: '11px', fontWeight: 500, fontFamily: 'inherit', borderRadius: 'var(--ps-radius-sm)' }}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => wmInputRef.current?.click()}
              style={{ border: '1.5px dashed var(--ps-border-strong)', borderRadius: 'var(--ps-radius-md)', padding: '14px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', width: '100%' }}>
              <Upload size={14} aria-hidden="true" /> Add logo
            </button>
          )}
          <input ref={wmInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setWatermarkUrl(r.result as string); r.readAsDataURL(f); e.target.value = '' }} style={{ display: 'none' }} aria-hidden="true" />
        </Section>

        {/* Reset */}
        <button type="button" onClick={() => { if (imageUrl) { const s = useEditorStore.getState(); s.setBackground({ type: 'gradient', value: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }); s.setPadding(48); s.setCornerRadius(12); s.setShadow('soft'); s.setFrame('none'); s.setWatermarkUrl(null) } else { reset() } }}
          aria-label="Reset styles"
          style={{ width: '100%', background: 'var(--ps-bg-hover)', border: 'none', cursor: 'pointer', padding: '7px 0', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', borderRadius: 'var(--ps-radius-sm)', color: 'var(--ps-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexShrink: 0 }}>
          <RotateCcw size={12} aria-hidden="true" /> Reset
        </button>
      </div>
    </div>
  )
}
