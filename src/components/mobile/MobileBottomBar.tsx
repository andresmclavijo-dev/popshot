import { LayoutGrid, Palette, Frame, Sparkles, Download } from 'lucide-react'

export type MobileTab = 'templates' | 'background' | 'layout' | 'effects' | 'export'

const TABS: { id: MobileTab; label: string; Icon: typeof LayoutGrid }[] = [
  { id: 'templates', label: 'Templates', Icon: LayoutGrid },
  { id: 'background', label: 'Background', Icon: Palette },
  { id: 'layout', label: 'Layout', Icon: Frame },
  { id: 'effects', label: 'Effects', Icon: Sparkles },
  { id: 'export', label: 'Export', Icon: Download },
]

export function MobileBottomBar({ activeTab, onTabChange }: { activeTab: MobileTab | null; onTabChange: (tab: MobileTab | null) => void }) {
  return (
    <nav aria-label="Editor controls" style={{
      flexShrink: 0,
      background: 'var(--ps-bg-panel)',
      borderTop: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 -1px 3px rgba(0,0,0,0.04)',
      paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)',
      paddingTop: '6px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button key={id} type="button"
              onClick={() => onTabChange(isActive ? null : id)}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '3px', padding: '6px 0', minHeight: '44px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{ color: isActive ? 'var(--ps-text-primary)' : 'var(--ps-text-tertiary)', transition: 'color 150ms ease-out' }}
              />
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--ps-text-primary)' : 'var(--ps-text-tertiary)',
                letterSpacing: '-0.01em',
                transition: 'color 150ms ease-out',
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
