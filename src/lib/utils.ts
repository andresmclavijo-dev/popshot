import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isBackgroundDark(bgValue: string): boolean {
  const hexMatches = bgValue.match(/#([0-9a-fA-F]{6})/g)
  if (!hexMatches || hexMatches.length === 0) return false

  const hexToLuminance = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  }

  const luminances = hexMatches.map(hexToLuminance)
  const avg = luminances.reduce((a, b) => a + b, 0) / luminances.length
  return avg < 0.5
}
