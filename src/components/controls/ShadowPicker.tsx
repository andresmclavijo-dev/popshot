import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { NumberInput } from '@/components/shared/NumberInput'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { useEditorStore } from '@/store/useEditorStore'
import type { ShadowType } from '@/types'

const SHADOW_OPTIONS: { id: ShadowType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'soft', label: 'Soft' },
  { id: 'deep', label: 'Deep' },
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
      <SegmentedControl
        options={SHADOW_OPTIONS}
        value={shadow}
        onChange={setShadow}
      />

      <button
        type="button"
        onClick={() => setCustomOpen(!customOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'var(--color-app-accent)',
          fontFamily: 'inherit',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          outline: 'none',
        }}
        aria-expanded={customOpen}
      >
        Custom shadow
        <ChevronDown
          size={12}
          style={{
            transform: customOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
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
