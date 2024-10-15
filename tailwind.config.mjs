import defaultTheme from 'tailwindcss/defaultTheme'
import defaultColors from 'tailwindcss/colors'

/* As of Tailwind CSS v2.2, certain colors has been renamed  */
const deprecatedColors = [
  'lightBlue',
  'warmGray',
  'coolGray',
  'blueGray',
  'trueGray'
]

for (const color of deprecatedColors) {
  delete defaultColors[color]
}

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
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      'soft-white': '#fbfbfe',
      primary: '#34b754',
      secondary: '#dddbff',
      accent: '#196735',
      'primary-text': '#050315',
      ...defaultColors
    }
  },
  plugins: [require('tailwindcss-animate')]
}
