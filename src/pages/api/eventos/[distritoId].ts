import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { supabase } from '@/lib/supabase'
import { StatusCodes } from 'http-status-codes'

export const GET: APIRoute = async ({ params }) => {
  const { distritoId } = params

  if (!distritoId) {
    return createErrorResponse({
      errorMessage: "Missing id param to get district's events",
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const parsedId = Number(distritoId)

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    return createErrorResponse({
      errorMessage: 'Id param must be a positive number!',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const { data: events, error } = await supabase
    .from('eventos')
    .select('id, subject, description, start_date, end_date')
    .eq('distrito_id', parsedId)

  if (error) {
    console.error(error)

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }

  return createSucessResponse({
    responseStatus: StatusCodes.OK,
    data: events.length === 0 ? null : events
  })
}
