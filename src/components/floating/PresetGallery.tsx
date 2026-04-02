import { X, Lock } from 'lucide-react'
import { useEditorStore } from '@/store/useEditorStore'
import { showToast } from '@/components/shared/Toast'
import type { Background, ShadowType, FrameType, ImagePosition, SavedPreset } from '@/types'

interface CommunityPreset {
  name: string
  background: Background
  padding: number
  cornerRadius: number
  shadow: ShadowType
  frame: FrameType
  imagePosition: ImagePosition
  previewBg: string
}

const COMMUNITY_PRESETS: CommunityPreset[] = [
  { name: 'Clean white', background: { type: 'solid', value: '#FFFFFF' }, padding: 48, cornerRadius: 12, shadow: 'soft', frame: 'none', imagePosition: 'center', previewBg: 'linear-gradient(135deg, #FFF, #F0F0F0)' },
  { name: 'Dark minimal', background: { type: 'solid', value: '#1A1A18' }, padding: 40, cornerRadius: 8, shadow: 'deep', frame: 'none', imagePosition: 'center', previewBg: 'linear-gradient(135deg, #1A1A18, #333)' },
  { name: 'Gradient pop', background: { type: 'gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)' }, padding: 56, cornerRadius: 16, shadow: 'soft', frame: 'none', imagePosition: 'center', previewBg: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { name: 'Arc showcase', background: { type: 'solid', value: '#1A1A2E' }, padding: 48, cornerRadius: 12, shadow: 'deep', frame: 'arc', imagePosition: 'center', previewBg: 'linear-gradient(135deg, #1A1A2E, #2D2D4E)' },
  { name: 'Card shadow', background: { type: 'solid', value: '#F7F7F6' }, padding: 64, cornerRadius: 20, shadow: 'deep', frame: 'card', imagePosition: 'center', previewBg: 'linear-gradient(135deg, #F7F7F6, #E8E8E6)' },
  { name: 'Warm linen', background: { type: 'gradient', value: 'linear-gradient(135deg, #ffecd2, #fcb69f)' }, padding: 48, cornerRadius: 14, shadow: 'soft', frame: 'macos-light', imagePosition: 'center', previewBg: 'linear-gradient(135deg, #ffecd2, #fcb69f)' },
]

function PresetCard({ name, previewBg, onClick }: { name: string; previewBg: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        aspectRatio: '4/3',
        background: previewBg,
        borderRadius: '10px',
        border: '1px solid rgba(0,0,0,0.06)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontFamily: 'inherit',
        outline: 'none',
        transition: 'transform 150ms var(--ease-out)',
        padding: '8px',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {/* Mini canvas preview */}
      <div style={{ width: '60%', height: '45%', borderRadius: '4px', background: 'rgba(255,255,255,0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
      <span style={{ fontSize: '10px', fontWeight: 500, color: previewBg.includes('#1A1A') || previewBg.includes('#333') ? 'rgba(255,255,255,0.8)' : '#333', textShadow: previewBg.includes('#1A1A') ? '0 1px 2px rgba(0,0,0,0.3)' : 'none' }}>
        {name}
      </span>
    </button>
  )
}

interface Props {
  open: boolean
  onClose: () => void
}

export function PresetGallery({ open, onClose }: Props) {
  const proUnlocked = useEditorStore((s) => s.proUnlocked)
  const savedPresets = useEditorStore((s) => s.savedPresets)
  const applyPreset = useEditorStore((s) => s.applyPreset)

  const applyCommunity = (p: CommunityPreset) => {
    const s = useEditorStore.getState()
    s.setBackground(p.background)
    s.setPadding(p.padding)
    s.setCornerRadius(p.cornerRadius)
    s.setShadow(p.shadow)
    s.setFrame(p.frame)
    s.setImagePosition(p.imagePosition)
    showToast(`${p.name} applied`)
    onClose()
  }

  const applySaved = (p: SavedPreset) => {
    applyPreset(p)
    showToast(`${p.name} applied`)
    onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100 }} />

      {/* Modal */}
      <div
        className="frosted-pill"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101,
          width: '100%',
          maxWidth: '640px',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Presets</span>
          <button type="button" onClick={onClose} aria-label="Close"
            style={{ background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 100ms var(--ease-out)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)' }}>
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Community presets */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '12px' }}>
            Community presets
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {COMMUNITY_PRESETS.map((p) => (
              <PresetCard key={p.name} name={p.name} previewBg={p.previewBg} onClick={() => applyCommunity(p)} />
            ))}
          </div>
        </div>

        {/* My presets */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
            My presets
            {!proUnlocked && <Lock size={10} strokeWidth={2.5} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />}
          </span>

          {!proUnlocked ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)', border: '1px dashed #DDD', borderRadius: '12px' }}>
              Save your first style to see it here · Pro
            </div>
          ) : savedPresets.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)', border: '1px dashed #DDD', borderRadius: '12px' }}>
              No saved presets yet. Use "Save" in the panel footer to save your current style.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {savedPresets.map((p) => (
                <PresetCard
                  key={p.id}
                  name={p.name}
                  previewBg={p.background.type === 'gradient' ? p.background.value : p.background.type === 'solid' ? `linear-gradient(135deg, ${p.background.value}, ${p.background.value})` : '#F0F0F0'}
                  onClick={() => applySaved(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
