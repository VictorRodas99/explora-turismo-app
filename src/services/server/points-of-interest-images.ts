import { API_STATES } from '@/pages/api/_states'
import { GET as APIgetImageByDistrictId } from '@/pages/api/puntos/[id]/imagenes'
import type { InterestPointImage } from '@/types'
import type { APIContext } from 'astro'

export default async function getInterestPointsImages(context: APIContext) {
  const response = await APIgetImageByDistrictId(context)
  const json = await response.json()

  const { statusText, data } = json.data

  if (statusText === API_STATES.error || !data) {
    return null
  }

  return data as InterestPointImage[]
}
