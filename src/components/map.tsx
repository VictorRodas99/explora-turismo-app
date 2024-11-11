import { initLeafletMap } from '@/lib/leaflet'
import { useEffect } from 'react'

interface MapProps {
  coords: number[]
  popupName?: string
  mapTitle?: string
}

interface MultipleLocationMapProps {
  locations: Array<{ name: string; coords: number[] }>
}

export function MultipleLocationMap({ locations }: MultipleLocationMapProps) {
  if (locations.length === 0) {
    return null
  }

  const mapId = window.btoa(
    `multiple-map-${JSON.stringify(locations.at(0)?.coords)}`
  )

  useEffect(() => {
    initLeafletMap(mapId, { locations })
  }, [locations, mapId])

  return (
    <aside className="w-full h-full">
      <div id={mapId} className="w-full h-full overflow-hidden rounded-lg" />
    </aside>
  )
}

export default function MapComponent({
  coords,
  popupName,
  mapTitle
}: MapProps) {
  const mapId = window.btoa(`map-${JSON.stringify(coords)}`)

  useEffect(() => {
    initLeafletMap(mapId, { coords, popupName })
  }, [coords, popupName, mapId])

  return (
    <aside className="sticky top-24 w-full h-fit flex flex-col gap-5 p-5 rounded-md bg-soft-white shadow-md">
      {mapTitle && <h2 className="font-bold text-xl">{mapTitle}</h2>}
      <div
        id={mapId}
        className="w-full h-[200px] md:h-[400px] z-10 overflow-hidden rounded-lg"
      />
    </aside>
  )
}
