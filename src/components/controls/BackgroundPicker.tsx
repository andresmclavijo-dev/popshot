import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS } from '@/lib/presets'
import type { Background } from '@/types'

export function BackgroundPicker() {
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)

  const isActive = (preset: (typeof BACKGROUND_PRESETS)[number]) => {
    return background.value === preset.background.value
  }

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bg: Background = { type: 'solid', value: e.target.value }
    setBackground(bg)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 'var(--space-2)',
        }}
      >
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => setBackground(preset.background)}
            aria-label={`${preset.label} background`}
            aria-pressed={isActive(preset)}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 'var(--radius-md)',
              border: isActive(preset)
                ? '2px solid var(--color-app-accent)'
                : '2px solid var(--color-app-border)',
              background:
                preset.background.type === 'gradient'
                  ? preset.background.value
                  : preset.background.value,
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <label
          htmlFor="custom-color"
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          Custom
        </label>
        <input
          id="custom-color"
          type="color"
          value={background.type === 'solid' ? background.value : '#ffffff'}
          onChange={handleCustomColor}
          style={{
            width: '32px',
            height: '32px',
            border: '1px solid var(--color-app-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            padding: '2px',
          }}
        />
      </div>
    </div>
  )
}
