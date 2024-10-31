import {
  createSucessResponse,
  createErrorResponse
} from '@/pages/api/_utils/create-response'
import { supabase } from '@/lib/supabase'
import type { APIRoute } from 'astro'
import { StatusCodes } from 'http-status-codes'

export const GET: APIRoute = async ({ params }) => {
  const { id } = params

  if (!id) {
    return createErrorResponse({
      errorMessage: 'Missing id param to get interest points',
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

  const { data: pointsOfInterest, error } = await supabase
    .from('puntos_de_interes')
    .select('id, name, description, address_reference, coords, tipo')
    .eq('distrito_id', parsedId)

  if (error) {
    console.error(error)

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }

  if (pointsOfInterest.length === 0) {
    return createSucessResponse({
      responseStatus: StatusCodes.NOT_FOUND,
      data: null
    })
  }

  return createSucessResponse({
    responseStatus: StatusCodes.OK,
    data: pointsOfInterest
  })
}
