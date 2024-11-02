import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { createErrorResponse } from '../_utils/create-response'
import { StatusCodes } from 'http-status-codes'
import { SB_COKIE_SESSION_NAME } from '@/constants'

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const authCode = url.searchParams.get('code')

  if (!authCode) {
    return createErrorResponse({
      errorMessage: 'No code provided',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode)

  if (error) {
    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }

  const { access_token, refresh_token } = data.session

  cookies.set(SB_COKIE_SESSION_NAME.acesss, access_token, {
    path: '/'
  })
  cookies.set(SB_COKIE_SESSION_NAME.refresh, refresh_token, {
    path: '/'
  })

  return redirect('/')
}
