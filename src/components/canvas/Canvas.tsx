import { useEditorStore } from '@/store/useEditorStore'
import { SHADOW_PRESETS, ASPECT_RATIO_PRESETS } from '@/lib/presets'
import { DropZone } from './DropZone'

export function Canvas() {
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const background = useEditorStore((s) => s.background)
  const padding = useEditorStore((s) => s.padding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const shadow = useEditorStore((s) => s.shadow)
  const aspectRatio = useEditorStore((s) => s.aspectRatio)

  const shadowStyle = SHADOW_PRESETS.find((p) => p.id === shadow)?.style ?? ''
  const ratioPreset = ASPECT_RATIO_PRESETS.find((p) => p.id === aspectRatio)

  const canvasBackground =
    background.type === 'transparent'
      ? 'transparent'
      : background.type === 'gradient'
        ? background.value
        : background.value

  const canvasStyle: React.CSSProperties = {
    background: canvasBackground,
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
          background: 'var(--color-bg-page)',
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
        <img
          src={imageUrl}
          alt="Screenshot preview"
          style={{
            display: 'block',
            maxWidth: '100%',
            borderRadius: `${cornerRadius}px`,
            boxShadow: shadowStyle,
          }}
        />
        {/* FRAME OVERLAY — coming next */}
      </div>
    </div>
  )
}
