import { useEditorStore } from '@/store/useEditorStore'
import { ASPECT_RATIO_PRESETS } from '@/lib/presets'
import type { AspectRatioType } from '@/types'

const ROW1_IDS: AspectRatioType[] = ['free', '16:9', '1:1', '4:3']
const ROW2_IDS: AspectRatioType[] = ['twitter', 'linkedin', 'dribbble']
const ROW3_IDS: AspectRatioType[] = ['behance', 'og', 'pinterest']

function SizeButton({ id, active, onClick }: {
  id: AspectRatioType
  active: boolean
  onClick: () => void
}) {
  const preset = ASPECT_RATIO_PRESETS.find((p) => p.id === id)!
  const hasDimensions = preset.width !== null

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        flex: 1,
        height: hasDimensions ? '36px' : '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1px',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.15s',
        border: active ? '2px solid var(--color-border-selected)' : '1px solid var(--color-border-input)',
        background: 'transparent',
        color: 'var(--color-text-primary)',
        position: 'relative',
        zIndex: active ? 1 : 0,
      }}
    >
      <span>{preset.label}</span>
      {hasDimensions && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: 400,
            opacity: 0.6,
            color: 'var(--color-text-tertiary)',
          }}
        >
          {preset.width}&times;{preset.height}
        </span>
      )}
    </button>
  )
}

function SegmentedRow({ ids, value, onChange }: {
  ids: AspectRatioType[]
  value: AspectRatioType
  onChange: (v: AspectRatioType) => void
}) {
  return (
    <div style={{ display: 'flex' }}>
      {ids.map((id, i) => {
        const isFirst = i === 0
        const isLast = i === ids.length - 1

        return (
          <div
            key={id}
            style={{
              flex: 1,
              marginLeft: !isFirst ? '-1px' : undefined,
            }}
          >
            <div
              style={{
                borderRadius: isFirst
                  ? 'var(--radius-sm) 0 0 var(--radius-sm)'
                  : isLast
                    ? '0 var(--radius-sm) var(--radius-sm) 0'
                    : '0',
                overflow: 'hidden',
              }}
            >
              <SizeButton
                id={id}
                active={value === id}
                onClick={() => onChange(id)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AspectRatioControl() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SegmentedRow ids={ROW1_IDS} value={aspectRatio} onChange={setAspectRatio} />
      <SegmentedRow ids={ROW2_IDS} value={aspectRatio} onChange={setAspectRatio} />
      <SegmentedRow ids={ROW3_IDS} value={aspectRatio} onChange={setAspectRatio} />
    </div>
  )
}
