import { useState, useCallback } from 'react'
import { exportAsPng, copyToClipboard } from '@/lib/exportImage'

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const exportPng = useCallback(async (scale: 1 | 2) => {
    setIsExporting(true)
    try {
      await exportAsPng(scale)
    } finally {
      setIsExporting(false)
    }
  }, [])

  const copyImage = useCallback(async () => {
    setIsExporting(true)
    try {
      await copyToClipboard()
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { exportPng, copyImage, isExporting, copied }
}
