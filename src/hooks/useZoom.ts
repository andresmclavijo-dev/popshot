import { useCallback, useEffect, useRef } from 'react'
import { useEditorStore } from '@/store/useEditorStore'

const ZOOM_MIN = 0.25
const ZOOM_MAX = 4
const ZOOM_STEP = 0.1
const FIT_PADDING = 80 // px of breathing room around canvas

function clampZoom(z: number): number {
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(z * 100) / 100))
}

export function useZoom(workspaceRef: React.RefObject<HTMLDivElement | null>, canvasRef: React.RefObject<HTMLDivElement | null>) {
  const zoom = useEditorStore((s) => s.zoom)
  const setZoom = useEditorStore((s) => s.setZoom)
  const fitRequested = useEditorStore((s) => s.fitRequested)
  const prevFit = useRef(fitRequested)

  const fitToScreen = useCallback(() => {
    const workspace = workspaceRef.current
    const canvas = canvasRef.current
    if (!workspace || !canvas) return

    const wW = workspace.clientWidth - FIT_PADDING * 2
    const wH = workspace.clientHeight - FIT_PADDING * 2
    // Canvas natural size (unscaled)
    const cW = canvas.scrollWidth
    const cH = canvas.scrollHeight

    if (cW <= 0 || cH <= 0) return

    const scale = clampZoom(Math.min(wW / cW, wH / cH, 1))
    setZoom(scale)
  }, [workspaceRef, canvasRef, setZoom])

  // React to fit requests (from store)
  useEffect(() => {
    if (fitRequested > prevFit.current) {
      // Small delay to let the DOM update first
      requestAnimationFrame(() => fitToScreen())
      prevFit.current = fitRequested
    }
  }, [fitRequested, fitToScreen])

  const zoomIn = useCallback(() => {
    setZoom(clampZoom(zoom + ZOOM_STEP))
  }, [zoom, setZoom])

  const zoomOut = useCallback(() => {
    setZoom(clampZoom(zoom - ZOOM_STEP))
  }, [zoom, setZoom])

  const zoomTo100 = useCallback(() => {
    setZoom(1)
  }, [setZoom])

  const zoomToLevel = useCallback((level: number) => {
    setZoom(clampZoom(level))
  }, [setZoom])

  // Pinch-to-zoom via wheel events (ctrlKey === true for trackpad pinch)
  useEffect(() => {
    const workspace = workspaceRef.current
    if (!workspace) return

    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const currentZoom = useEditorStore.getState().zoom
        const delta = -e.deltaY * 0.005
        const newZoom = clampZoom(currentZoom + delta)
        useEditorStore.getState().setZoom(newZoom)
      }
      // Regular scroll (no ctrl): let browser handle natively for panning
    }

    workspace.addEventListener('wheel', handler, { passive: false })
    return () => workspace.removeEventListener('wheel', handler)
  }, [workspaceRef])

  return { zoom, zoomIn, zoomOut, zoomTo100, zoomToLevel, fitToScreen }
}
