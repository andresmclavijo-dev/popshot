import { useState, useCallback } from 'react'
import { exportAsPng, copyToClipboard } from '@/lib/exportImage'
import { showToast } from '@/components/shared/Toast'

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const exportPng = useCallback(async (scale: 1 | 2) => {
    setIsExporting(true)
    try {
      await exportAsPng(scale)
      showToast(`Saved · ${scale}x`)
    } finally {
      setIsExporting(false)
    }
  }, [])

  const copyImage = useCallback(async () => {
    setIsExporting(true)
    try {
      await copyToClipboard()
      setCopied(true)
      showToast('Image copied')
      setTimeout(() => setCopied(false), 2000)
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { exportPng, copyImage, isExporting, copied }
}
