import { calculateAverageCoordinate } from '@/utils/mappers'
import type {
  LatLng,
  Map as MapInterface,
  MapOptions,
  MarkerOptions
} from 'leaflet'
import { icon, latLng, tileLayer } from 'leaflet'
import { map as createMap } from 'leaflet'
import { marker as createMarker } from 'leaflet'

function createMarker_(latLang: LatLng, options?: MarkerOptions) {
  const markerIcon = icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
  })

  return createMarker(latLang, { icon: markerIcon, ...options })
}

function setLeafletCSS() {
  const CSS_HREF = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  const { head } = document

  return new Promise((resolve, reject) => {
    const link = document.createElement('link')

    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', CSS_HREF)

    link.addEventListener('load', () => resolve(link))
    link.addEventListener('error', () => reject(`Could not load ${CSS_HREF}`))

    head.append(link)
  })
}

function createPopupContent(name: string, lat: number, lng: number) {
  return `
    <div class="flex flex-col gap-2">
      <span>${name}</span>
      <button 
        onclick="window.open('https://www.google.com/maps?q=${lat},${lng}', '_blank');"
        style="color: blue; text-decoration: underline; font-size: 0.875rem;"
      >
        Ir a Google Maps
      </button>
    </div>
  `
}

function initWithMutipleMarkers(
  rootElementId: string,
  locations: Array<{ name: string; coords: number[] }>
) {
  if (!Array.isArray(locations)) {
    throw new Error('Locations must be a valid array')
  }

  setLeafletCSS().catch((error: string) => {
    throw new Error(error)
  })

  const averageCoords = calculateAverageCoordinate(
    locations.map(({ coords }) => ({
      latitude: coords[0],
      longitude: coords[1]
    }))
  )

  const latLngExpression = latLng(
    averageCoords.latitude,
    averageCoords.longitude
  )

  const mapOptions: MapOptions = {
    center: latLngExpression,
    zoom: 9
  }

  const map = createMap(rootElementId, mapOptions)
  const layer = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  for (const location of locations) {
    const [latitude, longitude] = location.coords
    const { name: popupName } = location

    const subjectLocationMarker = createMarker_(latLng(latitude, longitude))

    const popupContent = createPopupContent(popupName, latitude, longitude)
    subjectLocationMarker.bindPopup(popupContent).openPopup()
    subjectLocationMarker.addTo(map)
  }

  layer.addTo(map)

  return map
}

export function initLeafletMap(
  rootElementId: string,
  options: {
    coords?: number[]
    popupName?: string
    locations?: Array<{ name: string; coords: number[] }>
  }
) {
  const { coords, popupName, locations } = options

  if (typeof rootElementId !== 'string') {
    throw new Error('Expected id to be a valid string')
  }

  if (locations) {
    return initWithMutipleMarkers(rootElementId, locations)
  }

  if (!Array.isArray(coords) || coords.some((coord) => Number.isNaN(coord))) {
    throw new Error('Invalid coords')
  }

  setLeafletCSS().catch((error: string) => {
    throw new Error(error)
  })

  const latLangExpression = latLng(coords[0], coords[1])

  const mapOptions: MapOptions = {
    center: latLangExpression,
    zoom: 18
  }

  const subjectLocationMarker = createMarker_(latLangExpression)

  const map = createMap(rootElementId, mapOptions)
  const layer = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })

  if (popupName) {
    const popupContent = createPopupContent(popupName, coords[0], coords[1])
    subjectLocationMarker.bindPopup(popupContent).openPopup()
    subjectLocationMarker.addTo(map)
  }

  layer.addTo(map)

  return map
}

function getCurrentUserLocation() {
  const currentLatLong = {
    lat: 0,
    long: 0
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { coords } = position

    console.log({ coords })

    currentLatLong.lat = coords.latitude
    currentLatLong.long = coords.longitude

    console.log({ currentLatLong })
  })

  if (currentLatLong.lat === 0 && currentLatLong.long === 0) {
    console.log('hm')
    return null
  }

  return latLng(currentLatLong.lat, currentLatLong.long)
}

export function bindUserMarker(map: MapInterface) {
  let userLocationMarker = null
  const userLocationLatLong = getCurrentUserLocation()

  console.log(userLocationLatLong)

  if (userLocationLatLong) {
    console.log(userLocationLatLong)
    userLocationMarker = createMarker_(userLocationLatLong)

    const popupContent = createPopupContent(
      'Tu ubicación actual',
      userLocationLatLong.lat,
      userLocationLatLong.lng
    )
    userLocationMarker.bindPopup(popupContent)
  }

  if (userLocationMarker) {
    console.log('binding')
    userLocationMarker.addTo(map)
  }

  return map
}
