import { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { Canvas } from '@/components/canvas/Canvas'
import { MobileTopBar } from './MobileTopBar'
import { MobileControlsSheet } from './MobileControlsSheet'
import { useEditorStore } from '@/store/useEditorStore'
import { TEMPLATES } from '@/data/templates'
import type { Background } from '@/types'

export function MobileShell() {
  const [hoveredBackground, setHoveredBackground] = useState<Background | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeTemplate = useEditorStore((s) => s.activeTemplate)
  const setActiveTemplate = useEditorStore((s) => s.setActiveTemplate)

  const handleHoverBg = useCallback((bg: Background | null) => setHoveredBackground(bg), [])

  return (
    <div style={{
      width: '100vw', height: '100dvh', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: 'var(--ps-bg-page)', position: 'relative',
    }}>
      <MobileTopBar onMenuOpen={() => setMenuOpen(true)} />

      {/* Canvas area */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 0,
      }}>
        <Canvas hoveredBackground={hoveredBackground} />
      </div>

      {/* Controls bottom sheet */}
      <MobileControlsSheet onHoverBackground={handleHoverBg} />

      {/* Template drawer — slides in from right */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 30 }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: '280px', zIndex: 31,
            background: 'var(--ps-bg-panel)', borderLeft: '0.5px solid var(--ps-border)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', flexShrink: 0,
              borderBottom: '0.5px solid var(--ps-border)',
            }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ps-text-primary)' }}>Templates</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"
                style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ps-text-tertiary)', borderRadius: '8px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Template list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', WebkitOverflowScrolling: 'touch' as never }}>
              {/* Group by platform */}
              {Array.from(new Set(TEMPLATES.map(t => t.platform))).map((platform) => {
                const templates = TEMPLATES.filter(t => t.platform === platform)
                return (
                  <div key={platform} style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ps-text-primary)', display: 'block', marginBottom: '8px' }}>{platform}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {templates.map((t) => {
                        const active = activeTemplate === t.id
                        return (
                          <button key={t.id} type="button"
                            onClick={() => { setActiveTemplate(active ? null : t.id); setMenuOpen(false) }}
                            aria-pressed={active}
                            style={{
                              width: '100%', padding: '10px 12px', borderRadius: '10px',
                              background: active ? 'var(--ps-bg-hover)' : 'transparent',
                              border: active ? '1.5px solid var(--ps-text-secondary)' : '1px solid transparent',
                              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                            <span style={{ fontSize: '13px', fontWeight: active ? 600 : 400, color: 'var(--ps-text-primary)' }}>{t.name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--ps-text-tertiary)' }}>{t.width}×{t.height}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
