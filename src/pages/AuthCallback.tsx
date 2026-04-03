import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      // Always redirect to the origin we're currently on
      window.location.replace(window.location.origin)
    })
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontFamily: 'var(--font-sans)',
      color: 'var(--ps-text-secondary)', fontSize: '14px',
    }}>
      Signing in...
    </div>
  )
}
