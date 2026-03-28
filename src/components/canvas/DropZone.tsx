import { useCallback, useEffect, useRef } from 'react'
import { Upload } from 'lucide-react'
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
        borderRadius: '8px',
        background: gradient,
        transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
        boxShadow: zIndex > 1
          ? '0 6px 20px rgba(0,0,0,0.22)'
          : '0 4px 12px rgba(0,0,0,0.14)',
        zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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

export function DropZone() {
  const { handleFile, isDragging, setIsDragging } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)

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
    <button
      type="button"
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-label="Upload screenshot"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
        fontFamily: 'inherit',
        padding: 'var(--space-8)',
      }}
    >
      {/* Fan thumbnails */}
      <div
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
          rotate={-3}
          zIndex={1}
          offsetX={-56}
        />
        <ExampleThumbnail
          gradient="linear-gradient(135deg, #f093fb, #f5576c)"
          rotate={0}
          zIndex={3}
          offsetX={0}
        />
        <ExampleThumbnail
          gradient="linear-gradient(135deg, #4facfe, #00f2fe)"
          rotate={3}
          zIndex={1}
          offsetX={56}
        />
      </div>

      {/* Upload zone */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          border: `1.5px dashed ${isDragging ? 'var(--color-app-accent)' : 'var(--color-app-border)'}`,
          borderRadius: '12px',
          padding: '24px 40px',
          background: isDragging ? 'var(--color-app-accent-subtle)' : 'transparent',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        <Upload
          size={28}
          style={{ color: 'var(--color-text-tertiary)' }}
          aria-hidden="true"
        />
        <span
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--color-text-primary)',
          }}
        >
          Drop your screenshot
        </span>
        <span
          style={{
            fontSize: '13px',
            color: 'var(--color-text-tertiary)',
          }}
        >
          or paste with ⌘V
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
    </button>
  )
}
