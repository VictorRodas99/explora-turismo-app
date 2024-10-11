import { useCallback, useEffect, useMemo, useState } from 'react'
import type { getImagesFromResponse } from '../../utils/formatter'
import { AnimatePresence, motion } from 'framer-motion'

interface GalleryProps {
  images: ReturnType<typeof getImagesFromResponse>
}

const IMAGE_GALLERY_ID_PREFIX = 'image-gallery'

export default function Gallery({ images }: GalleryProps) {
  const displayImages = useMemo(() => images?.slice(0, 9) ?? [], [images])
  const [loadedImagesIndexes, setLoadedImagesIndexes] = useState<Set<number>>(
    new Set()
  )

  const handleImageLoad = useCallback((imageIndex: number) => {
    setLoadedImagesIndexes((prev) => new Set(prev).add(imageIndex))
  }, [])

  /**
   * Se asigna el source y el onload programáticamente porque el onload
   * no se ejecuta cuando las imágenes ya están cacheadas (Ej: soft reload de la página)
   */
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

  return (
    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 md:pl-10">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
    </div>
  )
}
