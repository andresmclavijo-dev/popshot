import { useState, useCallback, useEffect } from 'react'
import { ArrowDownToLine, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { Canvas } from '@/components/canvas/Canvas'
import { Controls } from '@/components/controls/Controls'
import { ToastProvider, showToast } from '@/components/shared/Toast'
import { ExportGate } from '@/components/shared/ExportGate'
import { useExport } from '@/hooks/useExport'
import { useImageUpload } from '@/hooks/useImageUpload'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useEditorStore } from '@/store/useEditorStore'
import { checkUpgradeSuccess, isProUnlocked } from '@/lib/lemonSqueezy'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import type { Background } from '@/types'

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
  const { exportPng, copyImage, isExporting, copied, showGate, proceedWithWatermark, dismissGate } = useExport()
  const [exportOpen, setExportOpen] = useState(false)
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const imageLoaded = useEditorStore((s) => s.imageLoaded)
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

  const disabled = isExporting || !imageUrl || !imageLoaded

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Save PNG — secondary ghost */}
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
                      color: 'var(--color-text-secondary)',
                      fontSize: '13px',
                      fontWeight: 500,
                      borderRadius: 'var(--radius-md)',
                      padding: '0 var(--space-3)',
                      height: '36px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid var(--color-app-border)',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.4 : 1,
                      transition: 'background 100ms var(--ease-out), border-color 100ms var(--ease-out)',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                      if (!disabled) {
                        e.currentTarget.style.background = 'var(--color-bg-hover)'
                        e.currentTarget.style.borderColor = 'var(--color-app-border-strong)'
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'var(--color-app-border)'
                    }}
                  >
                    <ArrowDownToLine size={15} aria-hidden="true" />
                    Save PNG
                    <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginLeft: '2px' }}>&#8984;E</span>
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
          <TooltipContent>{disabled ? 'Drop a screenshot first' : 'Download PNG · ⌘E'}</TooltipContent>
        </Tooltip>

        {/* Copy image — primary filled */}
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
                  opacity: disabled ? 0.4 : 1,
                  transition: 'transform 100ms var(--ease-out), box-shadow 150ms var(--ease-out), background 100ms var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  if (!disabled) {
                    e.currentTarget.style.background = '#5835EE'
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(108,71,255,0.35)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#6C47FF'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
                onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = 'none' }}
              />
            }
          >
            {isExporting ? (
              <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
            ) : copied ? (
              <Check size={15} aria-hidden="true" />
            ) : (
              <Copy size={15} aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy image'}
            {!copied && !isExporting && (
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginLeft: '2px' }}>&#8984;C</span>
            )}
          </TooltipTrigger>
          <TooltipContent>{disabled ? 'Drop a screenshot first' : 'Copy to clipboard · ⌘C'}</TooltipContent>
        </Tooltip>
      </div>

      <ExportGate
        open={showGate}
        onExportWithWatermark={proceedWithWatermark}
        onDismiss={dismissGate}
      />
    </>
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
  const [hoveredBackground, setHoveredBackground] = useState<Background | null>(null)
  const setProUnlocked = useEditorStore((s) => s.setProUnlocked)

  useEffect(() => {
    if (checkUpgradeSuccess()) {
      setProUnlocked(true)
      showToast('Welcome to Pro. Watermark removed.')
    } else if (isProUnlocked()) {
      setProUnlocked(true)
    }
  }, [setProUnlocked])

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
            height: '64px',
            minHeight: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid var(--color-border)',
            background: '#FFFFFF',
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
          <Canvas hoveredBackground={hoveredBackground} />
          <Controls onHoverBackground={setHoveredBackground} />
        </main>
        <ToastProvider />
      </div>
    </TooltipProvider>
  )
}
