import { useEffect, useRef, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS, ASPECT_RATIO_PRESETS } from '@/lib/presets'
import { DropZone } from './DropZone'
import { FrameOverlay } from './FrameOverlay'
import { useImageUpload } from '@/hooks/useImageUpload'

export function Canvas() {
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const background = useEditorStore((s) => s.background)
  const hoveredBackground = useEditorStore((s) => s.hoveredBackground)
  const padding = useEditorStore((s) => s.padding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const shadow = useEditorStore((s) => s.shadow)
  const frame = useEditorStore((s) => s.frame)
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const reset = useEditorStore((s) => s.reset)
  const shuffleCount = useEditorStore((s) => s.shuffleCount)
  const isDemoMode = useEditorStore((s) => s.isDemoMode)
  const isLoading = useEditorStore((s) => s.isLoading)

  const { handleFile } = useImageUpload()
  const [popping, setPopping] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const prevShuffle = useRef(shuffleCount)
  const loaderTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (shuffleCount > prevShuffle.current) {
      setPopping(true)
      const timer = setTimeout(() => setPopping(false), 200)
      prevShuffle.current = shuffleCount
      return () => clearTimeout(timer)
    }
  }, [shuffleCount])

  // Loading spinner delay (only show if >200ms)
  useEffect(() => {
    if (isLoading) {
      loaderTimer.current = setTimeout(() => setShowLoader(true), 200)
    } else {
      clearTimeout(loaderTimer.current)
      setShowLoader(false)
    }
    return () => clearTimeout(loaderTimer.current)
  }, [isLoading])

  // Canvas-level drag handlers
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
    transition: 'background 600ms ease, transform 200ms ease',
    transform: popping ? 'scale(1.02)' : 'scale(1)',
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
    transition: 'background 0.2s, outline 0.2s',
    position: 'relative',
  }

  if (!imageUrl) {
    return (
      <div
        style={workspaceStyle}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {showLoader && <LoadingSpinner />}
        <DropZone isDragOver={isDragOver} />
      </div>
    )
  }

  return (
    <div
      style={workspaceStyle}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {showLoader && <LoadingSpinner />}

      {/* Demo mode banner */}
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
          ✦ Demo mode — drop your screenshot to start
        </div>
      )}

      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <div id="export-canvas" style={canvasStyle}>
          <div style={{ position: 'relative' }}>
            <FrameOverlay frame={frame} />
            <img
              src={imageUrl}
              alt="Screenshot preview"
              style={{
                display: 'block',
                maxWidth: '100%',
                borderRadius: frameRadius > 0 ? `${frameRadius}px` : `${cornerRadius}px`,
                boxShadow: shadowStyle,
                paddingTop: framePaddingTop > 0 ? `${framePaddingTop}px` : undefined,
              }}
            />
          </div>
        </div>
        {/* Clear button */}
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
                  width: '24px',
                  height: '24px',
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
                  transition: 'all 0.15s',
                  outline: 'none',
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
                }}
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

function LoadingSpinner() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 25,
        opacity: 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div
        style={{
          width: '20px',
          height: '20px',
          border: '2px solid var(--color-app-border)',
          borderTopColor: 'var(--color-app-accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  )
}
