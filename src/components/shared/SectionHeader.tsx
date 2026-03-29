interface SectionHeaderProps {
  label: string
  action?: React.ReactNode
}

export function SectionHeader({ label, action }: SectionHeaderProps) {
  return (
    <div style={{
      paddingTop: '24px',
      paddingLeft: '24px',
      paddingRight: '24px',
      paddingBottom: '12px',
      borderBottom: '1px solid var(--color-border)',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span style={{
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      }}>
        {label}
      </span>
      {action}
    </div>
  )
}

// Keep backward compat export
export const SectionDivider = SectionHeader
