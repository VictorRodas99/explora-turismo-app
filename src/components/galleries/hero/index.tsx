import { useCallback, useEffect, useState } from 'react'
import type { getImagesFromResponse } from '@/utils/formatter'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import deepClone from '@/utils/deep-clone'

interface GalleryProps {
  images: ReturnType<typeof getImagesFromResponse>
  retrieveError?: string
}

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

export default function Gallery({ images, retrieveError }: GalleryProps) {
  const [displayImages, setDisplayImages] = useState(images?.slice(0, 9) ?? [])
  const [loadedImagesIndexes, setLoadedImagesIndexes] = useState<Set<number>>(
    new Set()
  )
  const galleryAnimationControl = useAnimationControls()

  const handleImageLoad = useCallback((imageIndex: number) => {
    setLoadedImagesIndexes((prev) => new Set(prev).add(imageIndex))
  }, [])

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
      </AnimatePresence>
    </motion.div>
  )
}
