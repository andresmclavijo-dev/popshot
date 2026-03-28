import { useState, useCallback } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { extractColorsFromImage } from '@/lib/colorExtract'

export function useImageUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const setImage = useEditorStore((s) => s.setImage)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return

      const url = URL.createObjectURL(file)
      setImage(file, url)

      if (autoColor) {
        const bg = await extractColorsFromImage(url)
        setBackground(bg)
      }
    },
    [autoColor, setImage, setBackground],
  )

  return { handleFile, isDragging, setIsDragging }
}
