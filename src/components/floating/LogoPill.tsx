import { useRef, useCallback, useState } from 'react'
import { ChevronDown, Key, Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useEditorStore } from '@/store/useEditorStore'
import { showToast } from '@/components/shared/Toast'

const TAP_COUNT = 7
const TAP_WINDOW_MS = 3000

function LicenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const setProUnlocked = useEditorStore((s) => s.setProUnlocked)

  const handleActivate = async () => {
    const trimmed = key.trim()
    if (!trimmed) return
    setLoading(true)
    try {
      const res = await fetch('https://api.lemonsqueezy.com/v1/licenses/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: trimmed, instance_name: 'popshot-web' }),
      })
      if (res.ok) {
        localStorage.setItem('popshot_pro', 'true')
        localStorage.setItem('popshot_license_key', trimmed)
        setProUnlocked(true)
        showToast('Pro activated — welcome to Popshot Pro!')
        onClose()
      } else {
        showToast('Invalid key — check your purchase email and try again', 'error')
      }
    } catch {
      showToast('Connection error — try again', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 }} />
      <div className="frosted-pill" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 201, width: '100%', maxWidth: '380px', padding: '28px', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#222', marginBottom: '16px' }}>Activate Popshot Pro</h3>
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Paste your license key here..."
          onKeyDown={(e) => { if (e.key === 'Enter') handleActivate() }}
          autoFocus
          style={{ width: '100%', height: '40px', border: '1px solid var(--color-border-input)', borderRadius: '10px', padding: '0 14px', fontSize: '14px', fontFamily: 'inherit', color: '#222', background: '#FFF', outline: 'none', marginBottom: '12px' }} />
        <button type="button" onClick={handleActivate} disabled={loading || !key.trim()}
          style={{ width: '100%', height: '40px', background: '#222', color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', cursor: loading ? 'wait' : 'pointer', opacity: !key.trim() ? 0.5 : 1, transition: 'background 100ms var(--ease-out)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#333' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#222' }}>
          {loading ? 'Activating...' : 'Activate'}
        </button>
        <p style={{ fontSize: '12px', color: '#6b6b6b', marginTop: '12px', textAlign: 'center' }}>
          Check your email after purchase for your key.<br />Already activated? You're good.
        </p>
      </div>
    </>
  )
}

export function LogoPill() {
  const setProUnlocked = useEditorStore((s) => s.setProUnlocked)
  const tapsRef = useRef<number[]>([])
  const [flashing, setFlashing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [licenseOpen, setLicenseOpen] = useState(false)

  const handleLogoClick = useCallback(() => {
    const now = Date.now()
    tapsRef.current = tapsRef.current.filter((t) => now - t < TAP_WINDOW_MS)
    tapsRef.current.push(now)
    if (tapsRef.current.length >= TAP_COUNT) {
      tapsRef.current = []
      setProUnlocked(true)
      sessionStorage.setItem('ps_dev', '1')
      ;(window as Window & { __popshotUnlocked?: boolean }).__popshotUnlocked = true
      setFlashing(true)
      setTimeout(() => setFlashing(false), 1000)
      showToast('Dev mode activated')
    }
  }, [setProUnlocked])

  return (
    <>
      <div
        className="frosted-pill"
        style={{
          position: 'absolute',
          top: '18px',
          left: '18px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 8px 6px 8px',
        }}
      >
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="Popshot logo"
          style={{
            width: '24px', height: '24px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, border: 'none', cursor: 'pointer', padding: 0,
            animation: flashing ? 'dev-unlock-flash 1s ease-out' : undefined,
            transition: 'transform 100ms var(--ease-out)',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" />
          </svg>
        </button>

        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger render={
            <button type="button" aria-label="Menu"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit', borderRadius: '6px', transition: 'background 100ms var(--ease-out)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }} />
          }>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)', letterSpacing: '-0.01em', lineHeight: 1, userSelect: 'none' }}>
              Popshot
            </span>
            <ChevronDown size={12} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start" sideOffset={4}
            style={{ display: 'flex', flexDirection: 'column', padding: '4px', width: 'auto', minWidth: '180px' }}>
            <button type="button" onClick={() => { setMenuOpen(false); setLicenseOpen(true) }}
              style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
              <Key size={14} aria-hidden="true" /> Enter license key
            </button>
            <Tooltip>
              <TooltipTrigger render={
                <button type="button" style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 500, fontFamily: 'inherit', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-bg-hover)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }} />
              }>
                <Info size={14} aria-hidden="true" /> About
              </TooltipTrigger>
              <TooltipContent side="right">Popshot v1.0 · popshot.app · Made by Andres</TooltipContent>
            </Tooltip>
          </PopoverContent>
        </Popover>
      </div>

      <LicenseModal open={licenseOpen} onClose={() => setLicenseOpen(false)} />
    </>
  )
}
