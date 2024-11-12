import { API_STATES } from '@/pages/api/_states'
import type { ApiResponse } from '../validations/api-response.zod'
import type { CloudinaryResponse } from '@/lib/cloudinary/response'

export default async function getAssetsFrom({ folder }: { folder: string }) {
  if (typeof folder !== 'string') {
    throw new Error('folder param must be of type string')
  }

  const response = await fetch('/api/assets/', {
    method: 'POST',
    body: JSON.stringify({ folder })
  })

  const { statusText, data } = ((await response.json()) as ApiResponse).data

  if (statusText === API_STATES.error) {
    return {
      error: data as string,
      assets: null
    }
  }

  return {
    error: null,
    assets: data as CloudinaryResponse | null
  }
}
