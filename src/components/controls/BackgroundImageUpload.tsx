import { useCallback, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { useEditorStore } from '@/store/useEditorStore'

export function BackgroundImageUpload() {
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl)
  const backgroundImageBlur = useEditorStore((s) => s.backgroundImageBlur)
  const setBackgroundImageUrl = useEditorStore((s) => s.setBackgroundImageUrl)
  const setBackgroundImageBlur = useEditorStore((s) => s.setBackgroundImageBlur)
  const setBackground = useEditorStore((s) => s.setBackground)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setBackgroundImageUrl(dataUrl)
      setBackground({ type: 'image', value: 'image' })
    }
    reader.readAsDataURL(file)
  }, [setBackgroundImageUrl, setBackground])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const clearImage = useCallback(() => {
    setBackgroundImageUrl(null)
    setBackgroundImageBlur(0)
  }, [setBackgroundImageUrl, setBackgroundImageBlur])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
      <span style={{ fontSize: '12px', color: '#717171', fontWeight: 500 }}>
        Background image
      </span>

      {!backgroundImageUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          style={{
            height: '48px',
            border: '1px dashed var(--color-border-input)',
            borderRadius: '8px',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            fontFamily: 'inherit',
            transition: 'border-color 100ms var(--ease-out)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#222222' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-input)' }}
        >
          <Upload size={14} aria-hidden="true" />
          Drop or click to upload
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid var(--color-border-input)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', flex: 1 }}>
            Image set
          </span>
          <button
            type="button"
            onClick={clearImage}
            aria-label="Remove background image"
            style={{
              width: '24px',
              height: '24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-secondary)',
              padding: 0,
            }}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {backgroundImageUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Blur</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{backgroundImageBlur}px</span>
          </div>
          <Slider
            value={[backgroundImageBlur]}
            onValueChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val
              setBackgroundImageBlur(v)
            }}
            min={0}
            max={40}
            step={1}
            aria-label="Background image blur"
          />
        </div>
      )}
    </div>
  )
}
