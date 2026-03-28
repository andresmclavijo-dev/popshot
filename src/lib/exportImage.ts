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

export async function exportAsPng(scale: 1 | 2): Promise<void> {
  const node = getCanvasNode()
  await waitForDomSettle()
  const dataUrl = await toPng(node, { pixelRatio: scale * 2 })
  const link = document.createElement('a')
  link.download = `popshot-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}

export async function copyToClipboard(): Promise<void> {
  const node = getCanvasNode()
  await waitForDomSettle()
  const blob = await toBlob(node, { pixelRatio: 2 })
  if (!blob) throw new Error('Failed to create image blob')
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob }),
  ])
}
