import type {
  FavoriteDistrict,
  FavoritePoint
} from '@/services/validations/api-response-favorites.zod'
import { useMemo, useState, lazy, Suspense } from 'react'
import { getSavedPlacesLocally } from '@/utils/local-storage'
import MainLogo from '@/images/complete-logo.png'
import { cn } from '@/utils/cn'
import { AnimatePresence } from 'framer-motion'
import type { Place } from '@/types'
import FavoriteDistricts, { FavoritePoints } from './_favorite-sections'
import { ArrowRight } from 'lucide-react'
import type getInterestPointsImages from '@/services/server/points-of-interest-images'

const RecentlyViewed = lazy(() => import('./_recently-viewed'))

export interface FavoritePlacesProps {
  distritos: FavoriteDistrict['distrito'][]
  points: Array<
    FavoritePoint['puntos_de_interes'] & {
      url: string
      main_image: string | null
      images: Awaited<ReturnType<typeof getInterestPointsImages>>
    }
  >
}

function SectionTrigger<
  T extends Omit<Omit<Place, 'address_reference'>, 'type'>
>({
  children,
  handleOpen,
  places
}: {
  children: React.ReactNode
  places: T[] | null
  handleOpen: () => void
}) {
  if (!places) {
    return null
  }

  return (
    <div className="flex flex-col gap-5 w-full md:w-[1fr] h-fit">
      <button
        type="button"
        className="relative group rounded-md overflow-hidden shadow-md"
        onClick={handleOpen}
      >
        <span className="absolute right-2 bottom-2 text-white">
          <ArrowRight />
        </span>
        <div
          className={cn('grid grid-cols-2 w-full h-[200px]', {
            'grid-cols-1': places.length === 1
          })}
        >
          {places.slice(0, 4).map((place, index) => {
            const imageSource =
              'main_image' in place
                ? (place.main_image ?? MainLogo.src)
                : MainLogo.src

            return (
              <img
                className={cn(
                  'object-cover group-hover:brightness-90 transition-all w-full h-full',
                  { 'col-span-2': places.length === 3 && index === 2 }
                )}
                key={`${place.id}-${place.name}`}
                src={imageSource}
                alt={place.name}
              />
            )
          })}
        </div>
      </button>
      <h5 className="font-bold text-sm">{children}</h5>
    </div>
  )
}

export default function FavoritePlaces({
  distritos,
  points
}: FavoritePlacesProps) {
  const recentlyViewedPlaces = useMemo(() => getSavedPlacesLocally(), [])

  const [overlaySectionsStates, setOverlaySectionsStates] = useState({
    isOpenrecentlyViewed: false,
    isOpenDistritos: false,
    isOpenPoints: false
  })

  const handleOpenRecentlyViewedSection = (openState: boolean) => {
    if (typeof openState !== 'boolean') {
      throw new Error('Open state must be of type boolean')
    }

    setOverlaySectionsStates((prev) => ({
      ...prev,
      isOpenrecentlyViewed: openState
    }))
  }

  const handleOpenSectionOfFavorites = (
    openState: boolean,
    section: 'distritos' | 'puntos'
  ) => {
    if (typeof openState !== 'boolean') {
      throw new Error('Open state must be of type boolean')
    }

    if (section !== 'distritos' && section !== 'puntos') {
      throw new Error(
        `Expected section to be "distritos" or "puntos" but get ${section}`
      )
    }

    const validSection = Object.freeze({
      distritos: 'isOpenDistritos',
      puntos: 'isOpenPoints'
    })

    setOverlaySectionsStates((prev) => ({
      ...prev,
      [validSection[section]]: openState
    }))
  }

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <SectionTrigger
          handleOpen={() => handleOpenRecentlyViewedSection(true)}
          places={recentlyViewedPlaces}
        >
          Consultados Recientemente
        </SectionTrigger>
        <SectionTrigger
          handleOpen={() => handleOpenSectionOfFavorites(true, 'distritos')}
          places={distritos}
        >
          Distritos
        </SectionTrigger>
        <SectionTrigger
          handleOpen={() => handleOpenSectionOfFavorites(true, 'puntos')}
          places={points}
        >
          Puntos de interés
        </SectionTrigger>
      </section>

      <AnimatePresence>
        {overlaySectionsStates.isOpenrecentlyViewed && (
          <Suspense>
            <RecentlyViewed
              key="recently-viewed-section"
              recentlyViewedPlaces={recentlyViewedPlaces}
              onClose={() => handleOpenRecentlyViewedSection(false)}
            />
          </Suspense>
        )}
        {overlaySectionsStates.isOpenDistritos && (
          <Suspense>
            <FavoriteDistricts
              key="favorite-districts-section"
              distritos={distritos}
              onClose={() => handleOpenSectionOfFavorites(false, 'distritos')}
            />
          </Suspense>
        )}
        {overlaySectionsStates.isOpenPoints && (
          <Suspense>
            <FavoritePoints
              key="favorite-points-section"
              points={points}
              onClose={() => handleOpenSectionOfFavorites(false, 'puntos')}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}
