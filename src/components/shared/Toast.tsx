import { useEffect, useState, useRef } from 'react'

type ToastVariant = 'success' | 'error'

interface ToastData {
  message: string
  variant: ToastVariant
  id: number
}

let showToastGlobal: ((message: string, variant?: ToastVariant) => void) | null = null

export function showToast(message: string, variant: ToastVariant = 'success') {
  showToastGlobal?.(message, variant)
}

export function ToastProvider() {
  const [toast, setToast] = useState<ToastData | null>(null)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const fadeRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    showToastGlobal = (message: string, variant: ToastVariant = 'success') => {
      // Cancel previous timers
      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeRef.current) clearTimeout(fadeRef.current)
      setToast({ message, variant, id: Date.now() })
      setVisible(true)
    }
    return () => { showToastGlobal = null }
  }, [])

  useEffect(() => {
    if (!toast) return
    const duration = toast.variant === 'error' ? 4000 : 2000
    // Start fade-out before removal
    timerRef.current = setTimeout(() => {
      setVisible(false)
      fadeRef.current = setTimeout(() => setToast(null), 200)
    }, duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (fadeRef.current) clearTimeout(fadeRef.current)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '72px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: toast.variant === 'error' ? 'var(--color-danger)' : 'rgba(0,0,0,0.85)',
        color: '#FFFFFF',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        padding: '8px 18px',
        borderRadius: '20px',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: visible ? 'opacity 150ms var(--ease-out)' : 'opacity 200ms var(--ease-out)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {toast.message}
    </div>
  )
}
