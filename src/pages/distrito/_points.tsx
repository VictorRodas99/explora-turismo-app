import { useState, useRef, useEffect } from 'react'
import { getInterestPointUrl, truncateText } from '@/utils/formatter'
import type { FilteredPoints } from '@/utils/mappers'
import CompleteLogo from '@/images/complete-logo.png'
import type { InterestPointCategoryEnglish } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PointsProps {
  distrito: { id: number; name: string }
  filteredPoints: FilteredPoints
}

const getSubjectForPointsSection = (type: InterestPointCategoryEnglish) => {
  const subjectsFor: Record<InterestPointCategoryEnglish, string> = {
    lodging: 'Alojamientos, ¿Dónde vas a dormir?',
    tourist: 'Lugares turísticos',
    cinema: 'Cines y Entretenimiento',
    gastronomy: 'Comedores o Restaurantes',
    historical: 'Sitios históricos',
    other: 'Otros lugares interesantes'
  }

  return subjectsFor[type]
}

export function SpecificPoint({
  places,
  type,
  distrito,
  subject
}: {
  places: FilteredPoints[keyof FilteredPoints]
  type: InterestPointCategoryEnglish
  distrito: { id: number; name: string }
  subject?: string
}) {
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      setShowRightButton(container.scrollWidth > container.clientWidth)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current
    if (container) {
      const scrollAmount = container.clientWidth
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleScroll = () => {
    const container = containerRef.current
    if (container) {
      setShowLeftButton(container.scrollLeft > 0)
      setShowRightButton(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      )
    }
  }

  if (places.length === 0) {
    return null
  }

  return (
    <>
      <h2 className="font-bold text-xl">
        {subject ?? getSubjectForPointsSection(type)}
      </h2>
      <div className="relative">
        {showLeftButton && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <div
          ref={containerRef}
          className="flex gap-5 overflow-x-auto scrollbar-none"
          onScroll={handleScroll}
        >
          {places.map((point) => (
            <a
              href={getInterestPointUrl({ point, distrito: distrito })}
              key={`${point.name}-${point.id}`}
              className="flex flex-col gap-5 min-w-80 h-[250px] group"
            >
              <div className="group-hover:shadow-md w-[100%] h-[60%] rounded-lg overflow-hidden transition-shadow">
                <img
                  className="w-full h-full object-cover"
                  src={point.images?.at(0)?.url ?? CompleteLogo.src}
                  alt={point.name}
                />
              </div>
              <div className="flex flex-col gap-2 h-[40%]">
                <h5 className="font-bold">{point.name}</h5>
                <p className="text-sm text-gray-500">
                  {truncateText(point.description ?? '', {
                    maxWords: 7
                  })}
                </p>
              </div>
            </a>
          ))}
        </div>
        {showRightButton && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </>
  )
}

export default function Points({ distrito, filteredPoints }: PointsProps) {
  return Object.entries(filteredPoints).map(([type, points]) => (
    <SpecificPoint
      key={type}
      distrito={distrito}
      places={points}
      type={type as InterestPointCategoryEnglish}
    />
  ))
}
