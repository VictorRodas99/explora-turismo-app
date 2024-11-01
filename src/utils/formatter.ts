import type { UserRole } from '@/types'
import type { CloudinaryResponse } from '../lib/cloudinary/response'
import { USER_ROLES_SPANISH } from '@/constants'

export function getImagesFromResponse(response: CloudinaryResponse | null) {
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

interface TruncateOptions {
  maxWords?: number
  maxChars?: number
  ellipsis?: string
  preserveWords?: boolean
}

export function truncateText(
  text: string,
  options: TruncateOptions = {}
): string {
  const {
    maxWords = Number.POSITIVE_INFINITY,
    maxChars = Number.POSITIVE_INFINITY,
    ellipsis = '...',
    preserveWords = true
  } = options

  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords && text.length <= maxChars) {
    return text
  }

  let result = words.slice(0, maxWords).join(' ')

  if (result.length > maxChars) {
    if (preserveWords) {
      result = result.substring(0, maxChars)
      const lastSpace = result.lastIndexOf(' ')

      if (lastSpace !== -1) {
        result = result.substring(0, lastSpace)
      }
    } else {
      result = result.substring(0, maxChars)
    }
  }

  return result + (result.length < text.length ? ellipsis : '')
}

/**
 * Por alguna razón si no se quita el cero del primer dígito (si es que existe) el new Date()
 * sobre la fecha sin formatear retorna el día anterior
 */
export function removeLeadingZeroInMonth(dateString: string) {
  const regex = /(\d{4})-0?(\d{1,2})-(\d{2})/
  return dateString.replace(regex, '$1-$2-$3')
}

export function getLocaleDateString(date: Date | string) {
  if (date instanceof Date) {
    return date.toLocaleDateString('es', {
      month: 'long',
      day: 'numeric'
    })
  }

  const parsedDate = new Date(removeLeadingZeroInMonth(date))

  if (String(parsedDate) === 'Invalid Date') {
    throw new Error('Param must be a valid date, string or instance of Date')
  }

  return parsedDate.toLocaleDateString('es', {
    month: 'long',
    day: 'numeric'
  })
}

export function transformDateToNextYear(givenDate: string) {
  const [year, month, day] = givenDate.split('-').map(Number)
  const inputDate = new Date(year, month - 1, day)

  if (String(inputDate) === 'Invalid Date') {
    throw new Error('Given param must be a valid string date yy-mm-dd')
  }

  const currentDate = new Date()

  if (
    inputDate < currentDate ||
    inputDate.toDateString() === currentDate.toDateString()
  ) {
    inputDate.setFullYear(currentDate.getFullYear() + 1)
  }

  return inputDate
}

export function slugify(givenString: string): string {
  let newString = String(givenString)

  newString = newString.replace(/^\s+|\s+$/g, '')
  newString = newString.toLowerCase()
  newString = newString
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return newString
}

export function mapRoleInSpanish(role: UserRole) {
  return USER_ROLES_SPANISH[role]
}
