import { cn } from '@/utils/cn'
import type { getImagesFromResponse } from '@/utils/formatter'
import { Logs } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import ImageTour from './image-tour'
import { AnimatePresence, motion } from 'framer-motion'

export default function Gallery({
  images,
  retrieveError
}: {
  images: ReturnType<typeof getImagesFromResponse>
  retrieveError?: string
}) {
  const [isOpenImageTour, setisOpenImageTour] = useState(false)
  const [isMobileWidth, setIsMobileWidth] = useState(window.innerWidth < 768)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const [initialTouchPoint, setInitialTouchPoint] = useState(0)
  const [endTouchPoint, setEndTouchPoint] = useState(0)
  const [lastSwipeTime, setLastSwipeTime] = useState(0)
  const SWIPE_COOLDOWN = 300

  useEffect(() => {
    if (retrieveError === 'timeout') {
      console.warn(
        'El límite de requests que acepta cloudinary por hora ha sido alcanzado'
      )
    }
  }, [retrieveError])

  useEffect(() => {
    const checkIfIsMobileWidth = () => {
      setIsMobileWidth(window.innerWidth < 768)
    }

    window.addEventListener('resize', checkIfIsMobileWidth)

    return () => {
      window.removeEventListener('resize', checkIfIsMobileWidth)
    }
  }, [])

  useEffect(() => {
    const classListMethod = isOpenImageTour
      ? ('add' as const)
      : ('remove' as const)

    document.body.classList[classListMethod]('overflow-hidden')
  }, [isOpenImageTour])

  useEffect(() => {
    const ESCAPE_KEY_NAME = 'Escape'

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isOpenImageTour && event.key === ESCAPE_KEY_NAME) {
        setisOpenImageTour(false)
      }
    }

    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isOpenImageTour])

  if (!images || images.length === 0) {
    return <h2>Sin imágenes</h2>
  }

  const handleSwipe = () => {
    const currentTime = Date.now()
    if (currentTime - lastSwipeTime < SWIPE_COOLDOWN) {
      return
    }

    const difference = initialTouchPoint - endTouchPoint

    if (Math.abs(difference) > 70) {
      if (difference > 0) {
        setCurrentImageIndex((prev) =>
          prev < images.length - 1 ? prev + 1 : 0
        )
      } else {
        setCurrentImageIndex((prev) =>
          prev > 0 ? prev - 1 : images.length - 1
        )
      }
      setLastSwipeTime(currentTime)
    }
  }
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return

    const initialTouchPoint = event.touches[0].pageX
    setInitialTouchPoint(initialTouchPoint)

    handleSwipe()
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const endTouchPoint = event.changedTouches[0].pageX
    setEndTouchPoint(endTouchPoint)

    handleSwipe()
  }

  return (
    <>
      {isMobileWidth ? (
        <motion.div
          ref={sliderRef}
          className="relative w-full h-[180px] overflow-hidden rounded-xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <span className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full w-fit px-2 py-1 text-white text-xs z-10">
            {`${currentImageIndex + 1} / ${images.length}`}
          </span>
          <motion.div
            animate={{ x: `-${currentImageIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex h-full"
          >
            {images.map(({ assetId, url, name }) => (
              <div key={assetId} className="w-full h-full flex-shrink-0">
                <img
                  src={url}
                  alt={`imagen ${name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      ) : (
        <section
          className={cn(
            'relative grid grid-cols-4 gap-2 rounded-xl overflow-hidden max-h-[360px]',
            { [`grid-cols-${images.length}`]: images.length < 5 }
          )}
        >
          {images.slice(0, 5).map(({ assetId, url, name }, index) => (
            <button
              id={assetId}
              type="button"
              key={assetId}
              className={cn(
                'max-h-[180px] hover:brightness-75 transition-all focus:outline-none',
                {
                  'col-span-2 row-span-2 max-h-[360px]':
                    index === 0 && images.length > 3
                }
              )}
              onClick={() => setisOpenImageTour(true)}
            >
              <img
                src={url}
                alt={`imagen ${name}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setisOpenImageTour(true)}
            className="absolute flex gap-2 items-center right-5 bottom-5 bg-primary text-white text-sm px-3 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors"
          >
            <Logs size={18} />
          </button>
        </section>
      )}
      <AnimatePresence>
        {isOpenImageTour && !isMobileWidth ? (
          <ImageTour
            images={images}
            closeCallback={() => setisOpenImageTour(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
