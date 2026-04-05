import { useState, useRef, useEffect } from 'react'
import { UserRound, LogOut, Sun, Moon, Settings } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import { signInWithGoogle, signOut } from '@/lib/auth'

export function MobileTopBar() {
  const user = useEditorStore((s) => s.user)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
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
            /* Pro/signed-in: avatar opens action sheet */
            <button type="button" onClick={() => setSheetOpen(true)} aria-label="Account menu"
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
          ) : (
            /* Free/signed-out: Sign In + Go Pro */
            <>
              <button type="button" onClick={() => setSheetOpen(true)} aria-label="Settings"
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ps-text-tertiary)', borderRadius: '8px' }}>
                <Settings size={18} />
              </button>
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

      {/* Account/Settings action sheet */}
      {sheetOpen && <MobileAccountSheet user={user} onClose={() => setSheetOpen(false)} />}
    </>
  )
}

// ── Mobile action sheet — slides up from bottom ──
function MobileAccountSheet({ user, onClose }: { user: import('@supabase/supabase-js').User | null; onClose: () => void }) {
  const theme = useEditorStore((s) => s.theme)
  const setTheme = useEditorStore((s) => s.setTheme)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const raf = requestAnimationFrame(() => document.addEventListener('mousedown', handler))
    return () => { cancelAnimationFrame(raf); document.removeEventListener('mousedown', handler) }
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }} />

      {/* Sheet */}
      <div ref={ref} style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
        background: 'var(--ps-bg-surface)', borderRadius: '16px 16px 0 0',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '100px', background: 'var(--ps-border-strong)' }} />
        </div>

        {/* User info */}
        {user && (
          <div style={{ padding: '8px 20px 12px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '0.5px solid var(--ps-border)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '20px', overflow: 'hidden', background: 'var(--ps-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserRound size={20} style={{ color: 'var(--ps-text-tertiary)' }} />
              )}
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ps-text-primary)', display: 'block' }}>
                {user.user_metadata?.full_name || user.email || 'User'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)' }}>{user.email}</span>
            </div>
          </div>
        )}

        {/* Theme toggle row */}
        <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{
            width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px',
            background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '15px', fontWeight: 500, color: 'var(--ps-text-primary)',
            minHeight: '48px',
          }}>
          {theme === 'light' ? <Moon size={20} style={{ color: 'var(--ps-text-secondary)' }} /> : <Sun size={20} style={{ color: 'var(--ps-text-secondary)' }} />}
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>

        {/* Sign out (only if signed in) */}
        {user && (
          <button type="button" onClick={() => { signOut(); onClose() }}
            style={{
              width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px',
              background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '15px', fontWeight: 500, color: 'var(--ps-text-danger, #dc2626)',
              minHeight: '48px', borderTop: '0.5px solid var(--ps-border)',
            }}>
            <LogOut size={20} />
            Sign out
          </button>
        )}

        {/* Cancel */}
        <button type="button" onClick={onClose}
          style={{
            width: '100%', padding: '14px 20px',
            background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '15px', fontWeight: 400, color: 'var(--ps-text-tertiary)',
            minHeight: '48px', borderTop: '0.5px solid var(--ps-border)',
            textAlign: 'center',
          }}>
          Cancel
        </button>
      </div>
    </>
  )
}
