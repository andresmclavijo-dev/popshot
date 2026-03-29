import { Check } from 'lucide-react'
import { openCheckout } from '@/lib/lemonSqueezy'

interface ExportGateProps {
  open: boolean
  onExportWithWatermark: () => void
  onDismiss: () => void
}

const FEATURES = [
  'No watermark on exports',
  'Curated preset gallery (10+ styles)',
  'Custom gradient builder',
  'Brand watermark & logo overlay',
  'All future Pro features included',
]

export function ExportGate({ open, onExportWithWatermark, onDismiss }: ExportGateProps) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Pro"
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
          width: '100%',
          maxWidth: '600px',
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          animation: 'toast-in 250ms var(--ease-out)',
          position: 'relative',
          margin: '16px',
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
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: '#AAAAAA',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontFamily: 'inherit',
            transition: 'color 100ms var(--ease-out)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#222222' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#AAAAAA' }}
        >
          &times;
        </button>

        {/* Two-column layout */}
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

          {/* LEFT — Marketing copy */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* PRO badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--color-app-accent)',
              color: '#FFFFFF',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '3px 8px',
              borderRadius: '4px',
              width: 'fit-content',
              marginBottom: '12px',
            }}>
              POPSHOT PRO
            </div>

            {/* Headline */}
            <h2 style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#222222',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              margin: '0 0 6px',
            }}>
              Make every screenshot stunning
            </h2>

            {/* Subhead */}
            <p style={{
              fontSize: '14px',
              color: '#717171',
              margin: '0 0 20px',
              lineHeight: 1.5,
            }}>
              $19 once. No subscription. Yours forever.
            </p>

            {/* Feature list */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '24px',
            }}>
              {FEATURES.map(feature => (
                <div
                  key={feature}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <Check
                    size={15}
                    strokeWidth={2.5}
                    style={{ color: 'var(--color-app-accent)', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '14px', color: '#222222', lineHeight: 1.5 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <button
              type="button"
              onClick={() => openCheckout()}
              style={{
                width: '100%',
                height: '44px',
                background: 'var(--color-app-accent)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'pointer',
                marginBottom: '10px',
                transition: 'background 150ms var(--ease-out), transform 100ms var(--ease-out)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-app-accent-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-app-accent)'; e.currentTarget.style.transform = 'scale(1)' }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              Get Popshot Pro — $19 forever
            </button>

            {/* Secondary action */}
            <button
              type="button"
              onClick={onExportWithWatermark}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: '#717171',
                cursor: 'pointer',
                padding: '4px 0',
                textAlign: 'center',
                width: '100%',
                fontFamily: 'inherit',
                transition: 'color 100ms var(--ease-out)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#222222' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#717171' }}
            >
              Export with watermark
            </button>

            {/* Trust signal */}
            <p style={{
              fontSize: '11px',
              color: '#AAAAAA',
              textAlign: 'center',
              margin: '8px 0 0',
            }}>
              $19 · one-time · no subscription
            </p>
          </div>

          {/* RIGHT — Visual proof (hidden on narrow screens via min-width) */}
          <div
            style={{
              width: '220px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
            className="hidden-narrow"
          >
            {/* Split preview */}
            <div style={{
              display: 'flex',
              gap: '4px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #EBEBEB',
            }}>
              {/* With watermark */}
              <div style={{
                flex: 1,
                position: 'relative',
                aspectRatio: '4/3',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ width: '60%', height: '40%', background: 'rgba(255,255,255,0.9)', borderRadius: '3px' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  fontSize: '7px',
                  fontFamily: 'system-ui',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                }}>
                  popshot.app
                </div>
              </div>

              <div style={{ width: '1px', background: '#EBEBEB', flexShrink: 0 }} />

              {/* Without watermark */}
              <div style={{
                flex: 1,
                position: 'relative',
                aspectRatio: '4/3',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ width: '60%', height: '40%', background: 'rgba(255,255,255,0.9)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <span style={{ fontSize: '11px', color: '#717171', fontWeight: 500 }}>Free</span>
              <span style={{ fontSize: '11px', color: 'var(--color-app-accent)', fontWeight: 600 }}>Pro ✓</span>
            </div>

            {/* Value callout */}
            <div style={{
              background: '#F7F4FF',
              border: '1px solid #E8E0FF',
              borderRadius: '8px',
              padding: '10px 12px',
              marginTop: '4px',
            }}>
              <p style={{ fontSize: '12px', color: '#5B3FC2', fontWeight: 600, margin: '0 0 2px' }}>
                One-time purchase
              </p>
              <p style={{ fontSize: '11px', color: '#8B72D4', margin: 0, lineHeight: 1.4 }}>
                Pay once, use forever. No renewal, no surprise charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
