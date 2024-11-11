import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { StatusCodes } from 'http-status-codes'
import { supabase } from '@/lib/supabase'
import { getTableAttrBasedOn } from './_utils/general'
import { getSession } from '@/services/server/session'
import { DEFAULT_API_LIMIT_FOR } from '../_states'
import { getPagination } from '@/utils/pagination'

export const GET: APIRoute = async ({ cookies, url }) => {
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

  try {
    const { session, error } = await getSession({ cookies })

    if (!session || error) {
      return createErrorResponse({
        errorMessage: 'Operación no autorizada',
        responseStatus: StatusCodes.UNAUTHORIZED
      })
    }

    const {
      data: { user },
      error: userRetrieveError
    } = await supabase.auth.getUser(session.access_token)

    if (userRetrieveError || !user) {
      return createErrorResponse({
        errorMessage: 'Non valid user',
        responseStatus: StatusCodes.UNAUTHORIZED
      })
    }

    const { data: favoriteDistricts, error: retrieveFavoritesDistrictsError } =
      await supabase
        .from('distrito_favoritos')
        .select(
          `
        distrito_id,
        distrito (
          id,
          name,
          description,
          main_image,
          coords
        )
      `,
          { count: 'exact' }
        )
        .match({ user_id: user.id })
        .range(from, to)

    if (retrieveFavoritesDistrictsError) {
      throw retrieveFavoritesDistrictsError
    }

    const { data: favoritePoints, error: retrieveFavoritesPointsError } =
      await supabase
        .from('punto_interes_favoritos')
        .select(
          `
          punto_de_interes_id,
          puntos_de_interes (
            id,
            name,
            description,
            coords,
            distrito_id,
            distrito (
              name
            )
          )  
        `,
          { count: 'exact' }
        )
        .match({ user_id: user.id })
        .range(from, to)

    if (retrieveFavoritesPointsError) {
      throw retrieveFavoritesPointsError
    }

    const getMappedFavoritePoints = (favorites: typeof favoritePoints) => {
      const mappedFavorites = []

      for (const point of favorites) {
        const { punto_de_interes_id, puntos_de_interes: data } = point

        if (!data) {
          continue
        }

        const { distrito, ...relevantInfo } = data

        mappedFavorites.push({
          punto_de_interes_id,
          puntos_de_interes: {
            ...relevantInfo,
            distrito_name: distrito?.name ?? null
          }
        })
      }

      return mappedFavorites.length > 0 ? mappedFavorites : null
    }

    return createSucessResponse({
      responseStatus: StatusCodes.OK,
      data: {
        favoriteDistricts: favoriteDistricts ?? null,
        favoritePoints: getMappedFavoritePoints(favoritePoints)
      }
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
