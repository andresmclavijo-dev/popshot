import { useState, useCallback } from 'react'
import { Check, Lock } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import { openExportModal } from '@/components/shared/ExportModal'
import { TEMPLATES } from '@/data/templates'
import type { ImagePosition } from '@/types'
import type { MobileTab } from './MobileBottomBar'

// ── Mobile color picker — swatch + hex input + inline picker ──
function MobileColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hexDraft, setHexDraft] = useState(value.replace('#', '').toUpperCase())

  const handlePickerChange = useCallback((hex: string) => {
    onChange(hex)
    setHexDraft(hex.replace('#', '').toUpperCase())
  }, [onChange])

  return (
    <div style={{ marginBottom: '4px' }}>
      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Custom color</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Open color picker"
          style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: value, border: '1px solid var(--ps-border)', cursor: 'pointer' }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', height: '36px', padding: '0 10px', borderRadius: '10px', background: 'var(--ps-bg-surface)', border: '1px solid var(--ps-border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>#</span>
          <input value={hexDraft}
            onChange={(e) => { const c = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6); setHexDraft(c.toUpperCase()); if (c.length === 6) onChange('#' + c) }}
            onBlur={() => { if (hexDraft.length === 6) onChange('#' + hexDraft); else setHexDraft(value.replace('#', '').toUpperCase()) }}
            onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') { if (hexDraft.length === 6) onChange('#' + hexDraft); (e.target as HTMLInputElement).blur() } }}
            maxLength={6} aria-label="Hex color value"
            style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', fontWeight: 500, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: 'var(--ps-text-primary)', textTransform: 'uppercase' }} />
        </div>
      </div>
      {open && (
        <div style={{ marginTop: '8px', borderRadius: '12px', overflow: 'hidden' }} className="custom-color-picker">
          <HexColorPicker color={value} onChange={handlePickerChange} />
        </div>
      )}
    </div>
  )
}

const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach', 'transparent'])
const CHECKERBOARD = 'repeating-conic-gradient(#D0D0CE 0% 25%, #F0F0EE 0% 50%) 0 0 / 8px 8px'
const FREE_SWATCH_COUNT = 6
const IMAGE_POSITIONS: ImagePosition[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']

export function MobileControlsSheet({ activeTab, onClose }: { activeTab: MobileTab | null; onClose: () => void }) {
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
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)
  const imagePosition = useEditorStore((s) => s.imagePosition)
  const setImagePosition = useEditorStore((s) => s.setImagePosition)
  const setImageOffsetX = useEditorStore((s) => s.setImageOffsetX)
  const setImageOffsetY = useEditorStore((s) => s.setImageOffsetY)
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl)
  const setBackgroundImageUrl = useEditorStore((s) => s.setBackgroundImageUrl)
  const activeTemplate = useEditorStore((s) => s.activeTemplate)
  const setActiveTemplate = useEditorStore((s) => s.setActiveTemplate)

  // Export tab triggers modal directly
  if (activeTab === 'export') {
    if (imageUrl) openExportModal()
    // Close sheet after triggering
    setTimeout(() => onClose(), 50)
    return null
  }

  if (!activeTab) return null

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
      background: 'var(--ps-bg-surface)',
      borderTop: '0.5px solid var(--ps-border)',
      borderRadius: '16px 16px 0 0',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
      maxHeight: '55dvh',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Drag handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px', flexShrink: 0 }}>
        <div style={{ width: '36px', height: '4px', borderRadius: '100px', background: 'var(--ps-border-strong)' }} />
      </div>

      {/* Content — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 16px', WebkitOverflowScrolling: 'touch' as never }}>

        {/* Templates */}
        {activeTab === 'templates' && (
          <div>
            {Array.from(new Set(TEMPLATES.map(t => t.platform))).map((platform) => {
              const templates = TEMPLATES.filter(t => t.platform === platform)
              return (
                <div key={platform} style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ps-text-primary)', display: 'block', marginBottom: '6px' }}>{platform}</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {templates.map((t) => {
                      const active = activeTemplate === t.id
                      return (
                        <button key={t.id} type="button"
                          onClick={() => { setActiveTemplate(active ? null : t.id); onClose() }}
                          aria-pressed={active}
                          style={{
                            padding: '10px', borderRadius: '10px',
                            background: active ? 'var(--ps-bg-hover)' : 'transparent',
                            border: active ? '1.5px solid var(--ps-text-secondary)' : '1px solid var(--ps-border)',
                            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
                          }}>
                          <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: 'var(--ps-text-primary)', display: 'block' }}>{t.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--ps-text-tertiary)' }}>{t.width}×{t.height}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Background */}
        {activeTab === 'background' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
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
                    aria-label={`${preset.label} background`} aria-pressed={active}
                    style={{
                      height: '48px', borderRadius: '10px',
                      border: active ? '2px solid var(--ps-text-primary)' : '1px solid var(--ps-border)',
                      background: isTransparent ? CHECKERBOARD : preset.background.value,
                      cursor: 'pointer', opacity: locked ? 0.4 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    {locked && <Lock size={10} strokeWidth={2.5} style={{ color: LIGHT_SWATCHES.has(preset.id) ? '#666' : '#FFF' }} />}
                    {active && !locked && <Check size={12} strokeWidth={3} style={{ color: LIGHT_SWATCHES.has(preset.id) ? 'var(--ps-text-primary)' : '#FFF' }} />}
                  </button>
                )
              })}
            </div>
            {/* Custom color */}
            <MobileColorPicker
              value={background.type === 'solid' ? background.value : '#ffffff'}
              onChange={(hex) => {
                setBackground({ type: 'solid', value: hex })
                if (backgroundImageUrl) setBackgroundImageUrl(null)
                if (autoColor) setAutoColor(false)
              }}
            />
            {/* Match to image */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
              <label htmlFor="m-match" style={{ fontSize: '13px', color: 'var(--ps-text-secondary)' }}>Match to image</label>
              <Switch id="m-match" checked={autoColor} onCheckedChange={async (checked) => { setAutoColor(checked); if (checked && imageUrl) { try { const bg = await extractColorsFromImage(imageUrl); setBackground(bg) } catch {} } }} size="sm" />
            </div>
          </div>
        )}

        {/* Layout */}
        {activeTab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Padding</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{padding}px</span>
              </div>
              <Slider value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v)} min={0} max={240} step={4} aria-label="Padding" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Corners</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{cornerRadius}px</span>
              </div>
              <Slider value={[cornerRadius]} onValueChange={(v) => setCornerRadius(Array.isArray(v) ? v[0] : v)} min={0} max={48} step={2} aria-label="Corner radius" />
            </div>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '8px' }}>Position</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 28px)', gap: '6px', justifyContent: 'center' }}>
                {IMAGE_POSITIONS.map((pos) => {
                  const active = imagePosition === pos
                  return (
                    <button key={pos} type="button" onClick={() => {
                      setImagePosition(pos)
                      const xMap: Record<string, number> = { 'top-left': -120, 'left': -120, 'bottom-left': -120, 'top': 0, 'center': 0, 'bottom': 0, 'top-right': 120, 'right': 120, 'bottom-right': 120 }
                      const yMap: Record<string, number> = { 'top-left': -80, 'top': -80, 'top-right': -80, 'left': 0, 'center': 0, 'right': 0, 'bottom-left': 80, 'bottom': 80, 'bottom-right': 80 }
                      setImageOffsetX(xMap[pos] ?? 0)
                      setImageOffsetY(yMap[pos] ?? 0)
                    }} aria-label={`Position ${pos}`} aria-pressed={active}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', border: active ? 'none' : '1px solid var(--ps-border)', background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', cursor: 'pointer' }} />
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Effects */}
        {activeTab === 'effects' && (
          <div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '8px' }}>Shadow</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {SHADOW_PRESETS.map((opt) => {
                const active = shadow === opt.id
                const previewShadow = opt.id === 'soft' ? '0 2px 8px rgba(0,0,0,0.12)' : opt.id === 'deep' ? '0 3px 12px rgba(0,0,0,0.3)' : 'none'
                return (
                  <button key={opt.id} type="button" onClick={() => setShadow(opt.id)} aria-pressed={active}
                    style={{
                      height: '56px', borderRadius: '12px',
                      border: active ? '2px solid var(--ps-text-primary)' : '1px solid var(--ps-border)',
                      background: 'var(--ps-bg-surface)', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}>
                    <div style={{ width: '24px', height: '16px', borderRadius: '3px', background: 'var(--ps-bg-page)', boxShadow: previewShadow }} />
                    <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400, color: 'var(--ps-text-primary)' }}>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
