import { useState } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { openCheckout } from '@/lib/lemonSqueezy'
import { showToast } from '@/components/shared/Toast'

interface LicenseModalProps {
  open: boolean
  onClose: () => void
}

export function LicenseModal({ open, onClose }: LicenseModalProps) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setProUnlocked = useEditorStore((s) => s.setProUnlocked)

  if (!open) return null

  const activate = async () => {
    if (!key.trim()) { setError('Enter a license key'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/validate-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseKey: key.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        localStorage.setItem('popshot_pro', 'true')
        localStorage.setItem('popshot_license_key', key.trim())
        setProUnlocked(true)
        showToast('Pro activated — watermark removed')
        onClose()
      } else {
        setError(data.error || 'Invalid license key')
      }
    } catch {
      setError('Could not validate — check your connection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Activate license"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          animation: 'toast-in 250ms var(--ease-out)',
          margin: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#222222', margin: 0 }}>
          Activate Popshot Pro
        </h2>
        <p style={{ fontSize: '13px', color: '#717171', margin: 0, lineHeight: 1.5 }}>
          Enter the license key from your purchase email
        </p>

        <input
          type="text"
          value={key}
          onChange={(e) => { setKey(e.target.value); setError('') }}
          onKeyDown={(e) => { if (e.key === 'Enter') activate() }}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          autoFocus
          style={{
            width: '100%',
            height: '40px',
            border: error ? '1px solid var(--color-danger)' : '1px solid #DDDDDD',
            borderRadius: '10px',
            padding: '0 14px',
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#222222',
            background: '#FFFFFF',
            outline: 'none',
            transition: 'border-color 150ms var(--ease-out)',
          }}
          onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = '#222222' }}
          onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = '#DDDDDD' }}
        />

        {error && (
          <p style={{ fontSize: '12px', color: 'var(--color-danger)', margin: '-8px 0 0' }}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={activate}
          disabled={loading}
          style={{
            width: '100%',
            height: '36px',
            background: 'var(--color-app-accent)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background 150ms var(--ease-out)',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--color-app-accent-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-app-accent)' }}
        >
          {loading ? 'Validating...' : 'Activate'}
        </button>

        <button
          type="button"
          onClick={() => { openCheckout(); onClose() }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            color: 'var(--color-app-accent)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: '2px 0',
            textAlign: 'center',
          }}
        >
          Buy Popshot Pro — $19 forever
        </button>

        <p style={{ fontSize: '11px', color: '#AAAAAA', textAlign: 'center', margin: 0 }}>
          Check your email after purchase for your license key
        </p>
      </div>
    </div>
  )
}
