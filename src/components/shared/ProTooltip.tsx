import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const CHECKOUT_URL = 'https://popshot.app/#pro'

export function ProTooltipContent() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      minWidth: '180px',
    }}>
      <span style={{ fontWeight: 600, fontSize: '12px' }}>Popshot Pro · $19 once, yours forever</span>
      <a
        href={CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          color: '#FFF',
          fontSize: '12px',
          textDecoration: 'none',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline' }}
        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none' }}
      >
        Upgrade &rarr;
      </a>
    </div>
  )
}

export function ProGatedTooltip({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<div style={{ cursor: 'default' }} />}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        style={{
          background: 'rgba(0,0,0,0.9)',
          color: '#FFF',
          borderRadius: '10px',
          padding: '10px 14px',
          border: 'none',
        }}
      >
        <ProTooltipContent />
      </TooltipContent>
    </Tooltip>
  )
}
