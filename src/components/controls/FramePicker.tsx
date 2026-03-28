import { SegmentedControl } from '@/components/shared/SegmentedControl'
import { useEditorStore } from '@/store/useEditorStore'
import type { FrameType } from '@/types'

const ROW1: { id: FrameType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'macos-light', label: 'macOS Light' },
  { id: 'macos-dark', label: 'macOS Dark' },
]

const ROW2: { id: FrameType; label: string }[] = [
  { id: 'iphone', label: 'iPhone' },
]

export function FramePicker() {
  const frame = useEditorStore((s) => s.frame)
  const setFrame = useEditorStore((s) => s.setFrame)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SegmentedControl options={ROW1} value={frame} onChange={setFrame} />
      <div style={{ display: 'flex' }}>
        {ROW2.map((opt) => {
          const active = frame === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFrame(opt.id)}
              aria-pressed={active}
              style={{
                height: '30px',
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.15s',
                borderRadius: 'var(--radius-sm)',
                border: active ? '1px solid #6C47FF' : '1px solid var(--color-app-border)',
                background: active ? '#6C47FF' : 'transparent',
                color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
                padding: '0 16px',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
