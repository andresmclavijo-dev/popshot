import { Slider } from '@/components/ui/slider'
import { useEditorStore } from '@/store/useEditorStore'

export function PaddingControl() {
  const padding = useEditorStore((s) => s.padding)
  const setPadding = useEditorStore((s) => s.setPadding)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Padding
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          {padding}px
        </span>
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
