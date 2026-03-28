import { useCallback, useEffect, useRef } from 'react'
import { Upload } from 'lucide-react'
import { useImageUpload } from '@/hooks/useImageUpload'

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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        width: '100%',
        maxWidth: '480px',
        padding: 'var(--space-12) var(--space-8)',
        border: `2px dashed ${isDragging ? 'var(--color-app-accent)' : 'var(--color-app-border-strong)'}`,
        borderRadius: 'var(--radius-xl)',
        background: isDragging ? 'var(--color-app-accent-subtle)' : 'var(--color-bg-card)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        outline: 'none',
        fontFamily: 'inherit',
      }}
      aria-label="Upload screenshot"
    >
      <Upload
        size={32}
        style={{ color: 'var(--color-text-tertiary)' }}
        aria-hidden="true"
      />
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
        }}
      >
        Drop, paste or click to upload
      </span>
      <span
        style={{
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
        }}
      >
        PNG, JPG, WebP
      </span>
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
