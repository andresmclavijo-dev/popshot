import { useState } from 'react'
import { Undo2, Redo2, Minus, Plus } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEditorStore } from '@/store/useEditorStore'
import type { AspectRatioType } from '@/types'

const CANVAS_SIZES: { id: AspectRatioType; label: string; dims?: string }[] = [
  { id: 'free', label: 'Free' },
  { id: '16:9', label: '16:9', dims: '1280 \u00d7 720' },
  { id: '4:3', label: '4:3', dims: '1024 \u00d7 768' },
  { id: '1:1', label: '1:1', dims: '1080 \u00d7 1080' },
  { id: '4:5' as AspectRatioType, label: '4:5', dims: '1080 \u00d7 1350' },
]

const ZOOM_PRESETS = [
  { label: '25%', value: 0.25 },
  { label: '50%', value: 0.5 },
  { label: '75%', value: 0.75 },
  { label: '100%', value: 1 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
]

const sep: React.CSSProperties = { width: '1px', height: '20px', background: 'var(--ps-border)', flexShrink: 0, margin: '0 4px' }

const pillBtn = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--ps-text-primary)' : 'transparent',
  color: active ? 'var(--ps-text-on-dark)' : 'var(--ps-text-secondary)',
  border: 'none', cursor: 'pointer', padding: '5px 12px',
  fontSize: '12px', fontWeight: 500, fontFamily: 'inherit',
  borderRadius: 'var(--ps-radius-md)', transition: 'all 150ms ease-out',
  whiteSpace: 'nowrap' as const, lineHeight: '1.3',
})

const iconBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', cursor: 'pointer',
  padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 'var(--ps-radius-sm)', color: 'var(--ps-text-secondary)',
  transition: 'all 150ms ease-out',
}

const menuItem: React.CSSProperties = {
  padding: '6px 12px', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit',
  background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer',
  textAlign: 'left', color: 'var(--ps-text-primary)', width: '100%',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
}

export function BottomToolbar() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)
  const zoom = useEditorStore((s) => s.zoom)
  const setZoom = useEditorStore((s) => s.setZoom)
  const requestFit = useEditorStore((s) => s.requestFit)
  const [zoomOpen, setZoomOpen] = useState(false)

  const zoomPercent = Math.round(zoom * 100)

  return (
    <div className="frosted-pill" style={{
      position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 10, display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 6px',
    }}>
      {/* Zoom */}
      <Tooltip>
        <TooltipTrigger render={
          <button type="button" onClick={() => setZoom(Math.max(0.25, zoom - 0.1))} aria-label="Zoom out" style={iconBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }} />
        }><Minus size={14} aria-hidden="true" /></TooltipTrigger>
        <TooltipContent side="top">Zoom out</TooltipContent>
      </Tooltip>

      <Popover open={zoomOpen} onOpenChange={setZoomOpen}>
        <PopoverTrigger render={
          <button type="button" aria-label={`Zoom ${zoomPercent}%`}
            style={{ ...iconBtn, padding: '5px 4px', minWidth: '48px', textAlign: 'center', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }} />
        }>{zoomPercent}%</PopoverTrigger>
        <PopoverContent side="top" sideOffset={8} align="center" style={{ display: 'flex', flexDirection: 'column', padding: '4px', width: 'auto', minWidth: '140px' }}>
          {ZOOM_PRESETS.map((p) => (
            <button key={p.value} type="button" onClick={() => { setZoom(p.value); setZoomOpen(false) }}
              style={{ ...menuItem, fontWeight: Math.abs(zoom - p.value) < 0.01 ? 600 : 500, color: Math.abs(zoom - p.value) < 0.01 ? 'var(--ps-text-primary)' : 'var(--ps-text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
              {p.label}
            </button>
          ))}
          <div style={{ height: '1px', background: 'var(--ps-border)', margin: '4px 0' }} />
          <button type="button" onClick={() => { requestFit(); setZoomOpen(false) }} style={menuItem}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
            Fit to screen <span style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)' }}>\u2318 0</span>
          </button>
          <button type="button" onClick={() => { setZoom(1); setZoomOpen(false) }} style={menuItem}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
            Actual size <span style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)' }}>\u2318 1</span>
          </button>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger render={
          <button type="button" onClick={() => setZoom(Math.min(4, zoom + 0.1))} aria-label="Zoom in" style={iconBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }} />
        }><Plus size={14} aria-hidden="true" /></TooltipTrigger>
        <TooltipContent side="top">Zoom in</TooltipContent>
      </Tooltip>

      <div style={sep} />

      {/* Ratio pills */}
      {CANVAS_SIZES.map((size) => {
        const active = aspectRatio === size.id
        return (
          <Tooltip key={size.id}>
            <TooltipTrigger render={
              <button type="button" onClick={() => setAspectRatio(size.id)} aria-pressed={active} aria-label={`${size.label} canvas`}
                style={pillBtn(active)}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' } }} />
            }>{size.label}</TooltipTrigger>
            {size.dims && <TooltipContent side="top">{size.dims}</TooltipContent>}
          </Tooltip>
        )
      })}

      <div style={sep} />

      {/* Undo/Redo */}
      <Tooltip>
        <TooltipTrigger render={
          <button type="button" aria-label="Undo" onClick={() => useEditorStore.getState().undo()}
            style={{ ...iconBtn, opacity: useEditorStore.getState().canUndo() ? 1 : 0.35, cursor: useEditorStore.getState().canUndo() ? 'pointer' : 'default' }}
            onMouseEnter={(e) => { if (useEditorStore.getState().canUndo()) { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }} />
        }><Undo2 size={15} aria-hidden="true" /></TooltipTrigger>
        <TooltipContent side="top">Undo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={
          <button type="button" aria-label="Redo" onClick={() => useEditorStore.getState().redo()}
            style={{ ...iconBtn, opacity: useEditorStore.getState().canRedo() ? 1 : 0.35, cursor: useEditorStore.getState().canRedo() ? 'pointer' : 'default' }}
            onMouseEnter={(e) => { if (useEditorStore.getState().canRedo()) { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }} />
        }><Redo2 size={15} aria-hidden="true" /></TooltipTrigger>
        <TooltipContent side="top">Redo</TooltipContent>
      </Tooltip>
    </div>
  )
}
