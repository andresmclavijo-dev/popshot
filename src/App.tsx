import { useState, useEffect, useCallback } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Canvas } from '@/components/canvas/Canvas'
import { LogoPill } from '@/components/floating/LogoPill'
import { ExportPill } from '@/components/floating/ExportPill'
import { BottomToolbar } from '@/components/floating/BottomToolbar'
import { LeftPill } from '@/components/floating/LeftPill'
import { FloatingPanel } from '@/components/floating/FloatingPanel'
import { PresetGallery } from '@/components/floating/PresetGallery'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
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

  const hasImage = !!imageUrl

  return (
    <TooltipProvider delay={600}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        {/* Canvas — always rendered, shows drop zone when no image */}
        <Canvas hoveredBackground={hoveredBackground} />

        {/* Floating UI — always mounted, fade in when image loaded */}
        <LogoPill />
        <div style={{ opacity: hasImage ? 1 : 0, pointerEvents: hasImage ? 'auto' : 'none', transition: 'opacity 200ms ease-out' }}>
          <ExportPill />
          <FloatingPanel onHoverBackground={setHoveredBackground} />
          <BottomToolbar />
          <LeftPill onOpenGallery={() => setGalleryOpen(true)} />
        </div>

        {/* Modals */}
        <PresetGallery open={galleryOpen} onClose={() => setGalleryOpen(false)} />
        <UpgradeModal />

        <ShortcutBridge />
        <ToastProvider />
      </div>
    </TooltipProvider>
  )
}
