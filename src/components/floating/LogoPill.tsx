import { useRef, useCallback, useState } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { showToast } from '@/components/shared/Toast'

const TAP_COUNT = 7
const TAP_WINDOW_MS = 3000

export function LogoPill() {
  const setProUnlocked = useEditorStore((s) => s.setProUnlocked)
  const tapsRef = useRef<number[]>([])
  const [flashing, setFlashing] = useState(false)

  const handleLogoClick = useCallback(() => {
    const now = Date.now()
    // Remove taps older than the window
    tapsRef.current = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS)
    tapsRef.current.push(now)

    if (tapsRef.current.length >= TAP_COUNT) {
      tapsRef.current = []
      // Unlock
      setProUnlocked(true)
      sessionStorage.setItem('ps_dev', '1')
      ;(window as Window & { __popshotUnlocked?: boolean }).__popshotUnlocked = true
      setFlashing(true)
      setTimeout(() => setFlashing(false), 1000)
      showToast('Dev mode activated')
    }
  }, [setProUnlocked])

  return (
    <div
      className="frosted-pill"
      style={{
        position: 'absolute',
        top: '18px',
        left: '18px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px 8px 10px',
      }}
    >
      <button
        type="button"
        onClick={handleLogoClick}
        aria-label="Popshot logo"
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '7px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          animation: flashing ? 'dev-unlock-flash 1s ease-out' : undefined,
          transition: 'transform 100ms var(--ease-out)',
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        {/* Diamond / hexagon geometric icon */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" />
        </svg>
      </button>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        Popshot
      </span>
    </div>
  )
}
