import { useEffect, useState, useRef } from 'react'
import { useEditorStore } from '@/store/useEditorStore'

export function CanvasLoading() {
  const isLoading = useEditorStore((s) => s.isLoading)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const [visible, setVisible] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const visibleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const labelTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (isLoading) {
      visibleTimer.current = setTimeout(() => setVisible(true), 200)
      labelTimer.current = setTimeout(() => setShowLabel(true), 300)
    } else {
      clearTimeout(visibleTimer.current)
      clearTimeout(labelTimer.current)
      setVisible(false)
      setShowLabel(false)
    }
    return () => {
      clearTimeout(visibleTimer.current)
      clearTimeout(labelTimer.current)
    }
  }, [isLoading])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        zIndex: 25,
        opacity: 1,
        transition: 'opacity 200ms var(--ease-out)',
      }}
    >
      <div
        className="skeleton-shimmer"
        style={{
          width: '320px',
          height: '200px',
          borderRadius: `${cornerRadius}px`,
        }}
      />
      {showLabel && (
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          Extracting colors...
        </span>
      )}
    </div>
  )
}
