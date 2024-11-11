import { useQueries } from '@tanstack/react-query'
import OverlayedSection from '@/components/overlay-section'
import type { Distrito } from '@/types'
import { getImagesFromResponse, slugify, truncateText } from '@/utils/formatter'
import { ChevronLeft } from 'lucide-react'
import { API_STATES } from '../api/_states'
import type { CloudinaryResponse } from '@/lib/cloudinary/response'
import { useToast } from '@/hooks/use-toast'
import type { ApiResponse } from '@/services/validations/api-response.zod'
import { lazy, Suspense, useEffect, useState } from 'react'
import QueryClientProvider from '@/context/tanstack-react-query'
import MainLogo from '@/images/complete-logo.png'
import { cn } from '@/utils/cn'
import type { FavoritePlacesProps } from './_favorite-places'
import ImageCarousel from './_image-carousel'

const MultipleLocationMap = lazy(() =>
  import('@/components/map').then((module) => ({
    default: module.MultipleLocationMap
  }))
)

const fetchDistrictImages = async (distrito: Distrito) => {
  const response = await fetch('/api/assets/', {
    method: 'POST',
    body: JSON.stringify({ folder: `${slugify(distrito.name)}/galeria` })
  })

  const { statusText, data } = ((await response.json()) as ApiResponse).data

  if (statusText === API_STATES.error) {
    throw new Error(data as string)
  }

  return {
    id: distrito.id,
    images: getImagesFromResponse(data as CloudinaryResponse)
  }
}

function FavoritesContainer({
  children,
  places,
  onClose,
  isMobileWidth
}: {
  children: React.ReactNode
  places: FavoritePlacesProps['points'] | Distrito[]
  onClose: () => void
  isMobileWidth: boolean
}) {
  return (
    <OverlayedSection>
      <section className="flex h-full">
        <div
          className={cn('w-[70%] py-12 px-5', {
            'w-[60%]': places.length <= 2,
            'w-full': isMobileWidth
          })}
        >
          <header className="w-full flex gap-5 items-center mb-8">
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="font-bold md:text-3xl">Distritos favoritos</h2>
          </header>

          <div
            className={cn('grid grid-cols-3', {
              'grid-cols-2': places.length <= 2,
              'grid-cols-1': isMobileWidth
            })}
          >
            {children}
          </div>
        </div>
        {!isMobileWidth && (
          <Suspense>
            <div
              className={cn('w-[30%] border', {
                'w-[40%]': places.length <= 2
              })}
            >
              <MultipleLocationMap
                locations={places.map(({ name, coords }) => ({
                  name,
                  coords
                }))}
              />
            </div>
          </Suspense>
        )}
      </section>
    </OverlayedSection>
  )
}

export function FavoritePoints({
  points,
  onClose
}: {
  points: FavoritePlacesProps['points']
  onClose: () => void
}) {
  const [isMobileWidth, setIsMobileWith] = useState(window.innerWidth <= 426)

  useEffect(() => {
    const handleWidthChange = () => {
      setIsMobileWith(window.innerWidth <= 426)
    }

    window.addEventListener('resize', handleWidthChange)

    return () => {
      window.removeEventListener('resize', handleWidthChange)
    }
  }, [])

  return (
    <FavoritesContainer
      places={points}
      onClose={onClose}
      isMobileWidth={isMobileWidth}
    >
      {points.map((point) => {
        return (
          <div
            key={`${point.name}-${point.id}`}
            className="flex flex-col gap-5 p-6"
          >
            <div>
              {point.images ? (
                <ImageCarousel
                  images={point.images.map(({ url }) => ({ url }))}
                  href={point.url}
                  isMobileWidth={isMobileWidth}
                />
              ) : (
                <a href={point.url}>
                  <img src={MainLogo.src} alt="Logo de Destino Ñeembucú" />
                </a>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">{point.name}</h3>
              <p className="text-sm text-slate-500">
                {truncateText(point.description ?? 'Sin Descripción', {
                  maxWords: 10
                })}
              </p>
            </div>
          </div>
        )
      })}
    </FavoritesContainer>
  )
}

export function FavoriteDistricts({
  distritos,
  onClose
}: {
  distritos: Distrito[]
  onClose: () => void
}) {
  const { toast } = useToast()
  const [isMobileWidth, setIsMobileWith] = useState(window.innerWidth <= 426)

  const districtQueries = useQueries({
    queries: distritos.map((distrito) => ({
      queryKey: ['district-images', distrito.id],
      queryFn: () => fetchDistrictImages(distrito),
      cacheTime: 30 * 60 * 1000
    }))
  })

  const isLoading = districtQueries.some((query) => query.isLoading)
  const isError = districtQueries.some((query) => query.isError)
  const queryErrors = districtQueries
    .filter((query) => query.error)
    .map((query) => query.error)

  const successfulResults = districtQueries
    .filter((query) => query.isSuccess)
    .map((query) => query.data)

  useEffect(() => {
    const handleWidthChange = () => {
      setIsMobileWith(window.innerWidth <= 426)
    }

    window.addEventListener('resize', handleWidthChange)

    return () => {
      window.removeEventListener('resize', handleWidthChange)
    }
  }, [])

  if (isLoading) {
    return (
      <OverlayedSection className="py-12 px-5 md:px-28">
        <div className="flex items-center justify-center">
          <p className="text-lg">Cargando imágenes...</p>
        </div>
      </OverlayedSection>
    )
  }

  if (isError) {
    for (const error of queryErrors) {
      if (error) {
        toast({
          title: 'Error inesperado al tratar de obtener las imágenes',
          description: error.message,
          variant: 'destructive'
        })
      }
    }
    return null
  }

  return (
    <FavoritesContainer
      places={distritos}
      isMobileWidth={isMobileWidth}
      onClose={onClose}
    >
      {distritos.map((distrito) => {
        const districtData = successfulResults.find(
          (result) => result?.id === distrito.id
        )

        return (
          <div
            key={`${distrito.name}-${distrito.id}`}
            className="flex flex-col gap-5 p-6"
          >
            <div>
              {districtData?.images && districtData.images.length > 0 ? (
                <ImageCarousel
                  images={districtData.images}
                  href={`distrito/${distrito.id}`}
                  isMobileWidth={isMobileWidth}
                />
              ) : (
                <a href={`distrito/${distrito.id}`}>
                  <img src={MainLogo.src} alt="Logo de Destino Ñeembucú" />
                </a>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">{distrito.name}</h3>
              <p className="text-sm text-slate-500">
                {truncateText(distrito.description, { maxWords: 10 })}
              </p>
            </div>
          </div>
        )
      })}
    </FavoritesContainer>
  )
}

export default function FavoriteDistrictsContainer({
  distritos,
  onClose
}: {
  distritos: Distrito[]
  onClose: () => void
}) {
  return (
    <QueryClientProvider>
      <FavoriteDistricts distritos={distritos} onClose={onClose} />
    </QueryClientProvider>
  )
}
