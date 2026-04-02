export type BackgroundType = 'solid' | 'gradient' | 'transparent' | 'image'
export type ImagePosition = 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right'
export type ShadowType = 'none' | 'soft' | 'deep'
export type FrameType = 'none' | 'macos-light' | 'macos-dark' | 'safari' | 'arc' | 'card' | 'stack'
export type AspectRatioType = 'free' | '16:9' | '1:1' | '4:3' | '4:5' | 'twitter' | 'linkedin' | 'dribbble' | 'behance' | 'og' | 'pinterest'

export type WatermarkPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface Background {
  type: BackgroundType
  value: string
}

export interface WatermarkState {
  watermarkUrl: string | null     // base64 data URL
  watermarkPosition: WatermarkPosition
  watermarkOpacity: number        // 0–100
  watermarkScale: number          // 0.5–2 (maps to small/medium/large)
}

export interface EditorState extends WatermarkState {
  imageFile: File | null
  imageUrl: string | null
  background: Background
  padding: number
  cornerRadius: number
  shadow: ShadowType
  frame: FrameType
  aspectRatio: AspectRatioType
  autoColor: boolean
  proUnlocked: boolean
  imagePosition: ImagePosition
  backgroundImageUrl: string | null
  backgroundImageBlur: number
}

export interface SavedPreset {
  id: string
  name: string
  timestamp: number
  background: Background
  padding: number
  cornerRadius: number
  shadow: ShadowType
  frame: FrameType
  imagePosition: ImagePosition
}

export interface EditorActions {
  setImage: (file: File, url: string) => void
  setBackground: (bg: Background) => void
  setPadding: (v: number) => void
  setCornerRadius: (v: number) => void
  setShadow: (v: ShadowType) => void
  setFrame: (v: FrameType) => void
  setAspectRatio: (v: AspectRatioType) => void
  setAutoColor: (v: boolean) => void
  setProUnlocked: (v: boolean) => void
  setImagePosition: (v: ImagePosition) => void
  setBackgroundImageUrl: (v: string | null) => void
  setBackgroundImageBlur: (v: number) => void
  setWatermarkUrl: (v: string | null) => void
  setWatermarkPosition: (v: WatermarkPosition) => void
  setWatermarkOpacity: (v: number) => void
  setWatermarkScale: (v: number) => void
  reset: () => void
}
