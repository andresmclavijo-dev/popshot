import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Sun, Moon, FolderOpen, Shield, MoreHorizontal, ExternalLink } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { DarkTooltip } from '@/components/shared/ToolTooltip'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import { TEMPLATES, type Template } from '@/data/templates'

const PANEL_WIDTH = 220
const COLLAPSED_WIDTH = 64

const floatingBase: React.CSSProperties = {
  flexShrink: 0,
  height: '100%',
  borderRadius: '16px',
  background: 'var(--ps-bg-panel)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '0.5px solid var(--ps-border-panel)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
}

// Get unique platforms from template data
const PLATFORMS = Array.from(new Set(TEMPLATES.map(t => t.platform)))

function PlatformIcon({ icon }: { icon: string }) {
  const s = { width: 14, height: 14, display: 'block' }
  switch (icon) {
    case 'twitter': return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231L6.055 21.75H2.75l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    case 'linkedin': return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" /></svg>
    case 'instagram': return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
    case 'facebook': return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
    case 'dribbble': return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87z" /></svg>
    case 'reddit': return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.344 6.314 3.516 8.484l-.016.016A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
    case 'producthunt': return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.806-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z" /></svg>
    default: return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
  }
}

// ── Template Card — labels INSIDE the card ──
function TemplateCard({ template, active, onSelect }: { template: Template; active: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={active}
      aria-label={`${template.name} ${template.width}×${template.height}`}
      style={{
        width: '100%', background: 'var(--ps-bg-surface)',
        border: active ? '1.5px solid var(--ps-text-secondary)' : '1px solid var(--ps-border)',
        borderRadius: '12px', cursor: 'pointer',
        padding: '16px 12px', fontFamily: 'inherit',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        overflow: 'hidden', transition: 'all 150ms ease-out', outline: 'none',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--ps-bg-surface)' }}
    >
      {/* Proportional preview shape */}
      <div style={{
        width: '100%', height: '33px',
        aspectRatio: `${template.width}/${template.height}`,
        background: '#d9d9d9', borderRadius: '4px',
      }} />
      {/* Labels inside card */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', textAlign: 'center', lineHeight: 1.3 }}>
          {template.name}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--ps-text-secondary)', textAlign: 'center' }}>
          {template.width} × {template.height}
        </span>
        <span style={{ fontSize: '10px', fontWeight: 400, color: 'var(--ps-text-secondary)', textAlign: 'center' }}>
          {template.ratioLabel}
        </span>
      </div>
    </button>
  )
}

// ── Platform dropdown — custom popover, matches Paletta's HarmonyPicker ──
function PlatformDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 })

  const activeLabel = value === 'all' ? 'All platforms' : value
  const options = [{ value: 'all', label: 'All platforms' }, ...PLATFORMS.map(p => ({ value: p, label: p }))]

  const handleToggle = useCallback(() => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setOpen(o => !o)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (btnRef.current?.contains(target) || dropRef.current?.contains(target)) return
      setOpen(false)
    }
    const raf = requestAnimationFrame(() => document.addEventListener('mousedown', handler))
    return () => { cancelAnimationFrame(raf); document.removeEventListener('mousedown', handler) }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div style={{ padding: '0 14px 10px', flexShrink: 0 }}>
      <button ref={btnRef} type="button" onClick={handleToggle}
        aria-haspopup="listbox" aria-expanded={open} aria-label={`Platform: ${activeLabel}`}
        style={{
          width: '100%', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 10px', border: '1px solid var(--ps-border)', borderRadius: '10px',
          background: 'var(--ps-bg-surface)', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)',
          transition: 'border-color 150ms ease-out', outline: 'none',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ps-text-tertiary)' }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = '' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--ps-text-primary)' }}
        onBlur={(e) => { if (!open) e.currentTarget.style.borderColor = '' }}>
        <span>{activeLabel}</span>
        <ChevronDown size={14} style={{
          color: 'var(--ps-text-tertiary)', transition: 'transform 150ms ease-out',
          transform: open ? 'rotate(180deg)' : undefined,
        }} aria-hidden="true" />
      </button>

      {open && createPortal(
        <div ref={dropRef} role="listbox" aria-label="Platform filter"
          style={{
            position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width,
            zIndex: 9999, borderRadius: '12px',
            border: '1px solid var(--ps-border)',
            background: 'var(--ps-bg-panel)', backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '4px', overflow: 'hidden',
          }}>
          {options.map((opt) => {
            const isActive = value === opt.value
            return (
              <button key={opt.value} type="button" role="option" aria-selected={isActive}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: '8px',
                  background: isActive ? 'rgba(124,93,250,0.08)' : 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '13px', fontWeight: 500,
                  color: isActive ? '#7C5DFA' : 'var(--ps-text-primary)',
                  transition: 'background 100ms ease-out',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? 'rgba(124,93,250,0.08)' : 'transparent' }}>
                <span>{opt.label}</span>
                {isActive && <Check size={14} strokeWidth={2.5} style={{ color: '#7C5DFA' }} aria-hidden="true" />}
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </div>
  )
}

// ── Legal menu — matches Paletta's DockLegalMenu exactly ──
function LegalMenu() {
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

  const links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        aria-label="Legal links" aria-expanded={open}
        style={{
          width: '100%', height: '48px', display: 'flex', alignItems: 'center',
          gap: '12px', padding: '0 14px', borderRadius: '12px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '14px', fontWeight: 500, fontFamily: 'inherit',
          color: 'var(--ps-text-tertiary)',
          transition: 'color 150ms ease-out, background 150ms ease-out',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)'; e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)'; e.currentTarget.style.background = 'none' }}>
        <Shield size={20} aria-hidden="true" />
        <span>Legal</span>
      </button>
      {open && (
        <div role="menu" style={{
          position: 'absolute', left: 0, bottom: '100%', marginBottom: '4px',
          borderRadius: '8px', border: '0.5px solid var(--ps-border)',
          background: 'var(--ps-bg-panel)', boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          minWidth: '180px', padding: '4px', zIndex: 50,
        }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} role="menuitem" onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', textDecoration: 'none', padding: '8px 12px', borderRadius: '6px', transition: 'background 150ms ease-out' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
              {l.label}
              <ExternalLink size={12} style={{ opacity: 0.4, marginLeft: 'auto' }} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Collapsed Legal menu — MoreHorizontal icon, popover opens right ──
function CollapsedLegalMenu() {
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

  const links = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ]

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <button type="button" onClick={() => setOpen((o) => !o)}
        aria-label="Legal links" aria-expanded={open}
        style={{
          width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', borderRadius: '9999px', cursor: 'pointer',
          background: 'transparent', color: 'var(--ps-text-tertiary)',
          transition: 'color 150ms ease-out, background 150ms ease-out',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)'; e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)'; e.currentTarget.style.background = 'transparent' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
        <MoreHorizontal size={20} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" style={{
          position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)',
          marginLeft: '10px', borderRadius: '8px', border: '0.5px solid var(--ps-border)',
          background: 'var(--ps-bg-panel)', boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          minWidth: '180px', padding: '4px', zIndex: 50,
        }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} role="menuitem" onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', textDecoration: 'none', padding: '8px 12px', borderRadius: '6px', transition: 'background 150ms ease-out' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
              {l.label}
              <ExternalLink size={12} style={{ opacity: 0.4, marginLeft: 'auto' }} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export function LeftPanel() {
  const collapsed = useEditorStore((s) => s.leftPanelCollapsed)
  const setCollapsed = useEditorStore((s) => s.setLeftPanelCollapsed)
  const activeTemplate = useEditorStore((s) => s.activeTemplate)
  const setActiveTemplate = useEditorStore((s) => s.setActiveTemplate)
  const theme = useEditorStore((s) => s.theme)
  const setTheme = useEditorStore((s) => s.setTheme)

  const [tab, setTab] = useState<'templates' | 'assets'>('templates')
  const [platformFilter, setPlatformFilter] = useState<string>('all')

  // Filter templates by selected platform
  const filtered = useMemo(() => {
    if (platformFilter === 'all') return TEMPLATES
    return TEMPLATES.filter((t) => t.platform === platformFilter)
  }, [platformFilter])

  // Group by platform
  const grouped = useMemo(() => {
    const map = new Map<string, Template[]>()
    for (const t of filtered) {
      const arr = map.get(t.platform) || []
      arr.push(t)
      map.set(t.platform, arr)
    }
    return map
  }, [filtered])

  if (collapsed) {
    return (
      <div style={{
        flexShrink: 0, height: '100%',
        width: `${COLLAPSED_WIDTH}px`, borderRadius: '16px',
        background: 'var(--ps-bg-panel)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '0.5px solid var(--ps-border-panel)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '12px 8px',
        zIndex: 10, transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Logo */}
        <button type="button" onClick={() => setCollapsed(false)} aria-label="Expand panel"
          style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'var(--ps-brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            marginBottom: '10px',
            transition: 'transform 150ms ease-out',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" />
          </svg>
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom utility group — matches Paletta collapsed dock */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          {/* Theme toggle — single icon with tooltip */}
          <DarkTooltip label={theme === 'light' ? 'Dark mode' : 'Light mode'} position="right">
            <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              style={{
                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: '9999px', cursor: 'pointer',
                background: 'transparent', color: 'var(--ps-text-tertiary)',
                transition: 'color 150ms ease-out, background 150ms ease-out',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)'; e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)'; e.currentTarget.style.background = 'transparent' }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
              {theme === 'light' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>
          </DarkTooltip>

          {/* Legal — MoreHorizontal icon */}
          <CollapsedLegalMenu />

          {/* Expand — ChevronRight with tooltip */}
          <DarkTooltip label="Expand" position="right">
            <button type="button" onClick={() => setCollapsed(false)} aria-label="Expand panel"
              style={{
                width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', borderRadius: '9999px', cursor: 'pointer',
                background: 'transparent', color: 'var(--ps-text-tertiary)',
                transition: 'color 150ms ease-out, background 150ms ease-out',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)'; e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)'; e.currentTarget.style.background = 'transparent' }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </DarkTooltip>
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...floatingBase, width: `${PANEL_WIDTH}px`, transition: 'width 220ms ease' }}>
      {/* Header — Fix 1: more vertical breathing room */}
      <div style={{ padding: '20px 14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'var(--ps-brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" /></svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ps-text-primary)' }}>Popshot</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ margin: '0 14px 8px', padding: '3px', background: 'var(--ps-bg-hover)', borderRadius: '100px', display: 'flex', gap: '2px', flexShrink: 0 }}>
        {(['templates', 'assets'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{
              flex: 1, height: '30px', fontSize: '12px', fontWeight: tab === t ? 600 : 400,
              fontFamily: 'inherit',
              background: tab === t ? 'var(--ps-bg-surface)' : 'transparent',
              color: tab === t ? 'var(--ps-text-primary)' : 'var(--ps-text-secondary)',
              border: 'none', borderRadius: '100px', cursor: 'pointer',
              transition: 'all 150ms ease-out', textAlign: 'center',
              boxShadow: tab === t ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'templates' ? (
        <>
          {/* Platform dropdown — custom, matching Paletta */}
          <PlatformDropdown value={platformFilter} onChange={setPlatformFilter} />

          {/* Template list */}
          <div className="canvas-workspace" style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
            {Array.from(grouped.entries()).map(([platform, templates]) => (
              <div key={platform} style={{ marginBottom: '16px' }}>
                {/* Platform section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 0 5px' }}>
                  <span style={{ color: 'var(--ps-text-secondary)' }}><PlatformIcon icon={templates[0].platformIcon} /></span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ps-text-primary)' }}>{platform}</span>
                </div>
                {/* 2-col card grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {templates.map((t) => (
                    <TemplateCard key={t.id} template={t} active={activeTemplate === t.id}
                      onSelect={() => setActiveTemplate(activeTemplate === t.id ? null : t.id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Assets — empty state */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--ps-radius-md)', background: 'var(--ps-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <FolderOpen size={16} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />
          </div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', marginBottom: '4px' }}>No assets yet</p>
          <p style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)', marginBottom: '16px', lineHeight: 1.4 }}>Save logos, watermarks, and brand colors to reuse across all your screenshots.</p>
          <button type="button" onClick={openUpgradeModal}
            style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Unlock with Pro &rarr;
          </button>
        </div>
      )}

      {/* Bottom bar — matches Paletta Dock expanded exactly */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px 14px' }}>
        {/* Theme icons — two bare icons side by side with tooltips */}
        <div style={{ height: '48px', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '16px' }}>
          <DarkTooltip label="Light mode" position="top">
            <button type="button" onClick={() => setTheme('light')} aria-label="Light mode"
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                color: theme === 'light' ? '#7C5DFA' : undefined,
                opacity: theme === 'light' ? 1 : 0.4,
                transition: 'opacity 150ms ease-out, color 150ms ease-out',
              }}
              onMouseEnter={(e) => { if (theme !== 'light') e.currentTarget.style.opacity = '0.7' }}
              onMouseLeave={(e) => { if (theme !== 'light') e.currentTarget.style.opacity = '0.4' }}>
              <Sun size={20} aria-hidden="true" />
            </button>
          </DarkTooltip>
          <DarkTooltip label="Dark mode" position="top">
            <button type="button" onClick={() => setTheme('dark')} aria-label="Dark mode"
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: theme === 'dark' ? '#7C5DFA' : undefined,
              opacity: theme === 'dark' ? 1 : 0.4,
              transition: 'opacity 150ms ease-out, color 150ms ease-out',
            }}
            onMouseEnter={(e) => { if (theme !== 'dark') e.currentTarget.style.opacity = '0.7' }}
            onMouseLeave={(e) => { if (theme !== 'dark') e.currentTarget.style.opacity = '0.4' }}>
            <Moon size={20} aria-hidden="true" />
          </button>
          </DarkTooltip>
        </div>

        {/* Legal menu — Shield icon + popover */}
        <LegalMenu />

        {/* Collapse — ChevronLeft + label */}
        <button type="button" onClick={() => setCollapsed(true)} aria-label="Collapse panel"
          style={{
            width: '100%', height: '48px', display: 'flex', alignItems: 'center',
            gap: '12px', padding: '0 14px', borderRadius: '12px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '14px', fontWeight: 500, fontFamily: 'inherit',
            color: 'var(--ps-text-tertiary)',
            transition: 'color 150ms ease-out, background 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)'; e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)'; e.currentTarget.style.background = 'none' }}>
          <ChevronLeft size={20} aria-hidden="true" />
          <span>Collapse</span>
        </button>
      </div>
    </div>
  )
}
