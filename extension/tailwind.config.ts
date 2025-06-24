// tailwind.config.ts
import type { Config } from 'tailwindcss'


const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        pp: {
          DEFAULT: '#FE7743',        // main primary color
          foreground: '#EFEEEA',     // text on primary
          dark: '#273F4F',           // optional dark variant
          black: '#000000'           // if you want a true black too
        },
      },
    },
  },
  plugins: [],
}
export default config
