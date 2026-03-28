import { Check } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import type { Background } from '@/types'

const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach'])

export function BackgroundPicker() {
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)
  const setAutoColor = useEditorStore((s) => s.setAutoColor)
  const imageUrl = useEditorStore((s) => s.imageUrl)

  const isActive = (preset: (typeof BACKGROUND_PRESETS)[number]) => {
    return background.value === preset.background.value
  }

  const handleCustomColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bg: Background = { type: 'solid', value: e.target.value }
    setBackground(bg)
  }

  const handleAutoColorToggle = async (checked: boolean) => {
    setAutoColor(checked)
    if (checked && imageUrl) {
      const bg = await extractColorsFromImage(imageUrl)
      setBackground(bg)
    }
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
        {BACKGROUND_PRESETS.map((preset) => {
          const active = isActive(preset)
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setBackground(preset.background)}
              aria-label={`${preset.label} background`}
              aria-pressed={active}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                border: '2px solid transparent',
                background: preset.background.value,
                cursor: 'pointer',
                outline: active ? '2px solid #6C47FF' : 'none',
                outlineOffset: active ? '2px' : undefined,
                transition: 'outline 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: !active ? 'inset 0 0 0 1px var(--color-app-border)' : 'none',
              }}
            >
              {active && (
                <Check
                  size={14}
                  strokeWidth={3}
                  style={{
                    color: LIGHT_SWATCHES.has(preset.id)
                      ? '#6C47FF'
                      : '#FFFFFF',
                  }}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <label
          htmlFor="custom-color"
          style={{
            fontSize: '13px',
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'var(--space-2)',
        }}
      >
        <label
          htmlFor="auto-color-toggle"
          style={{
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
        >
          Auto-match colors
        </label>
        <Switch
          id="auto-color-toggle"
          checked={autoColor}
          onCheckedChange={handleAutoColorToggle}
          size="sm"
        />
      </div>
    </div>
  )
}
