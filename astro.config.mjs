// @ts-check
import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  devToolbar: { enabled: false },
  output: 'server',
  adapter: vercel(),
  server: {
    port: import.meta.env.PORT
  }
})
