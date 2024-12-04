import { interestPointCategories } from '@/constants'
import {
  getPoinstOfInterestById,
  getPointOfInterestByDistrict,
  getPointOfInterestContacts
} from '@/services/server/points-of-interest'
import { truncateText } from '@/utils/formatter'
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

  const [districtPoints, contacts] = await Promise.all([
    getPointOfInterestByDistrict({ ...Astro, params: { id: distritoId } }),
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

  const description = point.description ?? 'Sin descripción'
  const shortDescription = truncateText(description, { maxWords: 66 })

  return {
    distrito: {
      id: Number(distritoId),
      slugifiedName: slugifiedDistrictName
    },
    point,
    similarPoints,
    contacts,
    description,
    shortDescription
  }
}
