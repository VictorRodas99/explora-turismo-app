import type { RecentlyViewedItem } from '@/utils/local-storage'

const formatToLocaleDate = (date: Date): string => {
  return date.toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const isSameDay = (givenDate: Date, currentDate: Date) => {
  return (
    givenDate.getDate() === currentDate.getDate() &&
    givenDate.getMonth() === currentDate.getMonth() &&
    givenDate.getFullYear() === currentDate.getFullYear()
  )
}

const isYesterday = (date: Date, currentDate: Date) => {
  const yesterday = new Date(currentDate)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(date, yesterday)
}

export default function getOrderedPlacesByDate(
  places: RecentlyViewedItem[] | null
) {
  if (!places || places.length === 0) {
    return null
  }

  const orderedPlaces: Record<string, RecentlyViewedItem[]> = {}
  const currentDate = new Date()

  for (const place of places) {
    const { viewed_at: viewedDate } = place
    let dateKey: string

    if (isSameDay(viewedDate, currentDate)) {
      dateKey = 'Hoy'
    } else if (isYesterday(viewedDate, currentDate)) {
      dateKey = 'Ayer'
    } else {
      dateKey = formatToLocaleDate(viewedDate)
    }

    if (!orderedPlaces[dateKey]) {
      orderedPlaces[dateKey] = []
    }

    orderedPlaces[dateKey].push(place)
  }

  for (const dateKey in orderedPlaces) {
    orderedPlaces[dateKey].sort(
      (a, b) =>
        new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime()
    )
  }

  const sortedEntries = Object.entries(orderedPlaces).sort((a, b) => {
    if (a[0] === 'Hoy') return -1
    if (b[0] === 'Hoy') return 1
    if (a[0] === 'Ayer') return -1
    if (b[0] === 'Ayer') return 1

    const dateA =
      a[0] === 'Hoy'
        ? new Date()
        : a[0] === 'Ayer'
          ? new Date(currentDate.setDate(currentDate.getDate() - 1))
          : new Date(a[0])
    const dateB =
      b[0] === 'Hoy'
        ? new Date()
        : b[0] === 'Ayer'
          ? new Date(currentDate.setDate(currentDate.getDate() - 1))
          : new Date(b[0])

    return dateB.getTime() - dateA.getTime()
  })

  return Object.fromEntries(sortedEntries)
}
