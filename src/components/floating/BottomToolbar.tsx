import { useState } from 'react'
import { LayoutGrid, Undo2, Redo2 } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { STYLE_PRESETS } from '@/lib/presets'
import { openCheckout } from '@/lib/lemonSqueezy'
import { showToast } from '@/components/shared/Toast'
import type { AspectRatioType } from '@/types'

const CANVAS_SIZES: { id: AspectRatioType; label: string }[] = [
  { id: 'free', label: 'Free' },
  { id: '16:9', label: '16:9' },
  { id: '4:3', label: '4:3' },
  { id: '1:1', label: '1:1' },
  { id: '4:5' as AspectRatioType, label: '4:5' },
]

const separatorStyle: React.CSSProperties = {
  width: '1px',
  height: '20px',
  background: 'rgba(0, 0, 0, 0.08)',
  flexShrink: 0,
  margin: '0 4px',
}

const pillBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#222222' : 'transparent',
  color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
  border: 'none',
  cursor: 'pointer',
  padding: '5px 12px',
  fontSize: '12px',
  fontWeight: 500,
  fontFamily: 'inherit',
  borderRadius: '12px',
  transition: 'all 100ms var(--ease-out)',
  whiteSpace: 'nowrap' as const,
  lineHeight: 1.3,
})

const iconBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '10px',
  color: 'var(--color-text-secondary)',
  transition: 'color 100ms var(--ease-out), background 100ms var(--ease-out)',
}

export function BottomToolbar() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const setBackground = useEditorStore((s) => s.setBackground)
  const setShadow = useEditorStore((s) => s.setShadow)
  const setFrame = useEditorStore((s) => s.setFrame)
  const setPadding = useEditorStore((s) => s.setPadding)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)
  const [presetsOpen, setPresetsOpen] = useState(false)

  const applyPreset = (preset: typeof STYLE_PRESETS[number]) => {
    setBackground(preset.background)
    setShadow(preset.shadow)
    setFrame(preset.frame)
    setPadding(preset.padding)
    setCornerRadius(preset.cornerRadius)
    showToast(`${preset.label} applied`)
    setPresetsOpen(false)
  }

  return (
    <>
      <div
        className="frosted-pill"
        style={{
          position: 'absolute',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '4px 6px',
        }}
      >
        {/* Canvas size pills */}
        {CANVAS_SIZES.map((size) => {
          const active = aspectRatio === size.id
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => setAspectRatio(size.id)}
              aria-pressed={active}
              aria-label={`${size.label} canvas size`}
              style={pillBtnStyle(active)}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' } }}
            >
              {size.label}
            </button>
          )
        })}

        <div style={separatorStyle} />

        {/* Examples / Presets */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setPresetsOpen(!presetsOpen)}
                aria-label="Style presets"
                style={{
                  ...iconBtnStyle,
                  padding: '5px 10px',
                  gap: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              />
            }
          >
            <LayoutGrid size={14} aria-hidden="true" />
            Examples
          </TooltipTrigger>
          <TooltipContent side="top">Style presets</TooltipContent>
        </Tooltip>

        <div style={separatorStyle} />

        {/* Undo */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                aria-label="Undo"
                style={{ ...iconBtnStyle, opacity: 0.4, cursor: 'default' }}
              />
            }
          >
            <Undo2 size={15} aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="top">Undo · ⌘Z</TooltipContent>
        </Tooltip>

        {/* Redo */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                aria-label="Redo"
                style={{ ...iconBtnStyle, opacity: 0.4, cursor: 'default' }}
              />
            }
          >
            <Redo2 size={15} aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="top">Redo · ⌘⇧Z</TooltipContent>
        </Tooltip>
      </div>

      {/* Presets gallery modal */}
      {presetsOpen && (
        <>
          <div
            onClick={() => setPresetsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 60,
            }}
          />
          <div
            className="frosted-pill"
            style={{
              position: 'absolute',
              bottom: '68px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 70,
              padding: '12px',
              width: '320px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '10px', padding: '0 4px' }}>
              Style presets
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {STYLE_PRESETS.map((p) => {
                const locked = !proUnlocked
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => locked ? openCheckout() : applyPreset(p)}
                    aria-label={locked ? `${p.label} — Pro only` : `Apply ${p.label}`}
                    style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      background: p.previewGradient,
                      borderRadius: '8px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      opacity: locked ? 0.6 : 1,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '0 0 5px',
                      transition: 'opacity 150ms var(--ease-out), transform 150ms var(--ease-out)',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => { if (!locked) e.currentTarget.style.transform = 'scale(1.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#FFFFFF', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                      {p.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
