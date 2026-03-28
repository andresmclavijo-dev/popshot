import { getPalette } from 'colorthief'
import type { Background } from '@/types'

export async function extractColorsFromImage(imageUrl: string): Promise<Background> {
  const fallback: Background = {
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea, #764ba2)',
  }

  try {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load image'))
    })

    const palette = await getPalette(img, { colorCount: 2 })

    if (!palette || palette.length < 2) return fallback

    const hex1 = palette[0].hex()
    const hex2 = palette[1].hex()

    return {
      type: 'gradient',
      value: `linear-gradient(135deg, ${hex1}, ${hex2})`,
    }
  } catch {
    return fallback
  }
}
