import { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS, ASPECT_RATIO_PRESETS } from '@/lib/presets'
import { DropZone } from './DropZone'
import { FrameOverlay } from './FrameOverlay'
import { CanvasLoading } from './CanvasLoading'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { Background } from '@/types'

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
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl)
  const backgroundImageBlur = useEditorStore((s) => s.backgroundImageBlur)

  const { handleFile } = useImageUpload()
  const setImageLoaded = useEditorStore((s) => s.setImageLoaded)
  const imgRef = useRef<HTMLImageElement>(null)
  const [popKey, setPopKey] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const prevShuffle = useRef(lastShuffle)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setImageLoaded(false)
  }, [imageUrl, setImageLoaded])

  useEffect(() => {
    if (lastShuffle > prevShuffle.current) {
      setPopKey((k) => k + 1)
      prevShuffle.current = lastShuffle
    }
  }, [lastShuffle])

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
    center: { justifyContent: 'center', alignItems: 'center' },
    top: { justifyContent: 'center', alignItems: 'flex-start' },
    bottom: { justifyContent: 'center', alignItems: 'flex-end' },
    'top-left': { justifyContent: 'flex-start', alignItems: 'flex-start' },
    'top-right': { justifyContent: 'flex-end', alignItems: 'flex-start' },
  }
  const pos = positionMap[imagePosition] ?? positionMap.center

  const displayBg = hoveredBackground ?? background
  const shadowStyle = SHADOW_PRESETS.find((p) => p.id === shadow)?.style ?? ''
  const ratioPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === aspectRatio)
  const framePaddingTop = frame.startsWith('macos') ? 28 : 0
  const frameRadius = frame === 'iphone' ? 50 : frame !== 'none' ? 10 : 0

  const isImageBg = displayBg.type === 'image' && backgroundImageUrl
  const canvasStyle: React.CSSProperties = {
    background: isImageBg ? 'transparent' : displayBg.type === 'transparent' ? 'transparent' : displayBg.value,
    padding: `${padding}px`,
    display: 'inline-flex',
    alignItems: pos.alignItems as React.CSSProperties['alignItems'],
    justifyContent: pos.justifyContent as React.CSSProperties['justifyContent'],
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 200ms var(--ease-out)',
    animation: popKey > 0 ? 'canvasPop 300ms var(--ease-out)' : undefined,
    ...(ratioPreset?.width
      ? { width: `${ratioPreset.width}px`, height: `${ratioPreset.height}px` }
      : {}),
  }

  const workspaceStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDragOver ? 'rgba(108,71,255,0.03)' : 'var(--color-bg-page)',
    overflow: 'auto',
    padding: 'var(--space-8)',
    outline: isDragOver ? '2px solid var(--color-app-accent)' : 'none',
    outlineOffset: '-2px',
    transition: 'background 100ms var(--ease-out), outline 100ms var(--ease-out)',
    position: 'relative',
  }

  if (!imageUrl) {
    return (
      <div style={workspaceStyle} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        <CanvasLoading />
        <DropZone isDragOver={isDragOver} />
      </div>
    )
  }

  return (
    <div style={workspaceStyle} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <CanvasLoading />
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <div key={popKey} id="export-canvas" ref={canvasRef} style={canvasStyle}>
          {/* Background image layer */}
          {isImageBg && (
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
          )}
          <div style={{ position: 'relative', borderRadius: frameRadius > 0 ? `${frameRadius}px` : `${cornerRadius}px`, overflow: 'hidden' }}>
            <FrameOverlay frame={frame} />
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Screenshot preview"
              onLoad={(e) => {
                const img = e.target as HTMLImageElement
                console.log('[Popshot] Image loaded:', img.naturalWidth, 'x', img.naturalHeight)
                setImageLoaded(true)
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
                borderRadius: frameRadius > 0 ? `${frameRadius}px` : `${cornerRadius}px`,
                boxShadow: shadowStyle,
                paddingTop: framePaddingTop > 0 ? `${framePaddingTop}px` : undefined,
              }}
            />
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={reset}
                aria-label="Remove image"
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
  )
}
