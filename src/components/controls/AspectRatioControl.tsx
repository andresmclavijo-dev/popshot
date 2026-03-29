import { useEditorStore } from '@/store/useEditorStore'
import { ASPECT_RATIO_PRESETS } from '@/lib/presets'
import type { AspectRatioType } from '@/types'

export function AspectRatioControl() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {ASPECT_RATIO_PRESETS.map((preset) => {
        const active = aspectRatio === preset.id
        const hasDims = preset.width !== null
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setAspectRatio(preset.id)}
            aria-pressed={active}
            aria-label={`${preset.label} canvas size`}
            style={{
              border: active ? '2px solid #222222' : '1px solid #DDDDDD',
              borderRadius: '12px',
              background: '#FFFFFF',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2px',
              textAlign: 'left',
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
            <span style={{
              fontSize: '13px',
              fontWeight: active ? 600 : 500,
              color: '#222222',
              lineHeight: 1.3,
            }}>
              {preset.label}
            </span>
            {hasDims && (
              <span style={{
                fontSize: '10px',
                fontWeight: 400,
                color: '#717171',
                lineHeight: 1.2,
              }}>
                {preset.width}&times;{preset.height}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
