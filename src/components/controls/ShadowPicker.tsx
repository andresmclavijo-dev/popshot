import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS } from '@/lib/presets'
import type { ShadowType } from '@/types'

export function ShadowPicker() {
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      {SHADOW_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => setShadow(preset.id as ShadowType)}
          aria-pressed={shadow === preset.id}
          style={{
            flex: 1,
            padding: 'var(--space-2) var(--space-3)',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: 'inherit',
            borderRadius: 'var(--radius-sm)',
            border:
              shadow === preset.id
                ? '1px solid var(--color-app-accent)'
                : '1px solid var(--color-app-border)',
            background:
              shadow === preset.id
                ? 'var(--color-app-accent-subtle)'
                : 'var(--color-bg-card)',
            color:
              shadow === preset.id
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
