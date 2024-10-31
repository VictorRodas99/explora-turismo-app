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
      errorMessage: 'Missing id param to get interest points',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const pointInterestId = Number(id)

  if (Number.isNaN(pointInterestId) || pointInterestId <= 0) {
    return createErrorResponse({
      errorMessage: 'Id param must be a positive number!',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const { data: pointInterest, error } = await supabase
    .from('puntos_de_interes')
    .select(
      'id, name, description, address_reference, coords, tipo, distrito_id'
    )
    .eq('id', pointInterestId)

  if (error) {
    console.error(error)

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }

  return createSucessResponse({
    responseStatus: StatusCodes.OK,
    data: pointInterest.length === 0 ? null : pointInterest
  })
}
