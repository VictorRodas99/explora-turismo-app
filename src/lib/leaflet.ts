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

export function initLeafletMap(
  rootElementId: string,
  coords: number[],
  popupName?: string
) {
  if (typeof rootElementId !== 'string') {
    throw new Error('Expected id to be a valid string')
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
    subjectLocationMarker.bindPopup(popupName).openPopup()
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
  }

  if (userLocationMarker) {
    console.log('binding')
    userLocationMarker.addTo(map)
  }

  return map
}
