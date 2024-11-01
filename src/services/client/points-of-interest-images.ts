import { API_STATES } from '@/pages/api/_states'
import type { InterestPointImage } from '@/types'
import { getOrigin } from '@/utils/general'

export default async function getInterestPointsImages({
  interestPointId
}: {
  interestPointId: number
}) {
  const BASE_ROUTE = getOrigin()

  const response = await fetch(
    `${BASE_ROUTE}/api/puntos/${interestPointId}/imagenes/`
  )

  const json = await response.json()
  const { statusText, data: images } = json.data

  return statusText === API_STATES.error
    ? null
    : (images as InterestPointImage[])
}
