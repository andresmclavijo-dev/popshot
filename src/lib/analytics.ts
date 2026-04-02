/**
 * PostHog analytics wrapper.
 *
 * To activate:
 * 1. npm install posthog-js
 * 2. Set VITE_POSTHOG_KEY in .env
 * 3. Uncomment the posthog.init() call in main.tsx
 *
 * Until then, all capture calls are no-ops.
 */

// TODO: Replace with actual PostHog import when installed
// import posthog from 'posthog-js'

type EventName =
  | 'image_uploaded'
  | 'template_selected'
  | 'background_changed'
  | 'export_started'
  | 'export_completed'
  | 'pro_modal_shown'
  | 'upgrade_clicked'
  | 'license_activated'

export function capture(event: EventName, properties?: Record<string, unknown>) {
  // TODO: Wire to PostHog when key is configured
  // posthog.capture(event, properties)
  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${event}`, properties)
  }
}

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY
  if (!key) return

  // TODO: Uncomment when posthog-js is installed
  // posthog.init(key, {
  //   api_host: 'https://app.posthog.com',
  //   capture_pageview: true,
  //   capture_pageleave: true,
  // })
}
