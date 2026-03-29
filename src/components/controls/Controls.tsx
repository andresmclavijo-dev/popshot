import { BackgroundPicker, ShuffleButton } from './BackgroundPicker'
import { PaddingControl } from './PaddingControl'
import { CornerRadiusControl } from './CornerRadiusControl'
import { ShadowPicker } from './ShadowPicker'
import { FramePicker } from './FramePicker'
import { AspectRatioControl } from './AspectRatioControl'
import { SectionDivider } from '@/components/shared/SectionHeader'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { openCheckout } from '@/lib/lemonSqueezy'
import type { Background } from '@/types'

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
        padding: '8px 16px 32px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SectionDivider label="Corner radius" />
      <CornerRadiusControl />

      <SectionDivider label="Shadow" />
      <ShadowPicker />

      <SectionDivider label="Frame" />
      <FramePicker />

      <SectionDivider label="Background" action={<ShuffleButton />} />
      <BackgroundPicker onHoverBackground={onHoverBackground} />

      <SectionDivider label="Padding" />
      <PaddingControl />

      <SectionDivider label="Canvas size" />
      <AspectRatioControl />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '24px', paddingBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>Presets</span>
        <ProBadge />
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', paddingBottom: '20px' }}>
        Available in Pro
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '24px', paddingBottom: '14px', borderTop: '0.5px solid var(--color-app-border)' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>Watermark</span>
        <ProBadge />
      </div>
      <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', paddingBottom: '20px' }}>
        Available in Pro
      </div>
    </aside>
  )
}
