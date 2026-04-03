import { supabase } from './supabase'

export async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://popshot.app/auth/callback',
    },
  })
}

export async function signOut() {
  await supabase.auth.signOut()
}
