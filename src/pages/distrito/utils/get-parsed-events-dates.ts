import { getLocaleDateString, transformDateToNextYear } from '@/utils/formatter'
import type { Event } from '@/types'

export const getParsedEventsDates = (events: Event[] | null) => {
  const eventDatesMap = new Map<
    number,
    {
      dates: { start: Date; end: Date | null }
      toLocaleString: { start: string; end: string | null }
      subject: string
    }
  >()

  if (!events) {
    return eventDatesMap
  }

  for (const event of events) {
    const { id, start_date: start, end_date: end, subject } = event

    const parsedStartDate = transformDateToNextYear(start)
    const parsedEndDate = end ? transformDateToNextYear(end) : null

    const startDateToLocale = getLocaleDateString(parsedStartDate)
    const endDateToLocale = parsedEndDate
      ? getLocaleDateString(parsedEndDate)
      : null

    eventDatesMap.set(id, {
      dates: {
        start: parsedStartDate,
        end: parsedEndDate
      },
      toLocaleString: {
        start: startDateToLocale,
        end: endDateToLocale
      },
      subject
    })
  }

  return eventDatesMap
}
