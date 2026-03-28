import type { Background, ShadowType, AspectRatioType } from '@/types'

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
  { id: 'pure-white', label: 'White', background: { type: 'solid', value: '#FFFFFF' } },
  { id: 'soft-gray', label: 'Stone', background: { type: 'solid', value: '#EEEEED' } },
  { id: 'midnight', label: 'Midnight', background: { type: 'solid', value: '#1A1A18' } },
  { id: 'ocean', label: 'Ocean', background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)' } },
  { id: 'sunset', label: 'Sunset', background: { type: 'gradient', value: 'linear-gradient(135deg, #f093fb, #f5576c)' } },
  { id: 'aurora', label: 'Aurora', background: { type: 'gradient', value: 'linear-gradient(135deg, #4facfe, #00f2fe)' } },
  { id: 'peach', label: 'Peach', background: { type: 'gradient', value: 'linear-gradient(135deg, #ffecd2, #fcb69f)' } },
  { id: 'forest', label: 'Forest', background: { type: 'gradient', value: 'linear-gradient(135deg, #134e5e, #71b280)' } },
  { id: 'rose', label: 'Rose', background: { type: 'gradient', value: 'linear-gradient(135deg, #f8b4c8, #ee82a2)' } },
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
  { id: 'twitter', label: 'Twitter', width: 1600, height: 900 },
  { id: 'linkedin', label: 'LinkedIn', width: 1200, height: 627 },
  { id: 'dribbble', label: 'Dribbble', width: 1600, height: 1200 },
  { id: 'behance', label: 'Behance', width: 1400, height: 800 },
  { id: 'og', label: 'Open Graph', width: 1200, height: 630 },
  { id: 'pinterest', label: 'Pinterest', width: 1000, height: 1500 },
]
