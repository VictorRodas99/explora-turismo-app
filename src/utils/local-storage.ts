import { RECENTLY_VIEWED_KEY_NAME } from '@/constants'
import { distritoSchema, puntoInteresSchema } from '@/lib/database.zod'
import type { Distrito, InterestPoint, Place } from '@/types'

export type RecentlyViewedItem = Place & {
  viewed_at: Date
}
type ParsedRecentlyViewedItem = Place & {
  viewed_at: string
}

export const getSavedPlacesLocally = (): Array<RecentlyViewedItem> | null => {
  try {
    const parsedPlaces = JSON.parse(
      localStorage.getItem(RECENTLY_VIEWED_KEY_NAME) ?? 'null'
    )

    if (!parsedPlaces) {
      return null
    }

    const currentDate = new Date()
    const fiveMonthsAgo = new Date()
    fiveMonthsAgo.setMonth(currentDate.getMonth() - 5)

    const places = (parsedPlaces as ParsedRecentlyViewedItem[])
      .map((place) => ({
        ...place,
        viewed_at: new Date(place.viewed_at)
      }))
      .filter((place) => place.viewed_at > fiveMonthsAgo)

    localStorage.setItem(RECENTLY_VIEWED_KEY_NAME, JSON.stringify(places))

    return places as RecentlyViewedItem[]
  } catch (error) {
    console.error(error)
    return null
  }
}

export function savePlaceLocally(value: Place) {
  const save = (
    value: Distrito | InterestPoint,
    type: Place['type'],
    saved: Array<RecentlyViewedItem> | null
  ) => {
    if (type !== 'distrito' && type !== 'punto') {
      throw new Error('Must have a valid place type')
    }

    if (!saved) {
      return localStorage.setItem(
        RECENTLY_VIEWED_KEY_NAME,
        JSON.stringify([{ ...value, type, viewed_at: new Date() }])
      )
    }

    if (saved.some((place) => place.id === value.id)) {
      return
    }

    return localStorage.setItem(
      RECENTLY_VIEWED_KEY_NAME,
      JSON.stringify([{ ...value, type, viewed_at: new Date() }, ...saved])
    )
  }

  const savedPlacesUnparsed = localStorage.getItem(RECENTLY_VIEWED_KEY_NAME)
  const districtValidation = distritoSchema.safeParse(value)

  if (!districtValidation.success || 'address_reference' in value) {
    const pointValidation = puntoInteresSchema.safeParse(value)

    if (!pointValidation.success) {
      throw new Error(
        `
        Error parsing the JSON
        Received: ${JSON.stringify(value, null, 2)}
        `
      )
    }

    return save(value, 'punto', JSON.parse(savedPlacesUnparsed ?? 'null'))
  }

  save(value, 'distrito', JSON.parse(savedPlacesUnparsed ?? 'null'))
}

export const clearSavedPlacesLocally = () => {
  localStorage.removeItem(RECENTLY_VIEWED_KEY_NAME)
}
