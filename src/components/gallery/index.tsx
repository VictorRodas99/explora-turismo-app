import { useMemo } from 'react'
import type { getImagesFromResponse } from '../../utils/formatter'

interface GalleryProps {
  images: ReturnType<typeof getImagesFromResponse>
}

export default function Gallery({ images }: GalleryProps) {
  if (!images || images.length < 9) {
    return <h2>Sin imágenes suficientes</h2>
  }

  const displayImages = useMemo(() => images.slice(0, 9), [images])

  return (
    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 pl-10">
      {displayImages.map(({ url, assetId }, index) => (
        <div
          key={assetId}
          className={`max-h-[100px]
              ${index === 0 ? 'absolute top-0 left-0 w-[200px] h-[100px]' : ''}
              ${index === 1 ? 'col-span-2' : ''}
              ${index === 4 || index === 5 ? 'row-span-2 max-h-[220px]' : ''}
              ${index === 6 ? 'col-span-2' : ''}
            `}
        >
          <img
            src={url}
            alt={`imagen ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  )
}
