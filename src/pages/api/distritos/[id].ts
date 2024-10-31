import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { supabase } from '@/lib/supabase'
import { StatusCodes } from 'http-status-codes'

export const GET: APIRoute = async ({ params }) => {
  const { id } = params

  if (!id) {
    return createErrorResponse({
      errorMessage: 'Missing id param to get district',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const parsedId = Number(id)

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    return createErrorResponse({
      errorMessage: 'Id param must be a positive number!',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const { data: distrito, error } = await supabase
    .from('distrito')
    .select('id, name, description, main_image, coords')
    .eq('id', parsedId)

  if (error) {
    console.error(error)

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }

  return createSucessResponse({
    responseStatus: StatusCodes.OK,
    data: distrito.length === 0 ? null : distrito
  })
}
