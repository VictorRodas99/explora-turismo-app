import { v2 as cloudinary } from 'cloudinary'
import type { CloudinaryResponse } from './response'

class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(
      () => reject(new TimeoutError(`Operation timed out after ${ms}ms`)),
      ms
    )
  )
}

export async function getAssetsFromFolder({
  folder,
  timeoutMs = 5000
}: {
  folder: string
  timeoutMs?: number
}) {
  cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_KEY_SECRET
  })

  try {
    const searchPromise = new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.search
        .expression(`folder:${folder}/*`)
        .sort_by('public_id', 'desc')
        .max_results(50)
        .execute()
        .then(resolve)
        .catch(reject)
    })

    const result = await Promise.race([searchPromise, timeout(timeoutMs)])

    return {
      assets: result as CloudinaryResponse
    }
  } catch (error) {
    if (error instanceof TimeoutError) {
      return {
        assets: null,
        error: 'timeout'
      }
    }
    console.error('Error in Cloudinary search:', error)

    return {
      assets: null,
      error: error instanceof Error ? error.name : 'unknown error'
    }
  }
}
