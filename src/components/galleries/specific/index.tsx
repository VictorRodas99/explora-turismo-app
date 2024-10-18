import { cn } from '@/utils/cn'
import type { getImagesFromResponse } from '@/utils/formatter'
import { Logs } from 'lucide-react'
import { useEffect, useState } from 'react'
import ImageTour from './image-tour'
import { AnimatePresence } from 'framer-motion'

export default function Gallery({
  images,
  retrieveError
}: {
  images: ReturnType<typeof getImagesFromResponse>
  retrieveError?: string
}) {
  const [isOpenImageTour, setisOpenImageTour] = useState(false)

  useEffect(() => {
    if (retrieveError === 'timeout') {
      console.warn(
        'El límite de requests que acepta cloudinary por hora ha sido alcanzado'
      )
    }
  }, [retrieveError])

  if (!images) {
    // mostrar un vector que represente que no hay imágenes
    return <h2>Sin imágenes</h2>
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies(isOpenImageTour): We only need to update is isOpenImageTour changes
  useEffect(() => {
    const classListMethod = isOpenImageTour
      ? ('add' as const)
      : ('remove' as const)

    document.body.classList[classListMethod]('overflow-hidden')
  }, [isOpenImageTour])

  useEffect(() => {
    const ESCAPE_KEY_NAME = 'Escape'

    window.addEventListener('keyup', (event) => {
      const { key } = event

      if (isOpenImageTour && key === ESCAPE_KEY_NAME) {
        setisOpenImageTour(false)
      }
    })
  }, [isOpenImageTour])

  return (
    <>
      <section className="relative grid grid-cols-4 gap-2 rounded-xl overflow-hidden">
        {images.slice(0, 5).map(({ assetId, url, name }, index) => (
          <button
            id={assetId}
            type="button"
            key={assetId}
            className={cn(
              'max-h-[180px] hover:brightness-75 transition-all focus:outline-none',
              {
                'col-span-2 row-span-2 max-h-max': index === 0
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
      <AnimatePresence>
        {isOpenImageTour && (
          <ImageTour
            images={images}
            closeCallback={() => setisOpenImageTour(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
