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

function IPhoneFrame() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50px',
          border: '3px solid #1A1A18',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '35%',
          height: '28px',
          background: '#1A1A18',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '36%',
          height: '5px',
          background: '#1A1A18',
          borderRadius: '3px',
        }}
      />
    </div>
  )
}

interface FrameOverlayProps {
  frame: FrameType
}

export function FrameOverlay({ frame }: FrameOverlayProps) {
  if (frame === 'none') return null
  if (frame === 'macos-light') return <MacOSTitleBar variant="light" />
  if (frame === 'macos-dark') return <MacOSTitleBar variant="dark" />
  if (frame === 'iphone') return <IPhoneFrame />
  return null
}
