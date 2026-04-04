import { useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

/**
 * DarkTooltip — matches Paletta's DarkTooltip exactly.
 * Simple hover-based, no delay, absolute positioned dark bubble with rotated square arrow.
 */

type Position = 'top' | 'bottom' | 'right' | 'left'

const TOOLTIP_BG = 'var(--ps-text-primary)'

function DarkTooltipBubble({ label, position }: { label: string; position: Position }) {
  const base: CSSProperties = {
    position: 'absolute', zIndex: 50, whiteSpace: 'nowrap', pointerEvents: 'none',
  }

  const posStyle: CSSProperties =
    position === 'right' ? { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 }
    : position === 'left' ? { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 }
    : position === 'top' ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 }
    : /* bottom */ { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 }

  const arrowStyle: CSSProperties = {
    position: 'absolute', width: 6, height: 6, background: TOOLTIP_BG,
    transform: 'rotate(45deg)',
    ...(position === 'right' ? { left: -3, top: '50%', marginTop: -3 }
      : position === 'left' ? { right: -3, top: '50%', marginTop: -3 }
      : position === 'top' ? { bottom: -3, left: '50%', marginLeft: -3 }
      : /* bottom */ { top: -3, left: '50%', marginLeft: -3 }),
  }

  return (
    <div style={{ ...base, ...posStyle }} role="tooltip">
      <div style={{
        position: 'relative', background: TOOLTIP_BG, color: 'var(--ps-bg-page)',
        padding: '4px 9px', borderRadius: 6,
        fontSize: '11px', fontWeight: 500,
      }}>
        {label}
        <div style={arrowStyle} />
      </div>
    </div>
  )
}

export function DarkTooltip({
  label, position = 'top', children,
}: {
  label: string
  position?: Position
  children: ReactNode
}) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && <DarkTooltipBubble label={label} position={position} />}
    </div>
  )
}
