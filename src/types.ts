import type { Database } from './lib/database'
import type { interestPointCategories } from './constants'

export type Distrito = Database['public']['Tables']['distrito']['Row']

export type InterestPointCategoryEnglish = keyof typeof interestPointCategories
export type InterestPointCategory =
  (typeof interestPointCategories)[InterestPointCategoryEnglish]

export type InterestPointDB =
  Database['public']['Tables']['puntos_de_interes']['Row']

export interface InterestPoint extends InterestPointDB {
  tipo: InterestPointCategory
}
