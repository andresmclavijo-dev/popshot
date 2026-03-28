import { useEditorStore } from '@/store/useEditorStore'
import type { FrameType } from '@/types'

const FRAME_OPTIONS: { id: FrameType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'macos-light', label: 'macOS Light' },
  { id: 'macos-dark', label: 'macOS Dark' },
  { id: 'iphone', label: 'iPhone' },
]

export function FramePicker() {
  const frame = useEditorStore((s) => s.frame)
  const setFrame = useEditorStore((s) => s.setFrame)

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {FRAME_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setFrame(opt.id)}
          aria-pressed={frame === opt.id}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'inherit',
            borderRadius: 'var(--radius-sm)',
            border:
              frame === opt.id
                ? '1px solid var(--color-app-accent)'
                : '1px solid var(--color-app-border)',
            background:
              frame === opt.id
                ? 'var(--color-app-accent-subtle)'
                : 'var(--color-bg-card)',
            color:
              frame === opt.id
                ? 'var(--color-app-accent)'
                : 'var(--color-text-secondary)',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
