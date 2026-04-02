import { useState, useRef, useCallback } from 'react'
import { RotateCcw, Lock } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import { Check } from 'lucide-react'
import type { Background } from '@/types'

type Tab = 'style' | 'layout' | 'polish'

const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach', 'transparent'])
const CHECKERBOARD = 'repeating-conic-gradient(#D0D0CE 0% 25%, #F0F0EE 0% 50%) 0 0 / 8px 8px'

const tabStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#222222' : 'transparent',
  color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
  border: 'none',
  cursor: 'pointer',
  padding: '5px 14px',
  fontSize: '12px',
  fontWeight: active ? 600 : 500,
  fontFamily: 'inherit',
  borderRadius: '12px',
  transition: 'all 100ms var(--ease-out)',
  flex: 1,
  textAlign: 'center' as const,
})

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '8px',
  display: 'block',
}

const sliderRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const sliderLabelRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

function hexFromBg(bg: Background): string {
  if (bg.type === 'solid') return bg.value.replace('#', '').toUpperCase()
  return ''
}

function isCustomColor(bg: Background): boolean {
  if (bg.type !== 'solid') return false
  return !BACKGROUND_PRESETS.some((p) => p.background.value === bg.value)
}

function StyleTab({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)
  const setAutoColor = useEditorStore((s) => s.setAutoColor)
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)

  const colorInputRef = useRef<HTMLInputElement>(null)
  const [customHex, setCustomHex] = useState('F4F4F4')
  const [customOpacity, setCustomOpacity] = useState(100)

  const isActive = (preset: typeof BACKGROUND_PRESETS[number]) =>
    background.value === preset.background.value

  const customActive = isCustomColor(background)

  const applyCustomColor = useCallback((hex: string, opacity: number) => {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    if (isNaN(r) || isNaN(g) || isNaN(b)) return
    if (opacity >= 100) {
      setBackground({ type: 'solid', value: `#${hex}` })
    } else {
      const a = Math.round((opacity / 100) * 100) / 100
      setBackground({ type: 'solid', value: `rgba(${r},${g},${b},${a})` })
    }
  }, [setBackground])

  const handleColorPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.replace('#', '').toUpperCase()
    setCustomHex(hex)
    applyCustomColor(hex, customOpacity)
  }, [customOpacity, applyCustomColor])

  const handleHexInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace('#', '').toUpperCase()
    if (val.length > 6) val = val.slice(0, 6)
    setCustomHex(val)
    if (/^[0-9A-F]{6}$/.test(val)) {
      applyCustomColor(val, customOpacity)
    }
  }, [customOpacity, applyCustomColor])

  const handleOpacityInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    let val = parseInt(raw, 10)
    if (isNaN(val)) val = 100
    if (val > 100) val = 100
    if (val < 0) val = 0
    setCustomOpacity(val)
    if (/^[0-9A-F]{6}$/.test(customHex)) {
      applyCustomColor(customHex, val)
    }
  }, [customHex, applyCustomColor])

  const handleAutoColorToggle = async (checked: boolean) => {
    setAutoColor(checked)
    if (checked && imageUrl) {
      try {
        const bg = await extractColorsFromImage(imageUrl)
        setBackground(bg)
      } catch { /* keep current */ }
    }
  }

  // Premium swatches
  const premiumIds = new Set(['forest', 'rose'])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Background swatches — 2x5 grid */}
      <div>
        <span style={labelStyle}>Background</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {BACKGROUND_PRESETS.map((preset) => {
            const active = isActive(preset)
            const isTransparent = preset.id === 'transparent'
            const locked = premiumIds.has(preset.id) && !proUnlocked
            return (
              <Tooltip key={preset.id}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => !locked && setBackground(preset.background)}
                      onMouseEnter={() => !locked && onHoverBackground(preset.background)}
                      onMouseLeave={() => onHoverBackground(null)}
                      aria-label={`${preset.label} background${locked ? ' — Pro only' : ''}`}
                      aria-pressed={active}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '8px',
                        border: 'none',
                        background: isTransparent ? CHECKERBOARD : preset.background.value,
                        cursor: locked ? 'default' : 'pointer',
                        outline: active ? '2px solid #222222' : 'none',
                        outlineOffset: active ? '2px' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        transition: 'transform 100ms var(--ease-out)',
                        position: 'relative',
                        opacity: locked ? 0.5 : 1,
                      }}
                    />
                  }
                >
                  {locked && (
                    <Lock size={10} strokeWidth={2.5} style={{
                      color: LIGHT_SWATCHES.has(preset.id) ? '#666' : '#FFF',
                      filter: LIGHT_SWATCHES.has(preset.id) ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    }} aria-hidden="true" />
                  )}
                  {active && !locked && (
                    <Check size={12} strokeWidth={3} style={{
                      color: LIGHT_SWATCHES.has(preset.id) ? '#222' : '#FFF',
                      filter: LIGHT_SWATCHES.has(preset.id) ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                    }} aria-hidden="true" />
                  )}
                </TooltipTrigger>
                <TooltipContent>{locked ? 'Unlock with Popshot Pro' : preset.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>

      {/* Custom color row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Color swatch trigger */}
        <button
          type="button"
          onClick={() => colorInputRef.current?.click()}
          aria-label="Pick custom color"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '0.5px solid rgba(0,0,0,0.12)',
            background: customActive ? background.value : `#${customHex}`,
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
            outline: customActive ? '2px solid #222222' : 'none',
            outlineOffset: customActive ? '2px' : undefined,
            transition: 'outline 100ms var(--ease-out)',
            position: 'relative',
          }}
        >
          <input
            ref={colorInputRef}
            type="color"
            value={`#${customHex}`}
            onChange={handleColorPickerChange}
            aria-label="Color picker"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              border: 'none',
              padding: 0,
            }}
          />
        </button>

        {/* Hex input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          height: '32px',
          border: '1px solid var(--color-border-input)',
          borderRadius: '8px',
          padding: '0 8px',
          background: '#FFFFFF',
          gap: '2px',
        }}>
          <span style={{ fontSize: '12px', color: '#999', userSelect: 'none' }}>#</span>
          <input
            type="text"
            value={customActive ? hexFromBg(background) || customHex : customHex}
            onChange={handleHexInput}
            placeholder="F4F4F4"
            maxLength={6}
            aria-label="Hex color value"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#222',
              background: 'transparent',
              width: '100%',
              minWidth: 0,
              textTransform: 'uppercase',
            }}
          />
        </div>

        {/* Opacity input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '32px',
          width: '52px',
          border: '1px solid var(--color-border-input)',
          borderRadius: '8px',
          padding: '0 6px',
          background: '#FFFFFF',
          gap: '1px',
        }}>
          <input
            type="text"
            value={customOpacity}
            onChange={handleOpacityInput}
            maxLength={3}
            aria-label="Background opacity"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#222',
              background: 'transparent',
              textAlign: 'right',
              minWidth: 0,
            }}
          />
          <span style={{ fontSize: '11px', color: '#999', userSelect: 'none' }}>%</span>
        </div>
      </div>

      {/* Match to image */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label htmlFor="auto-color-fp" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
          Match to image
        </label>
        <Switch id="auto-color-fp" checked={autoColor} onCheckedChange={handleAutoColorToggle} size="sm" />
      </div>
    </div>
  )
}

function LayoutTab() {
  const padding = useEditorStore((s) => s.padding)
  const setPadding = useEditorStore((s) => s.setPadding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Padding */}
      <div style={sliderRowStyle}>
        <div style={sliderLabelRow}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Padding</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{padding}px</span>
        </div>
        <Slider
          value={[padding]}
          onValueChange={(val) => setPadding(Array.isArray(val) ? val[0] : val)}
          min={0} max={240} step={4}
          aria-label="Padding"
        />
      </div>

      {/* Corner radius */}
      <div style={sliderRowStyle}>
        <div style={sliderLabelRow}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Corners</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{cornerRadius}px</span>
        </div>
        <Slider
          value={[cornerRadius]}
          onValueChange={(val) => setCornerRadius(Array.isArray(val) ? val[0] : val)}
          min={0} max={48} step={2}
          aria-label="Corner radius"
        />
      </div>
    </div>
  )
}

const FRAME_OPTIONS: { id: import('@/types').FrameType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'macos-light', label: 'macOS' },
  { id: 'safari', label: 'Safari' },
  { id: 'arc', label: 'Arc' },
  { id: 'card', label: 'Card' },
  { id: 'stack', label: 'Stack' },
]

function FramePreviewIcon({ type }: { type: import('@/types').FrameType }) {
  const w = 36
  const h = 26
  if (type === 'none') {
    return (
      <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="34" height="24" rx="3" stroke="#BBBBBB" strokeWidth="1.2" fill="none" />
      </svg>
    )
  }
  if (type === 'macos-light') {
    return (
      <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="35" height="25" rx="3" fill="#F5F5F5" stroke="#DDD" />
        <circle cx="5" cy="4.5" r="1.8" fill="#FF5F57" />
        <circle cx="9.5" cy="4.5" r="1.8" fill="#FFBD2E" />
        <circle cx="14" cy="4.5" r="1.8" fill="#28C840" />
        <line x1="0.5" y1="8.5" x2="35.5" y2="8.5" stroke="#DDD" strokeWidth="0.5" />
      </svg>
    )
  }
  if (type === 'safari') {
    return (
      <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="35" height="25" rx="3" fill="#F5F5F5" stroke="#DDD" />
        <circle cx="5" cy="4" r="1.5" fill="#FF5F57" />
        <circle cx="9" cy="4" r="1.5" fill="#FFBD2E" />
        <circle cx="13" cy="4" r="1.5" fill="#28C840" />
        <rect x="8" y="8" width="20" height="4" rx="2" fill="#E8E8E8" />
        <line x1="0.5" y1="14" x2="35.5" y2="14" stroke="#DDD" strokeWidth="0.5" />
      </svg>
    )
  }
  if (type === 'arc') {
    return (
      <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="35" height="25" rx="3" fill="#1A1A2E" stroke="#333" />
        <rect x="3" y="4" width="2" height="10" rx="1" fill="url(#arc-grad)" />
        <rect x="8" y="5" width="12" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
        <rect x="22" y="5" width="8" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
        <defs><linearGradient id="arc-grad" x1="4" y1="4" x2="4" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5DFA" /><stop offset="1" stopColor="#EC4899" />
        </linearGradient></defs>
      </svg>
    )
  }
  if (type === 'card') {
    return (
      <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="34" height="24" rx="5" fill="white" stroke="#DDD" strokeWidth="1" />
        <rect x="4" y="4" width="28" height="18" rx="2" fill="#F0F0F0" />
      </svg>
    )
  }
  // stack
  return (
    <svg width={w} height={h} viewBox="0 0 36 26" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="30" height="20" rx="3" fill="#E0E0E0" stroke="#CCC" strokeWidth="0.5" />
      <rect x="3" y="3" width="30" height="20" rx="3" fill="#EEEEEE" stroke="#CCC" strokeWidth="0.5" />
      <rect x="1" y="1" width="30" height="20" rx="3" fill="white" stroke="#DDD" strokeWidth="1" />
    </svg>
  )
}

function PolishTab() {
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)
  const frame = useEditorStore((s) => s.frame)
  const setFrame = useEditorStore((s) => s.setFrame)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Shadow */}
      <div>
        <span style={labelStyle}>Shadow</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {SHADOW_PRESETS.map((opt) => {
            const active = shadow === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setShadow(opt.id)}
                aria-pressed={active}
                aria-label={`${opt.label} shadow`}
                style={{
                  flex: 1,
                  background: active ? '#222222' : 'rgba(0,0,0,0.04)',
                  color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 4px',
                  fontSize: '12px',
                  fontWeight: active ? 600 : 500,
                  fontFamily: 'inherit',
                  borderRadius: '10px',
                  transition: 'all 100ms var(--ease-out)',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.08)' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Frame */}
      <div>
        <span style={labelStyle}>Frame</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {FRAME_OPTIONS.map((f) => {
            const active = frame === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrame(f.id)}
                aria-pressed={active}
                aria-label={`${f.label} frame`}
                style={{
                  border: active ? '2px solid #222222' : '1px solid #DDDDDD',
                  borderRadius: '10px',
                  background: '#FFFFFF',
                  padding: '8px 4px 6px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'border-color 100ms var(--ease-out)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = '#B0B0B0' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = '#DDDDDD' }}
              >
                <FramePreviewIcon type={f.id} />
                <span style={{ fontSize: '10px', fontWeight: active ? 600 : 500, color: '#222', lineHeight: 1.2 }}>
                  {f.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function FloatingPanel({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('style')
  const reset = useEditorStore((s) => s.reset)
  const imageUrl = useEditorStore((s) => s.imageUrl)

  return (
    <div
      className="frosted-pill"
      style={{
        position: 'absolute',
        top: '50%',
        right: '18px',
        transform: 'translateY(-50%)',
        zIndex: 50,
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '2px',
        padding: '6px 6px 0',
        background: 'transparent',
      }}>
        {(['style', 'layout', 'polish'] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={tabStyle(activeTab === tab)}
            onMouseEnter={(e) => { if (activeTab !== tab) { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' } }}
            onMouseLeave={(e) => { if (activeTab !== tab) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' } }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px 14px', minHeight: '180px' }}>
        {activeTab === 'style' && <StyleTab onHoverBackground={onHoverBackground} />}
        {activeTab === 'layout' && <LayoutTab />}
        {activeTab === 'polish' && <PolishTab />}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '0 14px 12px',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        paddingTop: '10px',
      }}>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => {
                  if (imageUrl) {
                    // Reset styling only, not the image
                    useEditorStore.getState().setBackground({ type: 'gradient', value: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' })
                    useEditorStore.getState().setPadding(48)
                    useEditorStore.getState().setCornerRadius(12)
                    useEditorStore.getState().setShadow('soft')
                    useEditorStore.getState().setFrame('none')
                  } else {
                    reset()
                  }
                }}
                aria-label="Reset styles"
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.04)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '7px 0',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  borderRadius: '10px',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 100ms var(--ease-out)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              />
            }
          >
            <RotateCcw size={12} aria-hidden="true" />
            Reset
          </TooltipTrigger>
          <TooltipContent side="bottom">Reset to defaults</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
