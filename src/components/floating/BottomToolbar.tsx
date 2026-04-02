import { useState } from 'react'
import { LayoutGrid, Undo2, Redo2, Minus, Plus } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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

const ZOOM_PRESETS = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
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

const menuItemStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 500,
  fontFamily: 'inherit',
  background: 'transparent',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left',
  color: 'var(--color-text-primary)',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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
  const zoom = useEditorStore((s) => s.zoom)
  const setZoom = useEditorStore((s) => s.setZoom)
  const requestFit = useEditorStore((s) => s.requestFit)
  const [presetsOpen, setPresetsOpen] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)

  const applyPreset = (preset: typeof STYLE_PRESETS[number]) => {
    setBackground(preset.background)
    setShadow(preset.shadow)
    setFrame(preset.frame)
    setPadding(preset.padding)
    setCornerRadius(preset.cornerRadius)
    showToast(`${preset.label} applied`)
    setPresetsOpen(false)
  }

  const zoomPercent = Math.round(zoom * 100)

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
        {/* Zoom controls */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setZoom(Math.max(0.25, zoom - 0.1))}
                aria-label="Zoom out"
                style={iconBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              />
            }
          >
            <Minus size={14} aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="top">Zoom out · ⌘-</TooltipContent>
        </Tooltip>

        {/* Zoom level pill with popover */}
        <Popover open={zoomOpen} onOpenChange={setZoomOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                aria-label={`Zoom ${zoomPercent}%`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px 4px',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  color: 'var(--color-text-secondary)',
                  borderRadius: '8px',
                  transition: 'all 100ms var(--ease-out)',
                  minWidth: '48px',
                  textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1.3,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              />
            }
          >
            {zoomPercent}%
          </PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={8}
            align="center"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '4px',
              width: 'auto',
              minWidth: '140px',
            }}
          >
            {ZOOM_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => { setZoom(preset.value); setZoomOpen(false) }}
                style={{
                  ...menuItemStyle,
                  fontWeight: Math.abs(zoom - preset.value) < 0.01 ? 600 : 500,
                  color: Math.abs(zoom - preset.value) < 0.01 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                {preset.label}
                {Math.abs(zoom - preset.value) < 0.01 && <span style={{ fontSize: '10px' }}>&#10003;</span>}
              </button>
            ))}
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
            <button
              type="button"
              onClick={() => { requestFit(); setZoomOpen(false) }}
              style={menuItemStyle}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              Fit to screen
              <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>⌘0</span>
            </button>
            <button
              type="button"
              onClick={() => { setZoom(1); setZoomOpen(false) }}
              style={menuItemStyle}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              Actual size
              <span style={{ fontSize: '10px', color: 'var(--color-text-tertiary)' }}>⌘1</span>
            </button>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setZoom(Math.min(4, zoom + 0.1))}
                aria-label="Zoom in"
                style={iconBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              />
            }
          >
            <Plus size={14} aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="top">Zoom in · ⌘+</TooltipContent>
        </Tooltip>

        <div style={separatorStyle} />

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
