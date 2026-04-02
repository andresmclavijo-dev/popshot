import { useState, useRef, useCallback } from 'react'
import { RotateCcw, Lock, Upload, X, Save, ImageIcon, Check } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import { showToast } from '@/components/shared/Toast'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import type { Background, WatermarkPosition, ImagePosition } from '@/types'

const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach', 'transparent'])
const CHECKERBOARD = 'repeating-conic-gradient(#D0D0CE 0% 25%, #F0F0EE 0% 50%) 0 0 / 8px 8px'
const FREE_SWATCH_COUNT = 6

// ── Shared styles using design system tokens ──

const sectionLabel: React.CSSProperties = {
  fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
  letterSpacing: '0.06em', color: 'var(--ps-text-tertiary)',
  display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px',
}

const sliderRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' }

const sliderLabelRow: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}

function SectionLabel({ children, locked }: { children: React.ReactNode; locked?: boolean }) {
  return (
    <span style={sectionLabel}>
      {children}
      {locked && <Lock size={10} strokeWidth={2.5} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />}
    </span>
  )
}

// ── Frame options ──

const FRAME_OPTIONS: { id: import('@/types').FrameType; label: string; pro?: boolean }[] = [
  { id: 'none', label: 'None' },
  { id: 'macos-light', label: 'macOS' },
  { id: 'macos-dark', label: 'Dark' },
  { id: 'safari', label: 'Safari' },
  { id: 'arc', label: 'Arc', pro: true },
  { id: 'card', label: 'Card', pro: true },
  { id: 'stack', label: 'Stack', pro: true },
]

function FramePreviewIcon({ type }: { type: import('@/types').FrameType }) {
  const w = 36, h = 26
  if (type === 'none') return <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true"><rect x="1" y="1" width="34" height="24" rx="3" stroke="var(--ps-text-tertiary)" strokeWidth="1.2" fill="none" /></svg>
  if (type === 'macos-light') return <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="35" height="25" rx="3" fill="#F5F5F5" stroke="#DDD" /><circle cx="5" cy="4.5" r="1.8" fill="#FF5F57" /><circle cx="9.5" cy="4.5" r="1.8" fill="#FFBD2E" /><circle cx="14" cy="4.5" r="1.8" fill="#28C840" /></svg>
  if (type === 'macos-dark') return <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="35" height="25" rx="3" fill="#2D2D2D" stroke="#444" /><circle cx="5" cy="4.5" r="1.8" fill="#FF5F57" /><circle cx="9.5" cy="4.5" r="1.8" fill="#FFBD2E" /><circle cx="14" cy="4.5" r="1.8" fill="#28C840" /></svg>
  if (type === 'safari') return <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="35" height="25" rx="3" fill="#F5F5F5" stroke="#DDD" /><circle cx="5" cy="4" r="1.5" fill="#FF5F57" /><circle cx="9" cy="4" r="1.5" fill="#FFBD2E" /><circle cx="13" cy="4" r="1.5" fill="#28C840" /><rect x="8" y="8" width="20" height="4" rx="2" fill="#E8E8E8" /></svg>
  if (type === 'arc') return <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="35" height="25" rx="3" fill="#1A1A2E" stroke="#333" /><rect x="3" y="4" width="2" height="10" rx="1" fill="url(#ag)" /><rect x="8" y="5" width="12" height="4" rx="2" fill="rgba(255,255,255,.12)" /><defs><linearGradient id="ag" x1="4" y1="4" x2="4" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs></svg>
  if (type === 'card') return <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true"><rect x="1" y="1" width="34" height="24" rx="5" fill="white" stroke="#DDD" /><rect x="4" y="4" width="28" height="18" rx="2" fill="#F0F0F0" /></svg>
  return <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true"><rect x="5" y="5" width="30" height="20" rx="3" fill="#E0E0E0" stroke="#CCC" strokeWidth=".5" /><rect x="3" y="3" width="30" height="20" rx="3" fill="#EEE" stroke="#CCC" strokeWidth=".5" /><rect x="1" y="1" width="30" height="20" rx="3" fill="white" stroke="#DDD" /></svg>
}

// ── Watermark position grid ──
const WM_POSITIONS: WatermarkPosition[] = [
  'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right',
]

const IMAGE_POSITIONS: ImagePosition[] = [
  'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right',
]

// ── Main Panel ──

export function FloatingPanel({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)
  const setAutoColor = useEditorStore((s) => s.setAutoColor)
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const padding = useEditorStore((s) => s.padding)
  const setPadding = useEditorStore((s) => s.setPadding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)
  const imagePosition = useEditorStore((s) => s.imagePosition)
  const setImagePosition = useEditorStore((s) => s.setImagePosition)
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
  const savedPresets = useEditorStore((s) => s.savedPresets)
  const applyPreset = useEditorStore((s) => s.applyPreset)
  const savePreset = useEditorStore((s) => s.savePreset)
  const reset = useEditorStore((s) => s.reset)

  const colorInputRef = useRef<HTMLInputElement>(null)
  const bgImageInputRef = useRef<HTMLInputElement>(null)
  const wmInputRef = useRef<HTMLInputElement>(null)
  const [customHex, setCustomHex] = useState('F4F4F4')
  const [customOpacity, setCustomOpacity] = useState(100)
  const [saveOpen, setSaveOpen] = useState(false)
  const [presetName, setPresetName] = useState('')

  const isSwatchActive = (preset: typeof BACKGROUND_PRESETS[number]) =>
    background.value === preset.background.value && !backgroundImageUrl

  const customActive = background.type === 'solid' && !BACKGROUND_PRESETS.some((p) => p.background.value === background.value) && !backgroundImageUrl

  const applyCustomColor = useCallback((hex: string, opacity: number) => {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return
    if (opacity >= 100) setBackground({ type: 'solid', value: `#${hex}` })
    else setBackground({ type: 'solid', value: `rgba(${r},${g},${b},${Math.round((opacity / 100) * 100) / 100})` })
    if (autoColor) setAutoColor(false)
    if (backgroundImageUrl) setBackgroundImageUrl(null)
  }, [setBackground, autoColor, setAutoColor, backgroundImageUrl, setBackgroundImageUrl])

  const handleSave = () => {
    const name = presetName.trim() || `Style ${Date.now() % 1000}`
    savePreset(name)
    showToast(`Style saved as "${name}"`)
    setPresetName('')
    setSaveOpen(false)
  }

  return (
    <div className="frosted-pill" style={{
      position: 'absolute', top: '50%', right: '18px', transform: 'translateY(-50%)',
      zIndex: 10, width: '220px', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', maxHeight: 'calc(100vh - 120px)',
    }}>
      {/* Header: Save icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '8px 10px 4px', flexShrink: 0 }}>
        {proUnlocked ? (
          <Tooltip>
            <TooltipTrigger render={
              <button type="button" onClick={() => setSaveOpen(!saveOpen)} aria-label="Save style"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: 'var(--ps-radius-sm)', color: 'var(--ps-text-secondary)', display: 'flex', transition: 'all 150ms ease-out' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }} />
            }>
              <Save size={14} aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent side="bottom">Save style</TooltipContent>
          </Tooltip>
        ) : (
          <button type="button" onClick={openUpgradeModal} aria-label="Save style — Pro"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: 'var(--ps-radius-sm)', color: 'var(--ps-text-tertiary)', display: 'flex', position: 'relative' }}>
            <Save size={14} aria-hidden="true" />
            <Lock size={7} strokeWidth={3} style={{ position: 'absolute', bottom: '1px', right: '1px', color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Save popover */}
      {saveOpen && (
        <div style={{ padding: '6px 14px 10px', display: 'flex', gap: '4px', flexShrink: 0, borderBottom: '0.5px solid var(--ps-border)' }}>
          <input type="text" value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="Name this style..."
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setSaveOpen(false) }} autoFocus
            style={{ flex: 1, height: '28px', border: '1px solid var(--ps-border-strong)', borderRadius: 'var(--ps-radius-sm)', padding: '0 8px', fontSize: '12px', fontFamily: 'inherit', color: 'var(--ps-text-primary)', background: 'var(--ps-bg-surface)', outline: 'none', minWidth: 0 }} />
          <button type="button" onClick={handleSave}
            style={{ height: '28px', padding: '0 10px', background: 'var(--ps-text-primary)', color: 'var(--ps-text-on-dark)', border: 'none', borderRadius: 'var(--ps-radius-sm)', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' }}>
            Save
          </button>
        </div>
      )}

      {/* Scrollable content — single column, all sections */}
      <div className="canvas-workspace" style={{ padding: '14px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Saved presets pills */}
        {savedPresets.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {savedPresets.map((p) => (
              <button key={p.id} type="button" onClick={() => { applyPreset(p); showToast(`${p.name} applied`) }}
                style={{ background: 'var(--ps-bg-hover)', border: 'none', borderRadius: '10px', padding: '4px 10px', fontSize: '11px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', cursor: 'pointer', transition: 'background 150ms ease-out' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-active)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* ── BACKGROUND ── */}
        <div>
          <SectionLabel>Background</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '10px' }}>
            {BACKGROUND_PRESETS.map((preset, i) => {
              const active = isSwatchActive(preset)
              const isTransparent = preset.id === 'transparent'
              const locked = i >= FREE_SWATCH_COUNT && !proUnlocked
              return (
                <Tooltip key={preset.id}>
                  <TooltipTrigger render={
                    <button type="button"
                      onClick={() => {
                        if (locked) { openUpgradeModal(); return }
                        setBackground(preset.background)
                        if (backgroundImageUrl) setBackgroundImageUrl(null)
                        if (preset.background.type === 'solid') { setCustomHex(preset.background.value.replace('#', '').toUpperCase()); setCustomOpacity(100) }
                        if (autoColor) setAutoColor(false)
                      }}
                      onMouseEnter={() => !locked && onHoverBackground(preset.background)}
                      onMouseLeave={() => onHoverBackground(null)}
                      aria-label={`${preset.label} background`} aria-pressed={active}
                      style={{
                        width: '100%', aspectRatio: '1', borderRadius: 'var(--ps-radius-sm)', border: 'none',
                        background: isTransparent ? CHECKERBOARD : preset.background.value,
                        cursor: 'pointer', outline: active ? `2px solid var(--ps-border-selected)` : 'none',
                        outlineOffset: active ? '2px' : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 0, transition: 'transform 150ms ease-out', position: 'relative', opacity: locked ? 0.45 : 1,
                      }} />
                  }>
                    {locked && <Lock size={10} strokeWidth={2.5} style={{ color: LIGHT_SWATCHES.has(preset.id) ? '#666' : '#FFF' }} aria-hidden="true" />}
                    {active && !locked && <Check size={12} strokeWidth={3} style={{ color: LIGHT_SWATCHES.has(preset.id) ? 'var(--ps-text-primary)' : '#FFF' }} aria-hidden="true" />}
                  </TooltipTrigger>
                  <TooltipContent>{preset.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
          {/* Hex + opacity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <button type="button" onClick={() => colorInputRef.current?.click()} aria-label="Pick custom color"
              style={{ width: '32px', height: '32px', borderRadius: 'var(--ps-radius-sm)', border: '0.5px solid var(--ps-border)', background: customActive ? background.value : `#${customHex}`, cursor: 'pointer', flexShrink: 0, padding: 0, outline: customActive ? `2px solid var(--ps-border-selected)` : 'none', outlineOffset: customActive ? '2px' : undefined, position: 'relative' }}>
              <input ref={colorInputRef} type="color" value={`#${customHex}`} onChange={(e) => { const hex = e.target.value.replace('#', '').toUpperCase(); setCustomHex(hex); applyCustomColor(hex, customOpacity) }} aria-label="Color picker"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', border: 'none', padding: 0 }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, height: '32px', border: '1px solid var(--ps-border-strong)', borderRadius: 'var(--ps-radius-sm)', padding: '0 8px', background: 'var(--ps-bg-surface)', gap: '2px' }}>
              <span style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)', userSelect: 'none' }}>#</span>
              <input type="text" value={customActive ? (background.type === 'solid' ? background.value.replace('#', '').toUpperCase() : customHex) : customHex}
                onChange={(e) => { let v = e.target.value.replace('#', '').toUpperCase(); if (v.length > 6) v = v.slice(0, 6); setCustomHex(v); if (/^[0-9A-F]{6}$/.test(v)) applyCustomColor(v, customOpacity) }}
                placeholder="F4F4F4" maxLength={6} aria-label="Hex color value"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px', fontFamily: 'monospace', color: 'var(--ps-text-primary)', background: 'transparent', minWidth: 0, textTransform: 'uppercase' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', height: '32px', width: '52px', border: '1px solid var(--ps-border-strong)', borderRadius: 'var(--ps-radius-sm)', padding: '0 6px', background: 'var(--ps-bg-surface)', gap: '1px' }}>
              <input type="text" value={customOpacity} onChange={(e) => { let v = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10); if (isNaN(v)) v = 100; v = Math.max(0, Math.min(100, v)); setCustomOpacity(v); if (/^[0-9A-F]{6}$/.test(customHex)) applyCustomColor(customHex, v) }}
                maxLength={3} aria-label="Background opacity" style={{ width: '100%', border: 'none', outline: 'none', fontSize: '12px', fontFamily: 'monospace', color: 'var(--ps-text-primary)', background: 'transparent', textAlign: 'right', minWidth: 0 }} />
              <span style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)', userSelect: 'none' }}>%</span>
            </div>
          </div>
          {/* Background image — Pro */}
          <div>
            <SectionLabel locked={!proUnlocked}>Background image</SectionLabel>
            {!proUnlocked ? (
              <button type="button" onClick={openUpgradeModal}
                style={{ border: '1.5px dashed var(--ps-border)', borderRadius: 'var(--ps-radius-md)', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.45, cursor: 'pointer', fontSize: '12px', color: 'var(--ps-text-tertiary)', background: 'transparent', fontFamily: 'inherit', width: '100%' }}>
                <ImageIcon size={14} aria-hidden="true" /> Upload image
              </button>
            ) : backgroundImageUrl ? (
              <div style={{ position: 'relative', height: '48px', borderRadius: 'var(--ps-radius-md)', overflow: 'hidden', border: '1px solid var(--ps-border)' }}>
                <div style={{ width: '100%', height: '100%', backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <button type="button" onClick={() => setBackgroundImageUrl(null)} aria-label="Remove background image"
                  style={{ position: 'absolute', top: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--ps-bg-dark)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <X size={10} color="var(--ps-text-on-dark)" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => bgImageInputRef.current?.click()}
                style={{ border: '1.5px dashed var(--ps-border-strong)', borderRadius: 'var(--ps-radius-md)', padding: '12px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', width: '100%', transition: 'border-color 150ms ease-out' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ps-border-selected)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}>
                <ImageIcon size={14} aria-hidden="true" /> Upload image
              </button>
            )}
            <input ref={bgImageInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { setBackgroundImageUrl(r.result as string); setBackground({ type: 'image', value: 'image' }) }; r.readAsDataURL(f); e.target.value = '' }} style={{ display: 'none' }} aria-hidden="true" />
          </div>
          {/* Match to image */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <label htmlFor="auto-color-fp" style={{ fontSize: '12px', color: 'var(--ps-text-secondary)', cursor: 'pointer' }}>Match to image</label>
            <Switch id="auto-color-fp" checked={autoColor} onCheckedChange={async (checked) => { setAutoColor(checked); if (checked && imageUrl) { try { const bg = await extractColorsFromImage(imageUrl); setBackground(bg) } catch {} } }} size="sm" />
          </div>
        </div>

        {/* ── PADDING ── */}
        <div style={sliderRow}>
          <div style={sliderLabelRow}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Padding</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{padding}px</span>
          </div>
          <Slider value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v)} min={0} max={240} step={4} aria-label="Padding" />
        </div>

        {/* ── CORNERS ── */}
        <div style={sliderRow}>
          <div style={sliderLabelRow}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Corners</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{cornerRadius}px</span>
          </div>
          <Slider value={[cornerRadius]} onValueChange={(v) => setCornerRadius(Array.isArray(v) ? v[0] : v)} min={0} max={48} step={2} aria-label="Corner radius" />
        </div>

        {/* ── POSITION ── */}
        <div>
          <SectionLabel>Position</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 28px)', gap: '6px', justifyContent: 'center' }}>
            {IMAGE_POSITIONS.map((pos) => {
              const active = imagePosition === pos
              return (
                <button key={pos} type="button" onClick={() => setImagePosition(pos)} aria-label={`Position ${pos}`} aria-pressed={active}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', border: active ? 'none' : `0.5px solid var(--ps-border)`,
                    background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', cursor: 'pointer', padding: 0, transition: 'background 150ms ease-out' }} />
              )
            })}
          </div>
        </div>

        {/* ── SHADOW ── */}
        <div>
          <SectionLabel>Shadow</SectionLabel>
          <div style={{ display: 'flex', gap: '6px' }}>
            {SHADOW_PRESETS.map((opt) => {
              const active = shadow === opt.id
              const previewShadow = opt.id === 'soft' ? '0 2px 8px rgba(0,0,0,0.10)' : opt.id === 'deep' ? '0 4px 16px rgba(0,0,0,0.28)' : 'none'
              return (
                <button key={opt.id} type="button" onClick={() => setShadow(opt.id)} aria-pressed={active} aria-label={`${opt.label} shadow`}
                  style={{ flex: 1, background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', color: active ? 'var(--ps-text-on-dark)' : 'var(--ps-text-secondary)',
                    border: 'none', cursor: 'pointer', padding: '6px 4px', fontSize: '11px', fontWeight: 500, fontFamily: 'inherit',
                    borderRadius: 'var(--ps-radius-sm)', transition: 'all 150ms ease-out', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--ps-bg-active)' }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'var(--ps-bg-hover)' }}>
                  <div style={{ width: '24px', height: '16px', borderRadius: '4px', background: active ? 'rgba(255,255,255,0.9)' : 'var(--ps-bg-surface)', boxShadow: previewShadow }} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── FRAME ── */}
        <div>
          <SectionLabel>Frame</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {FRAME_OPTIONS.map((f) => {
              const active = frame === f.id
              const locked = f.pro && !proUnlocked
              return (
                <button key={f.id} type="button"
                  onClick={() => { if (locked) { openUpgradeModal(); return }; setFrame(f.id) }}
                  aria-pressed={active} aria-label={`${f.label} frame`}
                  style={{
                    border: active ? `2px solid var(--ps-border-selected)` : `1px solid var(--ps-border-strong)`,
                    borderRadius: 'var(--ps-radius-sm)', background: 'var(--ps-bg-surface)',
                    padding: '8px 4px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '4px',
                    transition: 'border-color 150ms ease-out', outline: 'none', fontFamily: 'inherit',
                    opacity: locked ? 0.45 : 1,
                  }}
                  onMouseEnter={(e) => { if (!active && !locked) e.currentTarget.style.borderColor = 'var(--ps-text-tertiary)' }}
                  onMouseLeave={(e) => { if (!active && !locked) e.currentTarget.style.borderColor = '' }}>
                  <FramePreviewIcon type={f.id} />
                  <span style={{ fontSize: '11px', fontWeight: active ? 600 : 500, color: locked ? 'var(--ps-text-tertiary)' : 'var(--ps-text-primary)', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {f.label}
                    {locked && <Lock size={8} strokeWidth={2.5} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── WATERMARK ── */}
        <div>
          <SectionLabel locked={!proUnlocked}>Watermark</SectionLabel>
          {!proUnlocked ? (
            <button type="button" onClick={openUpgradeModal}
              style={{ border: '1.5px dashed var(--ps-border)', borderRadius: 'var(--ps-radius-md)', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.45, cursor: 'pointer', fontSize: '12px', color: 'var(--ps-text-tertiary)', background: 'transparent', fontFamily: 'inherit', width: '100%' }}>
              <Upload size={14} aria-hidden="true" /> Add logo
            </button>
          ) : watermarkUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: 'var(--ps-radius-sm)', border: `1px solid var(--ps-border-strong)`, overflow: 'hidden', flexShrink: 0, background: '#F8F8F8' }}>
                  <img src={watermarkUrl} alt="Watermark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button type="button" onClick={() => { setWatermarkUrl(null); showToast('Watermark removed') }} aria-label="Remove watermark"
                    style={{ position: 'absolute', top: '-1px', right: '-1px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--ps-text-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <X size={8} color="var(--ps-text-on-dark)" aria-hidden="true" />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', width: '54px' }}>
                  {WM_POSITIONS.map((pos) => (
                    <button key={pos} type="button" onClick={() => setWatermarkPosition(pos)} aria-label={`Watermark ${pos}`} aria-pressed={watermarkPosition === pos}
                      style={{ width: '16px', height: '16px', borderRadius: '50%', border: 'none', background: watermarkPosition === pos ? 'var(--ps-text-primary)' : 'var(--ps-border-strong)', cursor: 'pointer', padding: 0, transition: 'background 150ms ease-out' }} />
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
              <div>
                <span style={{ fontSize: '12px', color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Size</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {([{ label: 'S', value: 0.08 }, { label: 'M', value: 0.12 }, { label: 'L', value: 0.18 }] as const).map((opt) => {
                    const active = Math.abs(watermarkScale - opt.value) < 0.01
                    return (
                      <button key={opt.label} type="button" onClick={() => setWatermarkScale(opt.value)} aria-pressed={active}
                        style={{ flex: 1, background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', color: active ? 'var(--ps-text-on-dark)' : 'var(--ps-text-secondary)',
                          border: 'none', cursor: 'pointer', padding: '6px 0', fontSize: '11px', fontWeight: 500, fontFamily: 'inherit', borderRadius: 'var(--ps-radius-sm)', transition: 'all 150ms ease-out', textAlign: 'center' }}>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => wmInputRef.current?.click()}
              style={{ border: '1.5px dashed var(--ps-border-strong)', borderRadius: 'var(--ps-radius-md)', padding: '14px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', width: '100%', transition: 'border-color 150ms ease-out' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ps-border-selected)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}>
              <Upload size={14} aria-hidden="true" /> Add logo
            </button>
          )}
          <input ref={wmInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setWatermarkUrl(r.result as string); r.readAsDataURL(f); e.target.value = '' }} style={{ display: 'none' }} aria-hidden="true" />
        </div>

        {/* Reset */}
        <button type="button" onClick={() => { if (imageUrl) { const s = useEditorStore.getState(); s.setBackground({ type: 'gradient', value: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }); s.setPadding(48); s.setCornerRadius(12); s.setShadow('soft'); s.setFrame('none'); s.setWatermarkUrl(null) } else { reset() } }}
          aria-label="Reset styles"
          style={{ width: '100%', background: 'var(--ps-bg-hover)', border: 'none', cursor: 'pointer', padding: '7px 0', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', borderRadius: 'var(--ps-radius-sm)', color: 'var(--ps-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'background 150ms ease-out', flexShrink: 0 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-active)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}>
          <RotateCcw size={12} aria-hidden="true" /> Reset
        </button>
      </div>
    </div>
  )
}
