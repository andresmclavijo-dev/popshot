import { useCallback, useEffect, useRef, useState } from 'react'
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
      // Check files first (drag-drop pastes)
      const file = e.clipboardData?.files[0]
      if (file && file.type.startsWith('image/')) {
        handleFile(file)
        return
      }
      // Check items for macOS screenshots (Cmd+Shift+3/4) and copied images
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const f = item.getAsFile()
          if (f) {
            handleFile(f)
            break
          }
        }
      }
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
        {/* Before / After visual */}
        {!dragging && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} aria-hidden="true">
            {/* Before: raw screenshot */}
            <div style={{
              width: '80px', height: '56px', borderRadius: '4px',
              background: '#FFF', border: '1px solid #E0E0E0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
            }}>
              <div style={{ width: '60px', height: '40px', borderRadius: '2px', background: '#F0F0F0', border: '1px solid #DDD' }} />
              <span style={{ position: 'absolute', bottom: '2px', right: '4px', fontSize: '8px', color: '#999', fontWeight: 500 }}>raw</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: '#CCC' }}>
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* After: beautified */}
            <div style={{
              width: '80px', height: '56px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              padding: '8px',
            }}>
              <div style={{ width: '56px', height: '36px', borderRadius: '3px', background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '17px', fontWeight: 600, color: '#222222', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
            {dragging ? 'Drop to beautify' : 'Make your screenshots beautiful'}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 400, color: '#6b6b6b', lineHeight: 1.4 }}>
            {dragging ? 'Release to upload' : 'Paste, drop, or upload — then export in seconds'}
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

        <span style={{ fontSize: '12px', color: '#6b6b6b' }}>
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
