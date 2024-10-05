import type { CloudinaryResponse } from '../lib/cloudinary/response'

export function getImagesFromResponse(
  response: CloudinaryResponse | null
) {
  if (!response) {
    return null
  }

  return response.resources
    .filter((asset) => asset.resource_type === 'image')
    .map((asset) => ({
      publicId: asset.public_id,
      assetId: asset.asset_id,
      name: asset.filename,
      displayName: asset.display_name,
      status: asset.status,
      url: asset.secure_url
    }))
}
