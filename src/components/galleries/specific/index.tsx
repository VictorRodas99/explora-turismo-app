import { cn } from '@/utils/cn'
import type { getImagesFromResponse } from '@/utils/formatter'
import { Logs } from 'lucide-react'

export default function Gallery({
  images
}: {
  images: ReturnType<typeof getImagesFromResponse>
}) {
  if (!images) {
    // mostrar un vector que represente que no hay imágenes
    return <h2>Sin imágenes</h2>
  }

  return (
    <section className="relative grid grid-cols-4 gap-2 rounded-xl overflow-hidden">
      {images.slice(0, 5).map(({ assetId, url, name }, index) => (
        <button
          type="button"
          key={assetId}
          className={cn('max-h-[180px] hover:brightness-75 transition-all', {
            'col-span-2 row-span-2 max-h-max': index === 0
          })}
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
        className="absolute flex gap-2 items-center right-5 bottom-5 border border-primary bg-white text-sm px-3 py-2 rounded-lg"
      >
        <Logs size={15} />
        Mostrar todas las fotos
      </button>
    </section>
  )
}
