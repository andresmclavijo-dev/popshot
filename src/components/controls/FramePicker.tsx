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
      {FRAME_OPTIONS.map((opt) => {
        const active = frame === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFrame(opt.id)}
            aria-pressed={active}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'inherit',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: active ? 'var(--color-app-accent)' : 'var(--color-bg-card)',
              color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
              boxShadow: active ? 'none' : 'inset 0 0 0 1px var(--color-app-border)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
