import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#05050A',
        surface1: '#0C0D14',
        surface2: '#13141E',
        accent: '#2F7EFF',
        alert: '#FF3D2E',
        primary: '#F1F2FF',
        secondary: '#5C6278',
        ghost: '#21222E',
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.035em',
        mono: '0.28em',
        wide: '0.35em',
      },
    },
  },
  plugins: [],
}

export default config
