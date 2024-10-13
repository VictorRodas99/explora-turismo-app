import { interestPointCategories } from '@/constants'
import type {
  InterestPoint,
  InterestPointCategory,
  InterestPointCategoryEnglish
} from '@/types'

export const getInterestPointCategoryInEnglish = (
  typeInSpanish: InterestPointCategory
) => {
  if (!Object.values(interestPointCategories).includes(typeInSpanish)) {
    throw new Error(
      `Invalid type, expected ${Object.values(interestPointCategories)
        .map((category) => `"${category}"`)
        .join(', ')}, given: "${typeInSpanish}"`
    )
  }

  const keyIndex = Object.values(interestPointCategories).findIndex(
    (value) => value === typeInSpanish
  )

  return Object.keys(interestPointCategories)[
    keyIndex
  ] as InterestPointCategoryEnglish
}

export function getFilteredInterestPoints(points: InterestPoint[] | null) {
  const interestPointsCategoriesFiltered: Record<
    InterestPointCategoryEnglish,
    InterestPoint[]
  > = {
    lodging: [],
    tourist: [],
    historical: [],
    cinema: [],
    gastronomy: [],
    other: []
  }

  for (const point of points ?? []) {
    if (!Object.values(interestPointCategories).includes(point.tipo)) {
      console.log(point)
      continue
    }

    const type = getInterestPointCategoryInEnglish(point.tipo)

    interestPointsCategoriesFiltered[type].push(point)
  }

  return interestPointsCategoriesFiltered
}
