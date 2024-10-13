import Calendar from 'react-calendar'
import './css/calendar.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

export default function Events() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const nextMonth = useMemo(() => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + 1)

    return newDate
  }, [currentDate])

  const [direction, setDirection] = useState(0)

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

  return (
    <>
      <h4 className="font-bold text-xl">Eventos</h4>
      <div className="relative">
        <button
          type="button"
          onClick={handlePrevClick}
          className="absolute top-6 p-2 left-2 hover:bg-gray-300 rounded-full transition-colors z-10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={handleNextClick}
          className="absolute top-6 right-2 p-2 hover:bg-gray-300 rounded-full transition-colors z-10"
        >
          <ChevronRight size={18} />
        </button>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentDate.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="flex gap-10"
          >
            <Calendar
              onChange={(newDate) => handleDateChange(newDate as Date)}
              value={currentDate}
              locale="es"
              nextLabel={null}
              prevLabel={null}
              next2Label={null}
              prev2Label={null}
              minDetail="month"
              maxDetail="month"
            />
            <Calendar
              onChange={(newDate) => handleDateChange(newDate as Date)}
              value={nextMonth}
              locale="es"
              nextLabel={null}
              prevLabel={null}
              next2Label={null}
              prev2Label={null}
              minDetail="month"
              maxDetail="month"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
