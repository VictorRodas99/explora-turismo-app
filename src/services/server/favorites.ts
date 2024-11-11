import { GET } from '@/pages/api/favoritos/index'
import type { APIContext } from 'astro'
import {
  apiResponseFavoritesSchema,
  type FavoritePlaces
} from '../validations/api-response-favorites.zod'
import type { API_STATES } from '@/pages/api/_states'

export async function getAllFavorites(context: APIContext) {
  const response = await GET(context)
  const jsonResponse = await response.json()

  const parsedResponse = apiResponseFavoritesSchema.safeParse(jsonResponse)

  if (!parsedResponse.success) {
    console.log(parsedResponse.error)

    throw new Error(
      `
      Error parsing the JSON response while fetching /api/favoritos/\n
      Received: ${JSON.stringify(jsonResponse, null, 2)}
      `
    )
  }

  const { data: vaildResponse } = parsedResponse.data

  if (!response.ok) {
    return {
      status: vaildResponse.statusText as typeof API_STATES.error,
      data: vaildResponse.data as string
    }
  }

  return {
    status: vaildResponse.statusText as typeof API_STATES.success,
    data: vaildResponse.data as FavoritePlaces
  }
}
