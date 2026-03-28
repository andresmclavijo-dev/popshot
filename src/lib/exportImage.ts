import { toPng } from 'html-to-image'

export async function exportAsPng(scale: 1 | 2): Promise<void> {
  const node = document.getElementById('export-canvas')
  if (!node) {
    throw new Error('Export canvas element not found')
  }

  try {
    const dataUrl = await toPng(node, { pixelRatio: scale })
    const link = document.createElement('a')
    link.download = `screenshoot-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}
