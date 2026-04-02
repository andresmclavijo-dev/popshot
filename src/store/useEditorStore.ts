import { create } from 'zustand'
import type { EditorState, EditorActions, Background, ShadowType, FrameType, AspectRatioType, ImagePosition, WatermarkPosition } from '@/types'
import { IS_PRO } from '@/lib/config'

// Snapshot of canvas-affecting properties for undo/redo
interface Snapshot {
  background: Background
  padding: number
  cornerRadius: number
  shadow: ShadowType
  frame: FrameType
  imagePosition: ImagePosition
  imageOffsetX: number
  imageOffsetY: number
  watermarkUrl: string | null
  watermarkPosition: WatermarkPosition
  watermarkOpacity: number
  watermarkScale: number
}

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
  // Undo/redo
  past: Snapshot[]
  future: Snapshot[]
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  // Export badge
  badgeEnabled: boolean
  setBadgeEnabled: (v: boolean) => void
  // Template
  activeTemplate: string | null
  setActiveTemplate: (id: string | null) => void
  // Theme
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  // Left panel
  leftPanelCollapsed: boolean
  setLeftPanelCollapsed: (v: boolean) => void
}

const MAX_HISTORY = 50

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
  imageOffsetX: 0,
  imageOffsetY: 0,
  backgroundImageUrl: null,
  backgroundImageBlur: 0,
  watermarkUrl: null,
  watermarkPosition: 'bottom-right',
  watermarkOpacity: 80,
  watermarkScale: 0.12,
}

function takeSnapshot(s: EditorState): Snapshot {
  return {
    background: s.background,
    padding: s.padding,
    cornerRadius: s.cornerRadius,
    shadow: s.shadow,
    frame: s.frame,
    imagePosition: s.imagePosition,
    imageOffsetX: s.imageOffsetX,
    imageOffsetY: s.imageOffsetY,
    watermarkUrl: s.watermarkUrl,
    watermarkPosition: s.watermarkPosition,
    watermarkOpacity: s.watermarkOpacity,
    watermarkScale: s.watermarkScale,
  }
}

function applySnapshot(snap: Snapshot): Partial<EditorState> {
  return { ...snap }
}

// Push current state to history before a change
function pushHistory(get: () => EditorState & EditorActions & StoreExtras): { past: Snapshot[]; future: Snapshot[] } {
  const state = get()
  const snap = takeSnapshot(state)
  const past = [...state.past, snap].slice(-MAX_HISTORY)
  return { past, future: [] }
}

export const useEditorStore = create<EditorState & EditorActions & StoreExtras>()((set, get) => ({
  ...initialState,
  lastShuffle: 0,
  isDemoMode: false,
  isLoading: false,
  imageLoaded: false,
  past: [],
  future: [],

  setImage: (file: File, url: string) => set({ imageFile: file, imageUrl: url, imageLoaded: false }),
  setImageLoaded: (v: boolean) => set({ imageLoaded: v }),
  setBackground: (bg: Background) => set({ ...pushHistory(get), background: bg }),
  setPadding: (v: number) => set({ ...pushHistory(get), padding: v }),
  setCornerRadius: (v: number) => set({ ...pushHistory(get), cornerRadius: v }),
  setShadow: (v: ShadowType) => set({ ...pushHistory(get), shadow: v }),
  setFrame: (v: FrameType) => set({ ...pushHistory(get), frame: v }),
  setAspectRatio: (v: AspectRatioType) => set({ aspectRatio: v, activeTemplate: null }), // Clears template selection
  setAutoColor: (v: boolean) => set({ autoColor: v }),
  setProUnlocked: (v: boolean) => set({ proUnlocked: v }),
  setImagePosition: (v: ImagePosition) => set({ ...pushHistory(get), imagePosition: v, imageOffsetX: 0, imageOffsetY: 0 }),
  setImageOffsetX: (v: number) => set({ ...pushHistory(get), imageOffsetX: v }),
  setImageOffsetY: (v: number) => set({ ...pushHistory(get), imageOffsetY: v }),
  setBackgroundImageUrl: (v: string | null) => set({ backgroundImageUrl: v }),
  setBackgroundImageBlur: (v: number) => set({ backgroundImageBlur: v }),
  setWatermarkUrl: (v: string | null) => set({ ...pushHistory(get), watermarkUrl: v }),
  setWatermarkPosition: (v: WatermarkPosition) => set({ ...pushHistory(get), watermarkPosition: v }),
  setWatermarkOpacity: (v: number) => set({ ...pushHistory(get), watermarkOpacity: v }),
  setWatermarkScale: (v: number) => set({ ...pushHistory(get), watermarkScale: v }),
  setDemoMode: (v: boolean) => set({ isDemoMode: v }),
  setIsLoading: (v: boolean) => set({ isLoading: v }),
  triggerShuffle: () => set({ lastShuffle: Date.now() }),
  zoom: 1,
  setZoom: (v: number) => set({ zoom: Math.max(0.25, Math.min(4, v)) }),
  fitRequested: 0,
  requestFit: () => set({ fitRequested: Date.now() }),

  // Export badge
  badgeEnabled: localStorage.getItem('popshot_badge') === '1',
  setBadgeEnabled: (v: boolean) => {
    localStorage.setItem('popshot_badge', v ? '1' : '0')
    set({ badgeEnabled: v })
  },

  // Template
  activeTemplate: null,
  setActiveTemplate: (id: string | null) => {
    set({ activeTemplate: id })
    // Auto-fit after template change
    setTimeout(() => set({ fitRequested: Date.now() }), 50)
  },

  // Theme
  theme: (localStorage.getItem('ps_theme') as 'light' | 'dark') || 'light',
  setTheme: (t: 'light' | 'dark') => {
    localStorage.setItem('ps_theme', t)
    document.documentElement.classList.toggle('dark', t === 'dark')
    set({ theme: t })
  },

  // Left panel
  leftPanelCollapsed: false,
  setLeftPanelCollapsed: (v: boolean) => set({ leftPanelCollapsed: v }),

  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return
    const prev = past[past.length - 1]
    const snap = takeSnapshot(get())
    set({
      ...applySnapshot(prev),
      past: past.slice(0, -1),
      future: [snap, ...future].slice(0, MAX_HISTORY),
    })
  },

  redo: () => {
    const { past, future } = get()
    if (future.length === 0) return
    const next = future[0]
    const snap = takeSnapshot(get())
    set({
      ...applySnapshot(next),
      past: [...past, snap].slice(-MAX_HISTORY),
      future: future.slice(1),
    })
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  reset: () => set({ ...initialState, past: [], future: [], lastShuffle: 0, isDemoMode: false, isLoading: false, imageLoaded: false, zoom: 1, fitRequested: Date.now() }),
}))
