import type { Database } from './lib/database'
import type { interestPointCategories } from './constants'

export type UserRole = 'admin' | 'editor' | 'viewer'

export type Distrito = Database['public']['Tables']['distrito']['Row']

export type InterestPointCategoryEnglish = keyof typeof interestPointCategories
export type InterestPointCategory =
  (typeof interestPointCategories)[InterestPointCategoryEnglish]

export type InterestPointDB =
  Database['public']['Tables']['puntos_de_interes']['Row']

export interface InterestPoint extends InterestPointDB {
  tipo: InterestPointCategory
}

export type Event = Database['public']['Tables']['eventos']['Row']
export type InterestPointImage =
  Database['public']['Tables']['puntos_de_interes_imagenes']['Row']

export type InterestPointContactsDB =
  Database['public']['Tables']['puntos_de_interes_contactos']['Row']
export type InterestPointContacts = Omit<InterestPointContactsDB, 'created_at'>
