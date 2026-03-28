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

      // Clean up previous object URL
      const prevUrl = useEditorStore.getState().imageUrl
      if (prevUrl && prevUrl.startsWith('blob:')) {
        URL.revokeObjectURL(prevUrl)
      }

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
