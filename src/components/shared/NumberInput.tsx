import { useCallback, useRef, useState } from 'react'

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
  const [labelHovered, setLabelHovered] = useState(false)

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

  const handleLabelMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startValue = value

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX
        const newValue = Math.round((startValue + delta) / step) * step
        onChange(clamp(newValue))
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
      }

      document.body.style.cursor = 'ew-resize'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [value, step, onChange, clamp],
  )

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <label
        title="Drag to adjust"
        onMouseDown={handleLabelMouseDown}
        onMouseEnter={() => setLabelHovered(true)}
        onMouseLeave={() => setLabelHovered(false)}
        style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          flex: 1,
          cursor: 'ew-resize',
          userSelect: 'none',
          borderBottom: labelHovered ? '1px dashed var(--color-app-border-strong)' : '1px dashed transparent',
          paddingBottom: '1px',
          transition: 'border-color 0.15s',
        }}
      >
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <input
          ref={inputRef}
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          style={{
            width: '64px',
            height: '36px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            textAlign: 'right',
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-input)',
            border: '1px solid var(--color-border-input)',
            borderRadius: 'var(--radius-input)',
            padding: '0 10px',
            outline: 'none',
            transition: 'border-color 150ms var(--ease-out)',
          }}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = 'var(--color-border-input)'
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = 'var(--color-border-input)'
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-focus)'
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-input)'
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
