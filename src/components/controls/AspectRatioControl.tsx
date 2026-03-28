import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { useEditorStore } from '@/store/useEditorStore'
import type { AspectRatioType } from '@/types'

const ROW1: { id: AspectRatioType; label: string }[] = [
  { id: 'free', label: 'Free' },
  { id: '16:9', label: '16:9' },
  { id: '1:1', label: '1:1' },
  { id: '4:3', label: '4:3' },
]

const ROW2: { id: AspectRatioType; label: string }[] = [
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'dribbble', label: 'Dribbble' },
  { id: 'behance', label: 'Behance' },
]

export function AspectRatioControl() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SegmentedControl options={ROW1} value={aspectRatio} onChange={setAspectRatio} />
      <SegmentedControl options={ROW2} value={aspectRatio} onChange={setAspectRatio} />
    </div>
  )
}
