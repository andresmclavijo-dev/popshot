import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { initAnalytics } from './lib/analytics'

// Apply theme before first paint to avoid flash
const savedTheme = localStorage.getItem('ps_theme')
if (savedTheme === 'dark') document.documentElement.classList.add('dark')

// Initialize analytics
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
