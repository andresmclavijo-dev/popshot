interface SegmentOption<T extends string> {
  id: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (v: T) => void
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--color-bg-hover)',
        borderRadius: '8px',
        padding: '3px',
        gap: '2px',
      }}
    >
      {options.map((opt) => {
        const active = value === opt.id

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            style={{
              flex: 1,
              height: '28px',
              fontSize: '12px',
              fontWeight: active ? 600 : 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease',
              borderRadius: '6px',
              border: 'none',
              background: active ? '#FFFFFF' : 'transparent',
              color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)' : 'none',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.6)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
              }
              e.currentTarget.style.transform = 'none'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = active
                ? '0 1px 3px rgba(0,0,0,0.08), 0 0 0 2px var(--color-bg-panel), 0 0 0 4px #6C47FF'
                : '0 0 0 2px var(--color-bg-panel), 0 0 0 4px #6C47FF'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = active
                ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)'
                : 'none'
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
