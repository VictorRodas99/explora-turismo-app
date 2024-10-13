import type { getParsedEventsDates } from '../utils/get-parsed-events-dates'
import renderTooltipForTile from '../_day-calendar-tooltip'
import { useMemo, useState } from 'react'

export default function useCalendar(now: Date) {
  const [currentDate, setCurrentDate] = useState(now)
  const [direction, setDirection] = useState(0)

  const nextMonth = useMemo(() => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + 1)

    return newDate
  }, [currentDate])

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate)
  }

  const handlePrevClick = () => {
    setDirection(-1)

    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const handleNextClick = () => {
    setDirection(1)

    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const tileClassName = ({
    date,
    view,
    eventsDates
  }: {
    date: Date
    view: string
    eventsDates: ReturnType<typeof getParsedEventsDates> | null
  }) => {
    if (view === 'month' && eventsDates) {
      const classes = []

      for (const { dates } of eventsDates.values()) {
        const isStart = date.toDateString() === dates.start.toDateString()
        const isEnd =
          dates.end && date.toDateString() === dates.end.toDateString()
        const isInRange = dates.end && date >= dates.start && date <= dates.end

        if (isStart || isEnd) classes.push('range-edge')
        if (isInRange) classes.push('in-range')
        if (!dates.end && isStart) classes.push('single-date')
      }

      return classes.join(' ')
    }
    return null
  }

  return {
    currentDate,
    nextMonth,
    handleDateChange,
    tileClassName,
    renderTooltipForTile,
    controls: {
      direction,
      handleNext: handleNextClick,
      handlePrev: handlePrevClick
    }
  }
}
