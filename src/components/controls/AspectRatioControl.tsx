import { useEditorStore } from '@/store/useEditorStore'
import { ASPECT_RATIO_PRESETS } from '@/lib/presets'
import type { AspectRatioType } from '@/types'

export function AspectRatioControl() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {ASPECT_RATIO_PRESETS.map((preset) => {
        const active = aspectRatio === preset.id
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setAspectRatio(preset.id as AspectRatioType)}
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
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
