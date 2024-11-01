import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'
import { AUTH_INPUTS_NAMES } from '@/constants'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { StatusCodes } from 'http-status-codes'

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()

  const email = formData.get(AUTH_INPUTS_NAMES.email)?.toString()
  const password = formData.get(AUTH_INPUTS_NAMES.password)?.toString()
  const firstName = formData.get(AUTH_INPUTS_NAMES.name)?.toString()
  const lastname = formData.get(AUTH_INPUTS_NAMES.lastname)?.toString()

  if (!email || !password || !firstName) {
    return createErrorResponse({
      errorMessage: 'Fields: "email", "first-name", "password" are required',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastname: lastname ?? ''
      }
    }
  })

  if (error) {
    if (error.code === 'over_email_send_rate_limit') {
      return createErrorResponse({
        errorMessage: 'Límite de registros alcanzados',
        responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }

  return createSucessResponse({
    responseStatus: 200,
    data: { redirectTo: '/login' }
  })
}
