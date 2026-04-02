import { useState, useCallback } from 'react'
import { exportAsImage, copyToClipboard } from '@/lib/exportImage'
import { showToast } from '@/components/shared/Toast'
import { IS_PRO } from '@/lib/config'
import type { ExportFormat, ExportScale } from '@/lib/exportImage'

function isProUser(): boolean {
  return IS_PRO || localStorage.getItem('popshot_pro') === 'true'
}

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: 'copy' } | { type: 'export'; scale: ExportScale; format: ExportFormat } | null>(null)

  const doExport = useCallback(async (scale: ExportScale, format: ExportFormat) => {
    setIsExporting(true)
    try {
      await exportAsImage(scale, format)
      showToast(`Saved · ${scale}x ${format.toUpperCase()}`)
    } catch (err) {
      console.error('[Popshot export error]', err)
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
      showToast('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[Popshot export error]', err)
      showToast('Export failed — try again', 'error')
    } finally {
      setIsExporting(false)
    }
  }, [])

  const exportImage = useCallback(async (scale: ExportScale, format: ExportFormat) => {
    if (!isProUser()) {
      setPendingAction({ type: 'export', scale, format })
      setShowGate(true)
      return
    }
    await doExport(scale, format)
  }, [doExport])

  // Legacy wrapper
  const exportPng = useCallback(async (scale: 1 | 2) => {
    await exportImage(scale, 'png')
  }, [exportImage])

  const copyImage = useCallback(async () => {
    if (!isProUser()) {
      setPendingAction({ type: 'copy' })
      setShowGate(true)
      return
    }
    await doCopyImage()
  }, [doCopyImage])

  const proceedWithWatermark = useCallback(async () => {
    setShowGate(false)
    if (pendingAction?.type === 'copy') {
      await doCopyImage()
    } else if (pendingAction?.type === 'export') {
      await doExport(pendingAction.scale, pendingAction.format)
    }
    setPendingAction(null)
  }, [pendingAction, doCopyImage, doExport])

  const dismissGate = useCallback(() => {
    setShowGate(false)
    setPendingAction(null)
  }, [])

  return { exportImage, exportPng, copyImage, isExporting, copied, showGate, proceedWithWatermark, dismissGate }
}
