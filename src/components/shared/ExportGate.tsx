import { openCheckout } from '@/lib/lemonSqueezy'

interface ExportGateProps {
  open: boolean
  onExportWithWatermark: () => void
  onDismiss: () => void
}

export function ExportGate({ open, onExportWithWatermark, onDismiss }: ExportGateProps) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Export options"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onDismiss}
      onKeyDown={(e) => { if (e.key === 'Escape') onDismiss() }}
    >
      <div
        style={{
          width: '360px',
          background: 'var(--color-bg-card)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          animation: 'toast-in 250ms var(--ease-out)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontFamily: 'inherit',
          }}
        >
          &times;
        </button>

        {/* Split preview */}
        <div
          style={{
            display: 'flex',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--color-app-border)',
            height: '100px',
          }}
        >
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.9)', borderRadius: '4px' }} />
            <span
              style={{
                position: 'absolute',
                bottom: '6px',
                right: '8px',
                fontFamily: 'system-ui',
                fontSize: '8px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              popshot.app
            </span>
          </div>
          <div style={{ width: '1px', background: 'var(--color-app-border)' }} />
          <div
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '60px', height: '40px', background: 'rgba(255,255,255,0.9)', borderRadius: '4px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-text-tertiary)', padding: '0 4px' }}>
          <span>With watermark</span>
          <span>Without watermark</span>
        </div>

        {/* Copy */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
            Your image is ready
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Free exports include the Popshot watermark.
          </p>
        </div>

        {/* Actions */}
        <button
          type="button"
          onClick={() => openCheckout()}
          style={{
            width: '100%',
            height: '40px',
            background: '#6C47FF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background 100ms var(--ease-out)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#5835EE' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#6C47FF' }}
        >
          Remove watermark — $19 forever
        </button>
        <button
          type="button"
          onClick={onExportWithWatermark}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          Export with watermark
        </button>
        <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          $19 · one-time · no subscription
        </span>
      </div>
    </div>
  )
}
