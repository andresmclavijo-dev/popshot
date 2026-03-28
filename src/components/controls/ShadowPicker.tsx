import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS } from '@/lib/presets'
import type { ShadowType } from '@/types'

export function ShadowPicker() {
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      {SHADOW_PRESETS.map((preset) => {
        const active = shadow === preset.id
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setShadow(preset.id as ShadowType)}
            aria-pressed={active}
            style={{
              flex: 1,
              padding: 'var(--space-2) var(--space-3)',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'inherit',
              borderRadius: 'var(--radius-sm)',
              border: active ? '1px solid #6C47FF' : '1px solid var(--color-app-border)',
              background: active ? '#6C47FF' : 'transparent',
              color: active ? '#FFFFFF' : 'var(--color-text-primary)',
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
