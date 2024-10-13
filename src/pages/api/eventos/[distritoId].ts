import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { supabase } from '@/lib/supabase'

export const GET: APIRoute = async ({ params }) => {
  const { distritoId } = params

  if (!distritoId) {
    return createErrorResponse({
      errorMessage: "Missing id param to get district's events",
      responseStatus: 403
    })
  }

  const parsedId = Number(distritoId)

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    return createErrorResponse({
      errorMessage: 'Id param must be a positive number!',
      responseStatus: 403
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
      responseStatus: 505
    })
  }

  return createSucessResponse({
    responseStatus: 202,
    data: events.length === 0 ? null : events
  })
}
