import { interestPointCategories } from '@/constants'
import { getAssetsFromFolder } from '@/lib/cloudinary/assets'
import {
  getPoinstOfInterestById,
  getPointOfInterestByDistrict,
  getPointOfInterestContacts
} from '@/services/server/points-of-interest'
import { getImagesFromResponse, slugify, truncateText } from '@/utils/formatter'
import { getInterestPointCategoryInEnglish } from '@/utils/mappers'
import type { APIContext } from 'astro'

export async function usePointData(Astro: APIContext) {
  const { nombreDistrito: slugifiedDistrictName } = Astro.params
  const distritoId = Astro.url.searchParams.get('distrito_id')

  if (!distritoId) {
    console.error('distrito_id param is required')
    return null
  }

  const points = await getPoinstOfInterestById(Astro)

  if (!points?.length) {
    return null
  }

  const point = points[0]

  const [districtPoints, { assets, error }, contacts] = await Promise.all([
    getPointOfInterestByDistrict({ ...Astro, params: { id: distritoId } }),
    getAssetsFromFolder({
      folder: slugifiedDistrictName ?? '',
      fileNamePattern: slugify(point.name)
    }),
    getPointOfInterestContacts(Astro)
  ])

  const similarPoints =
    districtPoints?.filter(
      (matches) =>
        matches.tipo ===
          interestPointCategories[
            getInterestPointCategoryInEnglish(point.tipo)
          ] && matches.id !== point.id
    ) ?? null

  const images = getImagesFromResponse(assets)
  const description = point.description ?? 'Sin descripción'
  const shortDescription = truncateText(description, { maxWords: 66 })

  return {
    distritoId: Number(distritoId),
    point,
    similarPoints,
    images,
    error,
    contacts,
    description,
    shortDescription
  }
}
