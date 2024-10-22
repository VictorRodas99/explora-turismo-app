import { supabase } from '@/lib/supabase'
import {
  createErrorResponse,
  createSucessResponse
} from '@/pages/api/_utils/create-response'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  const { id } = params

  if (!id) {
    return createErrorResponse({
      errorMessage: 'Missing id param to get interest points',
      responseStatus: 403
    })
  }

  const parsedId = Number(id)

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    return createErrorResponse({
      errorMessage: 'Id param must be a positive number!',
      responseStatus: 403
    })
  }

  const { data: contacts, error } = await supabase
    .from('puntos_de_interes_contactos')
    .select('id, instagram_user, punto_de_interes_id, phone_number')
    .eq('punto_de_interes_id', id)

  if (error) {
    console.error(error)

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: 505
    })
  }

  if (contacts.length === 0) {
    return createSucessResponse({
      responseStatus: 404,
      data: null
    })
  }

  return createSucessResponse({
    responseStatus: 202,
    data: contacts.at(0)
  })
}
