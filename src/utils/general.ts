import { validPathNames } from '../constants'

export function getWebsitePaths({ pathname }: { pathname: string }) {
  const currentPath = pathname.slice(1)

  return Object.freeze({
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
  })
}
