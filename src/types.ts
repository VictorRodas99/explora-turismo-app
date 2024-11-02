import type { Tables } from './lib/database'
import type { interestPointCategories } from './constants'

export type UserRole = 'admin' | 'editor' | 'viewer'

export type Event = Tables<'eventos'>
export type Distrito = Tables<'distrito'>
export type InterestPointDB = Tables<'puntos_de_interes'>
export type InterestPointImage = Tables<'puntos_de_interes_imagenes'>
export type InterestPointContactsDB = Tables<'puntos_de_interes_contactos'>

export type InterestPointCategoryEnglish = keyof typeof interestPointCategories
export type InterestPointCategory =
  (typeof interestPointCategories)[InterestPointCategoryEnglish]

export interface InterestPoint extends InterestPointDB {
  tipo: InterestPointCategory
}

export type InterestPointContacts = Omit<InterestPointContactsDB, 'created_at'>
