import { LayoutGrid } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface Props {
  onOpenGallery: () => void
}

export function LeftPill({ onOpenGallery }: Props) {
  return (
    <div
      className="frosted-pill"
      style={{
        position: 'absolute',
        left: '18px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '6px',
      }}
    >
      <Tooltip>
        <TooltipTrigger render={
          <button
            type="button"
            onClick={onOpenGallery}
            aria-label="Style presets"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              borderRadius: 'var(--ps-radius-md)',
              color: 'var(--ps-text-secondary)',
              fontSize: '11px',
              fontWeight: 500,
              fontFamily: 'inherit',
              transition: 'all 150ms ease-out',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ps-bg-hover)'; e.currentTarget.style.color = 'var(--ps-text-primary)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ps-text-secondary)' }}
          />
        }>
          <LayoutGrid size={18} aria-hidden="true" />
          <span>Examples</span>
        </TooltipTrigger>
        <TooltipContent side="right">Style presets</TooltipContent>
      </Tooltip>
    </div>
  )
}
