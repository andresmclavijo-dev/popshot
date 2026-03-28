import { useState, useCallback } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { extractColorsFromImage } from '@/lib/colorExtract'

export function useImageUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const setImage = useEditorStore((s) => s.setImage)
  const setBackground = useEditorStore((s) => s.setBackground)
  const setDemoMode = useEditorStore((s) => s.setDemoMode)
  const setIsLoading = useEditorStore((s) => s.setIsLoading)
  const autoColor = useEditorStore((s) => s.autoColor)

  const handleFile = useCallback(
    async (file: File, isDemo = false) => {
      if (!file.type.startsWith('image/')) return

      setIsLoading(true)
      const url = URL.createObjectURL(file)
      setImage(file, url)
      setDemoMode(isDemo)

      if (autoColor) {
        const bg = await extractColorsFromImage(url)
        setBackground(bg)
      }
      setIsLoading(false)
    },
    [autoColor, setImage, setBackground, setDemoMode, setIsLoading],
  )

  return { handleFile, isDragging, setIsDragging }
}
