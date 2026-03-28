import { Slider } from '@/components/ui/slider'
import { useEditorStore } from '@/store/useEditorStore'

export function CornerRadiusControl() {
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          Corner Radius
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          {cornerRadius}px
        </span>
      </div>
      <Slider
        value={[cornerRadius]}
        onValueChange={(val) => {
          const v = Array.isArray(val) ? val[0] : val
          setCornerRadius(v)
        }}
        min={0}
        max={32}
        step={2}
        aria-label="Corner radius"
      />
    </div>
  )
}
