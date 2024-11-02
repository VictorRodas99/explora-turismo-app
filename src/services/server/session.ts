import { supabase } from '@/lib/supabase'

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    return {
      session: null,
      user: null
    }
  }

  return {
    session: data.session,
    user: data.session?.user ?? null
  }
}

export async function signOut() {
  return await supabase.auth.signOut()
}
