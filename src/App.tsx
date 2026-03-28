import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Canvas } from '@/components/canvas/Canvas'
import { Controls } from '@/components/controls/Controls'
import { useExport } from '@/hooks/useExport'
import { useEditorStore } from '@/store/useEditorStore'

function ExportButton() {
  const { exportPng, isExporting } = useExport()
  const [open, setOpen] = useState(false)
  const imageUrl = useEditorStore((s) => s.imageUrl)

  const handleExport = async (scale: 1 | 2) => {
    setOpen(false)
    await exportPng(scale)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={isExporting || !imageUrl}
        render={<Button />}
        style={{
          background: 'var(--color-app-accent)',
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
          cursor: isExporting || !imageUrl ? 'not-allowed' : 'pointer',
          opacity: isExporting || !imageUrl ? 0.5 : 1,
        }}
      >
        {isExporting ? (
          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
        ) : (
          <Download size={14} aria-hidden="true" />
        )}
        Export
      </PopoverTrigger>
      <PopoverContent
        align="end"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
          padding: 'var(--space-2)',
          width: 'auto',
          minWidth: '140px',
        }}
      >
        <button
          type="button"
          onClick={() => handleExport(1)}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            fontSize: '13px',
            fontFamily: 'inherit',
            background: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--color-text-primary)',
          }}
        >
          Export 1x
        </button>
        <button
          type="button"
          onClick={() => handleExport(2)}
          style={{
            padding: 'var(--space-2) var(--space-3)',
            fontSize: '13px',
            fontFamily: 'inherit',
            background: 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            textAlign: 'left',
            color: 'var(--color-text-primary)',
          }}
        >
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
          Screenshoot
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
