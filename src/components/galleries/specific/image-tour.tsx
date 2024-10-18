import type { getImagesFromResponse } from '@/utils/formatter'
import { ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Carousel from '@/components/galleries/specific/carousel'

interface ImageTourProps {
  images: NonNullable<ReturnType<typeof getImagesFromResponse>>
  closeCallback: () => void
}

export default function ImageTour({ images, closeCallback }: ImageTourProps) {
  const [carouselState, setCarouselState] = useState<{
    isOpen: boolean
    currentImageId: string | null
  }>({
    isOpen: false,
    currentImageId: null
  })

  const handleImageClick = ({
    isOpen,
    currentImageId
  }: {
    isOpen: boolean
    currentImageId: string
  }) => {
    if (typeof isOpen !== 'boolean') {
      throw new Error('Param isOpen must be of type boolean')
    }

    // if (isOpen) {
    //   setisOpenImageTour(false)
    // }

    setCarouselState({
      isOpen,
      currentImageId
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed top-0 left-0 w-screen h-screen bg-soft-white z-50 overflow-y-auto overflow-x-hidden"
    >
      <header className="p-5">
        <button type="button" onClick={closeCallback}>
          <ChevronLeft />
        </button>
      </header>
      <section className="flex flex-col gap-5 px-28 pb-10">
        <h2 className="font-bold text-xl">Recorrido fotográfico</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {images.map((image) => (
            <button
              type="button"
              key={image.assetId}
              className="shadow-md w-40 h-32 hover:brightness-50 transition-all"
              onClick={() =>
                handleImageClick({
                  isOpen: true,
                  currentImageId: image.assetId
                })
              }
            >
              <img
                src={image.url}
                alt={image.displayName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>
      {carouselState.isOpen && (
        <Carousel
          currentImageId={carouselState.currentImageId}
          images={images}
          closeCarousel={() =>
            setCarouselState({ isOpen: false, currentImageId: null })
          }
        />
      )}
    </motion.div>
  )
}
