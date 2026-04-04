/**
 * Stripe checkout integration.
 *
 * Pricing: $5/month or $45/year (matches Paletta)
 *
 * Set VITE_STRIPE_MONTHLY_URL and VITE_STRIPE_ANNUAL_URL in .env.local
 * with your Stripe Payment Link URLs from the Stripe dashboard.
 *
 * TODO: Replace placeholder URLs before launch.
 */

const MONTHLY_URL = import.meta.env.VITE_STRIPE_MONTHLY_URL || ''
const ANNUAL_URL = import.meta.env.VITE_STRIPE_ANNUAL_URL || ''

export function openCheckout(plan: 'monthly' | 'annual' = 'annual') {
  const url = plan === 'monthly' ? MONTHLY_URL : ANNUAL_URL

  if (!url || url.includes('PLACEHOLDER')) {
    console.warn('[Popshot] Stripe checkout URL not configured. Set VITE_STRIPE_MONTHLY_URL and VITE_STRIPE_ANNUAL_URL in .env.local')
    return
  }

  window.open(url, '_blank')
}

export function checkUpgradeSuccess(): boolean {
  const params = new URLSearchParams(window.location.search)
  if (params.get('upgrade') === 'success') {
    localStorage.setItem('popshot_pro', 'true')
    window.history.replaceState({}, '', window.location.pathname)
    return true
  }
  return false
}

export function isProUnlocked(): boolean {
  return localStorage.getItem('popshot_pro') === 'true'
}
