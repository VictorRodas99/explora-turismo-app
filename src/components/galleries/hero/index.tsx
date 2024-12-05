import { useCallback, useEffect, useMemo, useState } from 'react'
import { getImagesFromResponse } from '@/utils/formatter'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import deepClone from '@/utils/deep-clone'
import getAssetsFrom from '@/services/client/get-assets'
import QueryClientProvider from '@/context/tanstack-react-query'
import { useQuery } from '@tanstack/react-query'

const IMAGE_GALLERY_ID_PREFIX = 'image-gallery'

const containerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.1
    }
  },
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const imageVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.5
    }
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3
    }
  }
}

const skeletonVariants = {
  initial: {
    opacity: 0,
    width: 0,
    transition: {
      duration: 0.5
    }
  },
  animate: {
    opacity: 1,
    width: '100%',
    transition: {
      duration: 0.5
    }
  },
  exit: {
    opacity: 0,
    width: 0,
    transition: {
      duration: 0.3
    }
  }
}

export default function GalleryContainer() {
  return (
    <QueryClientProvider>
      <Gallery />
    </QueryClientProvider>
  )
}

function Gallery() {
  const {
    isPending,
    error: apiResponseError,
    data: response
  } = useQuery({
    queryKey: ['hero-images'],
    queryFn: () => getAssetsFrom({ folder: 'galeria' })
  })

  const [displayImages, setDisplayImages] = useState<
    NonNullable<ReturnType<typeof getImagesFromResponse>>
  >([])

  const [loadedImagesIndexes, setLoadedImagesIndexes] = useState<Set<number>>(
    new Set()
  )
  const galleryAnimationControl = useAnimationControls()

  const handleImageLoad = useCallback((imageIndex: number) => {
    setLoadedImagesIndexes((prev) => new Set(prev).add(imageIndex))
  }, [])

  const retrieveError = useMemo(() => {
    if (response?.error) {
      return response.error
    }

    if (apiResponseError) {
      return apiResponseError.message
    }

    return null
  }, [response?.error, apiResponseError])

  useEffect(() => {
    if (response?.assets) {
      setDisplayImages(
        getImagesFromResponse(response.assets)?.slice(0, 9) ?? []
      )
    }
  }, [response?.assets])

  useEffect(() => {
    if (retrieveError === 'timeout') {
      console.warn(
        'El límite de requests que acepta cloudinary por hora ha sido alcanzado'
      )
    }
  }, [retrieveError])

  useEffect(() => {
    const matchElements = document.querySelectorAll(
      `[id^='${IMAGE_GALLERY_ID_PREFIX}-']`
    )
    const gallery = Array.from(matchElements).filter(
      (element) => element instanceof HTMLImageElement
    )

    if (gallery.length === 0) {
      return
    }

    for (const imageElement of gallery) {
      const { id } = imageElement
      const matchIndexPattern = id.match(/\d+$/)
      const index = matchIndexPattern ? Number(matchIndexPattern[0]) : null

      if (index === null) {
        continue
      }

      const image = displayImages.at(index)

      if (!image) {
        continue
      }

      const { url: src } = image

      imageElement.onload = () => handleImageLoad(index)
      imageElement.src = `${src}?auto=format&fit=crop&w=800&q=80`
    }
  }, [displayImages, handleImageLoad])

  useEffect(() => {
    if (displayImages.length === 0) {
      return
    }

    const newImagesArray = deepClone(displayImages)

    const randomizeImages = async () => {
      await galleryAnimationControl.start('exit')

      let currentIndex = newImagesArray.length
      while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        ;[newImagesArray[currentIndex], newImagesArray[randomIndex]] = [
          newImagesArray[randomIndex],
          newImagesArray[currentIndex]
        ]
      }

      setDisplayImages(newImagesArray)
      await galleryAnimationControl.start('animate')
    }

    const intervalId = setInterval(randomizeImages, 10_000)

    galleryAnimationControl.start('animate')

    return () => clearInterval(intervalId)
  }, [displayImages, galleryAnimationControl])

  return (
    <motion.div
      className="relative grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 md:pl-10"
      variants={containerVariants}
      initial="initial"
      animate={galleryAnimationControl}
    >
      <AnimatePresence>
        {isPending ? (
          <>
            {[...Array(9)].map((number, index) => (
              <motion.div
                key={`${number}-${index + 1}`}
                className={`relative rounded-lg overflow-hidden max-h-[100px]
                ${index === 0 ? 'col-span-2 row-span-2 md:col-span-1 md:row-span-1' : ''}
                ${index === 1 ? 'col-span-2' : ''}
                ${index === 4 || index === 5 ? 'row-span-2' : ''}
                ${index === 6 ? 'col-span-2' : ''}
              `}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {displayImages.map(({ assetId }, index) => (
              <motion.div
                key={assetId}
                className={`relative rounded-lg overflow-hidden max-h-[100px]
              ${index === 0 ? 'col-span-2 row-span-2 md:col-span-1 md:row-span-1' : ''}
              ${index === 1 ? 'col-span-2' : ''}
              ${index === 4 || index === 5 ? 'row-span-2' : ''}
              ${index === 6 ? 'col-span-2' : ''}
            `}
                variants={imageVariants}
              >
                <motion.div
                  className="absolute inset-0 bg-gray-200"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: loadedImagesIndexes.has(index) ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img
                  id={`${IMAGE_GALLERY_ID_PREFIX}-${index}`}
                  alt={`imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: loadedImagesIndexes.has(index) ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
