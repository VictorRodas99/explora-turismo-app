import type { getWebsitePaths } from '@/utils/general'
import { House, Bird, Crown } from 'lucide-react'

type PathsWithoutIcons = ReturnType<typeof getWebsitePaths>
type Keys = keyof PathsWithoutIcons
export type PathsWithoutIconsAsEntries = [Keys, PathsWithoutIcons[Keys]][]

export default function getIconFromPathName(
  name: Keys,
  pathsWithoutIcons: PathsWithoutIcons
) {
  if (!Object.keys(pathsWithoutIcons).includes(name)) {
    throw new Error('Given param does not exists as a valid path name')
  }

  switch (name) {
    case 'home':
      return House

    case 'places':
      return Bird

    case 'preferences':
      return Crown

    case 'aboout':
      return null

    default:
      return null
  }
}
