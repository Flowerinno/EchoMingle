/** @type {import('tailwindcss').Config} */
import tailwindcss from 'tailwindcss'
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [],
}
