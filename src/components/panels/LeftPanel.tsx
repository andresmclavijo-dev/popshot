import { useState, useMemo } from 'react'
import { ChevronLeft, Sun, Moon, Search, FolderOpen, ChevronsLeft, LogOut } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { openUpgradeModal } from '@/components/shared/UpgradeModal'
import { signInWithGoogle, signOut } from '@/lib/auth'
import { TEMPLATES, type Template, type TemplateCategory } from '@/data/templates'

const PANEL_WIDTH = 220
const COLLAPSED_WIDTH = 44

const floatingBase: React.CSSProperties = {
  position: 'absolute',
  left: '12px',
  top: '12px',
  bottom: '12px',
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

const FILTERS: { label: string; value: TemplateCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Social', value: 'social' },
  { label: 'Portfolio', value: 'portfolio' },
  { label: 'Product Hunt', value: 'producthunt' },
]

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

function TemplateCard({ template, active, onSelect }: { template: Template; active: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={active} aria-label={`${template.name} ${template.width}×${template.height}`}
      style={{
        width: '100%', background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '0', fontFamily: 'inherit', textAlign: 'left',
        outline: active ? `1.5px solid var(--ps-border-selected)` : 'none',
        outlineOffset: '2px', borderRadius: 'var(--ps-radius-sm)',
        transition: 'outline 150ms ease-out',
      }}>
      {/* Thumbnail */}
      <div style={{
        width: '100%', aspectRatio: `${template.width}/${template.height}`,
        maxHeight: '80px', background: '#2a2a2a', borderRadius: 'var(--ps-radius-sm)', border: '1px solid var(--ps-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '4px', overflow: 'hidden',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>{template.ratioLabel}</span>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ps-text-primary)', display: 'block', lineHeight: 1.3 }}>{template.name}</span>
      <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--ps-text-tertiary)' }}>{template.width} × {template.height}</span>
    </button>
  )
}

export function LeftPanel() {
  const collapsed = useEditorStore((s) => s.leftPanelCollapsed)
  const setCollapsed = useEditorStore((s) => s.setLeftPanelCollapsed)
  const activeTemplate = useEditorStore((s) => s.activeTemplate)
  const setActiveTemplate = useEditorStore((s) => s.setActiveTemplate)
  const theme = useEditorStore((s) => s.theme)
  const setTheme = useEditorStore((s) => s.setTheme)
  const user = useEditorStore((s) => s.user)

  const [tab, setTab] = useState<'templates' | 'assets'>('templates')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TemplateCategory | 'all'>('all')

  const filtered = useMemo(() => {
    let list = TEMPLATES
    if (filter !== 'all') list = list.filter((t) => t.category.includes(filter))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.platform.toLowerCase().includes(q))
    }
    return list
  }, [filter, search])

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
        position: 'absolute', left: '12px', top: '12px', bottom: '12px',
        width: `${COLLAPSED_WIDTH}px`, borderRadius: '16px',
        background: 'var(--ps-bg-panel)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '0.5px solid var(--ps-border-panel)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', padding: '10px 0 10px',
        zIndex: 10, transition: 'width 220ms ease',
      }}>
        {/* Logo mark — click to expand */}
        <button type="button" onClick={() => setCollapsed(false)} aria-label="Expand panel"
          style={{
            width: '28px', height: '28px', borderRadius: 'var(--ps-radius-sm)',
            background: 'var(--ps-brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            transition: 'transform 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" />
          </svg>
        </button>

        {/* Expand chevron hint */}
        <button type="button" onClick={() => setCollapsed(false)} aria-label="Expand panel"
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--ps-text-tertiary)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '4px', borderRadius: 'var(--ps-radius-sm)',
            transition: 'all 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-tertiary)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Theme toggle — functional when collapsed */}
        <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          style={{
            width: '28px', height: '28px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', border: 'none', borderRadius: 'var(--ps-radius-sm)',
            cursor: 'pointer', background: 'transparent', color: 'var(--ps-text-tertiary)',
            flexShrink: 0, transition: 'all 150ms ease-out',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-tertiary)' }}>
          {theme === 'light' ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
        </button>
      </div>
    )
  }

  return (
    <div style={{ ...floatingBase, width: `${PANEL_WIDTH}px`, transition: 'width 220ms ease' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'var(--ps-brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0.5L11 3.5V8.5L6 11.5L1 8.5V3.5L6 0.5Z" fill="white" fillOpacity="0.95" /></svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ps-text-primary)' }}>Popshot</span>
        </div>
        <button type="button" onClick={() => setCollapsed(true)} aria-label="Collapse panel"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: 'var(--ps-radius-sm)', color: 'var(--ps-text-tertiary)', display: 'flex', transition: 'all 150ms ease-out' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}>
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Auth — sign in or user profile */}
      {user ? (
        <div style={{ margin: '0 14px 8px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: 'var(--ps-radius-sm)', border: `1px solid var(--ps-border)` }}>
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0 }} />
          )}
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ps-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </span>
          <button type="button" onClick={signOut} aria-label="Sign out"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--ps-text-tertiary)', display: 'flex', transition: 'color 150ms ease-out' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)' }}>
            <LogOut size={14} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={signInWithGoogle}
          style={{ margin: '0 14px 8px', padding: '8px 12px', background: 'transparent', border: `1px solid var(--ps-border)`, borderRadius: 'var(--ps-radius-sm)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', textAlign: 'left', transition: 'border-color 150ms ease-out', width: 'calc(100% - 28px)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ps-border-selected)' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}>
          Sign in with Google &rarr;
        </button>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', padding: '0 14px 8px', flexShrink: 0 }}>
        {(['templates', 'assets'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '6px 0', fontSize: '12px', fontWeight: tab === t ? 600 : 500,
              fontFamily: 'inherit', background: tab === t ? 'var(--ps-text-primary)' : 'transparent',
              color: tab === t ? 'var(--ps-bg-page)' : 'var(--ps-text-secondary)',
              border: 'none', borderRadius: 'var(--ps-radius-sm)', cursor: 'pointer',
              transition: 'all 150ms ease-out', textAlign: 'center',
            }}
            onMouseEnter={(e) => { if (tab !== t) e.currentTarget.style.background = 'var(--ps-bg-hover)' }}
            onMouseLeave={(e) => { if (tab !== t) e.currentTarget.style.background = 'transparent' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'templates' ? (
        <>
          {/* Search */}
          <div style={{ padding: '0 14px 8px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '32px', border: `1px solid var(--ps-border-strong)`, borderRadius: 'var(--ps-radius-sm)', padding: '0 8px', gap: '6px', background: 'var(--ps-bg-surface)' }}>
              <Search size={14} style={{ color: 'var(--ps-text-tertiary)', flexShrink: 0 }} aria-hidden="true" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px', fontFamily: 'inherit', color: 'var(--ps-text-primary)', background: 'transparent', minWidth: 0 }} />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '4px', padding: '0 14px 10px', flexShrink: 0, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button key={f.value} type="button" onClick={() => setFilter(f.value)}
                style={{
                  padding: '4px 10px', fontSize: '11px', fontWeight: 500, fontFamily: 'inherit',
                  background: filter === f.value ? 'var(--ps-text-primary)' : 'var(--ps-bg-hover)',
                  color: filter === f.value ? 'var(--ps-bg-page)' : 'var(--ps-text-secondary)',
                  border: 'none', borderRadius: 'var(--ps-radius-pill)', cursor: 'pointer',
                  transition: 'all 150ms ease-out',
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Template list */}
          <div className="canvas-workspace" style={{ flex: 1, overflowY: 'auto', padding: '0 14px' }}>
            {Array.from(grouped.entries()).map(([platform, templates]) => (
              <div key={platform} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 0 5px' }}>
                  <span style={{ color: 'var(--ps-text-secondary)' }}><PlatformIcon icon={templates[0].platformIcon} /></span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ps-text-primary)' }}>{platform}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
            <FolderOpen size={24} style={{ color: 'var(--ps-text-tertiary)' }} aria-hidden="true" />
          </div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ps-text-primary)', marginBottom: '4px' }}>No assets yet</p>
          <p style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)', marginBottom: '16px', lineHeight: 1.4 }}>Save logos, watermarks, and brand colors to reuse across all your screenshots.</p>
          <button type="button" onClick={openUpgradeModal}
            style={{ fontSize: '12px', fontWeight: 500, fontFamily: 'inherit', color: 'var(--ps-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Unlock with Pro &rarr;
          </button>
        </div>
      )}

      {/* Bottom section */}
      <div style={{ borderTop: `0.5px solid var(--ps-border)`, flexShrink: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--ps-bg-hover)', borderRadius: 'var(--ps-radius-sm)', padding: '2px' }}>
            <button type="button" onClick={() => setTheme('light')} aria-label="Light mode"
              style={{ width: '28px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: '6px', cursor: 'pointer', background: theme === 'light' ? 'var(--ps-bg-surface)' : 'transparent', color: theme === 'light' ? 'var(--ps-text-primary)' : 'var(--ps-text-tertiary)', transition: 'all 150ms ease-out', boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}>
              <Sun size={14} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setTheme('dark')} aria-label="Dark mode"
              style={{ width: '28px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: '6px', cursor: 'pointer', background: theme === 'dark' ? 'var(--ps-bg-surface)' : 'transparent', color: theme === 'dark' ? 'var(--ps-text-primary)' : 'var(--ps-text-tertiary)', transition: 'all 150ms ease-out', boxShadow: theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}>
              <Moon size={14} aria-hidden="true" />
            </button>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--ps-text-tertiary)' }}>Appearance</span>
        </div>

        {/* Legal links */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <a href="https://popshot.app/privacy" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}>
            Privacy
          </a>
          <span style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)' }}>&middot;</span>
          <a href="https://popshot.app/terms" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)', textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
            onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}>
            Terms
          </a>
        </div>

        {/* Collapse */}
        <button type="button" onClick={() => setCollapsed(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', fontSize: '12px', fontFamily: 'inherit', color: 'var(--ps-text-tertiary)', transition: 'color 150ms ease-out' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ps-text-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--ps-text-tertiary)' }}>
          <ChevronsLeft size={14} aria-hidden="true" />
          Collapse
        </button>
      </div>
    </div>
  )
}
