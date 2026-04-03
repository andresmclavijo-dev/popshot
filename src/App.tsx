import { useState, useEffect, useCallback } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Canvas } from '@/components/canvas/Canvas'
import { LeftPanel } from '@/components/panels/LeftPanel'
import { RightPanel } from '@/components/panels/RightPanel'
import { BottomToolbar } from '@/components/floating/BottomToolbar'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import { ExportModal } from '@/components/shared/ExportModal'
import { ToastProvider, showToast } from '@/components/shared/Toast'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useExport } from '@/hooks/useExport'
import { useEditorStore } from '@/store/useEditorStore'
import { checkUpgradeSuccess, isProUnlocked } from '@/lib/checkout'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import type { Background } from '@/types'

function ShortcutBridge() {
  const { exportPng, copyImage } = useExport()
  const setBackground = useEditorStore((s) => s.setBackground)
  const setShadow = useEditorStore((s) => s.setShadow)
  const triggerShuffle = useEditorStore((s) => s.triggerShuffle)

  const onExportOpen = useCallback(() => { exportPng(1) }, [exportPng])
  const handleCopy = useCallback(async () => { await copyImage() }, [copyImage])
  const onShuffle = useCallback(() => {
    const bgs = BACKGROUND_PRESETS.filter((p) => p.id !== 'transparent')
    const shs = SHADOW_PRESETS.filter((p) => p.id !== 'none')
    setBackground(bgs[Math.floor(Math.random() * bgs.length)].background)
    setShadow(shs[Math.floor(Math.random() * shs.length)].id)
    triggerShuffle()
  }, [setBackground, setShadow, triggerShuffle])

  useKeyboardShortcuts({ onExportOpen, onCopyClipboard: handleCopy, onShuffle })
  return null
}

export function App() {
  const [hoveredBackground, setHoveredBackground] = useState<Background | null>(null)
  const setProUnlocked = useEditorStore((s) => s.setProUnlocked)

  useEffect(() => {
    if (isProUnlocked()) setProUnlocked(true)
    if (sessionStorage.getItem('ps_dev') === '1') {
      setProUnlocked(true)
      ;(window as Window & { __popshotUnlocked?: boolean }).__popshotUnlocked = true
    }
    if (checkUpgradeSuccess()) showToast('Check your email for the license key')
  }, [setProUnlocked])

  return (
    <TooltipProvider delay={600}>
      <div style={{
        width: '100vw', height: '100vh', overflow: 'hidden',
        display: 'flex', background: 'var(--ps-bg-page)',
        position: 'relative',
        padding: '8px', gap: '8px', boxSizing: 'border-box',
      }}>
        <LeftPanel />

        {/* Canvas container — takes remaining space between panels */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, minHeight: 0 }}>
          <Canvas hoveredBackground={hoveredBackground} />
          <BottomToolbar />
        </div>

        <RightPanel onHoverBackground={setHoveredBackground} />

        {/* Modals */}
        <UpgradeModal />
        <ExportModal />

        <ShortcutBridge />
        <ToastProvider />
      </div>
    </TooltipProvider>
  )
}
