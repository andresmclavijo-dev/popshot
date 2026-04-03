import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      window.location.href = '/'
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
