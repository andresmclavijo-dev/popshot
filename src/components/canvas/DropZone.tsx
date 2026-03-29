import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

function ExampleThumbnail({
  gradient,
  rotate,
  zIndex,
  offsetX,
}: {
  gradient: string
  rotate: number
  zIndex: number
  offsetX: number
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: '120px',
        height: '80px',
        borderRadius: '10px',
        background: gradient,
        transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
        boxShadow: zIndex > 1
          ? '0 8px 24px rgba(0,0,0,0.22)'
          : '0 4px 16px rgba(0,0,0,0.14)',
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 300ms var(--ease-out)',
      }}
    >
      <div
        style={{
          width: '68%',
          height: '55%',
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '4px',
        }}
      />
    </div>
  )
}

export function DropZone({ isDragOver = false }: { isDragOver?: boolean }) {
  const { handleFile, isDragging, setIsDragging } = useImageUpload()
  const dragging = isDragging || isDragOver
  const inputRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
    },
    [setIsDragging],
  )

  const onDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
    },
    [setIsDragging],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile, setIsDragging],
  )

  const onClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files[0]
      if (file && file.type.startsWith('image/')) {
        handleFile(file)
      }
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [handleFile])

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        padding: 'var(--space-8)',
      }}
    >
      {/* Fan thumbnails */}
      <div
        aria-hidden="true"
        style={{
          position: 'relative',
          width: '240px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ExampleThumbnail
          gradient="linear-gradient(135deg, #667eea, #764ba2)"
          rotate={isHovered || dragging ? -6 : -3}
          zIndex={1}
          offsetX={isHovered || dragging ? -64 : -56}
        />
        <ExampleThumbnail
          gradient="linear-gradient(135deg, #f093fb, #f5576c)"
          rotate={0}
          zIndex={3}
          offsetX={0}
        />
        <ExampleThumbnail
          gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
          rotate={isHovered || dragging ? 6 : 3}
          zIndex={1}
          offsetX={isHovered || dragging ? 64 : 56}
        />
      </div>

      {/* Upload zone */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          border: `1.5px dashed ${dragging ? 'var(--color-app-accent)' : 'var(--color-app-border-strong)'}`,
          borderRadius: '16px',
          padding: '32px 48px',
          background: dragging ? 'var(--color-app-accent-subtle)' : 'transparent',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: dragging ? 'var(--color-app-accent)' : 'var(--color-bg-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, transform 0.2s',
            transform: dragging ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <ImagePlus
            size={22}
            style={{
              color: dragging ? '#FFFFFF' : 'var(--color-text-secondary)',
              transition: 'color 0.2s',
            }}
            aria-hidden="true"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            {dragging ? 'Drop to beautify' : 'Drop a screenshot to start'}
          </span>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--color-text-tertiary)',
            }}
          >
            PNG, JPG, or WebP
          </span>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onClick}
          aria-label="Browse and upload a screenshot"
          style={{
            height: '40px',
            padding: '0 24px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'inherit',
            color: '#FFFFFF',
            background: '#6C47FF',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.15s, transform 0.1s, box-shadow 0.15s',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#5835EE'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(108,71,255,0.35)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#6C47FF'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'none'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px #FFFFFF, 0 0 0 4px #6C47FF'
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Browse files
        </button>

        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
          }}
        >
          or paste with <kbd style={{
            fontSize: '11px',
            fontFamily: 'inherit',
            padding: '1px 5px',
            borderRadius: '4px',
            border: '1px solid var(--color-app-border)',
            background: 'var(--color-bg-card)',
            color: 'var(--color-text-secondary)',
          }}>&#8984;V</kbd>
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  )
}
