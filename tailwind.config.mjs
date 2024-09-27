import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        outift: ['Outfit Variable', 'Poppins', 'system-ui']
      }
    },
    colors: {
      ...defaultTheme.colors,
      'soft-white': '#fbfbfe',
      primary: '#2f27ce',
      secondary: '#dddbff',
      accent: '#443dff',
      'primary-text': '#050315'
    }
  },
  plugins: []
}
