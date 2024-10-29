// @ts-check
import vercel from '@astrojs/vercel/serverless'
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import { SERVER_PORT } from '@/constants'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  devToolbar: { enabled: false },
  output: 'server',
  adapter: vercel(),
  server: {
    port: SERVER_PORT
  }
})
