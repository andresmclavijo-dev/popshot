declare global {
  interface Window {
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void
      }
    }
  }
}

const VARIANT_ID = 'VARIANT_ID_PLACEHOLDER'

export function openCheckout() {
  const url = `https://popshot.lemonsqueezy.com/checkout/buy/${VARIANT_ID}`
  if (window.LemonSqueezy) {
    window.LemonSqueezy.Url.Open(url)
  } else {
    window.open(url, '_blank')
  }
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
