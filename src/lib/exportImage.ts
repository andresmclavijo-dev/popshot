import { toPng, toJpeg, toBlob } from 'html-to-image'
import { useEditorStore } from '@/store/useEditorStore'

function getCanvasNode(): HTMLElement {
  const node = document.getElementById('export-canvas')
  if (!node) throw new Error('Export canvas element not found')
  return node
}

async function waitForDomSettle(): Promise<void> {
  await new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )
  // Additional buffer for paint
  await new Promise(resolve => setTimeout(resolve, 50))
}

/** Wait for the image inside export-canvas to be fully decoded */
async function waitForImageReady(node: HTMLElement): Promise<void> {
  const img = node.querySelector('img') as HTMLImageElement | null
  if (!img || (img.complete && img.naturalWidth > 0)) return
  await new Promise<void>((resolve, reject) => {
    let attempts = 0
    const check = setInterval(() => {
      attempts++
      if (img.complete && img.naturalWidth > 0) {
        clearInterval(check)
        resolve()
      }
      if (attempts > 30) {
        clearInterval(check)
        reject(new Error('Image failed to load'))
      }
    }, 100)
  })
}

/** Cap pixelRatio so exports stay reasonable (max 2x of 1920px) */
function getPixelRatio(node: HTMLElement, baseRatio: number): number {
  const w = node.offsetWidth
  const maxWidth = 1920
  if (w > maxWidth) return (maxWidth / w) * baseRatio
  return baseRatio
}

export async function exportAsPng(scale: 1 | 2): Promise<void> {
  const node = getCanvasNode()
  await waitForImageReady(node)
  await waitForDomSettle()
  const ratio = getPixelRatio(node, scale * 2)

  const bg = useEditorStore.getState().background
  const useJpeg = bg.type !== 'transparent'

  if (useJpeg) {
    const dataUrl = await toJpeg(node, { pixelRatio: ratio, quality: 0.92, cacheBust: true })
    const link = document.createElement('a')
    link.download = `popshot-${Date.now()}.jpg`
    link.href = dataUrl
    link.click()
  } else {
    const dataUrl = await toPng(node, { pixelRatio: ratio, cacheBust: true })
    const link = document.createElement('a')
    link.download = `popshot-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }
}

export async function copyToClipboard(): Promise<void> {
  const node = getCanvasNode()
  await waitForImageReady(node)
  await waitForDomSettle()
  const ratio = getPixelRatio(node, 2)
  const blob = await toBlob(node, { pixelRatio: ratio, cacheBust: true })
  if (!blob) throw new Error('Failed to create image blob')
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
}
