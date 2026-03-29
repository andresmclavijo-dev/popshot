import { useEditorStore } from '@/store/useEditorStore'
import type { FrameType } from '@/types'

const FRAMES: { id: FrameType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'macos-light', label: 'macOS Light' },
  { id: 'macos-dark', label: 'macOS Dark' },
  { id: 'iphone', label: 'iPhone' },
]

function FrameIcon({ type, size }: { type: FrameType; size: number }) {
  const s = size
  if (type === 'none') {
    return (
      <svg width={s} height={s * 0.7} viewBox="0 0 28 20" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="26" height="18" rx="3" stroke="#BBBBBB" strokeWidth="1.5" fill="none" />
      </svg>
    )
  }
  if (type === 'macos-light') {
    return (
      <svg width={s} height={s * 0.7} viewBox="0 0 28 20" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="27" height="19" rx="3" fill="#F5F5F5" stroke="#DDDDDD" />
        <circle cx="5" cy="4" r="1.5" fill="#FF5F57" />
        <circle cx="9" cy="4" r="1.5" fill="#FEBC2E" />
        <circle cx="13" cy="4" r="1.5" fill="#28C840" />
      </svg>
    )
  }
  if (type === 'macos-dark') {
    return (
      <svg width={s} height={s * 0.7} viewBox="0 0 28 20" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="27" height="19" rx="3" fill="#2D2D2D" stroke="#444444" />
        <circle cx="5" cy="4" r="1.5" fill="#FF5F57" />
        <circle cx="9" cy="4" r="1.5" fill="#FEBC2E" />
        <circle cx="13" cy="4" r="1.5" fill="#28C840" />
      </svg>
    )
  }
  // iphone
  return (
    <svg width={s * 0.5} height={s * 0.85} viewBox="0 0 14 24" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="13" height="23" rx="3" fill="#F5F5F5" stroke="#DDDDDD" />
      <rect x="4" y="21" width="6" height="1" rx="0.5" fill="#CCCCCC" />
    </svg>
  )
}

export function FramePicker() {
  const frame = useEditorStore((s) => s.frame)
  const setFrame = useEditorStore((s) => s.setFrame)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {FRAMES.map((f) => {
        const active = frame === f.id
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => setFrame(f.id)}
            aria-pressed={active}
            aria-label={`${f.label} frame`}
            style={{
              border: active ? '2px solid #222222' : '1px solid #DDDDDD',
              borderRadius: '12px',
              background: '#FFFFFF',
              padding: '14px 12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '72px',
              transition: 'border 100ms var(--ease-out)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = '#B0B0B0' }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.borderColor = '#DDDDDD'
              e.currentTarget.style.transform = 'none'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
          >
            <FrameIcon type={f.id} size={28} />
            <span style={{
              fontSize: '11px',
              fontWeight: active ? 600 : 500,
              color: '#222222',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              {f.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
