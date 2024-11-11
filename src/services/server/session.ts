import { SB_COKIE_SESSION_NAME } from '@/constants'
import { supabase } from '@/lib/supabase'
import type { AuthError, Session, User } from '@supabase/supabase-js'
import type { AstroCookies } from 'astro'

type Args =
  | {
      cookies: AstroCookies
    }
  | undefined

export async function getSession(context: Args = undefined): Promise<{
  session: Session | null
  user: User | null
  error?: AuthError
}> {
  const { cookies } = context ?? { cookies: null }

  const supabaseAccessToken = cookies?.get(SB_COKIE_SESSION_NAME.access)
  const supabaseRefreshToken = cookies?.get(SB_COKIE_SESSION_NAME.refresh)

  if (supabaseAccessToken && supabaseRefreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: supabaseAccessToken.value,
      refresh_token: supabaseRefreshToken.value
    })

    if (error) {
      cookies?.delete(SB_COKIE_SESSION_NAME.access, { path: '/' })
      cookies?.delete(SB_COKIE_SESSION_NAME.refresh, { path: '/' })

      return { session: null, user: null, error }
    }

    return { session: data.session, user: data.user }
  }

  const { data } = await supabase.auth.getSession()
  return { session: data.session, user: data?.session?.user ?? null }
}

export async function signOut() {
  return await supabase.auth.signOut()
}
