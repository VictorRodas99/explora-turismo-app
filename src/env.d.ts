/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly CLOUDINARY_API_KEY_SECRET: string
  readonly CLOUDINARY_CLOUD_NAME: string
  readonly CLOUDINARY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
