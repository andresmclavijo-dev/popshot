import { useState, useCallback } from 'react'
import { ArrowDownToLine, Copy, Share2 } from 'lucide-react'
import { useExport } from '@/hooks/useExport'
import { useEditorStore } from '@/store/useEditorStore'
import { showToast } from '@/components/shared/Toast'
import type { ExportFormat, ExportScale } from '@/lib/exportImage'

let openExportGlobal: (() => void) | null = null
export function openExportModal() { openExportGlobal?.() }

const segBtn = (active: boolean): React.CSSProperties => ({
  flex: 1, padding: '6px 0', fontSize: '12px', fontWeight: active ? 600 : 500,
  fontFamily: 'inherit', background: active ? 'var(--ps-text-primary)' : 'transparent',
  color: active ? 'var(--ps-text-on-dark)' : 'var(--ps-text-secondary)',
  border: 'none', borderRadius: '6px', cursor: 'pointer', transition: 'all 150ms ease-out',
  textAlign: 'center' as const,
})

const actionBtn: React.CSSProperties = {
  width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '8px', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
  border: 'none', borderRadius: 'var(--ps-radius-pill)', cursor: 'pointer',
  transition: 'background 150ms ease-out',
}

export function ExportModal() {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('png')
  const [scale, setScale] = useState<ExportScale>(2)
  const { exportImage, copyImage } = useExport()
  const badgeEnabled = useEditorStore((s) => s.badgeEnabled)
  const setBadgeEnabled = useEditorStore((s) => s.setBadgeEnabled)

  openExportGlobal = () => setOpen(true)

  const handleDownload = useCallback(async () => {
    setOpen(false)
    await exportImage(scale, format)
  }, [scale, format, exportImage])

  const handleCopy = useCallback(async () => {
    setOpen(false)
    await copyImage()
  }, [copyImage])

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText('https://popshot.app').then(() => showToast('Link copied')).catch(() => showToast('Failed to copy', 'error'))
    setOpen(false)
  }, [])

  if (!open) return null

  return (
    <>
      <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 101, width: '100%', maxWidth: '360px', background: 'var(--ps-bg-surface)',
        borderRadius: 'var(--ps-radius-xl)', padding: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ps-text-primary)', marginBottom: '20px' }}>Export</h2>

        {/* Format */}
        <div style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Format</span>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--ps-bg-hover)', borderRadius: 'var(--ps-radius-sm)', padding: '2px' }}>
            <button type="button" onClick={() => setFormat('png')} style={segBtn(format === 'png')}>PNG</button>
            <button type="button" onClick={() => setFormat('jpg')} style={segBtn(format === 'jpg')}>JPG</button>
          </div>
        </div>

        {/* Resolution */}
        <div style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Resolution</span>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--ps-bg-hover)', borderRadius: 'var(--ps-radius-sm)', padding: '2px' }}>
            {([1, 2, 3] as ExportScale[]).map((s) => (
              <button key={s} type="button" onClick={() => setScale(s)} style={segBtn(scale === s)}>{s}×</button>
            ))}
          </div>
        </div>

        {/* Badge */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', cursor: 'pointer', fontSize: '12px', color: 'var(--ps-text-secondary)' }}>
          <input type="checkbox" checked={badgeEnabled} onChange={(e) => setBadgeEnabled(e.target.checked)}
            style={{ width: '14px', height: '14px', accentColor: 'var(--ps-text-primary)', cursor: 'pointer' }} />
          Add "popshot.app" badge
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button type="button" onClick={handleDownload}
            style={{ ...actionBtn, background: 'var(--ps-text-primary)', color: 'var(--ps-text-on-dark)' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}>
            <ArrowDownToLine size={14} aria-hidden="true" /> Download
          </button>
          <button type="button" onClick={handleCopy}
            style={{ ...actionBtn, background: 'transparent', border: `1px solid var(--ps-border-strong)`, color: 'var(--ps-text-primary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
            <Copy size={14} aria-hidden="true" /> Copy to clipboard
          </button>
          <button type="button" onClick={handleShare}
            style={{ ...actionBtn, background: 'transparent', border: 'none', color: 'var(--ps-text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-secondary)' }}>
            <Share2 size={14} aria-hidden="true" /> Share link
          </button>
        </div>

        <button type="button" onClick={() => setOpen(false)}
          style={{ display: 'block', width: '100%', marginTop: '8px', background: 'transparent', border: 'none', fontSize: '13px', fontFamily: 'inherit', color: 'var(--ps-text-tertiary)', cursor: 'pointer', padding: '8px', textAlign: 'center' }}>
          Cancel
        </button>
      </div>
    </>
  )
}
