import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { supabase } from '@/lib/supabase'
import type { InterestPointCategory } from '@/types'

export interface SearchResult {
  type: 'distrito' | 'punto_de_interes'
  id: number
  name: string
  interestPointType?: InterestPointCategory
  description: string | null
  distrito_id?: number
  distrito_name?: string
}

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get('Content-Type') !== 'application/json') {
    return createErrorResponse({
      errorMessage: 'Body should be in json format',
      responseStatus: 403
    })
  }

  try {
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return createErrorResponse({
        errorMessage: 'Query parameter is required and must be a string',
        responseStatus: 400
      })
    }

    const { data: distritos, error: distritosError } = await supabase
      .from('distrito')
      .select(
        `
        id,
        name,
        description
      `
      )
      .textSearch('name', query)

    const { data: points, error: pointsError } = await supabase
      .from('puntos_de_interes')
      .select(
        `
        id,
        name,
        description,
        tipo,
        distrito_id,
        distrito:distrito_id (
          name
        )
      `
      )
      .textSearch('name', query)

    if (distritosError || pointsError) {
      return createErrorResponse({
        responseStatus: 505,
        errorMessage: String(distritosError?.message || pointsError?.message)
      })
    }

    const mappedDistritos = !distritos
      ? []
      : distritos.map((distrito) => ({
          type: 'distrito' as const,
          id: distrito.id,
          name: distrito.name,
          description: distrito.description
        }))

    const mappedPoints = !points
      ? []
      : points.map((point) => ({
          type: 'punto_de_interes' as const,
          id: point.id,
          name: point.name,
          description: point.description,
          distrito_id: point.distrito_id,
          interestPointType: point.tipo as InterestPointCategory,
          //@ts-ignore
          distrito_name: point.distrito?.name
        }))

    const formattedResults: SearchResult[] = [
      ...mappedDistritos,
      ...mappedPoints
    ]

    return createSucessResponse({
      responseStatus: 200,
      data: formattedResults
    })
  } catch (error) {
    return createErrorResponse({
      responseStatus: 500,
      errorMessage:
        error instanceof Error ? error.message : 'An unknown error occurred'
    })
  }
}
