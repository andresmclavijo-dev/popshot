import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

export function DropZone({ isDragOver = false }: { isDragOver?: boolean }) {
  const { handleFile, isDragging, setIsDragging } = useImageUpload()
  const dragging = isDragging || isDragOver
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [setIsDragging])
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [setIsDragging])
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile, setIsDragging])

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files[0]
      if (file && file.type.startsWith('image/')) handleFile(file)
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [handleFile])

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '320px',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 400ms var(--ease-out), transform 400ms var(--ease-out)',
      }}
    >
      {/* Drop zone card */}
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          padding: '48px 40px',
          border: dragging ? '2px solid var(--color-app-accent)' : '1.5px dashed #DDDDDD',
          borderRadius: '16px',
          background: dragging ? 'rgba(124, 93, 250, 0.04)' : 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          transition: 'border 150ms var(--ease-out), background 150ms var(--ease-out)',
          maxWidth: '320px',
          width: '100%',
        }}
      >
        <div style={{ animation: mounted ? 'iconPulse 1.8s ease-in-out 3' : 'none' }}>
          <ImagePlus
            size={36}
            strokeWidth={1.5}
            style={{
              color: dragging ? 'var(--color-app-accent)' : '#BBBBBB',
              transition: 'color 150ms var(--ease-out)',
            }}
            aria-hidden="true"
          />
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '17px', fontWeight: 600, color: '#222222', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {dragging ? 'Drop to beautify' : 'Make your screenshots pop'}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 400, color: '#717171', lineHeight: 1.4 }}>
            Drop, paste, or click to start
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
          aria-label="Browse and upload a screenshot"
          style={{
            height: '36px',
            padding: '0 20px',
            background: 'var(--color-app-accent)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            marginTop: '4px',
            transition: 'background 150ms var(--ease-out), transform 100ms var(--ease-out)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-app-accent-hover)'; e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-app-accent)'; e.currentTarget.style.transform = 'scale(1)' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.02)' }}
        >
          Browse files
        </button>

        <span style={{ fontSize: '12px', color: '#AAAAAA', marginTop: '-4px' }}>
          or paste with{' '}
          <kbd style={{
            background: '#F5F5F5',
            border: '1px solid #DDDDDD',
            borderRadius: '4px',
            padding: '1px 5px',
            fontSize: '11px',
            fontFamily: 'system-ui',
          }}>&#8984;V</kbd>
        </span>
      </div>

      <span style={{ marginTop: '16px', fontSize: '12px', color: '#AAAAAA', letterSpacing: '0.01em' }}>
        PNG, JPG, or WebP
      </span>

      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '20px',
      }}>
        {['Product launches', 'Case studies', 'Social posts', 'Portfolio'].map(tag => (
          <span
            key={tag}
            style={{
              fontSize: '12px',
              color: '#717171',
              background: '#F0F0EE',
              border: '1px solid #E2E2E0',
              borderRadius: '100px',
              padding: '4px 12px',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFile(file) }}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  )
}
