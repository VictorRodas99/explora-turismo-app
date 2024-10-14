import { validPathNames } from '../constants'
import { transformDateToNextYear } from './formatter'

export function getWebsitePaths({ pathname }: { pathname: string }) {
  const currentPath = pathname.slice(1)

  const paths = {
    home: {
      label: 'Home',
      url: `/${validPathNames.home}`,
      isCurrent: currentPath === validPathNames.home
    },
    places: {
      label: 'Lugares',
      url: `/${validPathNames.places}`,
      isCurrent: currentPath === validPathNames.places
    },
    preferences: {
      label: 'Preferencias',
      url: `/${validPathNames.preferences}`,
      isCurrent: currentPath === validPathNames.preferences
    },
    aboout: {
      label: 'Acerca de',
      url: `/${validPathNames.about}`,
      isCurrent: currentPath === validPathNames.about
    }
  } as const

  return Object.freeze(paths)
}

export function getRemanentDays({ from, to }: { from: Date; to: Date }) {
  if (to < from) {
    to = transformDateToNextYear(to.toISOString().split('T').at(0) ?? '')
  }

  const msFrom = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const msTo = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())

  const msDifference = msTo - msFrom
  const remanentDays = Math.ceil(msDifference / 1000 / 3600 / 24)

  return remanentDays
}
