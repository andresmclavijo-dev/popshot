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
                      color: '#717171',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderRadius: '8px',
                      padding: '0 14px',
                      height: '36px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid #DDDDDD',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.4 : 1,
                      transition: 'border-color 100ms var(--ease-out), color 100ms var(--ease-out)',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                      if (!disabled) {
                        e.currentTarget.style.borderColor = '#222222'
                        e.currentTarget.style.color = '#222222'
                      }
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.currentTarget.style.borderColor = '#DDDDDD'
                      e.currentTarget.style.color = '#717171'
                    }}
                  >
                    <ArrowDownToLine size={15} aria-hidden="true" />
                    Save PNG
                    <span style={{ fontSize: '11px', color: '#AAAAAA', background: '#F0F0EE', borderRadius: '4px', padding: '1px 5px' }}>&#8984;E</span>
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
          <TooltipContent side="bottom" sideOffset={8}>{disabled ? 'Drop a screenshot first' : 'Save as PNG · ⌘E'}</TooltipContent>
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
                  background: 'var(--color-app-accent)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  borderRadius: '8px',
                  padding: '0 16px',
                  height: '36px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.4 : 1,
                  transition: 'transform 100ms var(--ease-out), background 150ms var(--ease-out)',
                }}
                onMouseEnter={(e) => {
                  if (!disabled) e.currentTarget.style.background = 'var(--color-app-accent-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--color-app-accent)'
                  e.currentTarget.style.transform = 'none'
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
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', padding: '1px 5px' }}>&#8984;C</span>
            )}
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>{disabled ? 'Drop a screenshot first' : 'Copy to clipboard · ⌘C'}</TooltipContent>
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

// Demo auto-load removed — empty state shows on first visit

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
