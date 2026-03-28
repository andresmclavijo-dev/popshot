import { useCallback } from 'react'
import { Slider } from '@/components/ui/slider'
import { useEditorStore } from '@/store/useEditorStore'

const inputStyle: React.CSSProperties = {
  width: '52px',
  height: '24px',
  fontSize: '12px',
  fontFamily: 'inherit',
  textAlign: 'right',
  color: 'var(--color-text-primary)',
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-app-border)',
  borderRadius: 'var(--radius-xs)',
  padding: '0 var(--space-2)',
  outline: 'none',
}

export function PaddingControl() {
  const padding = useEditorStore((s) => s.padding)
  const setPadding = useEditorStore((s) => s.setPadding)

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseInt(e.target.value, 10)
      if (Number.isNaN(raw)) return
      const clamped = Math.max(0, Math.min(120, raw))
      setPadding(clamped)
    },
    [setPadding],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Padding
        </span>
        <input
          type="number"
          value={padding}
          onChange={handleInput}
          min={0}
          max={120}
          step={4}
          aria-label="Padding value"
          style={inputStyle}
        />
      </div>
      <Slider
        value={[padding]}
        onValueChange={(val) => {
          const v = Array.isArray(val) ? val[0] : val
          setPadding(v)
        }}
        min={0}
        max={120}
        step={4}
        aria-label="Padding"
      />
    </div>
  )
}
