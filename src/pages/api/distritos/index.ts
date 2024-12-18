import { getPagination } from '@/utils/pagination'
import { DEFAULT_API_LIMIT_FOR } from '../_states'
import { supabase } from '@/lib/supabase'
import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { StatusCodes } from 'http-status-codes'

export const GET: APIRoute = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) ?? 1

  const limitFromParam = Number(url.searchParams.get('limit'))
  const limit =
    Number.isNaN(limitFromParam) || limitFromParam <= 0
      ? DEFAULT_API_LIMIT_FOR.distritos
      : limitFromParam

  if (Number.isNaN(page)) {
    return createErrorResponse({
      errorMessage: 'Page param must be a valid number',
      responseStatus: StatusCodes.BAD_REQUEST
    })
  }

  const { from, to } = getPagination({ page, size: limit })

  const { data, error } = await supabase
    .from('distrito')
    .select('id, name, description, main_image, coords', { count: 'exact' })
    .order('id', { ascending: true })
    .range(from, to)

  if (error) {
    if (error.code === 'PGRST103') {
      return createSucessResponse({
        responseStatus: StatusCodes.OK,
        data: null
      })
    }

    console.error(error)

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: StatusCodes.INTERNAL_SERVER_ERROR
    })
  }

  return createSucessResponse({ responseStatus: StatusCodes.OK, data })
}
