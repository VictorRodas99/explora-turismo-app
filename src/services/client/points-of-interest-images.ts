import { isDevMode, SERVER_PORT, MAIN_DOMAIN } from '@/constants'
import { API_STATES } from '@/pages/api/_states'
import type { InterestPointImage } from '@/types'

export default async function getInterestPointsImages({
  interestPointId
}: {
  interestPointId: number
}) {
  const BASE_ROUTE = import.meta.env.SSR
    ? isDevMode
      ? `http://localhost:${SERVER_PORT}`
      : MAIN_DOMAIN
    : new URL(window.location.href).origin

  const response = await fetch(
    `${BASE_ROUTE}/api/puntos/${interestPointId}/imagenes/`
  )

  const json = await response.json()
  const { statusText, data: images } = json.data

  return statusText === API_STATES.error
    ? null
    : (images as InterestPointImage[])
}
