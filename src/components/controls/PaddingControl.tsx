import { Slider } from '@/components/ui/slider'
import { NumberInput } from '@/components/shared/NumberInput'
import { useEditorStore } from '@/store/useEditorStore'

export function PaddingControl() {
  const padding = useEditorStore((s) => s.padding)
  const setPadding = useEditorStore((s) => s.setPadding)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <NumberInput
        label="Padding"
        unit="px"
        value={padding}
        onChange={setPadding}
        min={0}
        max={240}
        step={4}
      />
      <Slider
        value={[padding]}
        onValueChange={(val) => {
          const v = Array.isArray(val) ? val[0] : val
          setPadding(v)
        }}
        min={0}
        max={240}
        step={4}
        aria-label="Padding"
      />
    </div>
  )
}
