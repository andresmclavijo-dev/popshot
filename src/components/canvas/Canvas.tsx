import { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS, ASPECT_RATIO_PRESETS } from '@/lib/presets'
import { isBackgroundDark } from '@/lib/utils'
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
  const isDemoMode = useEditorStore((s) => s.isDemoMode)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)

  const { handleFile } = useImageUpload()
  const setImageLoaded = useEditorStore((s) => s.setImageLoaded)
  const [popKey, setPopKey] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const prevShuffle = useRef(lastShuffle)
  const canvasRef = useRef<HTMLDivElement>(null)

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

  const displayBg = hoveredBackground ?? background
  const shadowStyle = SHADOW_PRESETS.find((p) => p.id === shadow)?.style ?? ''
  const ratioPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === aspectRatio)
  const framePaddingTop = frame.startsWith('macos') ? 28 : 0
  const frameRadius = frame === 'iphone' ? 50 : frame !== 'none' ? 10 : 0

  const canvasStyle: React.CSSProperties = {
    background: displayBg.type === 'transparent' ? 'transparent' : displayBg.value,
    padding: `${padding}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'background 200ms var(--ease-out)',
    animation: popKey > 0 ? 'canvasPop 300ms var(--ease-out)' : undefined,
    ...(ratioPreset?.width
      ? { width: `${ratioPreset.width}px`, height: `${ratioPreset.height}px` }
      : {}),
  }

  const workspaceStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDragOver ? 'rgba(108,71,255,0.03)' : '#E4E4E2',
    backgroundImage: isDragOver ? 'none' : 'radial-gradient(circle, #C8C8C4 1px, transparent 1px)',
    backgroundSize: '20px 20px',
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
      {isDemoMode && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            zIndex: 30,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Drop, paste, or click to use your screenshot
        </div>
      )}
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <div key={popKey} id="export-canvas" ref={canvasRef} style={canvasStyle}>
          <div style={{ position: 'relative' }}>
            <FrameOverlay frame={frame} />
            {/* imageUrl is base64 data URL — html-to-image captures this correctly.
                Never use blob: URLs — they fail silently in html-to-image exports. */}
            <img
              src={imageUrl}
              alt="Screenshot preview"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
              style={{
                display: 'block',
                maxWidth: '100%',
                borderRadius: frameRadius > 0 ? `${frameRadius}px` : `${cornerRadius}px`,
                boxShadow: shadowStyle,
                paddingTop: framePaddingTop > 0 ? `${framePaddingTop}px` : undefined,
              }}
            />
          </div>
          {/* Watermark — free users only */}
          {!proUnlocked && (
            <span
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '11px',
                fontWeight: 500,
                opacity: 0.5,
                color: isBackgroundDark(displayBg.value) ? '#FFFFFF' : '#1A1A18',
                letterSpacing: '0.02em',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              popshot.app
            </span>
          )}
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
