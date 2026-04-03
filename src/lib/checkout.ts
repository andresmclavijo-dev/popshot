/**
 * Stripe checkout integration.
 *
 * Set VITE_STRIPE_MONTHLY_URL and VITE_STRIPE_ANNUAL_URL in .env.local
 * with your Stripe Payment Link URLs.
 */

// TODO: Replace with real Stripe Payment Link URLs from dashboard
const MONTHLY_URL = import.meta.env.VITE_STRIPE_MONTHLY_URL || 'https://buy.stripe.com/MONTHLY_PLACEHOLDER'
const ANNUAL_URL = import.meta.env.VITE_STRIPE_ANNUAL_URL || 'https://buy.stripe.com/ANNUAL_PLACEHOLDER'

export function openCheckout(plan: 'monthly' | 'annual' = 'annual') {
  const url = plan === 'monthly' ? MONTHLY_URL : ANNUAL_URL
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
