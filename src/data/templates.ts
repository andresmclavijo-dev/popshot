export type TemplateCategory = 'social' | 'portfolio' | 'producthunt'

export interface Template {
  id: string
  platform: string
  platformIcon: string
  name: string
  ratioLabel: string
  width: number
  height: number
  category: TemplateCategory[]
}

export const TEMPLATES: Template[] = [
  // X (Twitter)
  { id: 'x-tweet', platform: 'X (Twitter)', platformIcon: 'twitter', name: 'Tweet Image', ratioLabel: '16:9', width: 1600, height: 900, category: ['social'] },
  { id: 'x-header', platform: 'X (Twitter)', platformIcon: 'twitter', name: 'Header Photo', ratioLabel: '3:1', width: 1500, height: 500, category: ['social'] },
  { id: 'x-profile', platform: 'X (Twitter)', platformIcon: 'twitter', name: 'Profile Photo', ratioLabel: '1:1', width: 400, height: 400, category: ['social'] },
  // LinkedIn
  { id: 'li-share', platform: 'LinkedIn', platformIcon: 'linkedin', name: 'Share Image', ratioLabel: '1.91:1', width: 1200, height: 627, category: ['social'] },
  { id: 'li-cover', platform: 'LinkedIn', platformIcon: 'linkedin', name: 'Cover Photo', ratioLabel: '4:1', width: 1584, height: 396, category: ['social'] },
  { id: 'li-logo', platform: 'LinkedIn', platformIcon: 'linkedin', name: 'Company Logo', ratioLabel: '1:1', width: 300, height: 300, category: ['social'] },
  // Instagram
  { id: 'ig-square', platform: 'Instagram', platformIcon: 'instagram', name: 'Square Post', ratioLabel: '1:1', width: 1080, height: 1080, category: ['social'] },
  { id: 'ig-portrait', platform: 'Instagram', platformIcon: 'instagram', name: 'Portrait Post', ratioLabel: '4:5', width: 1080, height: 1350, category: ['social'] },
  { id: 'ig-landscape', platform: 'Instagram', platformIcon: 'instagram', name: 'Landscape Post', ratioLabel: '16:9', width: 1080, height: 608, category: ['social'] },
  { id: 'ig-story', platform: 'Instagram', platformIcon: 'instagram', name: 'Story / Reel', ratioLabel: '9:16', width: 1080, height: 1920, category: ['social'] },
  { id: 'ig-carousel', platform: 'Instagram', platformIcon: 'instagram', name: 'Carousel', ratioLabel: '1.91:1', width: 1080, height: 566, category: ['social'] },
  // Facebook
  { id: 'fb-square', platform: 'Facebook', platformIcon: 'facebook', name: 'Square Post', ratioLabel: '1:1', width: 1080, height: 1080, category: ['social'] },
  { id: 'fb-portrait', platform: 'Facebook', platformIcon: 'facebook', name: 'Portrait Post', ratioLabel: '4:5', width: 1080, height: 1350, category: ['social'] },
  { id: 'fb-landscape', platform: 'Facebook', platformIcon: 'facebook', name: 'Landscape Post', ratioLabel: '16:9', width: 1200, height: 630, category: ['social'] },
  { id: 'fb-story', platform: 'Facebook', platformIcon: 'facebook', name: 'Story', ratioLabel: '9:16', width: 1080, height: 1920, category: ['social'] },
  { id: 'fb-cover', platform: 'Facebook', platformIcon: 'facebook', name: 'Cover Photo', ratioLabel: '16:9', width: 820, height: 312, category: ['social'] },
  // Dribbble
  { id: 'dr-standard', platform: 'Dribbble', platformIcon: 'dribbble', name: 'Standard Shot', ratioLabel: '4:3', width: 1600, height: 1200, category: ['portfolio'] },
  { id: 'dr-landscape', platform: 'Dribbble', platformIcon: 'dribbble', name: 'Landscape Shot', ratioLabel: '3:2', width: 1600, height: 1067, category: ['portfolio'] },
  { id: 'dr-square', platform: 'Dribbble', platformIcon: 'dribbble', name: 'Square Shot', ratioLabel: '1:1', width: 1600, height: 1600, category: ['portfolio'] },
  { id: 'dr-portrait', platform: 'Dribbble', platformIcon: 'dribbble', name: 'Portrait Shot', ratioLabel: '2:3', width: 1067, height: 1600, category: ['portfolio'] },
  // Reddit
  { id: 'rd-standard', platform: 'Reddit', platformIcon: 'reddit', name: 'Standard Post', ratioLabel: '16:9', width: 1200, height: 675, category: ['social'] },
  { id: 'rd-square', platform: 'Reddit', platformIcon: 'reddit', name: 'Square Post', ratioLabel: '1:1', width: 1080, height: 1080, category: ['social'] },
  { id: 'rd-portrait', platform: 'Reddit', platformIcon: 'reddit', name: 'Portrait Post', ratioLabel: '4:5', width: 1080, height: 1350, category: ['social'] },
  // Product Hunt
  { id: 'ph-gallery', platform: 'Product Hunt', platformIcon: 'producthunt', name: 'Gallery Image', ratioLabel: '16:9', width: 1270, height: 760, category: ['producthunt'] },
  { id: 'ph-thumb', platform: 'Product Hunt', platformIcon: 'producthunt', name: 'Thumbnail', ratioLabel: '1:1', width: 240, height: 240, category: ['producthunt'] },
  // Portfolio
  { id: 'pf-wide', platform: 'Portfolio', platformIcon: 'portfolio', name: 'Case Study Wide', ratioLabel: '16:9', width: 1920, height: 1080, category: ['portfolio'] },
  { id: 'pf-portrait', platform: 'Portfolio', platformIcon: 'portfolio', name: 'Case Study Portrait', ratioLabel: '4:5', width: 1080, height: 1350, category: ['portfolio'] },
]
