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
    <div className="absolute bg-black text-white top-0 left-0 w-screen h-screen flex flex-col gap-5 p-16 overflow-hidden">
      <header className="grid grid-cols-3">
        <div>
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
        </div>

        <div className="text-center text-sm">{`${currentImageIndex + 1} / ${images.length}`}</div>
        <div>{/* <ShareDialog distrito={{ name: '' }} /> */}</div>
      </header>
      <div className="grid place-items-center h-full">
        <div className="grid grid-cols-3 w-full items-center">
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="p-2 rounded-full border-2 border-gray-500 hover:bg-gray-400"
              onClick={goToPrevious}
            >
              <ChevronLeft />
            </button>
          </div>

          <div className="flex justify-center items-center h-full">
            <img
              src={currentImage.url}
              alt={currentImage.displayName}
              className="max-w-full max-h-[calc(100vh-200px)] object-contain"
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="p-2 rounded-full border-2 border-gray-500 hover:bg-gray-400"
              onClick={goToNext}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
