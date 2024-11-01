import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { AUTH_INPUTS_NAMES, SB_COKIE_SESSION_NAME } from '@/constants'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { StatusCodes } from 'http-status-codes'
import type { Provider } from '@supabase/supabase-js'
import { getOrigin } from '@/utils/general'

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()

  const email = formData.get(AUTH_INPUTS_NAMES.email)?.toString()
  const password = formData.get(AUTH_INPUTS_NAMES.password)?.toString()

  const provider = formData.get('provider')?.toString()

  const validProviders = ['google']

  if (provider && validProviders.includes(provider)) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${getOrigin()}/api/auth/callback`
      }
    })

    if (error) {
      return createErrorResponse({
        errorMessage: error.message,
        responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }

    return createSucessResponse({
      responseStatus: StatusCodes.OK,
      data: { redirectTo: '/' }
    })
  }

  if (!email || !password) {
    return createErrorResponse({
      errorMessage: 'Email and password are required',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    const message =
      error.code === 'invalid_credentials'
        ? 'Contraseña o email incorrectos'
        : error.message

    return createErrorResponse({
      errorMessage: message,
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

  return createSucessResponse({
    responseStatus: 200,
    data: { redirectTo: '/' }
  })
}
