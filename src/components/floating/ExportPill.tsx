import { useState, useCallback } from 'react'
import { toBlob } from 'html-to-image'
import { ArrowDownToLine, Copy, Check, Loader2, Share2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useExport } from '@/hooks/useExport'
import { useEditorStore } from '@/store/useEditorStore'
import { ExportGate } from '@/components/shared/ExportGate'

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

export function ExportPill() {
  const { exportPng, copyImage, isExporting, copied, showGate, proceedWithWatermark, dismissGate } = useExport()
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const imageLoaded = useEditorStore((s) => s.imageLoaded)
  const [exportOpen, setExportOpen] = useState(false)

  const disabled = isExporting || !imageUrl || !imageLoaded

  const handleExport = async (scale: 1 | 2) => {
    setExportOpen(false)
    await exportPng(scale)
  }

  const handleCopy = useCallback(async () => {
    await copyImage()
  }, [copyImage])

  const handleShare = useCallback(async () => {
    // Use Web Share API if available, otherwise copy
    if (navigator.share) {
      try {
        const el = document.getElementById('export-canvas')
        if (!el) return
        const blob = await toBlob(el, { cacheBust: true, skipFonts: true })
        if (!blob) return
        const file = new File([blob], 'popshot.png', { type: 'image/png' })
        await navigator.share({ files: [file] })
      } catch {
        // Fallback to copy
        await copyImage()
      }
    } else {
      await copyImage()
    }
  }, [copyImage])

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
          <TooltipContent side="bottom">Share image</TooltipContent>
        </Tooltip>

        <div style={dividerStyle} />

        {/* Copy */}
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
          <TooltipContent side="bottom">Copy to clipboard · ⌘C</TooltipContent>
        </Tooltip>

        <div style={dividerStyle} />

        {/* Export — primary dark CTA */}
        <Popover open={exportOpen} onOpenChange={setExportOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                disabled={disabled}
                style={{
                  background: '#222222',
                  color: '#FFFFFF',
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
                onMouseEnter={(e) => { e.currentTarget.style.background = '#333333' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#222222'; e.currentTarget.style.transform = 'none' }}
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
              padding: '4px',
              width: 'auto',
              minWidth: '160px',
            }}
          >
            <button
              type="button"
              onClick={() => handleExport(1)}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <ArrowDownToLine size={14} aria-hidden="true" />
              Download 1x
            </button>
            <button
              type="button"
              onClick={() => handleExport(2)}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'inherit',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <ArrowDownToLine size={14} aria-hidden="true" />
              Download 2x
            </button>
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
