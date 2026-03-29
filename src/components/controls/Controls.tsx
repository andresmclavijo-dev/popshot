import {
  Layers, CornerUpRight, Sun, Monitor,
  Layout, Palette, AlignCenter, Maximize2,
} from 'lucide-react'
import { BackgroundPicker, ShuffleButton } from './BackgroundPicker'
import { PaddingControl } from './PaddingControl'
import { CornerRadiusControl } from './CornerRadiusControl'
import { ShadowPicker } from './ShadowPicker'
import { FramePicker } from './FramePicker'
import { AspectRatioControl } from './AspectRatioControl'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { openCheckout } from '@/lib/lemonSqueezy'
import type { LucideIcon } from 'lucide-react'
import type { Background } from '@/types'

const zoneLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--color-text-tertiary)',
  marginBottom: '10px',
  display: 'block',
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
            fontSize: '10px',
            fontWeight: 700,
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
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>$29</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>$19</span>
          <span style={{ fontSize: '10px', color: 'var(--color-app-accent)', fontWeight: 500 }}>Launch price</span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          One-time. No subscription. Yours forever.
        </span>
        <button
          type="button"
          onClick={() => openCheckout()}
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
          $19 · one-time · no subscription
        </span>
      </PopoverContent>
    </Popover>
  )
}

function Section({ icon, label, children, isFirst = false, action }: {
  icon: LucideIcon
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
        paddingTop: isFirst ? '8px' : '24px',
        paddingBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SectionHeader icon={icon} label={label} />
        {action}
      </div>
      {children}
    </section>
  )
}

function LockedSection({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <section style={{ paddingTop: '24px', paddingBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SectionHeader icon={icon} label={label} />
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
      <div style={{
        background: 'rgba(108, 71, 255, 0.025)',
        borderRadius: '10px',
        padding: '12px 16px 16px',
        margin: '0 -16px',
      }}>
        <div style={zoneLabelStyle}>Image</div>
        <Section icon={CornerUpRight} label="Corner radius" isFirst>
          <CornerRadiusControl />
        </Section>
        <Section icon={Sun} label="Shadow">
          <ShadowPicker />
        </Section>
        <Section icon={Monitor} label="Frame">
          <FramePicker />
        </Section>
      </div>

      {/* Canvas zone */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.018)',
        borderRadius: '10px',
        padding: '12px 16px 16px',
        margin: '4px -16px 0',
      }}>
        <div style={zoneLabelStyle}>Canvas</div>
        <Section icon={Palette} label="Background" isFirst action={<ShuffleButton />}>
          <BackgroundPicker onHoverBackground={onHoverBackground} />
        </Section>
        <Section icon={AlignCenter} label="Padding">
          <PaddingControl />
        </Section>
        <Section icon={Maximize2} label="Canvas size">
          <AspectRatioControl />
        </Section>
      </div>

      <LockedSection icon={Layers} label="Presets" />
      <LockedSection icon={Layout} label="Watermark" />
    </aside>
  )
}
