import { BackgroundPicker, ShuffleButton } from './BackgroundPicker'
import { PaddingControl } from './PaddingControl'
import { CornerRadiusControl } from './CornerRadiusControl'
import { ShadowPicker } from './ShadowPicker'
import { FramePicker } from './FramePicker'
import { AspectRatioControl } from './AspectRatioControl'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Background } from '@/types'

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  textTransform: 'none',
  letterSpacing: '0.06em',
}

const zoneLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--color-text-tertiary)',
  padding: '14px 0 6px',
}

function ProBadge() {
  return (
    <Popover>
      <PopoverTrigger
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'inline-flex',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #6C47FF, #9C47FF)',
            color: '#FFFFFF',
            padding: '2px 6px',
            borderRadius: '9999px',
            display: 'inline-block',
            lineHeight: 1.4,
          }}
        >
          PRO
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="left"
        sideOffset={8}
        style={{
          width: '220px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-app-accent)',
          }}
        >
          PRO FEATURE
        </span>
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Make every screenshot stunning
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          $9 once. No subscription. Yours forever.
        </span>
        <button
          type="button"
          onClick={() => console.log('open payment modal — Lemon Squeezy coming soon')}
          style={{
            width: '100%',
            height: '30px',
            background: 'var(--color-app-accent)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            marginTop: '4px',
          }}
        >
          Get Popshot Pro
        </button>
        <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          $9 · one-time · no subscription
        </span>
      </PopoverContent>
    </Popover>
  )
}

function Section({ label, children, isFirst = false, action }: {
  label: string
  children: React.ReactNode
  isFirst?: boolean
  action?: React.ReactNode
}) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: isFirst ? '8px' : '20px',
        paddingBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <h3 style={sectionLabelStyle}>{label}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function LockedSection({ label }: { label: string }) {
  return (
    <section style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
        }}
      >
        <h3 style={sectionLabelStyle}>{label}</h3>
        <ProBadge />
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', padding: '10px 0' }}>
        Available in Pro
      </div>
    </section>
  )
}

export function Controls({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  return (
    <aside
      style={{
        width: '300px',
        minWidth: '300px',
        height: '100%',
        overflowY: 'auto',
        background: 'var(--color-bg-panel)',
        borderLeft: '1px solid var(--color-app-border)',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image zone */}
      <div style={{ margin: '0 -16px', padding: '0 16px 4px' }}>
        <div style={zoneLabelStyle}>Image</div>
        <Section label="Corner radius" isFirst>
          <CornerRadiusControl />
        </Section>
        <Section label="Shadow">
          <ShadowPicker />
        </Section>
        <Section label="Frame">
          <FramePicker />
        </Section>
      </div>

      <div style={{ margin: '0 -16px', padding: '0 16px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-app-border)', margin: 0 }} />
      </div>

      {/* Canvas zone */}
      <div style={{ margin: '0 -16px', padding: '0 16px 4px' }}>
        <div style={zoneLabelStyle}>Canvas</div>
        <Section label="Background" isFirst action={<ShuffleButton />}>
          <BackgroundPicker onHoverBackground={onHoverBackground} />
        </Section>
        <Section label="Padding">
          <PaddingControl />
        </Section>
        <Section label="Canvas size">
          <AspectRatioControl />
        </Section>
      </div>

      <div style={{ margin: '0 -16px', padding: '0 16px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-app-border)', margin: 0 }} />
      </div>

      <LockedSection label="Presets" />
      <LockedSection label="Watermark" />
    </aside>
  )
}
