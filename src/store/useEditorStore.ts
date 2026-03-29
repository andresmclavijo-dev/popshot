import { create } from 'zustand'
import type { EditorState, EditorActions, Background, ShadowType, FrameType, AspectRatioType } from '@/types'

interface StoreExtras {
  lastShuffle: number
  triggerShuffle: () => void
  isDemoMode: boolean
  setDemoMode: (v: boolean) => void
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  imageLoaded: boolean
  setImageLoaded: (v: boolean) => void
}

const initialState: EditorState = {
  imageFile: null,
  imageUrl: null,
  background: { type: 'gradient', value: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' },
  padding: 48,
  cornerRadius: 12,
  shadow: 'soft',
  frame: 'none',
  aspectRatio: 'free',
  autoColor: true,
  proUnlocked: false,
}

export const useEditorStore = create<EditorState & EditorActions & StoreExtras>()((set) => ({
  ...initialState,
  lastShuffle: 0,
  isDemoMode: false,
  isLoading: false,
  imageLoaded: false,
  setImage: (file: File, url: string) => set({ imageFile: file, imageUrl: url, imageLoaded: false }),
  setImageLoaded: (v: boolean) => set({ imageLoaded: v }),
  setBackground: (bg: Background) => set({ background: bg }),
  setPadding: (v: number) => set({ padding: v }),
  setCornerRadius: (v: number) => set({ cornerRadius: v }),
  setShadow: (v: ShadowType) => set({ shadow: v }),
  setFrame: (v: FrameType) => set({ frame: v }),
  setAspectRatio: (v: AspectRatioType) => set({ aspectRatio: v }),
  setAutoColor: (v: boolean) => set({ autoColor: v }),
  setProUnlocked: (v: boolean) => set({ proUnlocked: v }),
  setDemoMode: (v: boolean) => set({ isDemoMode: v }),
  setIsLoading: (v: boolean) => set({ isLoading: v }),
  triggerShuffle: () => set({ lastShuffle: Date.now() }),
  reset: () => set({ ...initialState, lastShuffle: 0, isDemoMode: false, isLoading: false, imageLoaded: false }),
}))
