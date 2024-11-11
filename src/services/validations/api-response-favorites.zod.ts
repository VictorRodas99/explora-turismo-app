import * as z from 'zod'

export const distritoSchema = z.object({
  id: z.number(),
  name: z.string(),
  main_image: z.string().or(z.null()),
  description: z.string(),
  coords: z.array(z.number())
})

export const pointSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().or(z.null()),
  coords: z.array(z.number()),
  distrito_id: z.number(),
  distrito_name: z.string().or(z.null())
})

export type Distrito = z.infer<typeof distritoSchema>

export const favoritePointSchema = z.object({
  punto_de_interes_id: z.number(),
  puntos_de_interes: pointSchema
})

export type FavoritePoint = z.infer<typeof favoritePointSchema>

export const FavoriteDistrictSchema = z.object({
  distrito_id: z.number(),
  distrito: distritoSchema
})

export type FavoriteDistrict = z.infer<typeof FavoriteDistrictSchema>

export const favoritesSchema = z.object({
  favoriteDistricts: z.array(FavoriteDistrictSchema),
  favoritePoints: z.array(favoritePointSchema)
})

export type FavoritePlaces = z.infer<typeof favoritesSchema>

export const FavoritesDataSchema = z.object({
  statusText: z.enum(['success', 'error']),
  data: favoritesSchema.or(z.string())
})

export type FavoritesData = z.infer<typeof FavoritesDataSchema>

export const apiResponseFavoritesSchema = z.object({
  data: FavoritesDataSchema
})

export type APIResponseFavoritesSchema = z.infer<
  typeof apiResponseFavoritesSchema
>
