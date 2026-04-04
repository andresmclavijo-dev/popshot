import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { HexColorPicker } from 'react-colorful'
import { ChevronDown, Lock, Upload, X, RotateCcw, Check, UserRound, ArrowRightCircle, LogOut } from 'lucide-react'
import { signInWithGoogle, signOut } from '@/lib/auth'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useEditorStore } from '@/store/useEditorStore'
import { BACKGROUND_PRESETS, SHADOW_PRESETS } from '@/lib/presets'
import { extractColorsFromImage } from '@/lib/colorExtract'
import { showToast } from '@/components/shared/Toast'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import { openExportModal } from '@/components/shared/ExportModal'
import type { Background, WatermarkPosition, ImagePosition } from '@/types'

const PANEL_WIDTH = 220
const LIGHT_SWATCHES = new Set(['pure-white', 'soft-gray', 'peach', 'transparent'])
const CHECKERBOARD = 'repeating-conic-gradient(#D0D0CE 0% 25%, #F0F0EE 0% 50%) 0 0 / 8px 8px'
const FREE_SWATCH_COUNT = 6

const sliderRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' }
const sliderLabelRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }

function Section({ label, locked, defaultOpen = true, isLast, children }: { label: string; locked?: boolean; defaultOpen?: boolean; isLast?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--ps-border)', padding: '0 16px' }}>
      <button type="button" onClick={() => !locked && setOpen(!open)}
        aria-expanded={locked ? undefined : open}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          cursor: locked ? 'default' : 'pointer', padding: '4px 0',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', minHeight: '32px',
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.outline = '2px solid var(--ps-text-primary)'; e.currentTarget.style.outlineOffset = '2px'; e.currentTarget.style.borderRadius = '6px' }}
        onBlur={(e) => { e.currentTarget.style.outline = 'none' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ps-text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {label}
          {locked && <Lock size={10} strokeWidth={2.5} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />}
        </span>
        {!locked && <ChevronDown size={16} style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 220ms var(--ease-out)', color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />}
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '600px' : '0px',
        opacity: open ? 1 : 0,
        transition: 'max-height 200ms ease-in-out, opacity 200ms ease-in-out',
        paddingBottom: open ? '16px' : '0px',
      }}>
        {children}
      </div>
    </div>
  )
}

// Frame options
const FRAME_OPTIONS: { id: import('@/types').FrameType; label: string; pro?: boolean }[] = [
  { id: 'none', label: 'None' }, { id: 'macos-light', label: 'macOS' }, { id: 'macos-dark', label: 'Dark' },
  { id: 'safari', label: 'Safari' }, { id: 'arc', label: 'Arc', pro: true }, { id: 'card', label: 'Card', pro: true },
  { id: 'stack', label: 'Stack', pro: true },
]

function FrameThumb({ type }: { type: import('@/types').FrameType }) {
  const w = 32, h = 22
  if (type === 'none') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x="1" y="1" width="30" height="20" rx="3" stroke="var(--ps-text-tertiary)" strokeWidth="1" fill="none" /></svg>
  if (type === 'macos-light') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#F5F5F5" stroke="#DDD" /><circle cx="5" cy="4" r="1.5" fill="#FF5F57" /><circle cx="9" cy="4" r="1.5" fill="#FFBD2E" /><circle cx="13" cy="4" r="1.5" fill="#28C840" /></svg>
  if (type === 'macos-dark') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#2D2D2D" stroke="#444" /><circle cx="5" cy="4" r="1.5" fill="#FF5F57" /><circle cx="9" cy="4" r="1.5" fill="#FFBD2E" /><circle cx="13" cy="4" r="1.5" fill="#28C840" /></svg>
  if (type === 'safari') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#F5F5F5" stroke="#DDD" /><circle cx="5" cy="3.5" r="1.2" fill="#FF5F57" /><circle cx="8.5" cy="3.5" r="1.2" fill="#FFBD2E" /><circle cx="12" cy="3.5" r="1.2" fill="#28C840" /><rect x="6" y="7" width="20" height="3" rx="1.5" fill="#E8E8E8" /></svg>
  if (type === 'arc') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x=".5" y=".5" width="31" height="21" rx="3" fill="#1A1A2E" stroke="#333" /><rect x="3" y="4" width="2" height="8" rx="1" fill="url(#ag2)" /><defs><linearGradient id="ag2" x1="4" y1="4" x2="4" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#6366f1" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs></svg>
  if (type === 'card') return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x="1" y="1" width="30" height="20" rx="4" fill="white" stroke="#DDD" /><rect x="4" y="4" width="24" height="14" rx="2" fill="#F0F0F0" /></svg>
  return <svg width={w} height={h} viewBox="0 0 32 22" fill="none"><rect x="4" y="4" width="27" height="17" rx="3" fill="#E0E0E0" stroke="#CCC" strokeWidth=".5" /><rect x="2" y="2" width="27" height="17" rx="3" fill="#EEE" stroke="#CCC" strokeWidth=".5" /><rect x="0.5" y="0.5" width="27" height="17" rx="3" fill="white" stroke="#DDD" /></svg>
}

const IMAGE_POSITIONS: ImagePosition[] = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']
const WM_POSITIONS: WatermarkPosition[] = ['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right']

// ── Custom color picker — Paletta pattern: swatch + hex input + react-colorful popover ──
function CustomColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const [open, setOpen] = useState(false)
  const [hexDraft, setHexDraft] = useState(value.replace('#', '').toUpperCase())
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, width: 0 })
  const swatchRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Sync draft when value changes externally
  useEffect(() => {
    setHexDraft(value.replace('#', '').toUpperCase())
  }, [value])

  // Position popover using getBoundingClientRect
  const openPicker = useCallback(() => {
    if (swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect()
      setPopoverPos({ top: rect.bottom + 6, left: rect.left, width: rect.width + 120 })
    }
    setOpen((o) => !o)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (pickerRef.current?.contains(e.target as Node) || swatchRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    const raf = requestAnimationFrame(() => document.addEventListener('mousedown', handler))
    return () => { cancelAnimationFrame(raf); document.removeEventListener('mousedown', handler) }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handlePickerChange = useCallback((hex: string) => {
    onChange(hex)
    setHexDraft(hex.replace('#', '').toUpperCase())
  }, [onChange])

  return (
    <div>
      {/* Swatch + hex input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Color swatch — click to toggle picker */}
        <button ref={swatchRef} type="button" onClick={openPicker} aria-label="Open color picker"
          style={{
            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
            background: value, border: '1px solid var(--ps-border)',
            cursor: 'pointer', transition: 'border-color 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ps-text-tertiary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }} />

        {/* Hex input */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '4px',
          height: '36px', padding: '0 10px', borderRadius: '10px',
          background: 'var(--ps-bg-surface)', border: '1px solid var(--ps-border)',
          transition: 'border-color 150ms ease-out',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>#</span>
          <input
            value={hexDraft}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
              setHexDraft(cleaned.toUpperCase())
              if (cleaned.length === 6) onChange('#' + cleaned)
            }}
            onBlur={() => {
              if (hexDraft.length === 6) onChange('#' + hexDraft)
              else setHexDraft(value.replace('#', '').toUpperCase())
            }}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') {
                if (hexDraft.length === 6) onChange('#' + hexDraft)
                else setHexDraft(value.replace('#', '').toUpperCase())
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            onClick={(e) => e.stopPropagation()}
            maxLength={6}
            aria-label="Hex color value"
            style={{
              flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '13px', fontWeight: 500, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              color: 'var(--ps-text-primary)', textTransform: 'uppercase',
            }}
          />
        </div>
      </div>

      {/* Picker popover — portal to escape overflow:hidden */}
      {open && createPortal(
        <div ref={pickerRef}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'fixed', top: popoverPos.top, left: popoverPos.left,
            width: popoverPos.width, zIndex: 9999,
            background: 'var(--ps-bg-panel)', borderRadius: '16px',
            border: '1px solid var(--ps-border)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            padding: '12px',
          }}>
          <div className="custom-color-picker">
            <HexColorPicker color={value} onChange={handlePickerChange} />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// ── User menu — Paletta pattern: avatar click opens dropdown with sign out ──
function UserMenu({ user }: { user: import('@supabase/supabase-js').User }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        aria-label="Account menu" aria-expanded={open}
        style={{
          width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', borderRadius: 0,
          transition: 'background 150ms ease-out',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
        {user.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="" referrerPolicy="no-referrer"
            style={{ width: '32px', height: '32px', borderRadius: '16px', flexShrink: 0 }} />
        ) : (
          <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--ps-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UserRound size={16} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />
          </div>
        )}
        <div style={{ flex: 1, overflow: 'hidden', textAlign: 'left' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ps-text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.2' }}>
            {user.user_metadata?.full_name || user.email || 'User'}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--ps-text-secondary)', lineHeight: '1.2' }}>Pro user</span>
        </div>
        <ChevronDown size={14} style={{ color: 'var(--ps-text-tertiary)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease-out' }} aria-hidden="true" />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: '8px', right: '8px', zIndex: 50,
          background: 'var(--ps-bg-panel)', borderRadius: '10px',
          border: '0.5px solid var(--ps-border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden', marginTop: '2px',
        }}>
          <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--ps-border)' }}>
            <span style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              {user.email}
            </span>
          </div>
          <button type="button" onClick={() => { signOut(); setOpen(false) }}
            style={{
              width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 500, fontFamily: 'inherit',
              color: 'var(--ps-text-danger, #dc2626)',
              transition: 'background 150ms ease-out',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
            <LogOut size={14} aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export function RightPanel({ onHoverBackground }: { onHoverBackground: (bg: Background | null) => void }) {
  const imageUrl = useEditorStore((s) => s.imageUrl)
  const background = useEditorStore((s) => s.background)
  const setBackground = useEditorStore((s) => s.setBackground)
  const autoColor = useEditorStore((s) => s.autoColor)
  const setAutoColor = useEditorStore((s) => s.setAutoColor)
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const padding = useEditorStore((s) => s.padding)
  const setPadding = useEditorStore((s) => s.setPadding)
  const cornerRadius = useEditorStore((s) => s.cornerRadius)
  const setCornerRadius = useEditorStore((s) => s.setCornerRadius)
  const imagePosition = useEditorStore((s) => s.imagePosition)
  const setImagePosition = useEditorStore((s) => s.setImagePosition)
  const imageOffsetX = useEditorStore((s) => s.imageOffsetX)
  const setImageOffsetX = useEditorStore((s) => s.setImageOffsetX)
  const imageOffsetY = useEditorStore((s) => s.imageOffsetY)
  const setImageOffsetY = useEditorStore((s) => s.setImageOffsetY)
  const shadow = useEditorStore((s) => s.shadow)
  const setShadow = useEditorStore((s) => s.setShadow)
  const frame = useEditorStore((s) => s.frame)
  const setFrame = useEditorStore((s) => s.setFrame)
  const backgroundImageUrl = useEditorStore((s) => s.backgroundImageUrl)
  const setBackgroundImageUrl = useEditorStore((s) => s.setBackgroundImageUrl)
  const watermarkUrl = useEditorStore((s) => s.watermarkUrl)
  const setWatermarkUrl = useEditorStore((s) => s.setWatermarkUrl)
  const watermarkPosition = useEditorStore((s) => s.watermarkPosition)
  const setWatermarkPosition = useEditorStore((s) => s.setWatermarkPosition)
  const watermarkOpacity = useEditorStore((s) => s.watermarkOpacity)
  const setWatermarkOpacity = useEditorStore((s) => s.setWatermarkOpacity)
  const watermarkScale = useEditorStore((s) => s.watermarkScale)
  const setWatermarkScale = useEditorStore((s) => s.setWatermarkScale)
  const reset = useEditorStore((s) => s.reset)

  const wmInputRef = useRef<HTMLInputElement>(null)

  const user = useEditorStore((s) => s.user)
  const hasImage = !!imageUrl
  const dimmed = !hasImage

  return (
    <div style={{
      width: `${PANEL_WIDTH}px`, flexShrink: 0,
      height: '100%', borderRadius: '16px',
      background: 'var(--ps-bg-panel)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: '0.5px solid var(--ps-border-panel)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 10,
    }}>
      {/* User row — Fix 1: hover on Sign In, Fix 4: tighter spacing + dropdown for pro */}
      {user ? (
        <UserMenu user={user} />
      ) : (
        <button type="button" onClick={signInWithGoogle}
          style={{
            width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', flexShrink: 0, borderRadius: 0,
            transition: 'background 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'var(--ps-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UserRound size={16} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ps-text-primary)' }}>Sign In</span>
        </button>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--ps-border)', flexShrink: 0 }} />

      {/* Action buttons — Fix 2: hover on Export, Fix 3: Go Pro always visible for free, Fix 5: chevron on both */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexShrink: 0 }}>
        {/* Export — secondary when Go Pro visible, primary when pro */}
        <button type="button" onClick={() => hasImage && openExportModal()} disabled={!hasImage}
          style={{
            flex: 1, height: '36px',
            background: proUnlocked ? 'var(--ps-text-primary)' : 'transparent',
            color: proUnlocked ? 'var(--ps-bg-page)' : 'var(--ps-text-primary)',
            border: proUnlocked ? 'none' : '1px solid var(--ps-border-strong)',
            borderRadius: '100px', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
            cursor: hasImage ? 'pointer' : 'not-allowed', opacity: hasImage ? 1 : 0.35,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            transition: 'transform 100ms ease, opacity 150ms ease-out',
          }}
          onMouseEnter={(e) => { if (hasImage) e.currentTarget.style.opacity = '0.85' }}
          onMouseDown={(e) => { if (hasImage) e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = hasImage ? '1' : '0.35' }}>
          Export <ChevronDown size={14} aria-hidden="true" />
        </button>
        {/* Go Pro — visible for all free users (not just signed-out) */}
        {!proUnlocked && (
          <button type="button" onClick={openUpgradeModal}
            style={{
              flex: 1, height: '36px', background: 'var(--ps-text-primary)',
              color: 'var(--ps-bg-page)', border: 'none', borderRadius: '100px',
              fontSize: '13px', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'transform 100ms ease, opacity 150ms ease-out',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}>
            Go Pro <ArrowRightCircle size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--ps-border)', flexShrink: 0 }} />

      {/* Scrollable sections */}
      <div className="canvas-workspace" style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 0, opacity: dimmed ? 0.35 : 1, pointerEvents: dimmed ? 'none' : 'auto', transition: 'opacity 200ms ease-out' }}>
        {/* Background */}
        <Section label="Background">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
            {BACKGROUND_PRESETS.map((preset, i) => {
              const active = background.value === preset.background.value && !backgroundImageUrl
              const isTransparent = preset.id === 'transparent'
              const locked = i >= FREE_SWATCH_COUNT && !proUnlocked
              return (
                <button key={preset.id} type="button"
                  onClick={() => {
                    if (locked) { openUpgradeModal(); return }
                    setBackground(preset.background)
                    if (backgroundImageUrl) setBackgroundImageUrl(null)
                    if (autoColor) setAutoColor(false)
                  }}
                  onMouseEnter={() => !locked && onHoverBackground(preset.background)}
                  onMouseLeave={() => onHoverBackground(null)}
                  aria-label={`${preset.label} background`} aria-pressed={active}
                  style={{
                    height: '52px', borderRadius: '12px',
                    border: active ? '1px solid var(--ps-bg-active)' : '1px solid var(--ps-border)',
                    background: isTransparent ? CHECKERBOARD : preset.background.value,
                    cursor: 'pointer', opacity: locked ? 0.45 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 150ms ease-out', padding: 0, overflow: 'hidden',
                  }}>
                  {locked && <Lock size={10} strokeWidth={2.5} style={{ color: LIGHT_SWATCHES.has(preset.id) ? '#666' : '#FFF' }} aria-hidden="true" />}
                  {active && !locked && <Check size={12} strokeWidth={3} style={{ color: LIGHT_SWATCHES.has(preset.id) ? 'var(--ps-text-primary)' : '#FFF' }} aria-hidden="true" />}
                </button>
              )
            })}
          </div>
          {/* Custom color */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Custom color</span>
            <CustomColorPicker
              value={background.type === 'solid' ? background.value : '#ffffff'}
              onChange={(hex) => {
                setBackground({ type: 'solid', value: hex })
                if (backgroundImageUrl) setBackgroundImageUrl(null)
                if (autoColor) setAutoColor(false)
              }}
            />
          </div>
          {/* Match to image */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label htmlFor="match-img" style={{ fontSize: '12px', color: 'var(--ps-text-secondary)', cursor: 'pointer' }}>Match to image</label>
            <Switch id="match-img" checked={autoColor} onCheckedChange={async (checked) => { setAutoColor(checked); if (checked && imageUrl) { try { const bg = await extractColorsFromImage(imageUrl); setBackground(bg) } catch {} } }} size="sm" />
          </div>
        </Section>

        {/* Layout */}
        <Section label="Layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Padding</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{padding}px</span>
              </div>
              <Slider value={[padding]} onValueChange={(v) => setPadding(Array.isArray(v) ? v[0] : v)} min={0} max={240} step={4} aria-label="Padding" />
            </div>
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Corners</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{cornerRadius}px</span>
              </div>
              <Slider value={[cornerRadius]} onValueChange={(v) => setCornerRadius(Array.isArray(v) ? v[0] : v)} min={0} max={48} step={2} aria-label="Corner radius" />
            </div>
            {/* Position — dot grid sets offsets for immediate visual effect */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Position</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 24px)', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
                {IMAGE_POSITIONS.map((pos) => {
                  const active = imagePosition === pos && imageOffsetX === 0 && imageOffsetY === 0
                  return (
                    <button key={pos} type="button" onClick={() => {
                      setImagePosition(pos)
                      // Also set offsets for immediate visual feedback
                      const xMap: Record<string, number> = { 'top-left': -120, 'left': -120, 'bottom-left': -120, 'top': 0, 'center': 0, 'bottom': 0, 'top-right': 120, 'right': 120, 'bottom-right': 120 }
                      const yMap: Record<string, number> = { 'top-left': -80, 'top': -80, 'top-right': -80, 'left': 0, 'center': 0, 'right': 0, 'bottom-left': 80, 'bottom': 80, 'bottom-right': 80 }
                      setImageOffsetX(xMap[pos] ?? 0)
                      setImageOffsetY(yMap[pos] ?? 0)
                    }} aria-label={`Position ${pos}`} aria-pressed={active}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', border: active ? 'none' : `0.5px solid var(--ps-border)`, background: active ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', cursor: 'pointer', padding: 0, transition: 'background 150ms ease-out' }} />
                  )
                })}
              </div>
            </div>
            {/* Fine offset sliders */}
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>X offset</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{imageOffsetX}px</span>
              </div>
              <Slider value={[imageOffsetX]} onValueChange={(v) => setImageOffsetX(Array.isArray(v) ? v[0] : v)} min={-500} max={500} step={1} aria-label="X offset" />
            </div>
            <div style={sliderRow}>
              <div style={sliderLabelRow}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)' }}>Y offset</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{imageOffsetY}px</span>
              </div>
              <Slider value={[imageOffsetY]} onValueChange={(v) => setImageOffsetY(Array.isArray(v) ? v[0] : v)} min={-500} max={500} step={1} aria-label="Y offset" />
            </div>
          </div>
        </Section>

        {/* Effects */}
        <Section label="Effects" defaultOpen={false}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Shadow */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Shadow</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {SHADOW_PRESETS.map((opt) => {
                  const active = shadow === opt.id
                  const previewShadow = opt.id === 'soft' ? '0 2px 8px rgba(0,0,0,0.12)' : opt.id === 'deep' ? '0 3px 12px rgba(0,0,0,0.3)' : 'none'
                  return (
                    <div key={opt.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                      <button type="button" onClick={() => setShadow(opt.id)} aria-pressed={active} aria-label={`${opt.label} shadow`}
                        style={{
                          width: '100%', height: '60px', borderRadius: '12px',
                          border: active ? '1px solid var(--ps-bg-active)' : '1px solid var(--ps-border)',
                          background: 'var(--ps-bg-surface)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          outline: 'none', fontFamily: 'inherit',
                          transition: 'border-color 150ms ease-out', overflow: 'hidden',
                        }}>
                        <div style={{ width: '28px', height: '18px', borderRadius: '4px', background: 'var(--ps-bg-page)', boxShadow: previewShadow }} />
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: 'var(--ps-text-primary)', textAlign: 'center' }}>
                        {opt.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Frame */}
            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-secondary)', display: 'block', marginBottom: '6px' }}>Frame</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {FRAME_OPTIONS.map((f) => {
                  const active = frame === f.id
                  const locked = f.pro && !proUnlocked
                  return (
                    <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                      <button type="button" onClick={() => { if (locked) { openUpgradeModal(); return }; setFrame(f.id) }} aria-pressed={active} aria-label={`${f.label} frame`}
                        style={{
                          width: '100%', height: '60px', borderRadius: '12px',
                          border: active ? '1px solid var(--ps-bg-active)' : '1px solid var(--ps-border)',
                          background: 'var(--ps-bg-surface)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          outline: 'none', fontFamily: 'inherit',
                          opacity: locked ? 0.45 : 1, transition: 'border-color 150ms ease-out', overflow: 'hidden',
                        }}>
                        <FrameThumb type={f.id} />
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: active ? 600 : 400, color: locked ? 'var(--ps-text-tertiary)' : 'var(--ps-text-primary)', display: 'flex', alignItems: 'center', gap: '2px', textAlign: 'center' }}>
                        {f.label}
                        {locked && <Lock size={7} strokeWidth={2.5} aria-hidden="true" />}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* Watermark */}
        <Section label="Watermark" locked={!proUnlocked} defaultOpen={false} isLast>
          {!proUnlocked ? (
            <button type="button" onClick={openUpgradeModal}
              style={{ border: '1.5px dashed var(--ps-border)', borderRadius: 'var(--ps-radius-md)', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.45, cursor: 'pointer', fontSize: '12px', color: 'var(--ps-text-tertiary)', background: 'transparent', fontFamily: 'inherit', width: '100%' }}>
              <Upload size={14} aria-hidden="true" /> Add logo
            </button>
          ) : watermarkUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: 'var(--ps-radius-sm)', border: `1px solid var(--ps-border-strong)`, overflow: 'hidden', flexShrink: 0, background: 'var(--ps-bg-hover)' }}>
                  <img src={watermarkUrl} alt="Watermark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button type="button" onClick={() => { setWatermarkUrl(null); showToast('Watermark removed') }} aria-label="Remove watermark"
                    style={{ position: 'absolute', top: '-1px', right: '-1px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--ps-text-primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    <X size={7} color="var(--ps-bg-page)" aria-hidden="true" />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', width: '48px' }}>
                  {WM_POSITIONS.map((pos) => (
                    <button key={pos} type="button" onClick={() => setWatermarkPosition(pos)} aria-label={`Watermark ${pos}`}
                      style={{ width: '14px', height: '14px', borderRadius: '50%', border: 'none', background: watermarkPosition === pos ? 'var(--ps-text-primary)' : 'var(--ps-border-strong)', cursor: 'pointer', padding: 0 }} />
                  ))}
                </div>
              </div>
              <div style={sliderRow}>
                <div style={sliderLabelRow}>
                  <span style={{ fontSize: '12px', color: 'var(--ps-text-secondary)' }}>Opacity</span>
                  <span style={{ fontSize: '12px', color: 'var(--ps-text-primary)', fontVariantNumeric: 'tabular-nums' }}>{watermarkOpacity}%</span>
                </div>
                <Slider value={[watermarkOpacity]} onValueChange={(v) => setWatermarkOpacity(Array.isArray(v) ? v[0] : v)} min={0} max={100} step={5} aria-label="Watermark opacity" />
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {([{ l: 'S', v: 0.08 }, { l: 'M', v: 0.12 }, { l: 'L', v: 0.18 }] as const).map((o) => (
                  <button key={o.l} type="button" onClick={() => setWatermarkScale(o.v)} aria-pressed={Math.abs(watermarkScale - o.v) < 0.01}
                    style={{ flex: 1, background: Math.abs(watermarkScale - o.v) < 0.01 ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)', color: Math.abs(watermarkScale - o.v) < 0.01 ? 'var(--ps-bg-page)' : 'var(--ps-text-secondary)', border: 'none', cursor: 'pointer', padding: '5px 0', fontSize: '11px', fontWeight: 500, fontFamily: 'inherit', borderRadius: 'var(--ps-radius-sm)' }}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => wmInputRef.current?.click()}
              style={{ border: '1.5px dashed var(--ps-border-strong)', borderRadius: 'var(--ps-radius-md)', padding: '14px', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', width: '100%' }}>
              <Upload size={14} aria-hidden="true" /> Add logo
            </button>
          )}
          <input ref={wmInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setWatermarkUrl(r.result as string); r.readAsDataURL(f); e.target.value = '' }} style={{ display: 'none' }} aria-hidden="true" />
        </Section>

        {/* Reset */}
        <button type="button" onClick={() => { if (imageUrl) { const s = useEditorStore.getState(); s.setBackground({ type: 'gradient', value: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }); s.setPadding(48); s.setCornerRadius(12); s.setShadow('soft'); s.setFrame('none'); s.setWatermarkUrl(null) } else { reset() } }}
          aria-label="Reset styles"
          style={{ width: 'calc(100% - 32px)', margin: '0 16px', background: 'var(--ps-bg-hover)', border: 'none', cursor: 'pointer', padding: '7px 0', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', borderRadius: 'var(--ps-radius-sm)', color: 'var(--ps-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexShrink: 0 }}>
          <RotateCcw size={12} aria-hidden="true" /> Reset
        </button>
      </div>
    </div>
  )
}
