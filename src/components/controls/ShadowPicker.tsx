import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { NumberInput } from '@/components/shared/NumberInput'
import { useEditorStore } from '@/store/useEditorStore'
import type { ShadowType } from '@/types'

const SHADOW_OPTIONS: {
  id: ShadowType
  label: string
  previewBg: string
  previewShadow: string
  span?: number
}[] = [
  { id: 'none', label: 'None', previewBg: '#E5E5E5', previewShadow: 'none' },
  { id: 'soft', label: 'Soft', previewBg: '#E0E0E0', previewShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  { id: 'deep', label: 'Deep', previewBg: '#D0D0D0', previewShadow: '0 16px 40px rgba(0,0,0,0.35)', span: 2 },
]

export function ShadowPicker() {
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)
  const [customOpen, setCustomOpen] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(20)
  const [blur, setBlur] = useState(60)
  const [spread, setSpread] = useState(0)
  const [opacity, setOpacity] = useState(12)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {SHADOW_OPTIONS.map((opt) => {
          const active = shadow === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setShadow(opt.id)}
              aria-pressed={active}
              aria-label={`${opt.label} shadow`}
              style={{
                border: active ? '2px solid #222222' : '1px solid #DDDDDD',
                borderRadius: '12px',
                background: '#FFFFFF',
                padding: '16px 12px 12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                minHeight: '80px',
                gridColumn: opt.span ? `span ${opt.span}` : undefined,
                transition: 'border 100ms var(--ease-out)',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = '#B0B0B0' }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.borderColor = '#DDDDDD'
                e.currentTarget.style.transform = 'none'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
            >
              <div style={{
                width: '40px',
                height: '24px',
                background: opt.previewBg,
                borderRadius: '4px',
                boxShadow: opt.previewShadow,
              }} />
              <span style={{
                fontSize: '12px',
                fontWeight: active ? 600 : 500,
                color: '#222222',
              }}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setCustomOpen(!customOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          fontFamily: 'inherit',
          padding: '4px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          outline: 'none',
          borderRadius: '4px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = '2px solid var(--color-border-focus)'
          e.currentTarget.style.outlineOffset = '2px'
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none'
        }}
        aria-expanded={customOpen}
      >
        Edit shadow
        <ChevronDown
          size={12}
          style={{
            transform: customOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms var(--ease-out)',
          }}
          aria-hidden="true"
        />
      </button>

      {customOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NumberInput label="X offset" unit="px" value={offsetX} onChange={setOffsetX} min={-100} max={100} step={1} />
          <NumberInput label="Y offset" unit="px" value={offsetY} onChange={setOffsetY} min={-100} max={100} step={1} />
          <NumberInput label="Blur" unit="px" value={blur} onChange={setBlur} min={0} max={200} step={1} />
          <NumberInput label="Spread" unit="px" value={spread} onChange={setSpread} min={-50} max={50} step={1} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Opacity</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{opacity}%</span>
            </div>
            <Slider
              value={[opacity]}
              onValueChange={(val) => setOpacity(Array.isArray(val) ? val[0] : val)}
              min={0}
              max={100}
              step={1}
              aria-label="Shadow opacity"
            />
          </div>
        </div>
      )}
    </div>
  )
}
