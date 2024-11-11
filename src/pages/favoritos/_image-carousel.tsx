import { cn } from '@/utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ImageCarouselProps {
  images: Array<{ url: string }>
  href: string
  isMobileWidth: boolean
}

export default function ImageCarousel({
  images,
  href,
  isMobileWidth
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (!images.length) {
    return null
  }

  return (
    <div className="relative group w-full h-64">
      <button
        type="button"
        onClick={goToPrevious}
        className={cn(
          'absolute left-2 top-[50%] p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-20',
          { 'opacity-0 group-hover:opacity-100': !isMobileWidth }
        )}
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={goToNext}
        className={cn(
          'absolute right-2 top-[50%] p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-20',
          { 'opacity-0 group-hover:opacity-100': !isMobileWidth }
        )}
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <a href={href}>
        <div className="absolute inset-0 transition-opacity duration-500 rounded-lg overflow-hidden">
          <img
            src={images[currentIndex].url}
            alt={`Imagen ${currentIndex + 1} del lugar`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-hidden">
          {images.map(({ url }, index) => (
            <span
              key={url}
              className={`w-[6px] h-[6px] rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </a>
    </div>
  )
}
