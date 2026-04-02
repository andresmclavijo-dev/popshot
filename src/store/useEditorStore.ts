import { create } from 'zustand'
import type { EditorState, EditorActions, Background, ShadowType, FrameType, AspectRatioType, ImagePosition, WatermarkPosition } from '@/types'
import { IS_PRO } from '@/lib/config'

interface StoreExtras {
  lastShuffle: number
  triggerShuffle: () => void
  isDemoMode: boolean
  setDemoMode: (v: boolean) => void
  isLoading: boolean
  setIsLoading: (v: boolean) => void
  imageLoaded: boolean
  setImageLoaded: (v: boolean) => void
  zoom: number
  setZoom: (v: number) => void
  fitRequested: number
  requestFit: () => void
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
  proUnlocked: IS_PRO,
  imagePosition: 'center',
  backgroundImageUrl: null,
  backgroundImageBlur: 0,
  watermarkUrl: null,
  watermarkPosition: 'bottom-right',
  watermarkOpacity: 80,
  watermarkScale: 0.12,
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
  setImagePosition: (v: ImagePosition) => set({ imagePosition: v }),
  setBackgroundImageUrl: (v: string | null) => set({ backgroundImageUrl: v }),
  setBackgroundImageBlur: (v: number) => set({ backgroundImageBlur: v }),
  setWatermarkUrl: (v: string | null) => set({ watermarkUrl: v }),
  setWatermarkPosition: (v: WatermarkPosition) => set({ watermarkPosition: v }),
  setWatermarkOpacity: (v: number) => set({ watermarkOpacity: v }),
  setWatermarkScale: (v: number) => set({ watermarkScale: v }),
  setDemoMode: (v: boolean) => set({ isDemoMode: v }),
  setIsLoading: (v: boolean) => set({ isLoading: v }),
  triggerShuffle: () => set({ lastShuffle: Date.now() }),
  zoom: 1,
  setZoom: (v: number) => set({ zoom: Math.max(0.25, Math.min(4, v)) }),
  fitRequested: 0,
  requestFit: () => set({ fitRequested: Date.now() }),
  reset: () => set({ ...initialState, lastShuffle: 0, isDemoMode: false, isLoading: false, imageLoaded: false, zoom: 1, fitRequested: Date.now() }),
}))
