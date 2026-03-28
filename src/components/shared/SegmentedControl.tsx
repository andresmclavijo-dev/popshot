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
              height: '30px',
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s',
              borderRadius: isFirst
                ? 'var(--radius-sm) 0 0 var(--radius-sm)'
                : isLast
                  ? '0 var(--radius-sm) var(--radius-sm) 0'
                  : '0',
              border: active
                ? '1px solid #6C47FF'
                : '1px solid var(--color-app-border)',
              borderLeft: !isFirst && !active ? 'none' : undefined,
              marginLeft: !isFirst && !active ? '-1px' : undefined,
              background: active ? '#6C47FF' : 'transparent',
              color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
              position: 'relative',
              zIndex: active ? 1 : 0,
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
