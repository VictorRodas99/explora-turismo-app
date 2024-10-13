import { API_STATES } from '@/pages/api/_states'
import { GET as APIDistritosById } from '@/pages/api/distritos/[id]'
import type { Distrito } from '@/types'
import type { APIContext } from 'astro'

export async function getDistritoById(context: APIContext) {
  const response = await APIDistritosById(context)
  const json = await response.json()

  const { statusText, data } = json.data

  if (statusText === API_STATES.error || !Array.isArray(data)) {
    return null
  }

  return (data.at(0) as Distrito) ?? null
}
