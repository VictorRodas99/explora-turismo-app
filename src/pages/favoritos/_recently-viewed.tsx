import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import OverlayedSection from '@/components/overlay-section'
import getOrderedPlacesByDate from './_utils/get-ordered-places-by-date'
import type { RecentlyViewedItem } from '@/utils/local-storage'

import MainLogo from '@/images/complete-logo.png'
import { getInterestPointUrl, truncateText } from '@/utils/formatter'

export default function RecentlyViewed({
  recentlyViewedPlaces,
  onClose
}: {
  recentlyViewedPlaces: RecentlyViewedItem[] | null
  onClose: () => void
}) {
  const [isSmallMobileDisplay, setIsSmallMobileDisplay] = useState(
    window.innerWidth <= 320
  )
  const places = useMemo(
    () => getOrderedPlacesByDate(recentlyViewedPlaces),
    [recentlyViewedPlaces]
  )

  if (!places) {
    return null
  }

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setIsSmallMobileDisplay(window.innerWidth <= 320)
    }

    window.addEventListener('resize', handleWindowSizeChange)

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  return (
    <OverlayedSection className="py-12 px-5 md:px-28">
      <section className="flex flex-col gap-12">
        <header className="w-full flex gap-5 items-center">
          <button type="button" onClick={onClose}>
            <ChevronLeft />
          </button>
          <h2 className="font-bold md:text-3xl">Consultados Recientemente</h2>
        </header>
        <div>
          {Object.entries(places).map(([date, places]) => (
            <div key={date} className="flex flex-col gap-3">
              <h2 className="font-bold">{date}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-7 w-full md:w-[60%]">
                {places.map((place) => {
                  const placeUrl =
                    place.type === 'punto'
                      ? getInterestPointUrl({
                          point: { id: place.id, name: place.name },
                          distrito: {
                            id: place.distrito_id,
                            name: place.distrito.name
                          }
                        })
                      : `distrito/${place.id}`
                  return (
                    <div
                      key={place.name}
                      className="flex flex-col gap-5 w-full md:w-[250px] md:min-h-[300px]"
                    >
                      <a
                        href={placeUrl}
                        className="overflow-hidden rounded-lg h-[150px] md:min-h-[250px] md:max-h-[250px]"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={
                            'main_image' in place
                              ? (place.main_image ?? MainLogo.src)
                              : MainLogo.src
                          }
                          alt={place.name}
                        />
                      </a>
                      <div className="flex flex-col gap-2">
                        <h5 className="text-sm font-bold">{place.name}</h5>
                        {!isSmallMobileDisplay && (
                          <p className="text-sm text-slate-500">
                            {truncateText(
                              place.description ?? 'Sin Descripción',
                              {
                                maxWords: 7
                              }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </OverlayedSection>
  )
}
