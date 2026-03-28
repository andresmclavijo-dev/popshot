import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { NumberInput } from '@/components/shared/NumberInput'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import type { ShadowType } from '@/types'

const SHADOW_OPTIONS: {
  id: ShadowType
  label: string
  tooltip: string
  previewShadow: string
}[] = [
  { id: 'none', label: 'None', tooltip: 'No shadow', previewShadow: 'none' },
  { id: 'soft', label: 'Soft', tooltip: 'Soft shadow', previewShadow: '0 2px 6px rgba(0,0,0,0.15)' },
  { id: 'deep', label: 'Deep', tooltip: 'Deep shadow', previewShadow: '0 2px 4px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.25)' },
]

export function ShadowPicker() {
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)
  const [customOpen, setCustomOpen] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(20)
  const [blur, setBlur] = useState(60)
  const [spread, setSpread] = useState(0)
  const [opacity, setOpacity] = useState(12)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex' }}>
        {SHADOW_OPTIONS.map((opt, i) => {
          const active = shadow === opt.id
          const isFirst = i === 0
          const isLast = i === SHADOW_OPTIONS.length - 1

          return (
            <Tooltip key={opt.id}>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => setShadow(opt.id)}
                    aria-pressed={active}
                    style={{
                      flex: 1,
                      height: '52px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontFamily: 'inherit',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.15s',
                      borderRadius: isFirst
                        ? 'var(--radius-sm) 0 0 var(--radius-sm)'
                        : isLast
                          ? '0 var(--radius-sm) var(--radius-sm) 0'
                          : '0',
                      border: active ? '1px solid #6C47FF' : '1px solid var(--color-app-border)',
                      borderLeft: !isFirst && !active ? 'none' : undefined,
                      marginLeft: !isFirst && !active ? '-1px' : undefined,
                      background: active ? '#6C47FF' : 'transparent',
                      color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
                      position: 'relative',
                      zIndex: active ? 1 : 0,
                    }}
                  />
                }
              >
                {/* Shadow preview */}
                <div
                  style={{
                    width: '32px',
                    height: '20px',
                    background: active ? 'rgba(255,255,255,0.15)' : '#F0F0EE',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '8px',
                      background: '#FFFFFF',
                      borderRadius: '2px',
                      boxShadow: opt.previewShadow,
                    }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500 }}>{opt.label}</span>
              </TooltipTrigger>
              <TooltipContent>{opt.tooltip}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setCustomOpen(!customOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '12px',
          color: 'var(--color-app-accent)',
          fontFamily: 'inherit',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          outline: 'none',
        }}
        aria-expanded={customOpen}
      >
        Custom shadow
        <ChevronDown
          size={12}
          style={{
            transform: customOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
          aria-hidden="true"
        />
      </button>

      {customOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NumberInput label="X offset" unit="px" value={offsetX} onChange={setOffsetX} min={-100} max={100} step={1} />
          <NumberInput label="Y offset" unit="px" value={offsetY} onChange={setOffsetY} min={-100} max={100} step={1} />
          <NumberInput label="Blur" unit="px" value={blur} onChange={setBlur} min={0} max={200} step={1} />
          <NumberInput label="Spread" unit="px" value={spread} onChange={setSpread} min={-50} max={50} step={1} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Opacity</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{opacity}%</span>
            </div>
            <Slider
              value={[opacity]}
              onValueChange={(val) => setOpacity(Array.isArray(val) ? val[0] : val)}
              min={0}
              max={100}
              step={1}
              aria-label="Shadow opacity"
            />
          </div>
        </div>
      )}
    </div>
  )
}
