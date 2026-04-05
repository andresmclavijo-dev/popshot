import { useState, useRef, useEffect } from 'react'
import { UserRound, LogOut } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import { signInWithGoogle, signOut } from '@/lib/auth'

export function MobileTopBar() {
  const user = useEditorStore((s) => s.user)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)

  return (
    <div style={{
      height: '52px', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px',
      background: 'var(--ps-bg-panel)',
      borderBottom: '0.5px solid var(--ps-border)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '7px',
          background: 'var(--ps-brand-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" />
          </svg>
        </div>
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ps-text-primary)' }}>Popshot</span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <MobileAvatarMenu user={user} />
        ) : (
          <>
            <button type="button" onClick={signInWithGoogle}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', color: 'var(--ps-text-primary)', padding: '6px 0' }}>
              Sign In
            </button>
            {!proUnlocked && (
              <button type="button" onClick={openUpgradeModal}
                style={{
                  height: '30px', padding: '0 12px',
                  background: 'var(--ps-text-primary)', color: 'var(--ps-bg-page)',
                  border: 'none', borderRadius: '100px',
                  fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                }}>
                Go Pro
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Avatar dropdown for signed-in users ──
function MobileAvatarMenu({ user }: { user: import('@supabase/supabase-js').User }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Account menu" aria-expanded={open}
        style={{
          width: '32px', height: '32px', borderRadius: '16px', overflow: 'hidden',
          border: 'none', cursor: 'pointer', padding: 0, background: 'var(--ps-bg-hover)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        {user.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <UserRound size={16} style={{ color: 'var(--ps-text-tertiary)' }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '6px', zIndex: 999,
          background: 'var(--ps-bg-surface)', borderRadius: '10px',
          border: '1px solid var(--ps-border)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          minWidth: '180px', overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--ps-border)' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.user_metadata?.full_name || user.email || 'User'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)' }}>{user.email}</span>
          </div>
          <button type="button" onClick={() => { signOut(); setOpen(false) }}
            style={{
              width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
              color: 'var(--ps-text-danger, #dc2626)',
            }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}
