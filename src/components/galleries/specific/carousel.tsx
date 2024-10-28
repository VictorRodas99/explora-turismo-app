import type { getImagesFromResponse } from '@/utils/formatter'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useMemo, useState } from 'react'

interface CarouselProps {
  currentImageId: string | null
  images: NonNullable<ReturnType<typeof getImagesFromResponse>>
  closeCarousel: () => void
}

export default function Carousel({
  currentImageId,
  images,
  closeCarousel
}: CarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(
    images.findIndex((image) => image.assetId === currentImageId)
  )

  const currentImage = useMemo(
    () => (currentImageIndex === -1 ? undefined : images.at(currentImageIndex)),
    [currentImageIndex, images]
  )

  const currentImageIndicator = useMemo(
    () => `${currentImageIndex + 1} / ${images.length}`,
    [currentImageIndex, images.length]
  )

  if (!currentImage) {
    throw new Error(
      `Given id ${currentImageId} does not exists in available images`
    )
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    )
  }

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    )
  }

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col h-[100dvh] overflow-hidden z-50">
      <header className="flex justify-between items-center p-4 md:px-16 md:py-8">
        <button
          type="button"
          className="hover:bg-[#4a4a4a] rounded-md p-2 transition-colors text-sm select-none"
          onClick={closeCarousel}
        >
          <span className="flex gap-2 items-center">
            <X size={18} />
            Cerrar
          </span>
        </button>

        <div className="hidden md:block text-center text-sm">
          {currentImageIndicator}
        </div>
        <div className="w-[72px]">
          {/* <ShareDialog distrito={{ name: '' }} /> */}
        </div>
      </header>

      <div className="flex-1 relative flex items-center justify-center min-h-0">
        <div className="absolute inset-x-0 flex justify-between px-4 md:px-8 z-10">
          <button
            type="button"
            className="p-2 rounded-full border-2 border-gray-500 hover:bg-gray-400 bg-black/50"
            onClick={goToPrevious}
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            className="p-2 rounded-full border-2 border-gray-500 hover:bg-gray-400 bg-black/50"
            onClick={goToNext}
          >
            <ChevronRight />
          </button>
        </div>

        <div className="w-full h-full flex flex-col items-center">
          <div className="md:hidden text-center text-sm py-2">
            {currentImageIndicator}
          </div>
          <div className="relative flex-1 w-full min-h-0 flex items-center justify-center px-4">
            <img
              src={currentImage.url}
              alt={currentImage.displayName}
              className="max-h-full max-w-full md:max-h-[calc(100vh-200px)] w-auto h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
