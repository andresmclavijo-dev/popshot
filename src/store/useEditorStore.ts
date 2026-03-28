import { create } from 'zustand'
import type { EditorState, EditorActions, Background, ShadowType, FrameType, AspectRatioType } from '@/types'

const initialState: EditorState = {
  imageFile: null,
  imageUrl: null,
  background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
  padding: 48,
  cornerRadius: 12,
  shadow: 'soft',
  frame: 'none',
  aspectRatio: 'free',
  autoColor: true,
  proUnlocked: false,
}

export const useEditorStore = create<EditorState & EditorActions>()((set) => ({
  ...initialState,
  setImage: (file: File, url: string) => set({ imageFile: file, imageUrl: url }),
  setBackground: (bg: Background) => set({ background: bg }),
  setPadding: (v: number) => set({ padding: v }),
  setCornerRadius: (v: number) => set({ cornerRadius: v }),
  setShadow: (v: ShadowType) => set({ shadow: v }),
  setFrame: (v: FrameType) => set({ frame: v }),
  setAspectRatio: (v: AspectRatioType) => set({ aspectRatio: v }),
  setAutoColor: (v: boolean) => set({ autoColor: v }),
  setProUnlocked: (v: boolean) => set({ proUnlocked: v }),
  reset: () => set(initialState),
}))
