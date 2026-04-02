import { toPng, toJpeg, toBlob } from 'html-to-image'
import { useEditorStore } from '@/store/useEditorStore'

export type ExportFormat = 'png' | 'jpg'
export type ExportScale = 1 | 2 | 3

function getCanvasNode(): HTMLElement {
  const node = document.getElementById('export-canvas')
  if (!node) throw new Error('Export canvas element not found')
  return node
}

async function waitForImageReady(node: HTMLElement): Promise<void> {
  const img = node.querySelector('img') as HTMLImageElement | null
  if (!img) return
  if (img.complete && img.naturalWidth > 0) return

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Image load timeout')), 5000)
    img.onload = () => { clearTimeout(timeout); resolve() }
    img.onerror = () => { clearTimeout(timeout); reject(new Error('Image load error')) }
  })
}

function getPixelRatio(node: HTMLElement, baseRatio: number): number {
  const w = node.offsetWidth
  const maxWidth = 1920
  if (w > maxWidth) return (maxWidth / w) * baseRatio
  return baseRatio
}

const COMMON_OPTIONS = {
  cacheBust: true,
  skipFonts: true,
  filter: (node: HTMLElement) => {
    if (node.nodeType !== 1) return true
    return !node.hasAttribute('data-export-ignore')
  },
}

async function prepareForExport(node: HTMLElement) {
  await waitForImageReady(node)
  await new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )
  await new Promise(resolve => setTimeout(resolve, 50))
}

export async function exportAsImage(scale: ExportScale, format: ExportFormat): Promise<void> {
  const node = getCanvasNode()
  await prepareForExport(node)
  const ratio = getPixelRatio(node, scale * 2)

  if (format === 'jpg') {
    const dataUrl = await toJpeg(node, { ...COMMON_OPTIONS, pixelRatio: ratio, quality: 0.92 })
    const link = document.createElement('a')
    link.download = `popshot-${Date.now()}.jpg`
    link.href = dataUrl
    link.click()
  } else {
    const dataUrl = await toPng(node, { ...COMMON_OPTIONS, pixelRatio: ratio })
    const link = document.createElement('a')
    link.download = `popshot-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }
}

// Legacy wrapper for backward compat
export async function exportAsPng(scale: 1 | 2): Promise<void> {
  const bg = useEditorStore.getState().background
  const format: ExportFormat = bg.type === 'transparent' ? 'png' : 'jpg'
  return exportAsImage(scale, format)
}

export async function copyToClipboard(): Promise<void> {
  const node = getCanvasNode()
  await prepareForExport(node)
  const ratio = getPixelRatio(node, 2 * 2) // Always 2x for clipboard
  const blob = await toBlob(node, { ...COMMON_OPTIONS, pixelRatio: ratio })
  if (!blob) throw new Error('Failed to create image blob')
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
}
