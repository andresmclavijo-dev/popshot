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

      if (mod && e.key === '0') {
        e.preventDefault()
        console.log('fit to canvas — coming in v1.5')
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
