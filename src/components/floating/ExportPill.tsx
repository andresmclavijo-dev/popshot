import { useState, useCallback } from 'react'
import { ArrowDownToLine, Copy, Check, Loader2, Share2, Lock } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useExport } from '@/hooks/useExport'
import { useEditorStore } from '@/store/useEditorStore'
import { ExportGate } from '@/components/shared/ExportGate'
import { showToast } from '@/components/shared/Toast'
import type { ExportFormat, ExportScale } from '@/lib/exportImage'

const dividerStyle: React.CSSProperties = {
  width: '1px',
  height: '20px',
  background: 'rgba(0, 0, 0, 0.08)',
  flexShrink: 0,
}

const actionBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '6px 10px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: 'var(--color-text-secondary)',
  borderRadius: '12px',
  transition: 'color 100ms var(--ease-out), background 100ms var(--ease-out)',
  whiteSpace: 'nowrap' as const,
}

const menuItemStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: 'inherit',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  textAlign: 'left' as const,
  color: 'var(--color-text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
}

export function ExportPill() {
  const { exportImage, copyImage, isExporting, copied, showGate, proceedWithWatermark, dismissGate } = useExport()
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const imageLoaded = useEditorStore((s) => s.imageLoaded)
  const [exportOpen, setExportOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('png')

  const badgeEnabled = useEditorStore((s) => s.badgeEnabled)
  const setBadgeEnabled = useEditorStore((s) => s.setBadgeEnabled)
  const disabled = isExporting || !imageUrl || !imageLoaded

  const handleExport = async (scale: ExportScale) => {
    setExportOpen(false)
    await exportImage(scale, format)
  }

  const handleCopy = useCallback(async () => {
    await copyImage()
  }, [copyImage])

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('https://popshot.app')
      showToast('Link copied')
    } catch {
      showToast('Failed to copy link', 'error')
    }
  }, [])

  const formatToggleStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: active ? '#222' : 'transparent',
    color: active ? '#FFF' : 'var(--color-text-secondary)',
    border: 'none',
    cursor: 'pointer',
    padding: '5px 0',
    fontSize: '12px',
    fontWeight: active ? 600 : 500,
    fontFamily: 'inherit',
    borderRadius: '6px',
    transition: 'all 100ms var(--ease-out)',
    textAlign: 'center' as const,
  })

  return (
    <>
      <div
        className="frosted-pill"
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '4px',
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
          transition: 'opacity 150ms var(--ease-out)',
        }}
      >
        {/* Share */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={handleShare}
                disabled={disabled}
                style={actionBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'transparent' }}
              />
            }
          >
            <Share2 size={14} aria-hidden="true" />
            <span>Share</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Copy link</TooltipContent>
        </Tooltip>

        <div style={dividerStyle} />

        {/* Copy — always PNG 2× */}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={handleCopy}
                disabled={disabled}
                style={actionBtnStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.background = 'transparent' }}
              />
            }
          >
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Copy PNG 2× · ⌘C</TooltipContent>
        </Tooltip>

        <div style={dividerStyle} />

        {/* Export — primary dark CTA with popover */}
        <Popover open={exportOpen} onOpenChange={setExportOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                disabled={disabled}
                style={{
                  background: '#222',
                  color: '#FFF',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  borderRadius: '16px',
                  transition: 'background 100ms var(--ease-out), transform 100ms var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#333' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#222'; e.currentTarget.style.transform = 'none' }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
              />
            }
          >
            {isExporting ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
            ) : (
              <ArrowDownToLine size={14} aria-hidden="true" />
            )}
            Export
          </PopoverTrigger>
          <PopoverContent
            align="end"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '8px',
              width: 'auto',
              minWidth: '180px',
              gap: '4px',
            }}
          >
            {/* Format toggle */}
            <div style={{ padding: '0 4px 4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>Format</span>
              <div style={{ display: 'flex', gap: '2px', background: 'rgba(0,0,0,0.04)', borderRadius: '8px', padding: '2px' }}>
                <button type="button" onClick={() => setFormat('png')} style={formatToggleStyle(format === 'png')}>PNG</button>
                <button type="button" onClick={() => setFormat('jpg')} style={formatToggleStyle(format === 'jpg')}>JPG</button>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />

            {/* Badge opt-in */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 4px 2px', cursor: 'pointer', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              <input type="checkbox" checked={badgeEnabled} onChange={(e) => setBadgeEnabled(e.target.checked)}
                style={{ width: '14px', height: '14px', accentColor: '#222', cursor: 'pointer' }} />
              Add "popshot.app" badge
            </label>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />

            {/* Download options */}
            {([1, 2, 3] as ExportScale[]).map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => handleExport(scale)}
                style={menuItemStyle}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <ArrowDownToLine size={14} aria-hidden="true" />
                Download {scale}×
              </button>
            ))}

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />

            {/* Batch export hint — locked */}
            <Tooltip>
              <TooltipTrigger render={
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 4px', fontSize: '12px', color: 'var(--color-text-tertiary)', cursor: 'default' }} />
              }>
                <Lock size={11} strokeWidth={2.5} aria-hidden="true" />
                Batch export · Pro
              </TooltipTrigger>
              <TooltipContent style={{ background: 'rgba(0,0,0,0.9)', color: '#FFF', borderRadius: '10px', padding: '10px 14px', border: 'none', maxWidth: '220px' }}>
                Style multiple screenshots at once — upgrade to Pro
              </TooltipContent>
            </Tooltip>
          </PopoverContent>
        </Popover>
      </div>

      <ExportGate
        open={showGate}
        onExportWithWatermark={proceedWithWatermark}
        onDismiss={dismissGate}
      />
    </>
  )
}
