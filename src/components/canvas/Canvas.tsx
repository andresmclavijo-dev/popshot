import { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS, ASPECT_RATIO_PRESETS } from '@/lib/presets'
import { TEMPLATES } from '@/data/templates'
import { DropZone } from './DropZone'
import { FrameOverlay, getFrameTopPadding, getFrameRadius } from './FrameOverlay'
import { CanvasLoading } from './CanvasLoading'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useZoom } from '@/hooks/useZoom'
import type { Background, WatermarkPosition } from '@/types'

function wmPositionStyle(pos: WatermarkPosition): React.CSSProperties {
  const inset = '16px'
  const map: Record<WatermarkPosition, React.CSSProperties> = {
    'top-left': { top: inset, left: inset },
    'top-center': { top: inset, left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: inset, right: inset },
    'center-left': { top: '50%', left: inset, transform: 'translateY(-50%)' },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    'center-right': { top: '50%', right: inset, transform: 'translateY(-50%)' },
    'bottom-left': { bottom: inset, left: inset },
    'bottom-center': { bottom: inset, left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: inset, right: inset },
  }
  return map[pos]
}

export function Canvas({ hoveredBackground }: { hoveredBackground: Background | null }) {
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const background = useEditorStore((s) => s.background)
  const padding = useEditorStore((s) => s.padding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const shadow = useEditorStore((s) => s.shadow)
  const frame = useEditorStore((s) => s.frame)
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const reset = useEditorStore((s) => s.reset)
  const lastShuffle = useEditorStore((s) => s.lastShuffle)
  const imagePosition = useEditorStore((s) => s.imagePosition)
  const imageOffsetX = useEditorStore((s) => s.imageOffsetX)
  const imageOffsetY = useEditorStore((s) => s.imageOffsetY)
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl)
  const backgroundImageBlur = useEditorStore((s) => s.backgroundImageBlur)
  const requestFit = useEditorStore((s) => s.requestFit)
  const activeTemplate = useEditorStore((s) => s.activeTemplate)
  const badgeEnabled = useEditorStore((s) => s.badgeEnabled)
  const watermarkUrl = useEditorStore((s) => s.watermarkUrl)
  const watermarkPosition = useEditorStore((s) => s.watermarkPosition)
  const watermarkOpacity = useEditorStore((s) => s.watermarkOpacity)
  const watermarkScale = useEditorStore((s) => s.watermarkScale)

  const { handleFile } = useImageUpload()
  const setImageLoaded = useEditorStore((s) => s.setImageLoaded)
  const imgRef = useRef<HTMLImageElement>(null)
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const [popKey, setPopKey] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const prevShuffle = useRef(lastShuffle)
  const canvasRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)

  const { zoom } = useZoom(workspaceRef, canvasRef)

  useEffect(() => {
    setImageLoaded(false)
  }, [imageUrl, setImageLoaded])

  useEffect(() => {
    if (lastShuffle > prevShuffle.current) {
      setPopKey((k) => k + 1)
      prevShuffle.current = lastShuffle
    }
  }, [lastShuffle])

  // Auto-fit when aspect ratio changes
  // Reset zoom to 100% (fitted) when ratio or template changes
  const setZoom = useEditorStore((s) => s.setZoom)
  const prevAspect = useRef(aspectRatio)
  const prevTemplate = useRef(activeTemplate)
  useEffect(() => {
    if (aspectRatio !== prevAspect.current || activeTemplate !== prevTemplate.current) {
      setZoom(1)
      prevAspect.current = aspectRatio
      prevTemplate.current = activeTemplate
    }
  }, [aspectRatio, activeTemplate, setZoom])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const positionMap: Record<string, { justifyContent: string; alignItems: string }> = {
    'top-left':     { justifyContent: 'flex-start', alignItems: 'flex-start' },
    'top':          { justifyContent: 'center',     alignItems: 'flex-start' },
    'top-right':    { justifyContent: 'flex-end',   alignItems: 'flex-start' },
    'left':         { justifyContent: 'flex-start', alignItems: 'center' },
    'center':       { justifyContent: 'center',     alignItems: 'center' },
    'right':        { justifyContent: 'flex-end',   alignItems: 'center' },
    'bottom-left':  { justifyContent: 'flex-start', alignItems: 'flex-end' },
    'bottom':       { justifyContent: 'center',     alignItems: 'flex-end' },
    'bottom-right': { justifyContent: 'flex-end',   alignItems: 'flex-end' },
  }
  const pos = positionMap[imagePosition] ?? positionMap.center

  const displayBg = hoveredBackground ?? background
  const shadowStyle = SHADOW_PRESETS.find((p) => p.id === shadow)?.style ?? ''
  const ratioPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === aspectRatio)
  const framePaddingTop = getFrameTopPadding(frame)
  const frameRadius = getFrameRadius(frame)

  // ── CANVAS SIZING — pure CSS approach ──
  const activeTempl = activeTemplate ? TEMPLATES.find(t => t.id === activeTemplate) : null
  const canvasW = activeTempl?.width ?? ratioPreset?.width ?? 800
  const canvasH = activeTempl?.height ?? ratioPreset?.height ?? 600

  const isImageBg = displayBg.type === 'image' && backgroundImageUrl
  const isTransparentBg = displayBg.type === 'transparent'
  const checkerboardBg = 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)'

  // Canvas element — CSS aspect-ratio + max constraints handle fitting
  const canvasStyle: React.CSSProperties = {
    aspectRatio: `${canvasW} / ${canvasH}`,
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    background: isImageBg ? 'transparent' : isTransparentBg ? 'transparent' : displayBg.value,
    ...(isTransparentBg && !isImageBg ? {
      backgroundImage: checkerboardBg,
      backgroundSize: '16px 16px',
      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
    } : {}),
    padding: `${padding}px`,
    display: 'inline-flex',
    alignItems: pos.alignItems as React.CSSProperties['alignItems'],
    justifyContent: pos.justifyContent as React.CSSProperties['justifyContent'],
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)',
    flexShrink: 0,
    transition: 'background 200ms var(--ease-out)',
    animation: popKey > 0 ? 'canvasPop 300ms var(--ease-out)' : undefined,
  }

  // Workspace — fills all space, padding creates safe zone, CSS handles contain
  const workspaceStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDragOver ? 'rgba(108,71,255,0.03)' : 'var(--ps-bg-page)',
    overflow: 'hidden',
    padding: '24px 32px 32px 32px',
    outline: isDragOver ? '2px solid var(--color-app-accent)' : 'none',
    outlineOffset: '-2px',
    transition: 'background 100ms var(--ease-out), outline 100ms var(--ease-out)',
  }

  if (!imageUrl) {
    return (
      <div ref={workspaceRef} className="canvas-workspace" role="main" style={workspaceStyle} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        <CanvasLoading />
        <DropZone isDragOver={isDragOver} />
      </div>
    )
  }

  return (
    <div ref={workspaceRef} className="canvas-workspace" role="main" style={workspaceStyle} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <CanvasLoading />
      {/* Zoom wrapper */}
      <div
        style={{
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: 'center center',
          transition: 'transform 150ms var(--ease-out)',
          display: 'inline-flex',
          position: 'relative',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <div
          style={{ position: 'relative', display: 'inline-flex' }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <div key={popKey} id="export-canvas" ref={canvasRef} style={canvasStyle}>
            {/* Background image layer — own overflow clip so canvas doesn't need it */}
            {isImageBg && (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: `-${backgroundImageBlur * 2}px`,
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: backgroundImageBlur > 0 ? `blur(${backgroundImageBlur}px)` : undefined,
                  }}
                />
              </div>
            )}
            {/* Shadow wrapper — offset via translate for bleed positioning */}
            <div style={{
              position: 'relative',
              borderRadius: frameRadius > 0 ? `${frameRadius}px` : `${cornerRadius}px`,
              boxShadow: shadowStyle,
              transform: (imageOffsetX || imageOffsetY) ? `translate(${imageOffsetX}px, ${imageOffsetY}px)` : undefined,
              transition: 'border-radius 200ms var(--ease-out), box-shadow 200ms var(--ease-out), transform 150ms ease-out',
            }}>
              <div style={{ borderRadius: 'inherit', overflow: 'hidden' }}>
                <FrameOverlay frame={frame} />
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Screenshot preview"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    console.log('[Popshot] Image loaded:', img.naturalWidth, 'x', img.naturalHeight)
                    setImageLoaded(true)
                    // Auto-fit on first load
                    requestAnimationFrame(() => requestFit())
                  }}
                  onError={(e) => {
                    console.error('[Popshot] Image load failed:', e)
                    setImageLoaded(false)
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                    paddingTop: framePaddingTop > 0 ? `${framePaddingTop}px` : '0px',
                    transition: 'padding-top 200ms var(--ease-out)',
                  }}
                />
              </div>
            </div>
          {/* Watermark overlay — on top of screenshot, below frame chrome z-index */}
          {watermarkUrl && (
            <div
              style={{
                position: 'absolute',
                ...wmPositionStyle(watermarkPosition),
                zIndex: 5,
                pointerEvents: 'none',
                opacity: watermarkOpacity / 100,
              }}
            >
              <img
                src={watermarkUrl}
                alt=""
                aria-hidden="true"
                style={{
                  display: 'block',
                  width: `${Math.round(watermarkScale * 100)}%`,
                  maxWidth: '40%',
                  height: 'auto',
                  userSelect: 'none',
                }}
              />
            </div>
          )}
          {/* Opt-in badge — only in export when enabled */}
          <div
            {...(badgeEnabled ? {} : { 'data-export-ignore': true })}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              zIndex: 10,
              pointerEvents: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.01em',
              lineHeight: 1,
              opacity: badgeEnabled ? 0.5 : 0,
              color: (() => {
                const bg = displayBg.value
                if (displayBg.type === 'transparent') return 'rgba(0,0,0,0.3)'
                if (displayBg.type === 'gradient') return 'rgba(255,255,255,0.5)'
                // Simple luminance check for solid colors
                if (bg.startsWith('#') && bg.length === 7) {
                  const r = parseInt(bg.slice(1, 3), 16)
                  const g = parseInt(bg.slice(3, 5), 16)
                  const b = parseInt(bg.slice(5, 7), 16)
                  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                  return lum > 0.5 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)'
                }
                return 'rgba(255,255,255,0.5)'
              })(),
            }}
          >
            popshot.app
          </div>
          </div>
          {/* Hover menu — Replace / Clear */}
          <div
            data-export-ignore
            style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 25,
              opacity: isImageHovered ? 1 : 0,
              pointerEvents: isImageHovered ? 'auto' : 'none',
              transition: 'opacity 150ms var(--ease-out)',
            }}
          >
            <div
              className="frosted-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '3px',
              }}
            >
              <button
                type="button"
                onClick={() => replaceInputRef.current?.click()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  color: 'var(--color-text-secondary)',
                  borderRadius: '14px',
                  transition: 'color 100ms var(--ease-out), background 100ms var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'rgba(0,0,0,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'transparent' }}
              >
                Replace
              </button>
              <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />
              <button
                type="button"
                onClick={reset}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  color: 'var(--color-text-secondary)',
                  borderRadius: '14px',
                  transition: 'color 100ms var(--ease-out), background 100ms var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.background = 'rgba(220,38,38,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'transparent' }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Hidden file input for replace */}
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = '' }}
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Remove image"
                  data-export-ignore
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-bg-panel)',
                    border: '1px solid var(--color-app-border)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    zIndex: 20,
                    transition: 'all 100ms var(--ease-out)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-danger)'
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.borderColor = 'var(--color-danger)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--color-bg-panel)'
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                    e.currentTarget.style.borderColor = 'var(--color-app-border)'
                    e.currentTarget.style.transform = 'none'
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)' }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
                />
              }
            >
              <X size={12} aria-hidden="true" />
            </TooltipTrigger>
            <TooltipContent>Remove image · ⌫</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
