import { BackgroundPicker } from './BackgroundPicker'
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
  marginBottom: '10px',
}

function Section({ label, children, isFirst = false }: {
  label: string
  children: React.ReactNode
  isFirst?: boolean
}) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: isFirst ? '16px' : '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--color-app-border)',
      }}
    >
      <h3 style={sectionLabelStyle}>{label}</h3>
      {children}
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
      <Section label="Background" isFirst>
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
    </aside>
  )
}
