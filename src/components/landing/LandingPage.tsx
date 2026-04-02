import { useRef } from 'react'
import { DropZone } from '@/components/canvas/DropZone'

const CHECKOUT_URL = 'https://popshot.app/#pro'

const sectionStyle: React.CSSProperties = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '0 24px',
}

export function LandingPage({ onOpenGallery }: { onOpenGallery: () => void }) {
  const uploadRef = useRef<HTMLDivElement>(null)

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      background: 'var(--color-bg-page)',
    }}>
      {/* Hero */}
      <section style={{ ...sectionStyle, paddingTop: '120px', paddingBottom: '80px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '44px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '16px',
        }}>
          Make your screenshots<br />look finished.
        </h1>
        <p style={{
          fontSize: '17px',
          fontWeight: 400,
          color: '#5c5c5c',
          lineHeight: 1.5,
          maxWidth: '480px',
          margin: '0 auto 32px',
        }}>
          Popshot turns raw screenshots into polished visuals for your landing pages, tweets, and case studies. No account. No subscription. No fuss.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
          <button
            type="button"
            onClick={scrollToUpload}
            style={{
              height: '44px', padding: '0 28px', background: '#222', color: '#FFF',
              border: 'none', borderRadius: '22px', fontSize: '15px', fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer', transition: 'background 100ms var(--ease-out), transform 100ms var(--ease-out)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#333' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#222'; e.currentTarget.style.transform = 'none' }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'none' }}
          >
            Try it free &rarr;
          </button>
          <button
            type="button"
            onClick={onOpenGallery}
            style={{
              height: '44px', padding: '0 28px', background: 'transparent', color: 'var(--color-text-secondary)',
              border: '1px solid #DDD', borderRadius: '22px', fontSize: '15px', fontWeight: 500,
              fontFamily: 'inherit', cursor: 'pointer', transition: 'all 100ms var(--ease-out)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#222' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#DDD'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
          >
            See examples
          </button>
        </div>

        {/* Before / After */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
          <div style={{ width: '160px', height: '100px', borderRadius: '8px', background: '#FFF', border: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '120px', height: '72px', borderRadius: '4px', background: '#F0F0F0', border: '1px solid #DDD' }} />
            <span style={{ position: 'absolute', bottom: '6px', fontSize: '10px', color: '#999', fontWeight: 500 }}>before</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, color: '#CCC' }}>
            <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ width: '160px', height: '100px', borderRadius: '10px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '16px', position: 'relative' }}>
            <div style={{ width: '120px', height: '72px', borderRadius: '6px', background: 'rgba(255,255,255,0.92)', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }} />
            <span style={{ position: 'absolute', bottom: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>after</span>
          </div>
        </div>
      </section>

      {/* Proof points */}
      <section style={{ ...sectionStyle, paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, title: 'Drag, drop, done', body: 'Upload or paste a screenshot. Pick a background, add a frame, adjust the shadow. Export PNG or JPG at up to 3\u00d7.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, title: '$19 once, yours forever', body: 'No monthly drain. No annual renewal. Pay once, unlock everything, use it whenever you need it.' },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title: 'No account required', body: 'Open the app, do the work, close the tab. Your screenshots never touch a server. Fully client\u2011side.' },
          ].map((item) => (
            <div key={item.title} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#222', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: '#5c5c5c', lineHeight: 1.5 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upload zone */}
      <section ref={uploadRef} style={{ ...sectionStyle, paddingBottom: '80px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 500, color: '#222', textAlign: 'center', marginBottom: '24px' }}>
          Ready to try it?
        </h2>
        <DropZone />
      </section>

      {/* Pricing */}
      <section style={{ ...sectionStyle, paddingBottom: '80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '560px', margin: '0 auto' }}>
          {/* Free */}
          <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#222', marginBottom: '16px' }}>Free</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Unlimited exports', '6 backgrounds', 'macOS frame', 'Custom hex color', 'All aspect ratios', 'PNG + JPG at 1\u00d7, 2\u00d7, 3\u00d7'].map((f) => (
                <li key={f} style={{ fontSize: '13px', color: '#5c5c5c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 7l2 2 4-4" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Pro */}
          <div style={{ background: '#FFF', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#222' }}>Pro</h3>
              <span style={{ textDecoration: 'line-through', color: 'rgba(0,0,0,0.35)', fontSize: '14px' }}>$29</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#222' }}>$19</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>launch price</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>Everything in Free, plus:</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {['All backgrounds + premium frames', 'Custom background image', 'Save unlimited presets', 'Logo / watermark overlay', 'Full preset gallery', 'Priority support'].map((f) => (
                <li key={f} style={{ fontSize: '13px', color: '#5c5c5c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 7l2 2 4-4" stroke="#7C5DFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#222', color: '#FFF', borderRadius: '10px', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit', textDecoration: 'none', transition: 'background 100ms var(--ease-out)' }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#333' }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = '#222' }}>
              Get Pro — $19
            </a>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '8px' }}>
              One-time · No subscription · Instant access
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ ...sectionStyle, paddingBottom: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#6b6b6b' }}>
          Popshot · Made by Andres · Also try{' '}
          <a href="https://paletta.io" target="_blank" rel="noopener noreferrer" style={{ color: '#6b6b6b', textDecoration: 'underline' }}>
            Paletta
          </a>
          {' '}&rarr;
        </p>
      </footer>
    </div>
  )
}
