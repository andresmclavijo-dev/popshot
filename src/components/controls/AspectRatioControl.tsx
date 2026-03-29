import { useEditorStore } from '@/store/useEditorStore'
import { ASPECT_RATIO_PRESETS } from '@/lib/presets'

function PlatformMark({ id }: { id: string }) {
  const s = { color: '#9F9F9B', display: 'flex', marginBottom: '4px' }
  switch (id) {
    case 'twitter':
      return <div style={s}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.75l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></div>
    case 'linkedin':
      return <div style={s}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></div>
    case 'dribbble':
      return <div style={s}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.816zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.176zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.386z"/></svg></div>
    case 'pinterest':
      return <div style={s}><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg></div>
    case 'behance':
      return <div style={s}><span style={{ fontSize: '11px', fontWeight: 700 }}>Be</span></div>
    case 'og':
      return <div style={s}><span style={{ fontSize: '10px', fontWeight: 600 }}>OG</span></div>
    default:
      return null
  }
}

export function AspectRatioControl() {
  const aspectRatio = useEditorStore((s) => s.aspectRatio)
  const setAspectRatio = useEditorStore((s) => s.setAspectRatio)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      {ASPECT_RATIO_PRESETS.map((preset) => {
        const active = aspectRatio === preset.id
        const hasDims = preset.width !== null
        const mark = PlatformMark({ id: preset.id })
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => setAspectRatio(preset.id)}
            aria-pressed={active}
            aria-label={`${preset.label} canvas size`}
            style={{
              border: active ? '2px solid #222222' : '1px solid #DDDDDD',
              borderRadius: '12px',
              background: '#FFFFFF',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: mark ? 'center' : 'flex-start',
              gap: '2px',
              textAlign: mark ? 'center' : 'left',
              transition: 'border 100ms var(--ease-out)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = '#B0B0B0' }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.borderColor = '#DDDDDD'
              e.currentTarget.style.transform = 'none'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
          >
            {mark}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#222222', lineHeight: 1.3 }}>
              {preset.label}
            </span>
            {hasDims && (
              <span style={{ fontSize: '10px', fontWeight: 400, color: '#717171', lineHeight: 1.2, marginTop: '2px' }}>
                {preset.width}&times;{preset.height}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
