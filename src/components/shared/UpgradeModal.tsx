import { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { capture } from '@/lib/analytics'
import { openCheckout } from '@/lib/checkout'
import { useFocusTrap } from '@/hooks/useFocusTrap'

let openUpgradeGlobal: (() => void) | null = null

export function openUpgradeModal(triggerOrEvent?: string | unknown) {
  const trigger = typeof triggerOrEvent === 'string' ? triggerOrEvent : undefined
  capture('pro_modal_shown', { trigger })
  openUpgradeGlobal?.()
}

const PRO_FEATURES: { bold: string; rest: string }[] = [
  { bold: 'All backgrounds', rest: ' & gradients' },
  { bold: 'Premium frames', rest: ' — Arc, Safari, Card, Stack' },
  { bold: 'Custom background', rest: ' image upload' },
  { bold: 'Logo / watermark', rest: ' overlay' },
  { bold: 'Full preset', rest: ' gallery' },
  { bold: '3D perspective', rest: ' tilt (coming soon)' },
  { bold: 'Batch export', rest: ' (coming soon)' },
]

export function UpgradeModal() {
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly')

  openUpgradeGlobal = () => setOpen(true)

  const handleDismiss = useCallback(() => {
    capture('pro_modal_dismissed')
    setOpen(false)
  }, [])

  const modalRef = useFocusTrap(open, handleDismiss)

  const isMonthly = plan === 'monthly'
  const price = isMonthly ? '$5' : '$3.75'
  const billedNote = isMonthly ? null : 'Billed $45/year'

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleDismiss} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }} />

      {/* Modal */}
      <div
        ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="upgrade-heading"
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 101, width: '100%', maxWidth: '440px',
          background: 'var(--ps-bg-surface)', borderRadius: '20px',
          padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
        }}>

        {/* Close button */}
        <button type="button" onClick={handleDismiss} aria-label="Close"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer',
            color: 'var(--ps-text-tertiary)', transition: 'color 150ms ease-out, background 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)'; e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)'; e.currentTarget.style.background = 'transparent' }}>
          <X size={16} aria-hidden="true" />
        </button>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          width: 'fit-content', marginBottom: '16px',
          background: 'var(--ps-brand-gradient)', borderRadius: '100px',
          padding: '5px 12px', fontSize: '10px', fontWeight: 700,
          color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>
          ✦ Popshot Pro
        </div>

        {/* Headline */}
        <h2 id="upgrade-heading" style={{
          fontSize: '22px', fontWeight: 800, color: 'var(--ps-text-primary)',
          letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 6px',
        }}>
          Unlock the full toolkit
        </h2>
        <p style={{ fontSize: '13px', fontWeight: 400, color: 'var(--ps-text-secondary)', margin: '0 0 24px' }}>
          Everything you need to ship beautiful screenshots. Cancel anytime.
        </p>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {PRO_FEATURES.map((f) => (
            <div key={f.bold} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: '13.5px', color: 'var(--ps-text-primary)' }}>
                <strong>{f.bold}</strong>{f.rest}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing toggle — inline segmented, Paletta pattern */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'var(--ps-bg-hover)', borderRadius: '10px',
            padding: '3px', gap: '3px',
          }}>
            <button type="button" aria-pressed={isMonthly}
              onClick={() => { setPlan('monthly'); capture('pro_plan_toggle', { plan: 'monthly' }) }}
              style={{
                padding: '6px 16px', height: '36px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
                border: 'none', cursor: 'pointer',
                background: isMonthly ? 'var(--ps-bg-surface)' : 'transparent',
                color: isMonthly ? 'var(--ps-text-primary)' : 'var(--ps-text-tertiary)',
                boxShadow: isMonthly ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 150ms ease-out',
              }}>
              Monthly
            </button>
            <button type="button" aria-pressed={!isMonthly}
              onClick={() => { setPlan('annual'); capture('pro_plan_toggle', { plan: 'annual' }) }}
              style={{
                padding: '6px 16px', height: '36px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
                border: 'none', cursor: 'pointer',
                background: !isMonthly ? 'var(--ps-bg-surface)' : 'transparent',
                color: !isMonthly ? 'var(--ps-text-primary)' : 'var(--ps-text-tertiary)',
                boxShadow: !isMonthly ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 150ms ease-out',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              Yearly
              <span style={{
                fontSize: '10px', fontWeight: 700,
                background: 'rgba(34,197,94,0.12)', color: '#16a34a',
                padding: '2px 6px', borderRadius: '100px',
              }}>
                −25%
              </span>
            </button>
          </div>
        </div>

        {/* Price display */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--ps-text-primary)', letterSpacing: '-0.02em' }}>
            {price}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--ps-text-secondary)' }}>/mo</span>
          {billedNote && (
            <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--ps-text-tertiary)', marginLeft: '8px' }}>
              {billedNote}
            </span>
          )}
        </div>

        {/* CTA */}
        <button type="button"
          onClick={() => {
            capture('upgrade_clicked', { plan })
            openCheckout(plan)
            setOpen(false)
          }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '44px',
            background: 'var(--ps-text-primary)', color: 'var(--ps-bg-page)',
            borderRadius: '100px', border: 'none',
            fontSize: '14px', fontWeight: 600, fontFamily: 'inherit',
            cursor: 'pointer', transition: 'opacity 150ms ease-out, transform 100ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}>
          Go Pro — {isMonthly ? '$5/mo' : '$45/yr'}
        </button>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--ps-text-tertiary)' }}>
            Launch pricing · Powered by Stripe
          </span>
          <button type="button" onClick={handleDismiss}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: 400, fontFamily: 'inherit',
              color: 'var(--ps-text-tertiary)', transition: 'color 150ms ease-out',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)' }}>
            Maybe later
          </button>
        </div>
      </div>
    </>
  )
}
