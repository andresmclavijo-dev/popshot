import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { initAnalytics } from './lib/analytics'
import { supabase } from './lib/supabase'
import { useEditorStore } from './store/useEditorStore'

// Apply theme before first paint to avoid flash
const savedTheme = localStorage.getItem('ps_theme')
if (savedTheme === 'dark') document.documentElement.classList.add('dark')

// Initialize analytics
initAnalytics()

// Bootstrap auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useEditorStore.getState().setUser(session?.user ?? null)
})
supabase.auth.onAuthStateChange((_event, session) => {
  useEditorStore.getState().setUser(session?.user ?? null)
})

// Simple routing: /auth/callback renders the callback page
if (window.location.pathname === '/auth/callback') {
  import('./pages/AuthCallback').then(({ default: AuthCallback }) => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode><AuthCallback /></StrictMode>
    )
  })
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode><App /></StrictMode>
  )
}
