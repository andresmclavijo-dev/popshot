import { useState, useCallback } from 'react'
import { ArrowDownToLine, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Canvas } from '@/components/canvas/Canvas'
import { Controls } from '@/components/controls/Controls'
import { ToastProvider } from '@/components/shared/Toast'
import { useExport } from '@/hooks/useExport'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useEditorStore } from '@/store/useEditorStore'

const menuItemStyle: React.CSSProperties = {
  padding: 'var(--space-2) var(--space-3)',
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: 'inherit',
  background: 'transparent',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  textAlign: 'left',
  color: 'var(--color-text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  width: '100%',
}

function ExportButton() {
  const { exportPng, copyImage, isExporting, copied } = useExport()
  const [open, setOpen] = useState(false)
  const imageUrl = useEditorStore((s) => s.imageUrl)

  const handleExport = async (scale: 1 | 2) => {
    setOpen(false)
    await exportPng(scale)
  }

  const handleCopy = async () => {
    setOpen(false)
    await copyImage()
  }

  const onExportOpen = useCallback(() => {
    if (imageUrl) setOpen(true)
  }, [imageUrl])

  const onCopyClipboard = useCallback(() => {
    if (imageUrl && !isExporting) copyImage()
  }, [imageUrl, isExporting, copyImage])

  useKeyboardShortcuts({ onExportOpen, onCopyClipboard })

  const disabled = isExporting || !imageUrl

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={<Button />}
        style={{
          background: '#6C47FF',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 600,
          borderRadius: 'var(--radius-md)',
          padding: '0 var(--space-4)',
          height: '36px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(108,71,255,0.3)'
          }
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.transform = 'none'
          e.currentTarget.style.boxShadow = 'none'
        }}
        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'
        }}
        onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (!disabled) e.currentTarget.style.transform = 'scale(1.02)'
        }}
      >
        {isExporting ? (
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
        ) : copied ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <ArrowDownToLine size={16} aria-hidden="true" />
        )}
        {copied ? 'Copied!' : 'Export'}
        {!copied && !isExporting && (
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginLeft: '2px' }}>⌘E</span>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 'var(--space-1)',
          width: 'auto',
          minWidth: '180px',
        }}
      >
        <button
          type="button"
          onClick={handleCopy}
          style={menuItemStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <Copy size={14} aria-hidden="true" />
          Copy to clipboard
        </button>
        <button
          type="button"
          onClick={() => handleExport(1)}
          style={menuItemStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <ArrowDownToLine size={14} aria-hidden="true" />
          Export 1x
        </button>
        <button
          type="button"
          onClick={() => handleExport(2)}
          style={menuItemStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <ArrowDownToLine size={14} aria-hidden="true" />
          Export 2x
        </button>
      </PopoverContent>
    </Popover>
  )
}

export function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          height: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-6)',
          borderBottom: '1px solid var(--color-app-border-strong)',
          background: '#FAFAF9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            aria-hidden="true"
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '5px',
              background: '#6C47FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>P</span>
          </div>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}
          >
            Popshot
          </span>
        </div>
        <ExportButton />
      </header>
      <main
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <Canvas />
        <Controls />
      </main>
      <ToastProvider />
    </div>
  )
}
