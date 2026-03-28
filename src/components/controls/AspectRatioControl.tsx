import { useEditorStore } from '@/store/useEditorStore'
import { ASPECT_RATIO_PRESETS } from '@/lib/presets'
import type { AspectRatioType } from '@/types'

export function AspectRatioControl() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {ASPECT_RATIO_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => setAspectRatio(preset.id as AspectRatioType)}
          aria-pressed={aspectRatio === preset.id}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'inherit',
            borderRadius: 'var(--radius-sm)',
            border:
              aspectRatio === preset.id
                ? '1px solid var(--color-app-accent)'
                : '1px solid var(--color-app-border)',
            background:
              aspectRatio === preset.id
                ? 'var(--color-app-accent-subtle)'
                : 'var(--color-bg-card)',
            color:
              aspectRatio === preset.id
                ? 'var(--color-app-accent)'
                : 'var(--color-text-secondary)',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.15s',
          }}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}
