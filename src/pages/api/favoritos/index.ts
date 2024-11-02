import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { StatusCodes } from 'http-status-codes'
import { supabase } from '@/lib/supabase'
import { getTableAttrBasedOn } from './_utils/general'

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

    const { placeId, placeType } = await request.json()
    const { table, idAttr } = getTableAttrBasedOn({ type: placeType })

    const { error } = await supabase
      .from(table)
      .insert({ [idAttr]: placeId, user_id: user.id })
      .select()
      .single()

    if (error) {
      console.error(error)

      // error code uniqueness violation
      if (error.code !== '23505') {
        throw error
      }

      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .match({
          [idAttr]: placeId,
          user_id: user.id
        })
        .select()
        .single()

      if (deleteError) {
        throw deleteError
      }
    }

    return createSucessResponse({
      responseStatus: StatusCodes.OK,
      data: { message: error ? 'deleted' : 'saved' }
    })
  } catch (error) {
    console.error(error)

    return createErrorResponse({
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage:
        error instanceof Error && 'message' in error
          ? String(error.message)
          : 'Unkown server error'
    })
  }
}
