import { getParsedEventsDates } from './utils/get-parsed-events-dates'
import WrongInfoBreadcrumb from '@/components/wrong-info-breadcrumb'
import QueryClientProvider from '@/context/tanstack-react-query'
import { ChevronLeft, ChevronRight, PartyPopper } from 'lucide-react'
import {
  getLocaleDateString,
  removeLeadingZeroInMonth
} from '@/utils/formatter'
import { AnimatePresence, motion } from 'framer-motion'
import { TooltipProvider } from '@/components/tooltip'
import { useQuery } from '@tanstack/react-query'
import useCalendar from './hooks/use-calendar'
import { API_STATES } from '../api/_states'
import Calendar from 'react-calendar'
import type { Event } from '@/types'
import { useMemo } from 'react'
import './css/_calendar.css'
import { getRemanentDays } from '@/utils/general'
import { cn } from '@/utils/cn'

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

function RemainingDays({
  remanentDays,
  className
}: {
  remanentDays: number
  className?: string
}) {
  return (
    <p
      className={cn(
        'text-gray-500 text-sm italic flex gap-1 items-center w-full',
        className
      )}
    >
      <span>({remanentDays === 1 ? 'queda' : 'quedan'}</span>
      <span>{remanentDays}</span>
      <span className="flex gap-1 items-center">
        {remanentDays === 1 ? 'día' : 'días'}){' '}
        <PartyPopper size={18} className="text-yellow-500" />
      </span>
    </p>
  )
}

function Events({ distritoId }: { distritoId: number }) {
  const { isPending, data: response } = useQuery({
    queryKey: ['data'],
    queryFn: () =>
      fetch(`/api/eventos/${distritoId}`).then((response) => response.json())
  })

  const {
    currentDate,
    nextMonth,
    handleDateChange,
    tileClassName,
    renderTooltipForTile,
    controls
  } = useCalendar(new Date())

  const eventsDates = useMemo(() => {
    if (!response) {
      return null
    }

    const { data: events } = response.data
    return getParsedEventsDates(events)
  }, [response])

  if (isPending && !response) {
    return <p>Cargando...</p>
  }

  const { statusText, data: events } = (response?.data as {
    statusText: string
    data: Event[] | null
  }) || { statusText: '', data: null }

  if (statusText === API_STATES.error) {
    return null
  }

  if (!events) {
    return (
      <>
        <WrongInfoBreadcrumb>
          Si esta información es incorrecta.{' '}
        </WrongInfoBreadcrumb>
        <h4 className="font-bold text-xl">No hay eventos en esta región</h4>
      </>
    )
  }

  return (
    <>
      <h4 className="font-bold text-xl">Eventos</h4>
      <div className="flex flex-col gap-3">
        {events.map((event) => {
          const remanentDays = getRemanentDays({
            from: new Date(),
            to: new Date(removeLeadingZeroInMonth(event.start_date))
          })

          return (
            <div key={`event-${event.id}`} className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <h5 className="font-bold">{event.subject}</h5>
                <RemainingDays remanentDays={remanentDays} />
              </div>

              <div className="grid grid-cols-2">
                <div>
                  <p className="text-gray-500 text-sm">
                    {`Inicio: ${getLocaleDateString(event.start_date)}`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {event.end_date &&
                      `Final: ${getLocaleDateString(event.end_date)}`}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={controls.handlePrev}
          className="absolute top-6 p-2 left-2 hover:bg-gray-300 rounded-full transition-colors z-10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={controls.handleNext}
          className="absolute top-6 right-2 p-2 hover:bg-gray-300 rounded-full transition-colors z-10"
        >
          <ChevronRight size={18} />
        </button>
        <AnimatePresence initial={false} custom={controls.direction}>
          <motion.div
            key={currentDate.toISOString()}
            custom={controls.direction}
            variants={variants}
            initial="enter"
            animate="center"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="flex gap-10"
          >
            <TooltipProvider>
              <Calendar
                onChange={(newDate) => handleDateChange(newDate as Date)}
                value={currentDate}
                activeStartDate={currentDate}
                locale="es"
                nextLabel={null}
                prevLabel={null}
                next2Label={null}
                prev2Label={null}
                minDetail="month"
                maxDetail="month"
                tileClassName={({ date, view }) =>
                  tileClassName({ date, view, eventsDates })
                }
                tileContent={({ date, view }) =>
                  renderTooltipForTile({ date, view, eventsDates })
                }
                selectRange={false}
              />
              <Calendar
                onChange={(newDate) => handleDateChange(newDate as Date)}
                value={nextMonth}
                activeStartDate={nextMonth}
                locale="es"
                nextLabel={null}
                prevLabel={null}
                next2Label={null}
                prev2Label={null}
                minDetail="month"
                maxDetail="month"
                tileClassName={({ date, view }) =>
                  tileClassName({ date, view, eventsDates })
                }
                tileContent={({ date, view }) =>
                  renderTooltipForTile({ date, view, eventsDates })
                }
                selectRange={false}
              />
            </TooltipProvider>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export default function EventsContainer({
  distritoId
}: {
  distritoId: number
}) {
  return (
    <QueryClientProvider>
      <Events distritoId={distritoId} />
    </QueryClientProvider>
  )
}
