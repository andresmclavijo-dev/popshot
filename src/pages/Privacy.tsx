const sectionStyle: React.CSSProperties = {
  marginBottom: '32px',
}

const h2Style: React.CSSProperties = {
  fontSize: '18px', fontWeight: 600, color: 'var(--ps-text-primary)',
  marginBottom: '8px',
}

const pStyle: React.CSSProperties = {
  fontSize: '14px', color: 'var(--ps-text-secondary)', lineHeight: 1.6,
  marginBottom: '8px',
}

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ps-bg-page)', fontFamily: 'var(--font-sans)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <a href="/" style={{ fontSize: '13px', color: 'var(--ps-text-tertiary)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          &larr; Back to Popshot
        </a>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ps-text-primary)', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '13px', color: 'var(--ps-text-tertiary)', marginBottom: '32px' }}>Last updated: April 2026</p>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Data we collect</h2>
          <p style={pStyle}>Popshot is a fully client-side application. Your screenshots are processed entirely in your browser and are never uploaded to or stored on our servers.</p>
          <p style={pStyle}>When you sign in with Google, we receive your name, email address, and profile picture from Google. This information is stored securely in our authentication provider (Supabase).</p>
          <p style={pStyle}>We use analytics (PostHog) to understand how the app is used. This includes anonymous usage events like exports and feature usage, but never the content of your screenshots.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>How we use it</h2>
          <p style={pStyle}>Your account information is used solely to manage your subscription and provide access to Pro features. We do not sell, share, or distribute your personal information to third parties.</p>
          <p style={pStyle}>Analytics data helps us improve the product and understand which features are most valuable to users.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Contact us</h2>
          <p style={pStyle}>If you have questions about this privacy policy or your data, reach out to us at hello@popshot.app.</p>
        </div>
      </div>
    </div>
  )
}
