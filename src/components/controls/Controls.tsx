import { BackgroundPicker, ShuffleButton } from './BackgroundPicker'
import { PaddingControl } from './PaddingControl'
import { CornerRadiusControl } from './CornerRadiusControl'
import { ShadowPicker } from './ShadowPicker'
import { FramePicker } from './FramePicker'
import { AspectRatioControl } from './AspectRatioControl'

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--color-text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const ProBadge = () => (
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
)

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
        paddingTop: isFirst ? '16px' : '20px',
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
    <section
      style={{
        paddingTop: '20px',
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
        <ProBadge />
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
          padding: '10px 0',
        }}
      >
        Available in Pro
      </div>
    </section>
  )
}

export function Controls() {
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
      <Section label="Background" isFirst action={<ShuffleButton />}>
        <BackgroundPicker />
      </Section>
      <Section label="Padding">
        <PaddingControl />
      </Section>
      <Section label="Corner Radius">
        <CornerRadiusControl />
      </Section>
      <Section label="Shadow">
        <ShadowPicker />
      </Section>
      <Section label="Frame">
        <FramePicker />
      </Section>
      <Section label="Canvas Size">
        <AspectRatioControl />
      </Section>
      <LockedSection label="Presets" />
      <LockedSection label="Watermark" />

      {/* Upgrade prompt */}
      <div style={{ marginTop: 'auto', paddingBottom: '16px' }}>
        <div
          style={{
            borderTop: '1px solid var(--color-app-border)',
            paddingTop: '16px',
          }}
        />
        <button
          type="button"
          onClick={() => console.log('open upgrade modal')}
          style={{
            width: '100%',
            background: 'var(--color-app-accent-subtle)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '13px', color: 'var(--color-app-accent)', fontWeight: 500 }}>
            Unlock Pro — $9 once
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
            No subscription. Yours forever.
          </div>
        </button>
      </div>
    </aside>
  )
}
