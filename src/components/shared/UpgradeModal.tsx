import { useState } from 'react'
import { capture } from '@/lib/analytics'
import { openCheckout } from '@/lib/checkout'

let openUpgradeGlobal: (() => void) | null = null

export function openUpgradeModal(triggerOrEvent?: string | unknown) {
  const trigger = typeof triggerOrEvent === 'string' ? triggerOrEvent : undefined
  capture('pro_modal_shown', { trigger })
  openUpgradeGlobal?.()
}

const features = [
  { text: 'All backgrounds & gradients', soon: false },
  { text: 'Premium frames (Arc, Safari, Card, Stack, macOS Dark)', soon: false },
  { text: 'Custom background image', soon: false },
  { text: 'Logo / watermark overlay', soon: false },
  { text: 'Full preset gallery', soon: false },
  { text: '3D perspective tilt', soon: true },
  { text: 'Batch export', soon: true },
]

const toggleStyle = (active: boolean): React.CSSProperties => ({
  flex: 1, padding: '10px 8px', background: active ? 'var(--ps-text-primary)' : 'transparent',
  color: active ? 'var(--ps-bg-page)' : 'var(--ps-text-secondary)',
  border: 'none', borderRadius: '10px', cursor: 'pointer',
  fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
  textAlign: 'center', transition: 'all 150ms ease-out',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
})

export function UpgradeModal() {
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual')

  openUpgradeGlobal = () => setOpen(true)

  if (!open) return null

  return (
    <>
      <div onClick={() => setOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 101, width: '100%', maxWidth: '400px',
        background: 'var(--ps-bg-surface)', borderRadius: 'var(--ps-radius-xl)',
        padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Star icon */}
        <div style={{ marginBottom: '16px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="star-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" /><stop offset="0.5" stopColor="#8b5cf6" /><stop offset="1" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path d="M14 2l3.5 8.5H26l-7 5.5 2.5 9L14 19.5 6.5 25l2.5-9-7-5.5h8.5L14 2z" fill="url(#star-grad)" />
          </svg>
        </div>

        <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--ps-text-primary)', marginBottom: '4px' }}>
          Popshot Pro
        </h2>
        <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--ps-text-secondary)', marginBottom: '20px' }}>
          Make every screenshot remarkable
        </p>

        {/* Feature list */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {features.map((f) => (
            <li key={f.text} style={{ fontSize: '13px', fontWeight: 400, color: 'var(--ps-text-primary)', lineHeight: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M4 7l2 2 4-4" stroke="var(--ps-text-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ flex: 1 }}>{f.text}</span>
              {f.soon && (
                <span style={{ fontSize: '10px', fontWeight: 500, background: 'var(--ps-bg-hover)', borderRadius: '10px', padding: '2px 8px', color: 'var(--ps-text-tertiary)' }}>
                  Soon
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Plan toggle */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--ps-bg-hover)', borderRadius: 'var(--ps-radius-md)', padding: '4px', marginBottom: '16px' }}>
          <button type="button" onClick={() => setPlan('monthly')} style={toggleStyle(plan === 'monthly')}>
            <span style={{ fontWeight: 600 }}>$5/mo</span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>Monthly</span>
          </button>
          <button type="button" onClick={() => setPlan('annual')} style={toggleStyle(plan === 'annual')}>
            <span style={{ fontWeight: 600 }}>$45/yr</span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>Annual · Save 25%</span>
          </button>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => {
            capture('upgrade_clicked')
            openCheckout(plan)
            setOpen(false)
          }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '44px',
            background: 'var(--ps-text-primary)', color: 'var(--ps-bg-page)',
            borderRadius: 'var(--ps-radius-pill)', border: 'none',
            fontSize: '14px', fontWeight: 500, fontFamily: 'inherit',
            cursor: 'pointer', transition: 'opacity 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          Upgrade to Pro &rarr;
        </button>

        <button type="button" onClick={() => setOpen(false)}
          style={{ display: 'block', width: '100%', marginTop: '12px', background: 'transparent', border: 'none', fontSize: '13px', fontWeight: 400, fontFamily: 'inherit', color: 'var(--ps-text-tertiary)', cursor: 'pointer', padding: '8px', textAlign: 'center' }}>
          Maybe later
        </button>
      </div>
    </>
  )
}
