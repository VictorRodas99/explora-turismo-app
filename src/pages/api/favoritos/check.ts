import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { supabase } from '@/lib/supabase'
import { getTableAttrBasedOn } from './_utils/general'
import { StatusCodes } from 'http-status-codes'

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return createErrorResponse({
        errorMessage: 'Operación no autorizada',
        responseStatus: StatusCodes.UNAUTHORIZED
      })
    }

    const {
      data: { user },
      error: userRetrieveError
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

    if (userRetrieveError || !user) {
      return createErrorResponse({
        errorMessage: 'Non valid user',
        responseStatus: StatusCodes.UNAUTHORIZED
      })
    }

    const json = await request.json()

    const { placeId, placeType } = json
    const { table, idAttr } = getTableAttrBasedOn({ type: placeType })

    const { data, error } = await supabase
      .from(table)
      .select('id')
      .match({
        [idAttr]: placeId,
        user_id: user.id
      })
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return createSucessResponse({
          responseStatus: StatusCodes.OK,
          data: { isFavorite: false }
        })
      }

      throw error
    }

    return createSucessResponse({
      responseStatus: StatusCodes.OK,
      data: { isFavorite: Boolean(data) }
    })
  } catch (error) {
    console.error(error)

    const errorMessage =
      error instanceof Error && 'message' in error
        ? error.message
        : 'Unkown server error'

    return createErrorResponse({
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage
    })
  }
}
