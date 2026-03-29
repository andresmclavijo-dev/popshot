import { toPng, toBlob } from 'html-to-image'

function getCanvasNode(): HTMLElement {
  const node = document.getElementById('export-canvas')
  if (!node) throw new Error('Export canvas element not found')
  return node
}

async function waitForDomSettle(): Promise<void> {
  await new Promise<void>(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  )
}

/** Convert all <img> elements to base64 data URLs so html-to-image can render them */
async function convertImagesToBase64(container: HTMLElement): Promise<string[]> {
  const images = container.querySelectorAll('img')
  const originalSrcs: string[] = []

  await Promise.all(Array.from(images).map(async (img, i) => {
    originalSrcs[i] = img.src
    try {
      const response = await fetch(img.src)
      const blob = await response.blob()
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      img.src = base64
    } catch {
      // Keep original src if conversion fails
    }
  }))

  // Wait for images to re-render with base64 src
  await new Promise(resolve => setTimeout(resolve, 100))

  return originalSrcs
}

function restoreOriginalSrcs(container: HTMLElement, originalSrcs: string[]) {
  const images = container.querySelectorAll('img')
  Array.from(images).forEach((img, i) => {
    if (originalSrcs[i]) img.src = originalSrcs[i]
  })
}

export async function exportAsPng(scale: 1 | 2): Promise<void> {
  const node = getCanvasNode()
  await waitForDomSettle()
  const originalSrcs = await convertImagesToBase64(node)
  try {
    const dataUrl = await toPng(node, { pixelRatio: scale * 2, cacheBust: true })
    restoreOriginalSrcs(node, originalSrcs)
    const link = document.createElement('a')
    link.download = `popshot-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    restoreOriginalSrcs(node, originalSrcs)
    throw error
  }
}

export async function copyToClipboard(): Promise<void> {
  const node = getCanvasNode()
  await waitForDomSettle()
  const originalSrcs = await convertImagesToBase64(node)
  try {
    const blob = await toBlob(node, { pixelRatio: 2, cacheBust: true })
    restoreOriginalSrcs(node, originalSrcs)
    if (!blob) throw new Error('Failed to create image blob')
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
  } catch (error) {
    restoreOriginalSrcs(node, originalSrcs)
    throw error
  }
}
