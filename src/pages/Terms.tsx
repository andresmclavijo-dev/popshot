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

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ps-bg-page)', fontFamily: 'var(--font-sans)', padding: '48px 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <a href="/" style={{ fontSize: '13px', color: 'var(--ps-text-tertiary)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
          &larr; Back to Popshot
        </a>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--ps-text-primary)', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ fontSize: '13px', color: 'var(--ps-text-tertiary)', marginBottom: '32px' }}>Last updated: April 2026</p>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Acceptance</h2>
          <p style={pStyle}>By using Popshot, you agree to these terms. If you do not agree, please do not use the service.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Use of service</h2>
          <p style={pStyle}>Popshot is a screenshot beautification tool. You may use it for personal and commercial purposes. You retain full ownership of any images you create with Popshot.</p>
          <p style={pStyle}>You agree not to use the service for any unlawful purpose or in any way that could damage or impair the service.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Payments</h2>
          <p style={pStyle}>Popshot Pro is available as a monthly ($5/mo) or annual ($45/yr) subscription. Payments are processed securely through Stripe. You may cancel your subscription at any time.</p>
          <p style={pStyle}>Refunds are available within 14 days of purchase if you are not satisfied with the service.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>For questions about these terms, contact us at hello@popshot.app.</p>
        </div>
      </div>
    </div>
  )
}
