import { useState, useCallback } from 'react'
import { Canvas } from '@/components/canvas/Canvas'
import { MobileTopBar } from './MobileTopBar'
import { MobileBottomBar, type MobileTab } from './MobileBottomBar'
import { MobileControlsSheet } from './MobileControlsSheet'

export function MobileShell() {
  const [activeTab, setActiveTab] = useState<MobileTab | null>(null)
  const handleCloseSheet = useCallback(() => setActiveTab(null), [])

  return (
    <div style={{
      width: '100vw', height: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: 'var(--ps-bg-page)', position: 'relative',
    }}>
      <MobileTopBar />

      {/* Canvas area — fills space between top bar and bottom bar */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 0, padding: '8px',
      }}>
        <Canvas hoveredBackground={null} />
        <MobileControlsSheet activeTab={activeTab} onClose={handleCloseSheet} />
      </div>

      <MobileBottomBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
