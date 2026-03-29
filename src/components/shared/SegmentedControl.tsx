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
    <div style={{ display: 'flex' }}>
      {options.map((opt, i) => {
        const active = value === opt.id
        const isFirst = i === 0
        const isLast = i === options.length - 1

        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            style={{
              flex: 1,
              height: '36px',
              fontSize: '12px',
              fontWeight: active ? 600 : 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border 100ms var(--ease-out)',
              borderRadius: isFirst ? '12px 0 0 12px' : isLast ? '0 12px 12px 0' : '0',
              border: active ? '2px solid var(--color-border-selected)' : '1px solid var(--color-border-input)',
              background: 'transparent',
              color: 'var(--color-text-primary)',
              position: 'relative',
              marginLeft: !isFirst ? '-1px' : undefined,
              zIndex: active ? 1 : 0,
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.borderColor = '#B0B0B0'
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.borderColor = 'var(--color-border-input)'
              e.currentTarget.style.transform = 'none'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-bg-panel), 0 0 0 4px var(--color-border-focus)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
