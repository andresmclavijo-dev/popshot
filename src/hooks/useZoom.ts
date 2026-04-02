import { useCallback, useEffect, useRef } from 'react'
import { useEditorStore } from '@/store/useEditorStore'

const ZOOM_MIN = 0.25
const ZOOM_MAX = 4
const ZOOM_STEP = 0.1

// Workspace insets for floating panels
const PANEL_RIGHT = 260  // right panel width + gap
const TOOLBAR_BOTTOM = 80 // bottom toolbar height + gap
const FIT_PADDING = 80    // breathing room

function clampZoom(z: number): number {
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(z * 100) / 100))
}

function roundToStep(z: number, step: number): number {
  return Math.round(z / step) * step
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

    // Available space = workspace minus panel offsets and padding
    const wW = workspace.clientWidth - PANEL_RIGHT - FIT_PADDING
    const wH = workspace.clientHeight - TOOLBAR_BOTTOM - FIT_PADDING

    // Canvas natural size (unscaled)
    const cW = canvas.scrollWidth
    const cH = canvas.scrollHeight

    if (cW <= 0 || cH <= 0 || wW <= 0 || wH <= 0) return

    const raw = Math.min(wW / cW, wH / cH)
    const clamped = Math.max(ZOOM_MIN, Math.min(2.0, raw))
    const rounded = roundToStep(clamped, 0.05)
    setZoom(rounded)
  }, [workspaceRef, canvasRef, setZoom])

  // React to fit requests (from store)
  useEffect(() => {
    if (fitRequested > prevFit.current) {
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
    }

    workspace.addEventListener('wheel', handler, { passive: false })
    return () => workspace.removeEventListener('wheel', handler)
  }, [workspaceRef])

  return { zoom, zoomIn, zoomOut, zoomTo100, zoomToLevel, fitToScreen }
}
