import { useState, useCallback } from 'react'
import { exportAsPng } from '@/lib/exportImage'

export function useExport() {
  const [isExporting, setIsExporting] = useState(false)

  const exportPng = useCallback(async (scale: 1 | 2) => {
    setIsExporting(true)
    try {
      await exportAsPng(scale)
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { exportPng, isExporting }
}
