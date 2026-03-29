import { toPng, toJpeg, toBlob } from 'html-to-image'
import { useEditorStore } from '@/store/useEditorStore'

function getCanvasNode(): HTMLElement {
  const node = document.getElementById('export-canvas')
  if (!node) throw new Error('Export canvas element not found')
  return node
}

/** Wait for the image inside export-canvas to be fully decoded */
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

/** If src is a blob: URL, convert to data URL via canvas drawImage */
async function ensureDataUrl(node: HTMLElement): Promise<void> {
  const img = node.querySelector('img') as HTMLImageElement | null
  if (!img || !img.src.startsWith('blob:')) return
  try {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0)
    img.src = canvas.toDataURL('image/png')
    await new Promise(resolve => setTimeout(resolve, 50))
  } catch {
    // Keep original — export may still fail but worth trying
  }
}

/** Cap pixelRatio so exports stay reasonable (max 2x of 1920px) */
function getPixelRatio(node: HTMLElement, baseRatio: number): number {
  const w = node.offsetWidth
  const maxWidth = 1920
  if (w > maxWidth) return (maxWidth / w) * baseRatio
  return baseRatio
}

const COMMON_OPTIONS = {
  cacheBust: true,
  skipFonts: true,
  filter: (node: Element) => !node.hasAttribute?.('data-export-ignore'),
}

async function prepareForExport(node: HTMLElement) {
  await waitForImageReady(node)
  await ensureDataUrl(node)

  // Log image state for debugging
  const imgs = node.querySelectorAll('img')
  imgs.forEach((img, i) => {
    console.log(`[Popshot] Export canvas img ${i}:`, {
      src: img.src.substring(0, 40),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    })
  })

  // Double rAF + paint buffer
  await new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )
  await new Promise(resolve => setTimeout(resolve, 50))
}

export async function exportAsPng(scale: 1 | 2): Promise<void> {
  const node = getCanvasNode()
  await prepareForExport(node)
  const ratio = getPixelRatio(node, scale * 2)

  const bg = useEditorStore.getState().background
  const useJpeg = bg.type !== 'transparent'

  if (useJpeg) {
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

export async function copyToClipboard(): Promise<void> {
  const node = getCanvasNode()
  await prepareForExport(node)
  const ratio = getPixelRatio(node, 2)
  const blob = await toBlob(node, { ...COMMON_OPTIONS, pixelRatio: ratio })
  if (!blob) throw new Error('Failed to create image blob')
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
}
