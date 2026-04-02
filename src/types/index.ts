export type BackgroundType = 'solid' | 'gradient' | 'transparent' | 'image'
export type ImagePosition = 'center' | 'top' | 'bottom' | 'top-left' | 'top-right'
export type ShadowType = 'none' | 'soft' | 'deep'
export type FrameType = 'none' | 'macos-light' | 'macos-dark' | 'iphone'
export type AspectRatioType = 'free' | '16:9' | '1:1' | '4:3' | '4:5' | 'twitter' | 'linkedin' | 'dribbble' | 'behance' | 'og' | 'pinterest'

export interface Background {
  type: BackgroundType
  value: string
}

export interface EditorState {
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
  reset: () => void
}
