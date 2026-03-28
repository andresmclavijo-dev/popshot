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
    const timer = setTimeout(() => setToast(null), 1500)
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
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--color-text-primary)',
        color: '#FFFFFF',
        fontSize: '13px',
        fontFamily: 'var(--font-sans)',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        zIndex: 9999,
        animation: 'toast-in 0.2s ease-out',
        pointerEvents: 'none',
      }}
    >
      {toast.message}
    </div>
  )
}
