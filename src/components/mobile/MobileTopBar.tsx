import { Menu } from 'lucide-react'
import { openExportModal } from '@/components/shared/ExportModal'
import { useEditorStore } from '@/store/useEditorStore'

export function MobileTopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const imageUrl = useEditorStore((s) => s.imageUrl)

  return (
    <div style={{
      height: '56px', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      background: 'var(--ps-bg-panel)',
      borderBottom: '0.5px solid var(--ps-border)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'var(--ps-brand-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ps-text-primary)' }}>Popshot</span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Export */}
        <button type="button" onClick={() => imageUrl && openExportModal()}
          disabled={!imageUrl}
          style={{
            height: '32px', padding: '0 14px',
            background: 'var(--ps-text-primary)', color: 'var(--ps-bg-page)',
            border: 'none', borderRadius: '100px',
            fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
            cursor: imageUrl ? 'pointer' : 'not-allowed',
            opacity: imageUrl ? 1 : 0.35,
          }}>
          Export
        </button>

        {/* Menu */}
        <button type="button" onClick={onMenuOpen} aria-label="Open menu"
          style={{
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer',
            color: 'var(--ps-text-secondary)',
          }}>
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
