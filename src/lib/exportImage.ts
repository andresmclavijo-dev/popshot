import { toPng, toBlob } from 'html-to-image'

function getCanvasNode(): HTMLElement {
  const node = document.getElementById('export-canvas')
  if (!node) throw new Error('Export canvas element not found')
  return node
}

export async function exportAsPng(scale: 1 | 2): Promise<void> {
  const node = getCanvasNode()
  try {
    const dataUrl = await toPng(node, { pixelRatio: scale })
    const link = document.createElement('a')
    link.download = `popshot-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}

export async function copyToClipboard(): Promise<void> {
  const node = getCanvasNode()
  try {
    const blob = await toBlob(node, { pixelRatio: 2 })
    if (!blob) throw new Error('Failed to create image blob')
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
  } catch (error) {
    console.error('Copy to clipboard failed:', error)
    throw error
  }
}
