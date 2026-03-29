import { useState, useCallback } from 'react'
import { useEditorStore } from '@/store/useEditorStore'
import { extractColorsFromImage } from '@/lib/colorExtract'
import { showToast } from '@/components/shared/Toast'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 20

export function useImageUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const setImage = useEditorStore((s) => s.setImage)
  const setBackground = useEditorStore((s) => s.setBackground)
  const setDemoMode = useEditorStore((s) => s.setDemoMode)
  const setIsLoading = useEditorStore((s) => s.setIsLoading)
  const autoColor = useEditorStore((s) => s.autoColor)

  const handleFile = useCallback(
    async (file: File, isDemo = false) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        showToast('Drop a PNG, JPG, WebP, or GIF', 'error')
        return
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showToast('Image too large — try under 20MB', 'error')
        return
      }

      setIsLoading(true)

      // Convert to base64 — html-to-image can capture data URLs but not blob: URLs
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setImage(file, base64)
      setDemoMode(isDemo)

      if (autoColor) {
        try {
          const bg = await extractColorsFromImage(base64)
          setBackground(bg)
        } catch {
          // Keep default gradient
        }
      }
      setIsLoading(false)
    },
    [autoColor, setImage, setBackground, setDemoMode, setIsLoading],
  )

  return { handleFile, isDragging, setIsDragging }
}
