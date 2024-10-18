import { initLeafletMap } from '@/lib/leaflet'
import { useEffect } from 'react'

interface MapProps {
  coords: number[]
  popupName?: string
}

export default function MapComponent({ coords, popupName }: MapProps) {
  useEffect(() => {
    initLeafletMap('map', coords, popupName)
  }, [coords, popupName])

  return (
    <aside className="sticky top-24 w-full h-fit flex flex-col gap-5 p-5 rounded-md bg-soft-white shadow-md">
      <h2 className="font-bold text-xl">¿Dónde vas a estar?</h2>
      <div
        id="map"
        className="w-full h-[400px] z-10 overflow-hidden rounded-lg"
      />
    </aside>
  )
}
