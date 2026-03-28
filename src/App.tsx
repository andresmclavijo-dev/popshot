import { useState, useCallback, useEffect } from 'react'
import { ArrowDownToLine, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { Canvas } from '@/components/canvas/Canvas'
import { Controls } from '@/components/controls/Controls'
import { ToastProvider } from '@/components/shared/Toast'
import { useExport } from '@/hooks/useExport'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'

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

function TopBarActions() {
  const { exportPng, copyImage, isExporting, copied } = useExport()
  const [exportOpen, setExportOpen] = useState(false)
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const setBackground = useEditorStore((s) => s.setBackground)
  const setShadow = useEditorStore((s) => s.setShadow)
  const triggerShuffle = useEditorStore((s) => s.triggerShuffle)

  const handleExport = async (scale: 1 | 2) => {
    setExportOpen(false)
    await exportPng(scale)
  }

  const handleCopy = useCallback(async () => {
    await copyImage()
  }, [copyImage])

  const onExportOpen = useCallback(() => {
    if (imageUrl) setExportOpen(true)
  }, [imageUrl])

  const onShuffle = useCallback(() => {
    const shuffleable = BACKGROUND_PRESETS.filter((p) => p.id !== 'transparent')
    const shadows = SHADOW_PRESETS.filter((p) => p.id !== 'none')
    const bg = shuffleable[Math.floor(Math.random() * shuffleable.length)]
    const sh = shadows[Math.floor(Math.random() * shadows.length)]
    setBackground(bg.background)
    setShadow(sh.id)
    triggerShuffle()
  }, [setBackground, setShadow, triggerShuffle])

  useKeyboardShortcuts({ onExportOpen, onCopyClipboard: handleCopy, onShuffle })

  const disabled = isExporting || !imageUrl

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Copy — primary filled */}
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={handleCopy}
              disabled={disabled}
              style={{
                background: '#6C47FF',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'inherit',
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
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(108,71,255,0.3)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(1.02)' }}
            />
          }
        >
          {isExporting ? (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
          ) : copied ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
          {copied ? 'Copied!' : 'Copy'}
          {!copied && !isExporting && (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginLeft: '2px' }}>⌘C</span>
          )}
        </TooltipTrigger>
        <TooltipContent>Copy to clipboard · ⌘C</TooltipContent>
      </Tooltip>

      {/* Export — secondary outline */}
      <Tooltip>
        <TooltipTrigger
          render={
            <div style={{ display: 'inline-flex' }}>
              <Popover open={exportOpen} onOpenChange={setExportOpen}>
                <PopoverTrigger
                  disabled={disabled}
                  render={<Button />}
                  style={{
                    background: 'transparent',
                    color: '#6C47FF',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-md)',
                    padding: '0 var(--space-4)',
                    height: '36px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #6C47FF',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'background 0.15s ease',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!disabled) e.currentTarget.style.background = 'var(--color-app-accent-subtle)'
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <ArrowDownToLine size={16} aria-hidden="true" />
                  Export
                  <span style={{ fontSize: '11px', color: 'rgba(108,71,255,0.5)', marginLeft: '2px' }}>⌘E</span>
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
                    onClick={() => handleExport(1)}
                    style={menuItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <ArrowDownToLine size={14} aria-hidden="true" />
                    Download 1x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport(2)}
                    style={menuItemStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <ArrowDownToLine size={14} aria-hidden="true" />
                    Download 2x
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          }
        />
        <TooltipContent>Download PNG · ⌘E</TooltipContent>
      </Tooltip>
    </div>
  )
}

function DemoLoader() {
  const { handleFile } = useImageUpload()
  const imageUrl = useEditorStore((s) => s.imageUrl)

  useEffect(() => {
    if (imageUrl) return
    fetch('/demo.png')
      .then((res) => {
        if (!res.ok) return
        return res.blob()
      })
      .then((blob) => {
        if (!blob) return
        const file = new File([blob], 'demo.png', { type: 'image/png' })
        handleFile(file, true)
      })
      .catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export function App() {
  return (
    <TooltipProvider delay={600}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <DemoLoader />
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
          <TopBarActions />
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
    </TooltipProvider>
  )
}
