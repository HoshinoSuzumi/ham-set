import type {Config} from 'tailwindcss';
import daisyui from 'daisyui';
import typography from "@tailwindcss/typography";


const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
        '5xl': '2304px',
      },
    },
  },
  plugins: [
    daisyui,
    typography
  ],
  daisyui: {
    themes: ['light', 'dark', 'cyberpunk'],
  },
};
export default config;
