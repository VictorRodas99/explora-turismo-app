import * as z from 'zod'

export const distritoSchema = z.object({
  coords: z.array(z.number()),
  description: z.string().nullable(),
  id: z.number(),
  main_image: z.string().nullable(),
  name: z.string()
})

export const distritoFavoritosSchema = z.object({
  created_at: z.string(),
  distrito_id: z.number().nullable(),
  id: z.number(),
  user_id: z.string().nullable()
})

export const distritoImagenesSchema = z.object({
  distrito_id: z.number(),
  id: z.number(),
  url: z.string()
})

export const eventosSchema = z.object({
  description: z.string().nullable(),
  distrito_id: z.number(),
  end_date: z.string().nullable(),
  id: z.number(),
  start_date: z.string(),
  subject: z.string()
})

export const puntoInteresSchema = z.object({
  address_reference: z.string().nullable(),
  coords: z.array(z.number()),
  description: z.string().nullable(),
  distrito_id: z.number(),
  id: z.number(),
  name: z.string(),
  tipo: z.string()
})

export const puntoInteresComentariosSchema = z.object({
  comment: z.string().nullable(),
  created_at: z.string(),
  id: z.number(),
  punto_de_interes_id: z.number(),
  rating: z.number(),
  user_id: z.string()
})

export const puntoInteresContactosSchema = z.object({
  created_at: z.string(),
  id: z.number(),
  instagram_user: z.string().nullable(),
  phone_number: z.array(z.number()),
  punto_de_interes_id: z.number()
})

export const puntoInteresImagenesSchema = z.object({
  id: z.number(),
  punto_de_interes_id: z.number(),
  url: z.string()
})

export const rolesDeUsuarioSchema = z.object({
  id: z.number(),
  role: z
    .union([z.literal('admin'), z.literal('editor'), z.literal('viewer')])
    .nullable(),
  user_id: z.string()
})
