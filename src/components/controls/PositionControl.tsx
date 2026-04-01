import { useEditorStore } from '@/store/useEditorStore'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import type { ImagePosition } from '@/types'

const POSITIONS: { id: ImagePosition; label: string; icon: string }[] = [
  { id: 'top-left', label: 'Top left', icon: '↖' },
  { id: 'top', label: 'Top', icon: '↑' },
  { id: 'top-right', label: 'Top right', icon: '↗' },
  { id: 'center', label: 'Center', icon: '·' },
  { id: 'bottom', label: 'Bottom', icon: '↓' },
]

export function PositionControl() {
  const imagePosition = useEditorStore((s) => s.imagePosition)
  const setImagePosition = useEditorStore((s) => s.setImagePosition)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
      {POSITIONS.map((pos) => {
        const active = imagePosition === pos.id
        return (
          <Tooltip key={pos.id}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={() => setImagePosition(pos.id)}
                  aria-label={`Position: ${pos.label}`}
                  aria-pressed={active}
                  style={{
                    width: '100%',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: active ? '2px solid #222222' : '1px solid var(--color-border-input)',
                    borderRadius: '6px',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    lineHeight: 1,
                    color: active ? '#222222' : 'var(--color-text-secondary)',
                    fontFamily: 'inherit',
                    padding: 0,
                    transition: 'border-color 100ms var(--ease-out)',
                  }}
                />
              }
            >
              <span aria-hidden="true">{pos.icon}</span>
            </TooltipTrigger>
            <TooltipContent>{pos.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
