import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ params }) => {
  const { id } = params

  if (!id) {
    return createErrorResponse({
      errorMessage: 'Missing id param to get interest points',
      responseStatus: 403
    })
  }

  const pointInterestId = Number(id)

  if (Number.isNaN(pointInterestId) || pointInterestId <= 0) {
    return createErrorResponse({
      errorMessage: 'Id param must be a positive number!',
      responseStatus: 403
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
      responseStatus: 505
    })
  }

  return createSucessResponse({
    responseStatus: 202,
    data: pointInterest.length === 0 ? null : pointInterest
  })
}
