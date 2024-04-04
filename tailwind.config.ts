import type {Config} from 'tailwindcss'
import daisyui from 'daisyui'
import typography from '@tailwindcss/typography'


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './assets/**/*.{css,scss}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
        '5xl': '2304px',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      boxShadow: {
        'panel-card': 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
      },
    },
  },
  plugins: [
    daisyui,
    typography
  ],
  corePlugins: {
    preflight: false,
  },
  daisyui: {
    themes: ['light', 'dark', 'cyberpunk'],
  },
};
export default config;
