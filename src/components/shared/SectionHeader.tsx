import type { LucideIcon } from 'lucide-react'

interface SectionHeaderProps {
  icon: LucideIcon
  label: string
}

export function SectionHeader({ icon: Icon, label }: SectionHeaderProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      paddingBottom: '10px',
      marginBottom: '12px',
      borderBottom: '0.5px solid var(--color-app-border)',
    }}>
      <Icon
        size={14}
        strokeWidth={2}
        style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }}
      />
      <span style={{
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        letterSpacing: '0.01em',
      }}>
        {label}
      </span>
    </div>
  )
}
