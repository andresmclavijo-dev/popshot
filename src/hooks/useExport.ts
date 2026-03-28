import { useState, useCallback } from 'react'
import { exportAsPng, copyToClipboard } from '@/lib/exportImage'
import { showToast } from '@/components/shared/Toast'

function shouldShowExportGate(): boolean {
  const proUnlocked = localStorage.getItem('popshot_pro') === 'true'
  if (proUnlocked) return false
  const seen = localStorage.getItem('hasSeenExportGate') === 'true'
  return !seen
}

function markExportGateSeen() {
  localStorage.setItem('hasSeenExportGate', 'true')
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: 'copy' } | { type: 'png'; scale: 1 | 2 } | null>(null)

  const doExportPng = useCallback(async (scale: 1 | 2) => {
    setIsExporting(true)
    try {
      await exportAsPng(scale)
      showToast(`Saved · ${scale}x`)
    } catch {
      showToast('Export failed — try again', 'error')
    } finally {
      setIsExporting(false)
    }
  }, [])

  const doCopyImage = useCallback(async () => {
    setIsExporting(true)
    try {
      await copyToClipboard()
      setCopied(true)
      showToast('Image copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Export failed — try again', 'error')
    } finally {
      setIsExporting(false)
    }
  }, [])

  const exportPng = useCallback(async (scale: 1 | 2) => {
    if (shouldShowExportGate()) {
      setPendingAction({ type: 'png', scale })
      setShowGate(true)
      return
    }
    await doExportPng(scale)
  }, [doExportPng])

  const copyImage = useCallback(async () => {
    if (shouldShowExportGate()) {
      setPendingAction({ type: 'copy' })
      setShowGate(true)
      return
    }
    await doCopyImage()
  }, [doCopyImage])

  const proceedWithWatermark = useCallback(async () => {
    markExportGateSeen()
    setShowGate(false)
    if (pendingAction?.type === 'copy') {
      await doCopyImage()
    } else if (pendingAction?.type === 'png') {
      await doExportPng(pendingAction.scale)
    }
    setPendingAction(null)
  }, [pendingAction, doCopyImage, doExportPng])

  const dismissGate = useCallback(() => {
    markExportGateSeen()
    setShowGate(false)
    setPendingAction(null)
  }, [])

  return { exportPng, copyImage, isExporting, copied, showGate, proceedWithWatermark, dismissGate }
}
