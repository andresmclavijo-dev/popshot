import { useState } from 'react'
import { ChevronUp, ChevronDown, Check, Lock } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import type { Background, ImagePosition } from '@/types'

const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach', 'transparent'])
const CHECKERBOARD = 'repeating-conic-gradient(#D0D0CE 0% 25%, #F0F0EE 0% 50%) 0 0 / 8px 8px'
const FREE_SWATCH_COUNT = 6
const IMAGE_POSITIONS: ImagePosition[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']
const SHADOW_OPTIONS = SHADOW_PRESETS

type Tab = 'background' | 'layout' | 'effects'

export function MobileControlsSheet(_props: { onHoverBackground: (bg: Background | null) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [tab, setTab] = useState<Tab>('background')

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

  if (!imageUrl) return null

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
      background: 'var(--ps-bg-panel)',
      borderTop: '0.5px solid var(--ps-border)',
      borderRadius: '20px 20px 0 0',
      boxShadow: '0 -4px 30px rgba(0,0,0,0.08)',
      transition: 'max-height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      maxHeight: expanded ? '65dvh' : '140px',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
    }}>
      {/* Drag handle + toggle */}
      <button type="button" onClick={() => setExpanded((e) => !e)}
        aria-label={expanded ? 'Collapse controls' : 'Expand controls'}
        style={{
          width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '10px 0 6px', background: 'transparent', border: 'none', cursor: 'pointer',
        }}>
        <div style={{ width: '40px', height: '5px', borderRadius: '100px', background: 'var(--ps-border-strong)' }} />
        <div style={{ marginTop: '4px', color: 'var(--ps-text-tertiary)' }}>
          {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </button>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '2px', padding: '0 16px 10px',
        flexShrink: 0,
      }}>
        {(['background', 'layout', 'effects'] as Tab[]).map((t) => (
          <button key={t} type="button" onClick={() => { setTab(t); if (!expanded) setExpanded(true) }}
            style={{
              flex: 1, height: '32px', fontSize: '12px', fontWeight: tab === t ? 600 : 400,
              fontFamily: 'inherit',
              background: tab === t ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)',
              color: tab === t ? 'var(--ps-bg-page)' : 'var(--ps-text-secondary)',
              border: 'none', borderRadius: '100px', cursor: 'pointer',
              textTransform: 'capitalize',
            }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', WebkitOverflowScrolling: 'touch' as never }}>
        {tab === 'background' && (
          <div>
            {/* Swatches */}
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
            {/* Match to image */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label htmlFor="m-match" style={{ fontSize: '13px', color: 'var(--ps-text-secondary)' }}>Match to image</label>
              <Switch id="m-match" checked={autoColor} onCheckedChange={async (checked) => { setAutoColor(checked); if (checked && imageUrl) { try { const bg = await extractColorsFromImage(imageUrl); setBackground(bg) } catch {} } }} size="sm" />
            </div>
          </div>
        )}

        {tab === 'layout' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Padding */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Padding</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{padding}px</span>
              </div>
              <Slider value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v)} min={0} max={240} step={4} aria-label="Padding" />
            </div>
            {/* Corners */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Corners</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{cornerRadius}px</span>
              </div>
              <Slider value={[cornerRadius]} onValueChange={(v) => setCornerRadius(Array.isArray(v) ? v[0] : v)} min={0} max={48} step={2} aria-label="Corner radius" />
            </div>
            {/* Position */}
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
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        border: active ? 'none' : '1px solid var(--ps-border)',
                        background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)',
                        cursor: 'pointer',
                      }} />
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {tab === 'effects' && (
          <div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '8px' }}>Shadow</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {SHADOW_OPTIONS.map((opt) => {
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
