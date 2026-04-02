import { useState } from 'react'
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

function StyleTab({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)
  const setAutoColor = useEditorStore((s) => s.setAutoColor)
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)

  const isActive = (preset: typeof BACKGROUND_PRESETS[number]) =>
    background.value === preset.background.value

  const handleAutoColorToggle = async (checked: boolean) => {
    setAutoColor(checked)
    if (checked && imageUrl) {
      try {
        const bg = await extractColorsFromImage(imageUrl)
        setBackground(bg)
      } catch { /* keep current */ }
    }
  }

  // Premium swatches (last 3: Moss, Blush + transparent stays free)
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

function PolishTab() {
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
