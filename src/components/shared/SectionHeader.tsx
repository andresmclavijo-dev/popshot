interface SectionDividerProps {
  label: string
  action?: React.ReactNode
}

export function SectionDivider({ label, action }: SectionDividerProps) {
  return (
    <div style={{
      paddingTop: '24px',
      paddingBottom: '14px',
      borderBottom: '0.5px solid var(--color-app-border)',
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
      }}>
        {label}
      </span>
      {action}
    </div>
  )
}
