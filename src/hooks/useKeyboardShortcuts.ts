import { useEffect } from 'react'
import { useEditorStore } from '@/store/useEditorStore'

function isInputFocused(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || (el as HTMLElement).isContentEditable
}

interface ShortcutHandlers {
  onExportOpen: () => void
  onCopyClipboard: () => void
  onShuffle?: () => void
}

export function useKeyboardShortcuts({ onExportOpen, onCopyClipboard, onShuffle }: ShortcutHandlers) {
  const reset = useEditorStore((s) => s.reset)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.shiftKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault()
        onShuffle?.()
        return
      }

      if (mod && e.key === 'e') {
        e.preventDefault()
        onExportOpen()
        return
      }

      if (mod && e.key === 'c' && !isInputFocused()) {
        e.preventDefault()
        onCopyClipboard()
        return
      }

      if (mod && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        console.log('redo — coming in v1.5')
        return
      }

      if (mod && e.key === 'z') {
        e.preventDefault()
        console.log('undo — coming in v1.5')
        return
      }

      // Zoom: Cmd+0 = fit to screen
      if (mod && e.key === '0') {
        e.preventDefault()
        useEditorStore.getState().requestFit()
        return
      }

      // Zoom: Cmd+1 = actual size (100%)
      if (mod && e.key === '1') {
        e.preventDefault()
        useEditorStore.getState().setZoom(1)
        return
      }

      // Zoom: Cmd+= or Cmd++ = zoom in
      if (mod && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        const z = useEditorStore.getState().zoom
        useEditorStore.getState().setZoom(Math.min(4, z + 0.1))
        return
      }

      // Zoom: Cmd+- = zoom out
      if (mod && e.key === '-') {
        e.preventDefault()
        const z = useEditorStore.getState().zoom
        useEditorStore.getState().setZoom(Math.max(0.25, z - 0.1))
        return
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputFocused()) {
        e.preventDefault()
        reset()
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [reset, onExportOpen, onCopyClipboard, onShuffle])
}
