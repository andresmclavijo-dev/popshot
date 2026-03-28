import { useState } from 'react'
import { Download, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Canvas } from '@/components/canvas/Canvas'
import { Controls } from '@/components/controls/Controls'
import { useExport } from '@/hooks/useExport'
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
          height: '32px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {isExporting ? (
          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
        ) : copied ? (
          <Check size={14} aria-hidden="true" />
        ) : (
          <Download size={14} aria-hidden="true" />
        )}
        {copied ? 'Copied!' : 'Export'}
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
          <Download size={14} aria-hidden="true" />
          Export 1x
        </button>
        <button
          type="button"
          onClick={() => handleExport(2)}
          style={menuItemStyle}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <Download size={14} aria-hidden="true" />
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
          height: '48px',
          minHeight: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-6)',
          borderBottom: '1px solid var(--color-app-border)',
          background: 'var(--color-bg-panel)',
        }}
      >
        <span
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          Popshot
        </span>
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
    </div>
  )
}
