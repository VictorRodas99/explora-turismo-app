export const validPathNames = Object.freeze({
  home: '',
  places: 'lugares',
  preferences: 'preferencias',
  about: 'acerca-de'
})

export const interestPointCategories = Object.freeze({
  lodging: 'alojamiento',
  tourist: 'turistico',
  historical: 'historico',
  cinema: 'cine',
  gastronomy: 'gastronomia',
  other: 'otro'
})

export const USER_ROLES = Object.freeze({
  viewer: 'viewer',
  admin: 'admin',
  editor: 'editor'
})

export const USER_ROLES_SPANISH = Object.freeze({
  viewer: 'Visitante',
  admin: 'Administrador',
  editor: 'Editor'
})

/* INPUTS THAT I USE WITH THE AUTH FORMS */
export const AUTH_INPUTS_NAMES = Object.freeze({
  email: 'email',
  name: 'first-name',
  lastname: 'last-name',
  password: 'password'
})
/* ----  */

export const SB_COKIE_SESSION_NAME = {
  acesss: 'sb-access-token',
  refresh: 'sb-refresh-token'
}

export const MAINTAINER_EMAIL = 'fcaunpanalisisturismoapp@gmail.com'
export const MAINTAINER_EMAIL_ALTERNATIVE = 'turismo@aplicadas.edu.py'

export const SITE_NAME = 'Destino Ñeembucú'

export const isDevMode = import.meta.env.DEV
export const SERVER_PORT = 4321
export const MAIN_DOMAIN = import.meta.env.DOMAIN_HOST
