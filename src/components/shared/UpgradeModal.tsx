import { useState } from 'react'
import { capture } from '@/lib/analytics'

const CHECKOUT_URL = 'https://popshot.app/#pro'

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
  { text: 'Save unlimited presets', soon: false },
  { text: 'Logo / watermark overlay', soon: false },
  { text: 'Full preset gallery', soon: false },
  { text: '3D perspective tilt', soon: true },
  { text: 'Batch export', soon: true },
]

export function UpgradeModal() {
  const [open, setOpen] = useState(false)

  // Register global opener
  openUpgradeGlobal = () => setOpen(true)

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 100,
        }}
      />
      {/* Modal */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', zIndex: 101,
        width: '100%', maxWidth: '400px',
        background: 'var(--ps-bg-surface)',
        borderRadius: 'var(--ps-radius-xl)',
        padding: '28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Star icon */}
        <div style={{ marginBottom: '16px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="star-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="0.5" stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#ec4899" />
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
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {features.map((f) => (
            <li key={f.text} style={{ fontSize: '13px', fontWeight: 400, color: 'var(--ps-text-primary)', lineHeight: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M4 7l2 2 4-4" stroke="var(--ps-text-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ flex: 1 }}>{f.text}</span>
              {f.soon && (
                <span style={{ fontSize: '10px', fontWeight: 500, background: 'rgba(0,0,0,0.06)', borderRadius: '10px', padding: '2px 8px', color: 'var(--ps-text-tertiary)' }}>
                  Soon
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '44px',
            background: 'var(--ps-text-primary)', color: 'var(--ps-text-on-dark)',
            borderRadius: 'var(--ps-radius-pill)',
            fontSize: '14px', fontWeight: 500, fontFamily: 'inherit',
            textDecoration: 'none',
            transition: 'background 150ms ease-out',
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '0.85' }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '1' }}
        >
          Get Pro — $19
        </a>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--ps-text-tertiary)', marginTop: '10px' }}>
          <s style={{ color: 'var(--ps-text-tertiary)' }}>$29</s>
          {' '} · One-time · No subscription
        </p>

        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            display: 'block', width: '100%', marginTop: '12px',
            background: 'transparent', border: 'none',
            fontSize: '13px', fontWeight: 400, fontFamily: 'inherit',
            color: 'var(--ps-text-tertiary)', cursor: 'pointer',
            padding: '8px', textAlign: 'center',
          }}
        >
          Maybe later
        </button>
      </div>
    </>
  )
}
