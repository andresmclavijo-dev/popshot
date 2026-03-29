import { useEffect, useRef, useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { BackgroundPicker, ShuffleButton } from './BackgroundPicker'
import { PaddingControl } from './PaddingControl'
import { CornerRadiusControl } from './CornerRadiusControl'
import { ShadowPicker } from './ShadowPicker'
import { FramePicker } from './FramePicker'
import { AspectRatioControl } from './AspectRatioControl'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { LicenseModal } from '@/components/shared/LicenseModal'
import { useEditorStore } from '@/store/useEditorStore'
import { STYLE_PRESETS } from '@/lib/presets'
import { openCheckout } from '@/lib/lemonSqueezy'
import { showToast } from '@/components/shared/Toast'
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

function PresetsSection() {
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const setBackground = useEditorStore((s) => s.setBackground)
  const setShadow = useEditorStore((s) => s.setShadow)
  const setFrame = useEditorStore((s) => s.setFrame)
  const setPadding = useEditorStore((s) => s.setPadding)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)

  const applyPreset = (preset: typeof STYLE_PRESETS[number]) => {
    setBackground(preset.background)
    setShadow(preset.shadow)
    setFrame(preset.frame)
    setPadding(preset.padding)
    setCornerRadius(preset.cornerRadius)
    showToast(`${preset.label} applied`)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
      {STYLE_PRESETS.map(p => {
        const locked = !proUnlocked
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => locked ? openCheckout() : applyPreset(p)}
            aria-label={locked ? `${p.label} preset — Pro only` : `Apply ${p.label}`}
            style={{
              width: '100%',
              aspectRatio: '4/3',
              background: p.previewGradient,
              borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.06)',
              opacity: locked ? 0.6 : 1,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 0 6px',
              transition: 'opacity 150ms var(--ease-out), transform 150ms var(--ease-out)',
              position: 'relative',
              overflow: 'hidden',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = locked ? '0.8' : '1'
              if (!locked) e.currentTarget.style.transform = 'scale(1.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = locked ? '0.6' : '1'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {locked && (
              <Lock size={14} strokeWidth={2} style={{
                color: '#FFFFFF',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }} />
            )}
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#FFFFFF',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            }}>
              {p.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function Controls({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const [licenseOpen, setLicenseOpen] = useState(false)

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
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div ref={panelRef} style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ paddingBottom: '48px' }}>

          {/* ── STYLE ── */}
          <span style={zoneLabelStyle}>Style</span>

          <SectionHeader label="Presets" />
          <div style={{ padding: '0 24px 20px' }}>
            <PresetsSection />
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

      {/* License footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--color-border)',
        flexShrink: 0,
      }}>
        {proUnlocked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-app-accent)' }}>
            <Check size={12} />
            Pro activated
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setLicenseOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: '#717171',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
              textDecoration: 'underline',
              textDecorationColor: '#DDDDDD',
            }}
          >
            Activate license key
          </button>
        )}
      </div>

      {/* Bottom fade — sits above footer */}
      <div style={{
        position: 'absolute',
        bottom: '49px',
        left: 0,
        right: 0,
        height: '48px',
        background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
      }} />

      <LicenseModal open={licenseOpen} onClose={() => setLicenseOpen(false)} />
    </aside>
  )
}
