import type { APIContext } from 'astro'
import { GET as APIgetPointOfInterestByDistrict } from '@/pages/api/puntos/distrito/[id]'
import { API_STATES } from '@/pages/api/_states'
import type { InterestPoint } from '@/types'

export async function getPointOfInterestByDistrict(context: APIContext) {
  const response = await APIgetPointOfInterestByDistrict(context)
  const json = await response.json()

  const { statusText, data } = json.data

  if (statusText === API_STATES.error || !data) {
    return null
  }

  return data as InterestPoint[]
}
