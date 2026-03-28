import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS, ASPECT_RATIO_PRESETS } from '@/lib/presets'
import { DropZone } from './DropZone'
import { FrameOverlay } from './FrameOverlay'

export function Canvas() {
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const background = useEditorStore((s) => s.background)
  const padding = useEditorStore((s) => s.padding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const shadow = useEditorStore((s) => s.shadow)
  const frame = useEditorStore((s) => s.frame)
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const reset = useEditorStore((s) => s.reset)
  const shuffleCount = useEditorStore((s) => s.shuffleCount)

  const [popping, setPopping] = useState(false)
  const prevShuffle = useRef(shuffleCount)

  useEffect(() => {
    if (shuffleCount > prevShuffle.current) {
      setPopping(true)
      const timer = setTimeout(() => setPopping(false), 200)
      prevShuffle.current = shuffleCount
      return () => clearTimeout(timer)
    }
  }, [shuffleCount])

  const shadowStyle = SHADOW_PRESETS.find((p) => p.id === shadow)?.style ?? ''
  const ratioPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === aspectRatio)

  const framePaddingTop = frame.startsWith('macos') ? 28 : 0
  const frameRadius = frame === 'iphone' ? 50 : frame !== 'none' ? 10 : 0

  const canvasStyle: React.CSSProperties = {
    background: background.type === 'transparent' ? 'transparent' : background.value,
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
    background: '#E4E4E2',
    backgroundImage: 'radial-gradient(circle, #C8C8C4 1px, transparent 1px)',
    backgroundSize: '20px 20px',
    overflow: 'auto',
    padding: 'var(--space-8)',
  }

  if (!imageUrl) {
    return (
      <div style={workspaceStyle}>
        <DropZone />
      </div>
    )
  }

  return (
    <div style={workspaceStyle}>
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
        <button
          type="button"
          onClick={reset}
          aria-label="Clear image"
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
        >
          <X size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
