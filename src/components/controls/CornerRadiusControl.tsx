import { Slider } from '@/components/ui/slider'
import { NumberInput } from '@/components/shared/NumberInput'
import { useEditorStore } from '@/store/useEditorStore'

export function CornerRadiusControl() {
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <NumberInput
        label="Radius"
        unit="px"
        value={cornerRadius}
        onChange={setCornerRadius}
        min={0}
        max={32}
        step={2}
      />
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
