import { useEffect, useRef } from 'react'
import { Lock } from 'lucide-react'
import { BackgroundPicker, ShuffleButton } from './BackgroundPicker'
import { PaddingControl } from './PaddingControl'
import { CornerRadiusControl } from './CornerRadiusControl'
import { ShadowPicker } from './ShadowPicker'
import { FramePicker } from './FramePicker'
import { AspectRatioControl } from './AspectRatioControl'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { openCheckout } from '@/lib/lemonSqueezy'
import type { Background } from '@/types'

const zoneLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#AAAAAA',
  padding: '20px 24px 8px',
  display: 'block',
}

const PRESET_GRADIENTS = [
  { label: 'Ocean', bg: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { label: 'Sunset', bg: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { label: 'Aurora', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { label: 'Midnight', bg: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { label: 'Forest', bg: 'linear-gradient(135deg, #134e5e, #71b280)' },
  { label: 'Peach', bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
]

function LockedPresets() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {PRESET_GRADIENTS.map(p => (
          <button
            key={p.label}
            type="button"
            onClick={() => openCheckout()}
            aria-label={`${p.label} preset — Pro only`}
            style={{
              width: '100%',
              aspectRatio: '4/3',
              background: p.bg,
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.06)',
              opacity: 0.6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 150ms var(--ease-out)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.6' }}
          >
            <Lock size={14} strokeWidth={2} style={{ color: '#FFFFFF', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => openCheckout()}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--color-app-accent)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          padding: '2px 0',
          textAlign: 'left',
          transition: 'color 100ms var(--ease-out)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-app-accent-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-app-accent)' }}
      >
        Unlock with Pro
      </button>
    </div>
  )
}

export function Controls({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0
  }, [])

  return (
    <aside
      style={{
        width: '300px',
        minWidth: '300px',
        height: '100%',
        background: 'var(--color-bg-panel)',
        borderLeft: '1px solid var(--color-border)',
        padding: 0,
        boxShadow: 'var(--shadow-sidebar)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div ref={panelRef} style={{ height: '100%', overflowY: 'auto' }}>
        <div style={{ paddingBottom: '48px' }}>

          {/* ── STYLE ── */}
          <span style={zoneLabelStyle}>Style</span>

          <SectionHeader label="Presets" />
          <div style={{ padding: '0 24px 20px' }}>
            <LockedPresets />
          </div>

          <SectionHeader label="Frame" />
          <div style={{ padding: '0 24px 20px' }}>
            <FramePicker />
          </div>

          <SectionHeader label="Background" action={<ShuffleButton />} />
          <div style={{ padding: '0 24px 20px' }}>
            <BackgroundPicker onHoverBackground={onHoverBackground} />
          </div>

          {/* ── LAYOUT ── */}
          <span style={zoneLabelStyle}>Layout</span>

          <SectionHeader label="Padding" />
          <div style={{ padding: '0 24px 20px' }}>
            <PaddingControl />
          </div>

          <SectionHeader label="Corner radius" />
          <div style={{ padding: '0 24px 20px' }}>
            <CornerRadiusControl />
          </div>

          {/* ── POLISH ── */}
          <span style={zoneLabelStyle}>Polish</span>

          <SectionHeader label="Shadow" />
          <div style={{ padding: '0 24px 20px' }}>
            <ShadowPicker />
          </div>

          {/* ── CANVAS ── */}
          <span style={zoneLabelStyle}>Canvas</span>

          <SectionHeader label="Canvas size" />
          <div style={{ padding: '0 24px 20px' }}>
            <AspectRatioControl />
          </div>

        </div>
      </div>
      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48px',
        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
      }} />
    </aside>
  )
}
