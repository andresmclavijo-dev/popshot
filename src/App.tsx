import { useState, useEffect, useCallback } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Canvas } from '@/components/canvas/Canvas'
import { LandingPage } from '@/components/landing/LandingPage'
import { LogoPill } from '@/components/floating/LogoPill'
import { ExportPill } from '@/components/floating/ExportPill'
import { BottomToolbar } from '@/components/floating/BottomToolbar'
import { FloatingPanel } from '@/components/floating/FloatingPanel'
import { PresetGallery } from '@/components/floating/PresetGallery'
import { ToastProvider, showToast } from '@/components/shared/Toast'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useExport } from '@/hooks/useExport'
import { useEditorStore } from '@/store/useEditorStore'
import { checkUpgradeSuccess, isProUnlocked } from '@/lib/lemonSqueezy'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import type { Background } from '@/types'

function ShortcutBridge() {
  const { exportPng, copyImage } = useExport()
  const setBackground = useEditorStore((s) => s.setBackground)
  const setShadow = useEditorStore((s) => s.setShadow)
  const triggerShuffle = useEditorStore((s) => s.triggerShuffle)

  const onExportOpen = useCallback(() => {
    exportPng(1)
  }, [exportPng])

  const handleCopy = useCallback(async () => {
    await copyImage()
  }, [copyImage])

  const onShuffle = useCallback(() => {
    const shuffleable = BACKGROUND_PRESETS.filter((p) => p.id !== 'transparent')
    const shadows = SHADOW_PRESETS.filter((p) => p.id !== 'none')
    const bg = shuffleable[Math.floor(Math.random() * shuffleable.length)]
    const sh = shadows[Math.floor(Math.random() * shadows.length)]
    setBackground(bg.background)
    setShadow(sh.id)
    triggerShuffle()
  }, [setBackground, setShadow, triggerShuffle])

  useKeyboardShortcuts({ onExportOpen, onCopyClipboard: handleCopy, onShuffle })

  return null
}

export function App() {
  const [hoveredBackground, setHoveredBackground] = useState<Background | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const setProUnlocked = useEditorStore((s) => s.setProUnlocked)
  const imageUrl = useEditorStore((s) => s.imageUrl)

  useEffect(() => {
    if (isProUnlocked()) setProUnlocked(true)
    if (sessionStorage.getItem('ps_dev') === '1') {
      setProUnlocked(true)
      ;(window as Window & { __popshotUnlocked?: boolean }).__popshotUnlocked = true
    }
    if (checkUpgradeSuccess()) showToast('Check your email for the license key')
  }, [setProUnlocked])

  const isEditor = !!imageUrl

  return (
    <TooltipProvider delay={600}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {isEditor ? (
          <>
            {/* Editor view */}
            <Canvas hoveredBackground={hoveredBackground} />
            <div style={{ opacity: 1, transition: 'opacity 200ms var(--ease-out)' }}>
              <ExportPill />
              <FloatingPanel onHoverBackground={setHoveredBackground} />
              <BottomToolbar />
            </div>
          </>
        ) : (
          /* Landing page */
          <LandingPage onOpenGallery={() => setGalleryOpen(true)} />
        )}

        {/* Always visible */}
        <LogoPill />
        <ShortcutBridge />
        <ToastProvider />

        {/* Gallery modal — available from both views */}
        <PresetGallery open={galleryOpen} onClose={() => setGalleryOpen(false)} />
      </div>
    </TooltipProvider>
  )
}
