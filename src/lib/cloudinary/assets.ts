import { v2 as cloudinary } from 'cloudinary'
import type { CloudinaryResponse } from './response'

export async function getAssetsFromFolder({ folder }: { folder: string }) {
  cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_KEY_SECRET
  })

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}/*`)
      .sort_by('public_id', 'desc')
      .max_results(50)
      .execute()

    return result as CloudinaryResponse
  } catch (error) {
    console.error(error)
    return null
  }
}
