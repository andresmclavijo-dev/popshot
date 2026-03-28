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
                fontWeight: active ? 600 : 500,
                fontFamily: 'inherit',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.15s ease',
                borderRadius: '6px',
                border: active ? '1.5px solid #6C47FF' : '1px solid var(--color-app-border)',
                background: active ? 'var(--color-app-accent-subtle)' : 'transparent',
                color: active ? '#6C47FF' : 'var(--color-text-secondary)',
                padding: '0 16px',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--color-app-border-strong)'
                  e.currentTarget.style.background = 'var(--color-bg-hover)'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--color-app-border)'
                  e.currentTarget.style.background = 'transparent'
                }
                e.currentTarget.style.transform = 'none'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-bg-panel), 0 0 0 4px #6C47FF'
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none'
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
