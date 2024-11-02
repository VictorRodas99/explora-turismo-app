import { signOut } from '@/services/server/session'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const { error } = await signOut()

  if (error) {
    throw error
  }

  cookies.delete('sb-access-token', { path: '/' })
  cookies.delete('sb-refresh-token', { path: '/' })

  return redirect('/login')
}
