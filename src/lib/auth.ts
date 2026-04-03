import { supabase } from './supabase'

export async function signInWithGoogle() {
  const isProd = window.location.hostname === 'popshot.app'
  const redirectTo = isProd
    ? 'https://popshot.app/auth/callback'
    : 'http://localhost:5173/auth/callback'

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
}

export async function signOut() {
  await supabase.auth.signOut()
}
