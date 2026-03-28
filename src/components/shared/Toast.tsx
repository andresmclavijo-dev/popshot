import { useEffect, useState } from 'react'

let showToastGlobal: ((message: string) => void) | null = null

export function showToast(message: string) {
  showToastGlobal?.(message)
}

export function ToastProvider() {
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null)

  useEffect(() => {
    showToastGlobal = (message: string) => {
      setToast({ message, id: Date.now() })
    }
    return () => { showToastGlobal = null }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(timer)
  }, [toast])

  if (!toast) return null

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: 'var(--color-text-primary)',
        color: '#FFFFFF',
        fontSize: '13px',
        fontFamily: 'var(--font-sans)',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        zIndex: 9999,
        animation: 'toast-in 200ms var(--ease-out)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="7" fill="#16A34A" />
        <path d="M4 7l2 2 4-4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {toast.message}
    </div>
  )
}
