import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'
import { jwtDecode } from 'jwt-decode'

export default async function getUserRole() {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const jwt = jwtDecode(session.access_token)

  // @ts-ignore
  return jwt.user_role as UserRole
}
