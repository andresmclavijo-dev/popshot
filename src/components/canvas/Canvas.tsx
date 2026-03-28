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

  const shadowStyle = SHADOW_PRESETS.find((p) => p.id === shadow)?.style ?? ''
  const ratioPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === aspectRatio)

  const framePaddingTop = frame.startsWith('macos') ? 36 : 0
  const frameRadius = frame === 'iphone' ? 50 : frame !== 'none' ? 10 : 0

  const canvasStyle: React.CSSProperties = {
    background: background.type === 'transparent' ? 'transparent' : background.value,
    padding: `${padding}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(ratioPreset?.width
      ? { width: `${ratioPreset.width}px`, height: `${ratioPreset.height}px` }
      : {}),
  }

  if (!imageUrl) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#E8E8E6',
          padding: 'var(--space-8)',
        }}
      >
        <DropZone />
      </div>
    )
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-page)',
        overflow: 'auto',
        padding: 'var(--space-8)',
      }}
    >
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
    </div>
  )
}
