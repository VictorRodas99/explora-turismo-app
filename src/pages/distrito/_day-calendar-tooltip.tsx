import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip'
import type { getParsedEventsDates } from './utils/get-parsed-events-dates'

function DayCalendarTooltip({ eventNames }: { eventNames: string[] }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full -translate-y-5 opacity-0" />
      </TooltipTrigger>
      <TooltipContent className="bg-white -translate-y-2">
        <p className="text-black font-normal">{eventNames.join(', ')}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function renderTooltipForTile({
  date,
  view,
  eventsDates
}: {
  date: Date
  view: string
  eventsDates: ReturnType<typeof getParsedEventsDates> | null
}) {
  if (view !== 'month' || !eventsDates) {
    return null
  }

  const eventNames = []

  for (const { dates, subject } of eventsDates.values()) {
    const isInRange = dates.end
      ? date >= dates.start && date <= dates.end
      : date.toDateString() === dates.start.toDateString()

    if (isInRange) {
      eventNames.push(subject)
    }
  }

  if (eventNames.length > 0) {
    return <DayCalendarTooltip eventNames={eventNames} />
  }
}
