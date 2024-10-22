import type { APIContext } from 'astro'
import { GET as APIgetPointOfInterestByDistrict } from '@/pages/api/puntos/distrito/[id]'
import { GET as APIgetPointOfInterestById } from '@/pages/api/puntos/[id]'
import { GET as APIgetPointOfInterestContactById } from '@/pages/api/puntos/[id]/contactos'
import { API_STATES } from '@/pages/api/_states'
import type { InterestPoint, InterestPointContacts } from '@/types'

export async function getPointOfInterestByDistrict(context: APIContext) {
  const response = await APIgetPointOfInterestByDistrict(context)
  const json = await response.json()

  const { statusText, data } = json.data

  if (statusText === API_STATES.error || !data) {
    return null
  }

  return data as InterestPoint[]
}

export async function getPoinstOfInterestById(context: APIContext) {
  const response = await APIgetPointOfInterestById(context)
  const json = await response.json()

  const { statusText, data } = json.data

  if (statusText === API_STATES.error || !data) {
    return null
  }

  return data as InterestPoint[]
}

export async function getPointOfInterestContacts(context: APIContext) {
  const response = await APIgetPointOfInterestContactById(context)
  const json = await response.json()

  const { statusText } = json.data
  const data: InterestPointContacts = json.data.data

  if (statusText === API_STATES.error || !data) {
    return null
  }

  return {
    id: data.id,
    instagramUser: data.instagram_user,
    phoneNumbers: data.phone_number
  }
}
