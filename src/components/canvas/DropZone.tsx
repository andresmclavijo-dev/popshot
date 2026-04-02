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

  const loadDemo = useCallback(async () => {
    try {
      const res = await fetch('/demo.png')
      const blob = await res.blob()
      const file = new File([blob], 'demo.png', { type: 'image/png' })
      handleFile(file, true)
    } catch {
      // Silently fail if demo not available
    }
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
      {/* Drop zone area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '48px 40px',
          border: dragging ? '2px dashed var(--color-app-accent)' : '1.5px dashed rgba(0,0,0,0.12)',
          borderRadius: '20px',
          background: dragging ? 'rgba(124, 93, 250, 0.04)' : 'transparent',
          transition: 'border 150ms var(--ease-out), background 150ms var(--ease-out)',
          maxWidth: '360px',
          width: '100%',
        }}
      >
        <div style={{ animation: mounted ? 'iconPulse 1.8s ease-in-out 3' : 'none' }}>
          <ImagePlus
            size={40}
            strokeWidth={1.2}
            style={{
              color: dragging ? 'var(--color-app-accent)' : '#BBBBBB',
              transition: 'color 150ms var(--ease-out)',
            }}
            aria-hidden="true"
          />
        </div>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '17px', fontWeight: 600, color: '#222222', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {dragging ? 'Drop to beautify' : 'Drop your screenshot'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 400, color: '#999', lineHeight: 1.4 }}>
            PNG, JPG, or WebP
          </span>
        </div>

        {/* Frosted action pill */}
        <div
          className="frosted-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            padding: '4px',
          }}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            aria-label="Upload image"
            style={{
              background: '#222222',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '16px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'background 100ms var(--ease-out), transform 100ms var(--ease-out)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#333' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#222222'; e.currentTarget.style.transform = 'none' }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
          >
            Upload image
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); loadDemo() }}
            aria-label="Try demo"
            style={{
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: 'none',
              borderRadius: '16px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'color 100ms var(--ease-out), background 100ms var(--ease-out)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'transparent' }}
          >
            Try demo
          </button>
        </div>

        <span style={{ fontSize: '12px', color: '#BBB' }}>
          or paste with{' '}
          <kbd style={{
            background: '#F5F5F5',
            border: '1px solid #DDD',
            borderRadius: '4px',
            padding: '1px 5px',
            fontSize: '11px',
            fontFamily: 'system-ui',
          }}>&#8984;V</kbd>
        </span>
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
