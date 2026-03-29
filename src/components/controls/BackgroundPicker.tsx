import { useState, useCallback } from 'react'
import { Check, ChevronDown, Shuffle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import type { Background } from '@/types'

const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach', 'transparent'])

const CHECKERBOARD = 'repeating-conic-gradient(#D0D0CE 0% 25%, #F0F0EE 0% 50%) 0 0 / 8px 8px'

const SHUFFLEABLE_PRESETS = BACKGROUND_PRESETS.filter((p) => p.id !== 'transparent')
const SHUFFLEABLE_SHADOWS = SHADOW_PRESETS.filter((p) => p.id !== 'none')

const ProBadge = () => (
  <span
    style={{
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      background: 'linear-gradient(135deg, #6C47FF, #9C47FF)',
      color: '#FFFFFF',
      padding: '2px 6px',
      borderRadius: '9999px',
      display: 'inline-block',
      lineHeight: 1.4,
    }}
  >
    PRO
  </span>
)

function hexFromBackground(bg: Background): string {
  if (bg.type === 'solid') return bg.value.replace('#', '')
  return ''
}

export function ShuffleButton() {
  const setBackground = useEditorStore((s) => s.setBackground)
  const setShadow = useEditorStore((s) => s.setShadow)
  const triggerShuffle = useEditorStore((s) => s.triggerShuffle)
  const [angle, setAngle] = useState(0)

  const handleShuffle = () => {
    const bg = SHUFFLEABLE_PRESETS[Math.floor(Math.random() * SHUFFLEABLE_PRESETS.length)]
    const sh = SHUFFLEABLE_SHADOWS[Math.floor(Math.random() * SHUFFLEABLE_SHADOWS.length)]
    setBackground(bg.background)
    setShadow(sh.id)
    triggerShuffle()
    setAngle((a) => a + 180)
  }

  return (
    <button
      type="button"
      onClick={handleShuffle}
      aria-label="Surprise me"
      title="Surprise me"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '2px',
        color: 'var(--color-text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        outline: 'none',
        lineHeight: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-tertiary)' }}
    >
      <Shuffle
        size={14}
        style={{
          transform: `rotate(${angle}deg)`,
          transition: 'transform 300ms var(--ease-out)',
        }}
        aria-hidden="true"
      />
    </button>
  )
}

export function BackgroundPicker({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)
  const setAutoColor = useEditorStore((s) => s.setAutoColor)
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const [gradientOpen, setGradientOpen] = useState(false)
  const [gradColor1, setGradColor1] = useState('#667eea')
  const [gradColor2, setGradColor2] = useState('#764ba2')
  const [gradAngle, setGradAngle] = useState(135)

  const isActive = (preset: (typeof BACKGROUND_PRESETS)[number]) => {
    return background.value === preset.background.value
  }

  const handleHexInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace('#', '')
      if (val.length > 6) val = val.slice(0, 6)
      if (/^[0-9a-fA-F]{6}$/.test(val)) {
        setBackground({ type: 'solid', value: `#${val}` })
      }
    },
    [setBackground],
  )

  const handleAutoColorToggle = async (checked: boolean) => {
    setAutoColor(checked)
    if (checked && imageUrl) {
      const bg = await extractColorsFromImage(imageUrl)
      setBackground(bg)
    }
  }

  const applyCustomGradient = useCallback(() => {
    setBackground({
      type: 'gradient',
      value: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})`,
    })
  }, [gradAngle, gradColor1, gradColor2, setBackground])

  const hexDisplayValue = background.type === 'solid'
    ? hexFromBackground(background)
    : background.type === 'gradient' ? '\u2014' : '\u2014'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Swatch grid — 4 per row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          width: '100%',
        }}
      >
        {BACKGROUND_PRESETS.map((preset) => {
          const active = isActive(preset)
          const isTransparent = preset.id === 'transparent'
          return (
            <div
              key={preset.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => setBackground(preset.background)}
                      onMouseEnter={(e) => {
                        onHoverBackground(preset.background)
                        if (!active) {
                          e.currentTarget.style.transform = 'scale(1.05)'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        onHoverBackground(null)
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = active ? 'none' : 'scale(1.05)' }}
                      aria-label={`${preset.label} background`}
                      aria-pressed={active}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        maxWidth: '52px',
                        borderRadius: '6px',
                        border: 'none',
                        background: isTransparent ? CHECKERBOARD : preset.background.value,
                        cursor: 'pointer',
                        outline: active ? '2px solid var(--color-app-accent)' : 'none',
                        outlineOffset: active ? '2px' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        transition: 'transform 100ms var(--ease-out), box-shadow 100ms var(--ease-out)',
                      }}
                    />
                  }
                >
                  {active && (
                    <Check
                      size={14}
                      strokeWidth={3}
                      style={{
                        color: LIGHT_SWATCHES.has(preset.id) ? '#6C47FF' : '#FFFFFF',
                        filter: LIGHT_SWATCHES.has(preset.id) ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      }}
                      aria-hidden="true"
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent>{preset.label}</TooltipContent>
              </Tooltip>
              <span
                style={{
                  fontSize: '10px',
                  color: 'var(--color-text-tertiary)',
                  textAlign: 'center',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {preset.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Hex input row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-app-border)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '5px',
            flexShrink: 0,
            background: background.type === 'transparent' ? CHECKERBOARD : background.value,
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        />
        <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>#</span>
        <input
          type="text"
          value={hexDisplayValue}
          onChange={handleHexInput}
          readOnly={background.type !== 'solid'}
          placeholder="Custom"
          aria-label="Hex color value"
          style={{
            width: '100%',
            height: '22px',
            fontSize: '13px',
            fontFamily: 'inherit',
            color: 'var(--color-text-primary)',
            background: 'transparent',
            border: 'none',
            padding: 0,
            outline: 'none',
          }}
        />
      </div>

      {/* Match to image */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '12px',
        }}
      >
        <label
          htmlFor="auto-color-toggle"
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          Match to image
        </label>
        <Switch
          id="auto-color-toggle"
          checked={autoColor}
          onCheckedChange={handleAutoColorToggle}
          size="sm"
        />
      </div>

      {/* Edit gradient disclosure */}
      <button
        type="button"
        onClick={() => setGradientOpen(!gradientOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'var(--color-app-accent)',
          fontFamily: 'inherit',
          padding: '4px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          outline: 'none',
          borderRadius: '4px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid #6C47FF'
          e.currentTarget.style.outlineOffset = '2px'
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none'
        }}
        aria-expanded={gradientOpen}
      >
        Edit gradient
        <ProBadge />
        <ChevronDown
          size={12}
          style={{
            transform: gradientOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
            marginLeft: 'auto',
          }}
          aria-hidden="true"
        />
      </button>

      {gradientOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', width: '48px' }}>
              Start
            </label>
            <input
              type="color"
              value={gradColor1}
              onChange={(e) => { setGradColor1(e.target.value) }}
              onBlur={applyCustomGradient}
              aria-label="Gradient start color"
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid var(--color-app-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                padding: '2px',
              }}
            />
            <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)', width: '32px' }}>
              End
            </label>
            <input
              type="color"
              value={gradColor2}
              onChange={(e) => { setGradColor2(e.target.value) }}
              onBlur={applyCustomGradient}
              aria-label="Gradient end color"
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid var(--color-app-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                padding: '2px',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Angle
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                {gradAngle}&deg;
              </span>
            </div>
            <Slider
              value={[gradAngle]}
              onValueChange={(val) => {
                const v = Array.isArray(val) ? val[0] : val
                setGradAngle(v)
              }}
              onValueCommitted={applyCustomGradient}
              min={0}
              max={360}
              step={15}
              aria-label="Gradient angle"
            />
          </div>
          <button
            type="button"
            onClick={applyCustomGradient}
            style={{
              height: '30px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'inherit',
              background: 'var(--color-app-accent)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            Apply gradient
          </button>
        </div>
      )}
    </div>
  )
}
