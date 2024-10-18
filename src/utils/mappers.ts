import { interestPointCategories } from '@/constants'
import getInterestPointsImages from '@/services/client/points-of-interest-images'
import type {
  InterestPoint,
  InterestPointCategory,
  InterestPointCategoryEnglish,
  InterestPointImage
} from '@/types'

export type FilteredPoints = Awaited<
  ReturnType<typeof getFilteredInterestPoints>
>

const categoryReverseMap = Object.fromEntries(
  Object.entries(interestPointCategories).map(([key, value]) => [value, key])
)

export const getInterestPointCategoryInEnglish = (
  typeInSpanish: InterestPointCategory
): InterestPointCategoryEnglish => {
  const englishCategory = categoryReverseMap[typeInSpanish]

  if (!englishCategory) {
    throw new Error(
      `Invalid type, expected ${Object.values(interestPointCategories)
        .map((category) => `"${category}"`)
        .join(', ')}, given: "${typeInSpanish}"`
    )
  }

  return englishCategory as InterestPointCategoryEnglish
}

export async function getFilteredInterestPoints(
  points: InterestPoint[] | null
) {
  const interestPointsCategoriesFiltered: Record<
    InterestPointCategoryEnglish,
    Array<InterestPoint & { images: InterestPointImage[] | null }>
  > = {
    lodging: [],
    tourist: [],
    historical: [],
    cinema: [],
    gastronomy: [],
    other: []
  }

  if (!points) return interestPointsCategoriesFiltered

  const imagePromises = points.map((point) =>
    getInterestPointsImages({ interestPointId: point.id })
  )
  const allImages = await Promise.all(imagePromises)

  points.forEach((point, index) => {
    if (!Object.values(interestPointCategories).includes(point.tipo)) {
      console.log(point)
      return
    }

    const type = getInterestPointCategoryInEnglish(point.tipo)
    interestPointsCategoriesFiltered[type].push({
      ...point,
      images: allImages[index]
    })
  })

  return interestPointsCategoriesFiltered
}
