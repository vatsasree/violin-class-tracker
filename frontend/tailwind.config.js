/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0e0818',
          surface: '#1a1028',
          surfaceLight: '#231637',
          gold: '#c9a84c',
          goldLight: '#e8c97a',
          muted: '#a899c0',
          darkMuted: '#6b5f88',
        }
      }
    },
  },
  plugins: [],
}
