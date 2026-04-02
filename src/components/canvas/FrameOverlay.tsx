import type { FrameType } from '@/types'

function MacOSTitleBar({ variant }: { variant: 'light' | 'dark' }) {
  const bgColor = variant === 'light' ? '#FFFFFF' : '#2D2D2D'
  const borderColor = variant === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)'

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '28px',
        background: bgColor,
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        border: `1px solid ${borderColor}`,
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '20px',
        gap: '8px',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="6" fill="#FF5F57" />
        <circle cx="6" cy="6" r="5.5" fill="transparent" stroke="#E0443E" strokeWidth="1" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="6" fill="#FFBD2E" />
        <circle cx="6" cy="6" r="5.5" fill="transparent" stroke="#DEA123" strokeWidth="1" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <circle cx="6" cy="6" r="6" fill="#28C840" />
        <circle cx="6" cy="6" r="5.5" fill="transparent" stroke="#1AAB29" strokeWidth="1" />
      </svg>
    </div>
  )
}

function SafariBar() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '52px',
        background: '#FFFFFF',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        border: '1px solid rgba(0,0,0,0.12)',
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Traffic lights row */}
      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px', gap: '8px', height: '28px' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <circle cx="6" cy="6" r="6" fill="#FF5F57" />
          <circle cx="6" cy="6" r="5.5" fill="transparent" stroke="#E0443E" strokeWidth="1" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <circle cx="6" cy="6" r="6" fill="#FFBD2E" />
          <circle cx="6" cy="6" r="5.5" fill="transparent" stroke="#DEA123" strokeWidth="1" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <circle cx="6" cy="6" r="6" fill="#28C840" />
          <circle cx="6" cy="6" r="5.5" fill="transparent" stroke="#1AAB29" strokeWidth="1" />
        </svg>
      </div>
      {/* URL bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 60px', height: '24px' }}>
        <div style={{
          width: '100%',
          maxWidth: '360px',
          height: '18px',
          background: '#F0F0F0',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: '40%', height: '4px', background: '#D0D0D0', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  )
}

function ArcBar() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '36px',
        background: '#1A1A2E',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Sidebar indicator */}
      <div style={{
        width: '3px',
        height: '20px',
        background: 'linear-gradient(180deg, #7C5DFA, #EC4899)',
        borderRadius: '2px',
        marginLeft: '12px',
      }} />
      {/* Colored tab strip */}
      <div style={{ display: 'flex', gap: '4px', marginLeft: '12px', flex: 1 }}>
        <div style={{
          height: '22px',
          padding: '0 12px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ width: '36px', height: '3px', background: 'rgba(255,255,255,0.5)', borderRadius: '1.5px' }} />
        </div>
        <div style={{
          height: '22px',
          padding: '0 12px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ width: '24px', height: '3px', background: 'rgba(255,255,255,0.25)', borderRadius: '1.5px' }} />
        </div>
      </div>
      {/* Traffic lights */}
      <div style={{ display: 'flex', gap: '6px', marginRight: '14px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
      </div>
    </div>
  )
}

function CardFrame() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '12px',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  )
}

function StackFrame() {
  return (
    <>
      {/* Bottom card (furthest back) */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          right: '-8px',
          bottom: '-8px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.4)',
          border: '1px solid rgba(0,0,0,0.06)',
          pointerEvents: 'none',
          zIndex: -2,
        }}
      />
      {/* Middle card */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          right: '-4px',
          bottom: '-4px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(0,0,0,0.06)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    </>
  )
}

/** Returns the title-bar height consumed by a frame (used for image paddingTop) */
export function getFrameTopPadding(frame: FrameType): number {
  if (frame === 'macos-light' || frame === 'macos-dark') return 28
  if (frame === 'safari') return 52
  if (frame === 'arc') return 36
  return 0
}

/** Returns the border-radius the frame expects on its container */
export function getFrameRadius(frame: FrameType): number {
  if (frame === 'none') return 0
  if (frame === 'card' || frame === 'stack') return 12
  return 10
}

interface FrameOverlayProps {
  frame: FrameType
}

export function FrameOverlay({ frame }: FrameOverlayProps) {
  if (frame === 'none') return null
  if (frame === 'macos-light') return <MacOSTitleBar variant="light" />
  if (frame === 'macos-dark') return <MacOSTitleBar variant="dark" />
  if (frame === 'safari') return <SafariBar />
  if (frame === 'arc') return <ArcBar />
  if (frame === 'card') return <CardFrame />
  if (frame === 'stack') return <StackFrame />
  return null
}
