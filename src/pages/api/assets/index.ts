import type { APIRoute } from 'astro'
import {
  createErrorResponse,
  createSucessResponse
} from '../_utils/create-response'
import { StatusCodes } from 'http-status-codes'
import { getAssetsFromFolder } from '@/lib/cloudinary/assets'

export const POST: APIRoute = async ({ request }) => {
  const { folder } = await request.json()

  if (!folder) {
    return createErrorResponse({
      responseStatus: StatusCodes.BAD_REQUEST,
      errorMessage: 'folder name is required'
    })
  }

  const { error, assets } = await getAssetsFromFolder({ folder })

  if (error) {
    return createErrorResponse({
      responseStatus: StatusCodes.SERVICE_UNAVAILABLE,
      errorMessage: error
    })
  }

  return createSucessResponse({
    responseStatus: StatusCodes.OK,
    data: assets
  })
}
