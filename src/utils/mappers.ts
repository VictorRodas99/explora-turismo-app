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

interface Coordinate {
  latitude: number
  longitude: number
}

export function calculateAverageCoordinate(
  coordinates: Coordinate[]
): Coordinate {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate average of empty coordinates array')
  }

  const cartesian = coordinates.map((coord) => {
    // convert to radians
    const lat = (coord.latitude * Math.PI) / 180
    const lng = (coord.longitude * Math.PI) / 180

    // convert to cartesian coordinates
    return {
      x: Math.cos(lat) * Math.cos(lng),
      y: Math.cos(lat) * Math.sin(lng),
      z: Math.sin(lat)
    }
  })

  // calculate average
  const sum = cartesian.reduce((acc, curr) => ({
    x: acc.x + curr.x,
    y: acc.y + curr.y,
    z: acc.z + curr.z
  }))

  const avg = {
    x: sum.x / coordinates.length,
    y: sum.y / coordinates.length,
    z: sum.z / coordinates.length
  }

  const longitude = Math.atan2(avg.y, avg.x)
  const hypotenuse = Math.sqrt(avg.x * avg.x + avg.y * avg.y)
  const latitude = Math.atan2(avg.z, hypotenuse)

  // convert to degrees
  return {
    latitude: (latitude * 180) / Math.PI,
    longitude: (longitude * 180) / Math.PI
  }
}
