import type { Background, ShadowType, FrameType, AspectRatioType } from '@/types'

export interface StylePreset {
  id: string
  label: string
  background: Background
  shadow: ShadowType
  frame: FrameType
  padding: number
  cornerRadius: number
  previewGradient: string
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'dribbble-shot', label: 'Dribbble Shot',
    background: { type: 'gradient', value: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' },
    shadow: 'soft', frame: 'none', padding: 64, cornerRadius: 16,
    previewGradient: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
  },
  {
    id: 'product-hunt', label: 'Product Hunt',
    background: { type: 'solid', value: '#F7F7F6' },
    shadow: 'soft', frame: 'macos-light', padding: 48, cornerRadius: 12,
    previewGradient: 'linear-gradient(135deg, #F7F7F6, #EBEBEB)',
  },
  {
    id: 'twitter-post', label: 'Twitter Post',
    background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
    shadow: 'deep', frame: 'none', padding: 40, cornerRadius: 12,
    previewGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
  },
  {
    id: 'portfolio', label: 'Portfolio',
    background: { type: 'gradient', value: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
    shadow: 'soft', frame: 'none', padding: 80, cornerRadius: 20,
    previewGradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
  },
  {
    id: 'case-study', label: 'Case Study',
    background: { type: 'solid', value: '#222222' },
    shadow: 'deep', frame: 'macos-dark', padding: 56, cornerRadius: 12,
    previewGradient: 'linear-gradient(135deg, #222222, #444444)',
  },
  {
    id: 'minimal', label: 'Minimal',
    background: { type: 'solid', value: '#FFFFFF' },
    shadow: 'none', frame: 'none', padding: 32, cornerRadius: 8,
    previewGradient: 'linear-gradient(135deg, #FFFFFF, #F0F0F0)',
  },
]

export interface BackgroundPreset {
  id: string
  label: string
  background: Background
}

export interface ShadowPreset {
  id: ShadowType
  label: string
  style: string
}

export interface AspectRatioPreset {
  id: AspectRatioType
  label: string
  width: number | null
  height: number | null
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { id: 'transparent', label: 'None', background: { type: 'transparent', value: 'transparent' } },
  { id: 'pure-white', label: 'Paper', background: { type: 'solid', value: '#FFFFFF' } },
  { id: 'soft-gray', label: 'Concrete', background: { type: 'solid', value: '#EEEEED' } },
  { id: 'midnight', label: 'Midnight', background: { type: 'solid', value: '#1A1A18' } },
  { id: 'ocean', label: 'Deep Sea', background: { type: 'gradient', value: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' } },
  { id: 'sunset', label: 'Dusk', background: { type: 'gradient', value: 'linear-gradient(145deg, #f093fb 0%, #c471f5 50%, #fa71cd 100%)' } },
  { id: 'aurora', label: 'Nordic', background: { type: 'gradient', value: 'linear-gradient(120deg, #4facfe 0%, #a8edea 55%, #fed6e3 100%)' } },
  { id: 'peach', label: 'Warm', background: { type: 'gradient', value: 'linear-gradient(135deg, #ffecd2, #fcb69f)' } },
  { id: 'forest', label: 'Moss', background: { type: 'gradient', value: 'linear-gradient(150deg, #134e5e 0%, #2d6a4f 50%, #71b280 100%)' } },
  { id: 'rose', label: 'Blush', background: { type: 'gradient', value: 'linear-gradient(135deg, #ffecd2 0%, #f8b4c8 50%, #ee82a2 100%)' } },
]

export const SHADOW_PRESETS: ShadowPreset[] = [
  { id: 'none', label: 'None', style: '' },
  { id: 'soft', label: 'Soft', style: '0 20px 60px rgba(0,0,0,0.12)' },
  { id: 'deep', label: 'Deep', style: '0 2px 8px rgba(0,0,0,0.18), 0 32px 64px rgba(0,0,0,0.22)' },
]

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { id: 'free', label: 'Free', width: null, height: null },
  { id: '16:9', label: '16:9', width: 1280, height: 720 },
  { id: '1:1', label: '1:1', width: 1080, height: 1080 },
  { id: '4:3', label: '4:3', width: 1024, height: 768 },
  { id: '4:5', label: '4:5', width: 1080, height: 1350 },
  { id: 'twitter', label: 'Twitter', width: 1600, height: 900 },
  { id: 'linkedin', label: 'LinkedIn', width: 1200, height: 627 },
  { id: 'dribbble', label: 'Dribbble', width: 1600, height: 1200 },
  { id: 'behance', label: 'Behance', width: 1400, height: 800 },
  { id: 'og', label: 'Open Graph', width: 1200, height: 630 },
  { id: 'pinterest', label: 'Pinterest', width: 1000, height: 1500 },
]
