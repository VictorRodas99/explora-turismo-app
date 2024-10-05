import type { APIRoute } from 'astro'
import { supabase } from '../../../lib/supabase'
import { getPagination } from '../../../utils/pagination'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'

export const GET: APIRoute = async ({ url }) => {
  const page = Number(url.searchParams.get('page')) ?? 1
  const limit = Number(url.searchParams.get('limit')) ?? 6

  if (Number.isNaN(page)) {
    return createErrorResponse({
      errorMessage: 'Page param must be a valid number',
      responseStatus: 403
    })
  }

  const { from, to } = getPagination({ page, size: limit })

  const { data, error } = await supabase
    .from('distrito')
    .select('id, name, description, main_image', { count: 'exact' })
    .order('id', { ascending: true })
    .range(from, to)

  if (error) {
    if (error.code === 'PGRST103') {
      return createSucessResponse({ responseStatus: 200, data: null })
    }

    console.error(error)

    return createErrorResponse({
      errorMessage: error.message,
      responseStatus: 505
    })
  }

  return createSucessResponse({ responseStatus: 200, data })
}
