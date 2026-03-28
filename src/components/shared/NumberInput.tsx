import { useCallback, useRef } from 'react'

interface NumberInputProps {
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  label: string
  unit?: string
}

export function NumberInput({ value, onChange, min, max, step, label, unit }: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const clamp = useCallback(
    (v: number) => Math.max(min, Math.min(max, v)),
    [min, max],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = parseInt(e.target.value, 10)
      if (Number.isNaN(raw)) return
      onChange(clamp(raw))
    },
    [onChange, clamp],
  )

  const handleBlur = useCallback(() => {
    onChange(clamp(value))
  }, [onChange, clamp, value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        onChange(clamp(value + step))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        onChange(clamp(value - step))
      }
    },
    [onChange, clamp, value, step],
  )

  const displayValue = unit ? `${value}` : `${value}`

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <label
        style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          flex: 1,
        }}
      >
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <input
          ref={inputRef}
          type="number"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          style={{
            width: '64px',
            height: '30px',
            fontSize: '13px',
            fontFamily: 'inherit',
            textAlign: 'right',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-card)',
            border: '1px solid transparent',
            borderRadius: 'var(--radius-sm)',
            padding: '0 8px',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = 'var(--color-app-border)'
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = 'transparent'
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-app-accent)'
          }}
          onFocusCapture={() => {}}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = 'transparent'
          }}
        />
        {unit && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
